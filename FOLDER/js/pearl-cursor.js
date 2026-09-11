/*
 * 랜딩 페이지를 뺀 모든 페이지에서, 마우스 커서를 따라 떨며 굴러다니는
 * 흰 진주알 하나. "pearl jitter"라는 이름 그 자체를 커서 옆에 놓아 둔다.
 *
 * - 어떤 배경(검정 기본 테마든 건축 프로젝트의 흰 배경이든)에서도 늘
 *   또렷이 보이도록 mix-blend-mode: difference 를 쓴다 — 검정 위에서는
 *   흰 진주 그대로, 흰 배경 위에서는 자동으로 반전돼 보인다.
 * - 커서를 그대로 덮지 않도록 살짝 오른쪽 아래로 비켜 따라간다.
 * - 이동 거리만큼 실제로 굴러가는 것처럼 회전각을 계속 더하고, 그 위에
 *   작은 떨림(jitter)을 얹는다.
 * - 포인터가 없는 터치 기기에서는 아예 만들지 않는다.
 */
(function () {
    'use strict';

    if (!window.matchMedia || !window.matchMedia('(pointer: fine)').matches) return;
    if (document.getElementById('pj-pearl')) return;

    var RADIUS = 11;     // px — 진주 반지름, 회전량 계산에 쓴다
    var OFFSET_X = 15;   // 커서 끝을 가리지 않도록 살짝 오른쪽으로
    var OFFSET_Y = 17;   // 살짝 아래로
    var FOLLOW = 0.18;   // 따라가는 부드러움 (0~1, 클수록 빠르게 따라붙는다)

    var style = document.createElement('style');
    style.textContent =
        '#pj-pearl{' +
        'position:fixed;top:0;left:0;width:' + (RADIUS * 2) + 'px;height:' + (RADIUS * 2) + 'px;' +
        'margin:' + (-RADIUS) + 'px 0 0 ' + (-RADIUS) + 'px;' +
        'border-radius:50%;pointer-events:none;z-index:2147483647;' +
        'opacity:0;transition:opacity .4s ease;' +
        'mix-blend-mode:difference;' +
        'background:radial-gradient(circle at 34% 30%,#ffffff 0%,#f4f4f6 26%,#dcdde2 52%,#b3b4bc 76%,#84858e 100%);' +
        'box-shadow:inset -3px -3px 5px rgba(0,0,0,.4),inset 2px 2px 3px rgba(255,255,255,.65),0 3px 7px rgba(0,0,0,.5);' +
        'will-change:transform,opacity;' +
        '}' +
        '#pj-pearl.is-visible{opacity:1}' +
        '@media (prefers-reduced-motion: reduce){#pj-pearl{display:none}}';
    document.head.appendChild(style);

    var pearl = document.createElement('div');
    pearl.id = 'pj-pearl';
    pearl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(pearl);

    var targetX = 0, targetY = 0, x = 0, y = 0, lastX = 0, lastY = 0;
    var angle = 0, started = false, t = 0;

    function onMove(event) {
        targetX = event.clientX + OFFSET_X;
        targetY = event.clientY + OFFSET_Y;
        if (!started) {
            started = true;
            x = lastX = targetX;
            y = lastY = targetY;
            pearl.classList.add('is-visible');
        }
    }

    function hide() { pearl.classList.remove('is-visible'); }

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', hide);
    window.addEventListener('blur', hide);

    function tick() {
        t += 1;
        x += (targetX - x) * FOLLOW;
        y += (targetY - y) * FOLLOW;

        // 실제로 구른 거리만큼 회전 — 오른쪽으로 갈수록 시계방향.
        var dx = x - lastX;
        lastX = x; lastY = y;
        angle += (dx / RADIUS) * (180 / Math.PI);

        // 구르는 움직임 위에 얹는 잔떨림 — 진동수를 서로 어긋나게 섞어
        // 규칙적으로 보이지 않게 한다.
        var jitterX = Math.sin(t * 0.9) * 0.9 + Math.sin(t * 2.3) * 0.5;
        var jitterY = Math.cos(t * 1.05) * 0.9 + Math.sin(t * 1.7) * 0.5;

        pearl.style.transform =
            'translate3d(' + (x + jitterX).toFixed(1) + 'px,' + (y + jitterY).toFixed(1) + 'px,0) rotate(' + angle.toFixed(1) + 'deg)';

        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}());
