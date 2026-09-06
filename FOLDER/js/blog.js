/*
 * THOUGHTS 페이지 — data/posts.json 을 읽어 그 자리에서 그려낸다.
 *
 * pc.html 이 js/works.js 를 읽어 화면을 만드는 것과 같은 방식이다. 미리
 * 만들어 둔 HTML이 아니라 이 데이터 파일 하나가 내용의 전부라서, 컴퓨터
 * 없이도 GitHub 웹사이트나 앱에서 이 파일만 고쳐 커밋하면 바로 반영된다
 * (새글쓰기.bat 은 같은 파일을 로컬에서 편하게 고쳐 줄 뿐이다).
 */
(function () {
    'use strict';

    var container = document.getElementById('posts');
    if (!container) return;

    function esc(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 대괄호로만 된 줄은 문단이 아니라 글 안의 작은 소제목으로 다룬다.
    function renderParagraph(text) {
        var trimmed = text.trim();
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

    fetch('data/posts.json', { cache: 'no-store' })
        .then(function (response) {
            if (!response.ok) throw new Error('posts.json ' + response.status);
            return response.json();
        })
        .then(function (posts) {
            if (!posts.length) {
                container.innerHTML = '<p class="post__title">아직 쓴 글이 없습니다.</p>';
                return;
            }
            var html = [];
            posts.forEach(function (post, i) {
                html.push(renderPost(post));
                if (i < posts.length - 1) html.push('<hr class="story-end">');
            });
            container.innerHTML = html.join('\n');
        })
        .catch(function (error) {
            container.innerHTML = '<p class="post__title">글을 불러오지 못했습니다.</p>' +
                '<p>' + esc(error.message) + '</p>';
        });
}());
