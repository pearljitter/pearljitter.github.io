/*
 * THOUGHTS 페이지 — data/posts.json 을 읽어 그 자리에서 그려낸다.
 *
 * pc.html 이 js/works.js 를 읽어 화면을 만드는 것과 같은 방식이다. 미리
 * 만들어 둔 HTML이 아니라 이 데이터 파일 하나가 내용의 전부라서, 컴퓨터
 * 없이도 GitHub 웹사이트나 앱에서 이 파일만 고쳐 커밋하면 바로 반영된다.
 * 사이트에 있는 "새 글 쓰기" 버튼(js/blog-editor.js)도 같은 파일을 고친다.
 */
(function () {
    'use strict';

    var container = document.getElementById('posts');
    if (!container) return;

    function load() {
        return fetch('data/posts.json', { cache: 'no-store' })
            .then(function (response) {
                if (!response.ok) throw new Error('posts.json ' + response.status);
                return response.json();
            });
    }

    load()
        .then(function (posts) {
            window.__posts = posts;   // blog-editor.js 가 저장 직후 다시 그릴 때 쓴다
            container.innerHTML = window.BlogRender.renderList(posts);
        })
        .catch(function (error) {
            container.innerHTML = '<p class="post__title">글을 불러오지 못했습니다.</p>' +
                '<p>' + error.message.replace(/</g, '&lt;') + '</p>';
        });

    window.BlogData = { load: load };
}());
