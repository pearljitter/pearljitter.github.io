/*
 * 보기 2 · 터널
 *
 * 소실점을 향해 뻗은 통로 양옆에 작업으로 들어가는 관문을 세운다.
 * 스크롤하면 통로를 앞뒤로 지나간다.
 *
 * 정렬은 추상적인 것 → 유쾌한 것 → 작은 것 순이고, G 코드가 먼저 온다.
 * 좌표는 (구체성, 규모, 진지함)이라 세 축 모두 오름차순이면
 * 추상적이고 유쾌하고 작은 것이 앞쪽에 놓인다.
 *
 * 안내선 없이 통로의 깊이감은 관문 자체가 만든다: 각 관문은 통로 벽면의
 * 그 위치(x = ±side)에 바깥쪽 모서리를 고정하고, 안쪽 모서리만 통로 쪽으로
 * 열리듯 튼다 — 게시판이 벽에 경첩으로 붙어 있는 것과 같은 회전이라
 * 카드가 벽면에서 떨어져 떠 있지 않고 벽의 일부처럼 읽힌다.
 */
window.ModeTunnel = (function () {
    'use strict';

    var GAP = 540;          // 관문 사이 안쪽 거리(px)
    var LEAD = 380;         // 첫 관문까지의 여유
    var TILT = 34;          // 벽에서 통로 쪽으로 열리는 각도
    var side = 300;         // 통로 반폭 — 화면 폭에 따라 다시 잡는다

    var stage, track, scroll, spacer, started = false;
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

    /* 관문이 화면 밖으로 나가지 않도록 통로 폭과 관문 크기를 화면에 맞춘다. */
    function layout() {
        var w = stage.clientWidth || window.innerWidth;
        side = Math.max(120, Math.min(340, w * 0.3));
        var gateWidth = Math.max(150, Math.min(260, w * 0.26));

        // 썸네일은 늘 정사각형(CSS aspect-ratio). 벽면 쪽 모서리를 축으로
        // 돌려, 그 모서리는 벽에 고정된 채 반대쪽만 통로 안으로 열린다.
        gates.forEach(function (gate) {
            gate.element.style.width = gateWidth + 'px';
            gate.element.style.marginTop = -(gateWidth * 0.42 + 24) + 'px';
            gate.element.style.transformOrigin = gate.side < 0 ? '0% 50%' : '100% 50%';
            gate.element.style.transform =
                'translateX(-50%) translate3d(' + (gate.side * side) + 'px, 0, ' +
                gate.z + 'px) rotateY(' + (gate.side * TILT) + 'deg)';
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

            // 마우스 hover 는 아래 mousemove 히트테스트가 맡는다 — 스크롤 오버레이가
            // 위에 있어서 이 요소 자체는 mouseenter/mouseleave 를 받지 못한다.
            gate.addEventListener('focus', function () { onReadout(work); });
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
            updateHover();
            raf = null;
            return;
        }
        depth = next;
        render();
        updateHover();
        raf = requestAnimationFrame(tick);
    }

    function onScroll() {
        target = scroll.scrollTop;
        if (!raf) raf = requestAnimationFrame(tick);
    }

    /*
     * .tunnel__scroll sits on top of the 3D stage (it has to, to catch wheel
     * and touch scrolling), so it also swallows every pointer event before it
     * reaches the <a> gates underneath — clicks did nothing, and hover never
     * fired. We hit-test the visible gate frames ourselves for both.
     */
    var hoveredGate = null;
    var lastMouse = null;

    function gateAt(x, y) {
        var hit = null, hitDepth = -Infinity;
        gates.forEach(function (gate) {
            if (gate.element.style.pointerEvents !== 'auto') return;
            var rect = gate.element.querySelector('.gate__frame').getBoundingClientRect();
            if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) return;
            var z = gate.z + depth;           // 0 에 가까울수록(=가장 덜 음수) 카메라에 가깝다
            if (z > hitDepth) { hitDepth = z; hit = gate; }
        });
        return hit;
    }

    function onClick(event) {
        var hit = gateAt(event.clientX, event.clientY);
        if (hit) window.location.href = hit.element.href;
    }

    function updateHover() {
        if (!lastMouse) return;
        var hit = gateAt(lastMouse.x, lastMouse.y);
        if (hit === hoveredGate) return;
        if (hoveredGate) hoveredGate.element.classList.remove('is-hovered');
        hoveredGate = hit;
        if (hit) hit.element.classList.add('is-hovered');
        onReadout(hit ? hit.work : null);
        scroll.style.cursor = hit ? 'pointer' : '';
    }

    function onMove(event) {
        lastMouse = { x: event.clientX, y: event.clientY };
        updateHover();
    }

    return {
        init: function (element, readout) {
            if (started) return;
            started = true;
            onReadout = readout || onReadout;

            stage = element.querySelector('.tunnel__stage');
            track = element.querySelector('.tunnel__track');
            scroll = element.querySelector('.tunnel__scroll');
            spacer = element.querySelector('.tunnel__spacer');

            buildGates();
            layout();
            render();

            scroll.addEventListener('scroll', onScroll, { passive: true });
            scroll.addEventListener('click', onClick);
            scroll.addEventListener('mousemove', onMove);
            scroll.addEventListener('mouseleave', function () {
                lastMouse = null;
                if (hoveredGate) {
                    hoveredGate.element.classList.remove('is-hovered');
                    hoveredGate = null;
                    onReadout(null);
                    scroll.style.cursor = '';
                }
            });
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
