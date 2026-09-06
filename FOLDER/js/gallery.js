/*
 * Shared lightbox for the project gallery pages.
 *
 * Each page only ships its <img> tags: the thumbnail in `src`, the full-size
 * file in `data-full`. Everything below is built at runtime, so the markup
 * still degrades to a plain grid of images when JavaScript is off.
 */
(function () {
    'use strict';

    var gallery = document.querySelector('.gallery');
    if (!gallery) return;

    var tiles = Array.prototype.slice.call(gallery.querySelectorAll('img'));
    if (!tiles.length) return;

    var items = tiles.map(function (img, i) {
        return {
            src: img.getAttribute('data-full') || img.src,
            text: img.getAttribute('data-caption') || '#' + (i + 1)
        };
    });

    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.innerHTML =
        '<button class="lb-close" type="button" aria-label="Close">&times;</button>' +
        '<button class="lb-prev" type="button" aria-label="Previous">&#8592;</button>' +
        '<img alt="">' +
        '<p></p>' +
        '<button class="lb-next" type="button" aria-label="Next">&#8594;</button>';
    document.body.appendChild(box);

    var full = box.querySelector('img');
    var caption = box.querySelector('p');
    var prevBtn = box.querySelector('.lb-prev');
    var nextBtn = box.querySelector('.lb-next');
    var index = 0;
    var lastFocus = null;

    function preload(i) {
        if (i < 0 || i >= items.length) return;
        var img = new Image();
        img.src = items[i].src;
    }

    function render() {
        full.src = items[index].src;
        full.alt = items[index].text;
        caption.textContent = items[index].text;
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === items.length - 1;
        preload(index + 1);
        preload(index - 1);
    }

    function open(i) {
        index = i;
        lastFocus = document.activeElement;
        render();
        box.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        box.querySelector('.lb-close').focus();
    }

    function close() {
        box.classList.remove('is-open');
        document.body.style.overflow = '';
        full.removeAttribute('src');
        if (lastFocus) lastFocus.focus();
    }

    function step(delta) {
        var next = index + delta;
        if (next < 0 || next >= items.length) return;
        index = next;
        render();
    }

    tiles.forEach(function (img, i) {
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.addEventListener('click', function () { open(i); });
        img.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open(i);
            }
        });
    });

    /*
     * 연도 아래 본문에 실린 그림도 같은 라이트박스로 연다.
     * 본문 그림과 그리드 타일은 같은 원본을 가리키므로 data-full 로 짝을 찾는다.
     */
    var indexBySource = {};
    items.forEach(function (item, i) { indexBySource[item.src] = i; });

    Array.prototype.forEach.call(
        document.querySelectorAll('.story img[data-full]'),
        function (img) {
            var i = indexBySource[img.getAttribute('data-full')];
            if (i === undefined) return;
            img.setAttribute('tabindex', '0');
            img.setAttribute('role', 'button');
            img.addEventListener('click', function () { open(i); });
            img.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    open(i);
                }
            });
        }
    );

    box.querySelector('.lb-close').addEventListener('click', close);
    prevBtn.addEventListener('click', function () { step(-1); });
    nextBtn.addEventListener('click', function () { step(1); });

    // Clicking the backdrop (but not the image or the buttons) closes.
    box.addEventListener('click', function (e) {
        if (e.target === box) close();
    });

    document.addEventListener('keydown', function (e) {
        if (!box.classList.contains('is-open')) return;
        if (e.key === 'ArrowLeft') step(-1);
        else if (e.key === 'ArrowRight') step(1);
        else if (e.key === 'Escape') close();
    });

    // Swipe between images on touch devices.
    var startX = null;
    box.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
    }, { passive: true });
    box.addEventListener('touchend', function (e) {
        if (startX === null) return;
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
        startX = null;
    });
}());
