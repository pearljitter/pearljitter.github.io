/*
 * 보기 3 · 목록
 *
 * 3D 없이 읽기 위한 보기. 작업을 갈래별로 묶고 제목 · 설명 · 날짜를
 * 한 줄로 세운다. 애플 사이트처럼 여백을 넉넉히 두고 강조는 최소로.
 */
window.ModeList = (function () {
    'use strict';

    var started = false;

    var GROUPS = [
        { key: 'Architecture', label: 'Architecture',
          match: function (w) { return w.isArchitecture; } },
        { key: 'Interactive', label: 'Interactive',
          match: function (w) { return !w.isArchitecture && w.kind !== 'Text'; } },
        { key: 'Writing', label: 'Writing',
          match: function (w) { return w.kind === 'Text'; } }
    ];

    // '21.11.24' 를 연도로. 뒤 두 자리가 연도라 2000 을 더한다.
    function year(work) {
        var parts = work.date.replace('~', '').split('.');
        return parts.length === 3 ? '20' + parts[2] : work.date;
    }

    function card(work) {
        var a = document.createElement('a');
        a.className = 'card';
        a.href = work.url;

        var img = document.createElement('img');
        img.className = 'card__thumb';
        img.src = work.thumb;
        img.alt = work.title;
        img.loading = 'lazy';
        img.decoding = 'async';

        var body = document.createElement('div');
        var title = document.createElement('p');
        title.className = 'card__title';
        title.textContent = work.title;
        var note = document.createElement('p');
        note.className = 'card__note';
        note.textContent = work.note || work.kind;
        body.appendChild(title);
        body.appendChild(note);

        var date = document.createElement('div');
        date.className = 'card__date';
        date.textContent = year(work);

        a.appendChild(img);
        a.appendChild(body);
        a.appendChild(date);
        return a;
    }

    return {
        init: function (element) {
            if (started) return;
            started = true;

            var wrap = document.createElement('div');
            wrap.className = 'list';

            var lede = document.createElement('p');
            lede.className = 'list__lede';
            lede.innerHTML = 'Architecture and interactive work by pearl jitter. ' +
                '<span>Selected projects, most recent first.</span>';
            wrap.appendChild(lede);

            GROUPS.forEach(function (group) {
                var items = window.WORKS.filter(group.match).sort(function (a, b) {
                    return year(b).localeCompare(year(a));
                });
                if (!items.length) return;

                var section = document.createElement('section');
                section.className = 'list__group';

                var heading = document.createElement('h2');
                heading.className = 'list__heading';
                heading.innerHTML = group.label + ' <em>' + items.length + '</em>';
                section.appendChild(heading);

                items.forEach(function (work) { section.appendChild(card(work)); });
                wrap.appendChild(section);
            });

            element.appendChild(wrap);
        },
        resize: function () {}
    };
}());
