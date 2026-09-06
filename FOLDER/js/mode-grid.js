/*
 * 보기 1 · 3D 그리드
 *
 * 좌표 공간에 작업을 흩어 놓고 썸네일만 띄운다. 제목과 좌표값은 빼고,
 * 대신 각 점이 자기 썸네일에서 뽑아낸 색을 갖는다. 점이든 썸네일이든
 * 누르면 둘 다 커지고 점 뒤로 같은 색 글로우가 켜진다.
 */
window.ModeGrid = (function () {
    'use strict';

    var GRID_EXTENT = 8;
    var GRID_STEP = 1;
    var MAJOR_EVERY = 4;
    var FADE_RADIUS = GRID_EXTENT * 1.15;
    var SEGMENTS = 24;
    var MINOR_LEVEL = 0.14;
    var MAJOR_LEVEL = 0.34;
    var AXIS_LEVEL = 0.7;
    var AXIS_SCALE = 1.8;
    var AXIS_LENGTH = 13 * AXIS_SCALE;
    var AXIS_FADE_RADIUS = FADE_RADIUS * AXIS_SCALE;
    var AXIS_LABEL_RADIUS = 8.9 * AXIS_SCALE;
    var AXIS_LABEL_SIZE = 0.05;

    var THUMB_HEIGHT = 1.6;        // 월드 단위 썸네일 한 변
    var THUMB_IDLE = 0.72;
    var SELECTED_GROWTH = 1.32;
    var DOT_RADIUS = 0.1;

    var FIT_RADIUS = 17.5;
    var MIN_DISTANCE = 6;
    var MAX_DISTANCE = 60;

    var scene, camera, renderer, container;
    var dots = [], plates = [], axisSprites = [];
    var needsRender = true, zoomRatio = 1, started = false;
    var hovered = null, selected = null;
    var onReadout = function () {};

    function invalidate() { needsRender = true; }

    // ------------------------------------------------------------- 격자

    function falloff(x, y, z, radius) {
        var r = Math.sqrt(x * x + y * y + z * z) / radius;
        return Math.max(0, 1 - r * r);
    }

    function addLine(a, b, level, target, radius) {
        for (var s = 0; s < SEGMENTS; s++) {
            var ts = [s / SEGMENTS, (s + 1) / SEGMENTS];
            for (var k = 0; k < 2; k++) {
                var t = ts[k];
                var x = a[0] + (b[0] - a[0]) * t;
                var y = a[1] + (b[1] - a[1]) * t;
                var z = a[2] + (b[2] - a[2]) * t;
                var c = falloff(x, y, z, radius || FADE_RADIUS) * level;
                target.position.push(x, y, z);
                target.color.push(c, c, c);
            }
        }
    }

    function buildGrid() {
        var minor = { position: [], color: [] };
        var major = { position: [], color: [] };
        var E = GRID_EXTENT;

        for (var i = -E; i <= E; i += GRID_STEP) {
            if (i === 0) continue;
            var isMajor = i % MAJOR_EVERY === 0;
            var target = isMajor ? major : minor;
            var level = isMajor ? MAJOR_LEVEL : MINOR_LEVEL;
            addLine([i, -E, 0], [i, E, 0], level, target);
            addLine([-E, i, 0], [E, i, 0], level, target);
            addLine([0, i, -E], [0, i, E], level, target);
            addLine([0, -E, i], [0, E, i], level, target);
            addLine([i, 0, -E], [i, 0, E], level, target);
            addLine([-E, 0, i], [E, 0, i], level, target);
        }

        [[1, 0, 0], [0, 1, 0], [0, 0, 1]].forEach(function (dir) {
            addLine(
                [-dir[0] * AXIS_LENGTH, -dir[1] * AXIS_LENGTH, -dir[2] * AXIS_LENGTH],
                [dir[0] * AXIS_LENGTH, dir[1] * AXIS_LENGTH, dir[2] * AXIS_LENGTH],
                AXIS_LEVEL, major, AXIS_FADE_RADIUS
            );
        });

        [minor, major].forEach(function (data) {
            var geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(data.position, 3));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(data.color, 3));
            var lines = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({
                vertexColors: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                transparent: true
            }));
            lines.renderOrder = -1;
            scene.add(lines);
        });
    }

    // --------------------------------------------------------- 축 이름

    function textSprite(text, worldHeight, opacity) {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        var font = '600 40px -apple-system, "SF Pro Text", Inter, sans-serif';
        context.font = font;
        canvas.width = Math.ceil(context.measureText(text).width) + 20;
        canvas.height = 60;
        context.font = font;
        context.fillStyle = '#f5f5f7';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, canvas.width / 2, canvas.height / 2);

        var texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        var sprite = new THREE.Sprite(new THREE.SpriteMaterial({
            map: texture, transparent: true, depthWrite: false, opacity: opacity
        }));
        sprite.scale.set(worldHeight * (canvas.width / canvas.height), worldHeight, 1);
        sprite.userData.aspect = canvas.width / canvas.height;
        return sprite;
    }

    function buildAxisLabels() {
        var labels = [
            ['CONCRETE', [1, 0, 0]], ['ABSTRACT', [-1, 0, 0]],
            ['BIG', [0, 1, 0]], ['SMALL', [0, -1, 0]],
            ['SERIOUS', [0, 0, 1]], ['PLAYFUL', [0, 0, -1]]
        ];
        labels.forEach(function (entry) {
            var sprite = textSprite(entry[0], AXIS_LABEL_SIZE, 0.66);
            sprite.material.sizeAttenuation = false;
            sprite.position.set(
                entry[1][0] * AXIS_LABEL_RADIUS,
                entry[1][1] * AXIS_LABEL_RADIUS,
                entry[1][2] * AXIS_LABEL_RADIUS
            );
            axisSprites.push(sprite);
            scene.add(sprite);
        });
    }

    // ------------------------------------------------- 썸네일에서 색 뽑기

    function dominantColour(image) {
        var size = 24;
        var canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, size, size);
        var data = context.getImageData(0, 0, size, size).data;

        // 단순 평균은 회색으로 수렴한다. 채도가 있는 픽셀에 가중치를 준다.
        var r = 0, g = 0, b = 0, weight = 0;
        for (var i = 0; i < data.length; i += 4) {
            var mx = Math.max(data[i], data[i + 1], data[i + 2]);
            var mn = Math.min(data[i], data[i + 1], data[i + 2]);
            var w = 0.15 + (mx - mn) / 255;
            r += data[i] * w; g += data[i + 1] * w; b += data[i + 2] * w;
            weight += w;
        }
        var colour = new THREE.Color(
            r / weight / 255, g / weight / 255, b / weight / 255
        );
        // 어두운 배경에서 점이 묻히지 않게 밝기와 채도를 올려 둔다.
        var hsl = colour.getHSL({ h: 0, s: 0, l: 0 });
        colour.setHSL(hsl.h, Math.min(1, hsl.s * 1.9 + 0.18), Math.min(0.78, Math.max(0.55, hsl.l * 1.35)));
        return colour;
    }

    function glowTexture() {
        var size = 128;
        var canvas = document.createElement('canvas');
        canvas.width = canvas.height = size;
        var context = canvas.getContext('2d');
        var gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.28, 'rgba(255,255,255,0.42)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, size, size);
        return new THREE.CanvasTexture(canvas);
    }

    // ------------------------------------------------------------- 작업

    function addWork(work, glowMap) {
        var pos = new THREE.Vector3(work.coords[0], work.coords[1], work.coords[2]);

        var dot = new THREE.Mesh(
            new THREE.SphereGeometry(DOT_RADIUS, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        dot.position.copy(pos);
        dot.userData.work = work;
        scene.add(dot);
        dots.push(dot);

        var glow = new THREE.Sprite(new THREE.SpriteMaterial({
            map: glowMap,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true,
            opacity: 0
        }));
        glow.position.copy(pos);
        glow.scale.setScalar(1.6);
        scene.add(glow);
        dot.userData.glow = glow;

        var image = new Image();
        image.onload = function () {
            var colour = dominantColour(image);
            dot.material.color.copy(colour);
            glow.material.color.copy(colour);

            var texture = new THREE.CanvasTexture(image);
            texture.minFilter = THREE.LinearFilter;
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

            var plate = new THREE.Sprite(new THREE.SpriteMaterial({
                map: texture, transparent: true, depthWrite: false, opacity: THUMB_IDLE
            }));
            plate.scale.set(THUMB_HEIGHT, THUMB_HEIGHT, 1);
            plate.position.copy(pos).add(new THREE.Vector3(0, 0.22, 0));
            plate.center.set(0.5, 0);
            plate.userData.work = work;
            plate.userData.baseScale = plate.scale.clone();
            scene.add(plate);
            plates.push(plate);

            dot.userData.plate = plate;
            invalidate();
        };
        image.onerror = invalidate;
        image.src = work.thumb;
    }

    // --------------------------------------------------------- 상태 표시

    function apply(dot) {
        if (!dot) return;
        var isSelected = dot === selected;
        var isActive = isSelected || dot === hovered;
        var plate = dot.userData.plate;

        dot.scale.setScalar(isSelected ? 2.4 : (isActive ? 1.8 : 1));
        dot.userData.glow.material.opacity = isSelected ? 0.95 : (isActive ? 0.35 : 0);
        dot.userData.glow.scale.setScalar(isSelected ? 3.4 : 1.9);

        if (plate) {
            plate.material.opacity = isActive ? 1 : THUMB_IDLE;
            plate.scale.copy(plate.userData.baseScale)
                .multiplyScalar(isSelected ? SELECTED_GROWTH : 1);
            plate.renderOrder = isSelected ? 2 : (isActive ? 1 : 0);
        }
    }

    function setHovered(dot) {
        if (hovered === dot) return;
        var previous = hovered;
        hovered = dot;
        apply(previous);
        apply(dot);
        onReadout(dot ? dot.userData.work : (selected ? selected.userData.work : null));
        container.style.cursor = dot ? 'pointer' : '';
        invalidate();
    }

    // 첫 클릭은 고르기, 같은 것을 다시 누르면 연다.
    function activate(dot) {
        if (dot && dot === selected) {
            window.location.href = dot.userData.work.url;
            return;
        }
        var previous = selected;
        selected = dot;
        apply(previous);
        apply(dot);
        onReadout(dot ? dot.userData.work : null);
        invalidate();
    }

    // ------------------------------------------------------------- 선택

    var projected = new THREE.Vector3();

    function screenOf(object) {
        projected.copy(object.position).applyQuaternion(scene.quaternion).project(camera);
        if (projected.z > 1) return null;
        return {
            x: (projected.x * 0.5 + 0.5) * container.clientWidth,
            y: (-projected.y * 0.5 + 0.5) * container.clientHeight
        };
    }

    /* 점은 화면 거리로, 썸네일은 화면상 사각형으로 판정한다.
       둘 중 하나라도 맞으면 같은 작업을 고른 것으로 본다. */
    function pickAt(x, y, radius) {
        var best = null, bestDistance = radius;

        dots.forEach(function (dot) {
            var p = screenOf(dot);
            if (!p) return;
            var d = Math.hypot(p.x - x, p.y - y);
            if (d < bestDistance) { bestDistance = d; best = dot; }
        });
        if (best) return best;

        for (var i = plates.length - 1; i >= 0; i--) {
            var plate = plates[i];
            var p = screenOf(plate);
            if (!p) continue;
            var scale = container.clientHeight /
                (2 * camera.position.distanceTo(plate.position) * Math.tan(camera.fov * Math.PI / 360));
            var w = plate.scale.x * scale, h = plate.scale.y * scale;
            if (x >= p.x - w / 2 && x <= p.x + w / 2 && y <= p.y && y >= p.y - h) {
                return plate.userData.work ? findDot(plate.userData.work) : null;
            }
        }
        return null;
    }

    function findDot(work) {
        for (var i = 0; i < dots.length; i++) {
            if (dots[i].userData.work === work) return dots[i];
        }
        return null;
    }

    // ------------------------------------------------------- 카메라 · 조작

    function fittedDistance() {
        var vFov = camera.fov * Math.PI / 180;
        var hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
        return FIT_RADIUS / Math.sin(Math.min(vFov, hFov) / 2);
    }

    function clampDistance(d) {
        return Math.min(Math.max(d, MIN_DISTANCE), MAX_DISTANCE);
    }

    function layout() {
        camera.position.setLength(clampDistance(fittedDistance() * zoomRatio));
        camera.lookAt(0, 0, 0);
        var size = AXIS_LABEL_SIZE * Math.min(1, camera.aspect / 1.3);
        axisSprites.forEach(function (sprite) {
            sprite.scale.set(size * sprite.userData.aspect, size, 1);
        });
        invalidate();
    }

    function zoomTo(distance) {
        var next = clampDistance(distance);
        zoomRatio = next / fittedDistance();
        camera.position.setLength(next);
        camera.lookAt(0, 0, 0);
        invalidate();
    }

    function resize() {
        var w = container.clientWidth, h = container.clientHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        layout();
    }

    function bindPointer() {
        var dragging = false, moved = false, previous = { x: 0, y: 0 };
        var rotation = { x: 0, y: 0 };
        var SPEED = 0.005;

        function rotateBy(dx, dy) {
            rotation.y += dx * SPEED;
            rotation.x += dy * SPEED;
            rotation.x = Math.max(Math.min(rotation.x, Math.PI / 2), -Math.PI / 2);
            rotation.y = (rotation.y + Math.PI) % (Math.PI * 2) - Math.PI;
            scene.rotation.x = rotation.x;
            scene.rotation.y = rotation.y;
            invalidate();
        }

        function local(event) {
            var rect = container.getBoundingClientRect();
            return { x: event.clientX - rect.left, y: event.clientY - rect.top };
        }

        container.addEventListener('mousedown', function (e) {
            dragging = true; moved = false; previous = { x: e.clientX, y: e.clientY };
        });
        window.addEventListener('mouseup', function () { dragging = false; });
        container.addEventListener('mousemove', function (e) {
            if (dragging) {
                var dx = e.clientX - previous.x, dy = e.clientY - previous.y;
                if (Math.abs(dx) + Math.abs(dy) > 2) moved = true;
                rotateBy(dx, dy);
                previous = { x: e.clientX, y: e.clientY };
            }
            var p = local(e);
            setHovered(pickAt(p.x, p.y, 18));
        });
        container.addEventListener('click', function (e) {
            if (moved) return;
            var p = local(e);
            activate(pickAt(p.x, p.y, 18));
        });
        container.addEventListener('wheel', function (e) {
            e.preventDefault();
            zoomTo(camera.position.length() * (e.deltaY > 0 ? 1.1 : 0.9));
        }, { passive: false });

        var touchStart = null, pinchStart = 0, pinchCamera = 0;
        function gap(t) {
            return Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
        }
        container.addEventListener('touchstart', function (e) {
            if (e.touches.length === 1) {
                var t = e.touches[0];
                touchStart = { x: t.clientX, y: t.clientY, time: Date.now(), moved: false };
                previous = { x: t.clientX, y: t.clientY };
            } else if (e.touches.length === 2) {
                touchStart = null;
                pinchStart = gap(e.touches);
                pinchCamera = camera.position.length();
            }
        }, { passive: true });
        container.addEventListener('touchmove', function (e) {
            e.preventDefault();
            if (e.touches.length === 1 && touchStart) {
                var t = e.touches[0];
                if (Math.abs(t.clientX - touchStart.x) + Math.abs(t.clientY - touchStart.y) > 10) {
                    touchStart.moved = true;
                }
                rotateBy(t.clientX - previous.x, t.clientY - previous.y);
                previous = { x: t.clientX, y: t.clientY };
            } else if (e.touches.length === 2 && pinchStart > 0) {
                var g = gap(e.touches);
                if (g > 0) zoomTo(pinchCamera * (pinchStart / g));
            }
        }, { passive: false });
        container.addEventListener('touchend', function (e) {
            if (e.touches.length === 0) pinchStart = 0;
            if (!touchStart || touchStart.moved || Date.now() - touchStart.time > 500) {
                touchStart = null;
                return;
            }
            var rect = container.getBoundingClientRect();
            var x = touchStart.x - rect.left, y = touchStart.y - rect.top;
            touchStart = null;
            activate(pickAt(x, y, 44));
        });
    }

    function animate() {
        requestAnimationFrame(animate);
        if (!needsRender) return;
        needsRender = false;
        renderer.render(scene, camera);
    }

    return {
        init: function (element, readout) {
            if (started) return;
            started = true;
            container = element;
            onReadout = readout || onReadout;

            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
            camera.position.set(1, 1, 1);
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(renderer.domElement);

            buildGrid();
            buildAxisLabels();
            var glowMap = glowTexture();
            window.WORKS.forEach(function (work) { addWork(work, glowMap); });

            bindPointer();
            window.addEventListener('resize', resize);
            resize();
            animate();
        },
        resize: resize,
        clearSelection: function () {
            var previous = selected;
            selected = null;
            apply(previous);
            invalidate();
        }
    };
}());
