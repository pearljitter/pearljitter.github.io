/*
 * 보기 2 · 터널
 *
 * 소실점을 향해 뻗은 통로 양옆에 작업으로 들어가는 관문을 세운다.
 * 스크롤하면 통로를 앞뒤로 지나간다.
 *
 * 정렬은 추상적인 것 → 유쾌한 것 → 작은 것 순이고, G 코드가 먼저 온다.
 * 좌표는 (구체성, 규모, 진지함)이라 세 축 모두 오름차순이면
 * 추상적이고 유쾌하고 작은 것이 앞쪽에 놓인다.
 */
window.ModeTunnel = (function () {
    'use strict';

    var GAP = 540;          // 관문 사이 안쪽 거리(px)
    var LEAD = 380;         // 첫 관문까지의 여유
    var TILT = 26;          // 관문이 안쪽을 보도록 돌리는 각도
    var side = 300;         // 통로 반폭 — 화면 폭에 따라 다시 잡는다

    var stage, track, edgeLayer, scroll, spacer, started = false;
    var gates = [], onReadout = function () {};
    var depth = 0, target = 0, raf = null;

    function ordered() {
        return window.WORKS.slice().sort(function (a, b) {
            if (a.isArchitecture !== b.isArchitecture) {
                return a.isArchitecture ? 1 : -1;   // g 코드 먼저
            }
            if (a.coords[0] !== b.coords[0]) return a.coords[0] - b.coords[0]; // 추상 먼저
            if (a.coords[2] !== b.coords[2]) return a.coords[2] - b.coords[2]; // 유쾌 먼저
            return a.coords[1] - b.coords[1];                                   // 작은 것 먼저
        });
    }

    var edges = [];

    function buildEdges() {
        // 통로의 네 모서리를 옅은 선으로 그어 깊이를 읽히게 한다.
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (corner) {
            var edge = document.createElement('div');
            edge.className = 'tunnel__edge';
            edge.dataset.x = corner[0];
            edge.dataset.y = corner[1];
            edgeLayer.appendChild(edge);
            edges.push(edge);
        });
    }

    /* 관문이 화면 밖으로 나가지 않도록 통로 폭과 관문 크기를 화면에 맞춘다. */
    function layout() {
        var w = stage.clientWidth || window.innerWidth;
        side = Math.max(120, Math.min(340, w * 0.3));
        var gateWidth = Math.max(150, Math.min(260, w * 0.26));

        var halfHeight = side * 0.74;
        edges.forEach(function (edge) {
            edge.style.transform =
                'translate3d(' + (edge.dataset.x * side) + 'px, ' +
                (edge.dataset.y * halfHeight) + 'px, -5700px) rotateY(90deg)';
        });

        gates.forEach(function (gate) {
            gate.element.style.width = gateWidth + 'px';
            gate.element.style.marginTop = -(gateWidth * 0.42 + 24) + 'px';
            gate.element.querySelector('img').style.height = (gateWidth * 0.84) + 'px';
            gate.element.style.transform =
                'translateX(-50%) translate3d(' + (gate.side * side) + 'px, 0, ' +
                gate.z + 'px) rotateY(' + (-gate.side * TILT) + 'deg)';
        });
    }

    function buildGates() {
        ordered().forEach(function (work, i) {
            var direction = i % 2 === 0 ? -1 : 1;   // 왼쪽/오른쪽 벽
            var z = -(LEAD + i * GAP);

            var gate = document.createElement('a');
            gate.className = 'gate';
            gate.href = work.url;
            gate.style.left = '50%';

            var frame = document.createElement('div');
            frame.className = 'gate__frame';
            var img = document.createElement('img');
            img.src = work.thumb;
            img.alt = work.title;
            img.loading = 'lazy';
            img.decoding = 'async';
            frame.appendChild(img);

            var label = document.createElement('div');
            label.className = 'gate__label';
            label.textContent = work.title;

            gate.appendChild(frame);
            gate.appendChild(label);

            gate.addEventListener('mouseenter', function () { onReadout(work); });
            gate.addEventListener('focus', function () { onReadout(work); });
            gate.addEventListener('mouseleave', function () { onReadout(null); });
            gate.addEventListener('blur', function () { onReadout(null); });

            track.appendChild(gate);
            gates.push({ element: gate, z: z, side: direction, work: work });
        });

        // 마지막 관문까지 지나갈 수 있도록 스크롤 길이를 잡는다.
        spacer.style.height = (LEAD + gates.length * GAP + window.innerHeight) + 'px';
    }

    function render() {
        track.style.transform = 'translateZ(' + depth + 'px)';

        // 카메라를 지나쳐 뒤로 간 관문은 조용히 지운다.
        gates.forEach(function (gate) {
            var distance = gate.z + depth;
            var visible = distance < 60 && distance > -3400;
            // 가까울수록 또렷하고, 멀어질수록 어둠에 잠긴다.
            var far = -distance;
            gate.element.style.opacity = visible
                ? Math.min(1, Math.max(0, 1.05 - Math.max(0, far - 200) / 2400))
                : 0;
            gate.element.style.pointerEvents = visible ? 'auto' : 'none';
        });
    }

    function tick() {
        var next = depth + (target - depth) * 0.12;
        if (Math.abs(next - depth) < 0.4) {
            depth = target;
            render();
            raf = null;
            return;
        }
        depth = next;
        render();
        raf = requestAnimationFrame(tick);
    }

    function onScroll() {
        target = scroll.scrollTop;
        if (!raf) raf = requestAnimationFrame(tick);
    }

    return {
        init: function (element, readout) {
            if (started) return;
            started = true;
            onReadout = readout || onReadout;

            stage = element.querySelector('.tunnel__stage');
            track = element.querySelector('.tunnel__track');
            edgeLayer = element.querySelector('.tunnel__edges');
            scroll = element.querySelector('.tunnel__scroll');
            spacer = element.querySelector('.tunnel__spacer');

            buildEdges();
            buildGates();
            layout();
            render();

            scroll.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', function () {
                spacer.style.height =
                    (LEAD + gates.length * GAP + window.innerHeight) + 'px';
                layout();
            });
        },
        resize: function () {
            if (!started) return;
            layout();
            render();
        }
    };
}());
