/*
 * THOUGHTS 글 목록을 HTML로 그리는 로직. js/blog.js(처음 불러올 때)와
 * js/blog-editor.js(저장한 직후 화면을 바로 갱신할 때) 가 함께 쓴다 —
 * 렌더링 규칙이 한 군데에만 있어야 둘이 어긋나지 않는다.
 */
window.BlogRender = (function () {
    'use strict';

    function esc(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 대괄호로만 된 줄은 문단이 아니라 글 안의 작은 소제목으로 다룬다.
    // ![대체텍스트](경로) 형태의 줄은 그림판(js/blog-editor.js)이 끼워 넣은
    // 이미지다 — 프로젝트 페이지와 같은 .story figure 스타일을 그대로 쓴다.
    var IMAGE_LINE = /^!\[([^\]]*)\]\(([^)]+)\)$/;

    function renderParagraph(text) {
        var trimmed = text.trim();
        var imageMatch = IMAGE_LINE.exec(trimmed);
        if (imageMatch) {
            var alt = imageMatch[1];
            var src = imageMatch[2].replace(/"/g, '&quot;');
            var caption = alt ? '<figcaption>' + esc(alt) + '</figcaption>' : '';
            return '<figure><img src="' + src + '" alt="' + esc(alt) + '" loading="lazy">' + caption + '</figure>';
        }
        if (trimmed.charAt(0) === '[' && trimmed.charAt(trimmed.length - 1) === ']') {
            return '<p class="post__sub">' + esc(trimmed.slice(1, -1)) + '</p>';
        }
        return '<p>' + esc(text) + '</p>';
    }

    function renderPost(post) {
        var parts = ['<section class="post">'];
        if (post.date) {
            parts.push('<h3 class="post__date">' + esc(post.date) + '</h3>');
        }
        parts.push('<p class="post__title">' + esc(post.title) + '</p>');
        (post.body || []).forEach(function (p) { parts.push(renderParagraph(p)); });
        parts.push('</section>');
        return parts.join('');
    }

    function renderList(posts) {
        if (!posts.length) {
            return '<p class="post__title">아직 쓴 글이 없습니다.</p>';
        }
        var html = [];
        posts.forEach(function (post, i) {
            html.push(renderPost(post));
            if (i < posts.length - 1) html.push('<hr class="story-end">');
        });
        return html.join('\n');
    }

    // 새 글쓰기 폼에서 쓴다 — tools/add_post.py 와 같은 규칙으로 문단을 나눈다.
    function splitParagraphs(text) {
        var blocks = text.replace(/\r\n/g, '\n').split(/\n\s*\n/);
        var paragraphs = [];
        blocks.forEach(function (block) {
            var lines = block.split('\n').map(function (l) { return l.trim(); })
                .filter(function (l) { return l; });
            if (!lines.length) return;
            if (lines.length === 1 && lines[0].charAt(0) === '[' &&
                lines[0].charAt(lines[0].length - 1) === ']') {
                paragraphs.push(lines[0]);
            } else {
                paragraphs.push(lines.join(' '));
            }
        });
        return paragraphs;
    }

    return { renderList: renderList, splitParagraphs: splitParagraphs };
}());
