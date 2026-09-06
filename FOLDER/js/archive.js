/*
 * 아카이브 셸 — 세 보기를 갈아 끼운다.
 *
 * 무거운 보기는 처음 열릴 때만 만든다. 3D 그리드는 WebGL 을 쓰므로
 * 목록만 보러 온 사람에게는 끝까지 만들어지지 않는다.
 */
(function () {
    'use strict';

    var MODES = [
        { id: 'grid', label: '3D Grid', hint: 'Drag to rotate · scroll to zoom · click a work' },
        { id: 'tunnel', label: 'Tunnel', hint: 'Scroll to move through the tunnel' },
        { id: 'list', label: 'List', hint: '' }
    ];
    var STORAGE_KEY = 'pj-archive-mode';

    var buttons = {}, panels = {}, current = null;
    var segmented = document.querySelector('.segmented');
    var thumb = document.querySelector('.segmented__thumb');
    var readout = document.querySelector('.readout');
    var readoutTitle = document.querySelector('.readout__title');
    var readoutMeta = document.querySelector('.readout__meta');
    var hint = document.querySelector('.hint');

    function showReadout(work) {
        // 둘 다 화면 아래에 있으므로 하나만 보이게 한다.
        if (hint.textContent) hint.style.opacity = work ? '0' : '1';
        if (!work) {
            readout.classList.remove('is-visible');
            return;
        }
        readoutTitle.textContent = work.title;
        readoutMeta.textContent = [work.kind, work.note, work.date]
            .filter(Boolean).join(' · ');
        readout.classList.add('is-visible');
    }

    function moveThumb(button) {
        thumb.style.width = button.offsetWidth + 'px';
        thumb.style.transform = 'translateX(' + (button.offsetLeft - 2) + 'px)';
    }

    function activate(id, remember) {
        if (current === id) return;

        MODES.forEach(function (mode) {
            var on = mode.id === id;
            panels[mode.id].classList.toggle('is-active', on);
            buttons[mode.id].setAttribute('aria-selected', on ? 'true' : 'false');
        });
        moveThumb(buttons[id]);
        showReadout(null);

        var mode = MODES.filter(function (m) { return m.id === id; })[0];
        hint.textContent = mode.hint;
        hint.style.opacity = mode.hint ? '1' : '0';

        current = id;
        if (remember !== false) {
            try { localStorage.setItem(STORAGE_KEY, id); } catch (e) { /* 사생활 모드 */ }
        }

        // 보기별 초기화는 처음 열릴 때 한 번만.
        if (id === 'grid') window.ModeGrid.init(panels.grid, showReadout);
        if (id === 'tunnel') window.ModeTunnel.init(panels.tunnel, showReadout);
        if (id === 'list') window.ModeList.init(panels.list);

        // 숨겨져 있는 동안 크기가 0이라 다시 재어 준다.
        window.requestAnimationFrame(function () {
            var view = id === 'grid' ? window.ModeGrid
                : id === 'tunnel' ? window.ModeTunnel : window.ModeList;
            if (view && view.resize) view.resize();
        });
    }

    MODES.forEach(function (mode) {
        panels[mode.id] = document.getElementById('mode-' + mode.id);

        var button = document.createElement('button');
        button.type = 'button';
        button.textContent = mode.label;
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-selected', 'false');
        button.setAttribute('aria-controls', 'mode-' + mode.id);
        button.addEventListener('click', function () { activate(mode.id); });
        segmented.appendChild(button);
        buttons[mode.id] = button;
    });

    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* 무시 */ }
    activate(buttons[saved] ? saved : 'grid', false);

    window.addEventListener('resize', function () {
        if (current) moveThumb(buttons[current]);
    });

    // 1 · 2 · 3 으로도 보기를 바꾼다.
    document.addEventListener('keydown', function (e) {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        var index = ['1', '2', '3'].indexOf(e.key);
        if (index >= 0) activate(MODES[index].id);
    });
}());
