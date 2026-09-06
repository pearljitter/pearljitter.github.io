/*
 * THOUGHTS 페이지의 "새 글 쓰기" 버튼.
 *
 * 이 사이트에는 서버가 없다 — GitHub Pages 는 저장소에 있는 파일을 그대로
 * 보여줄 뿐이다. 그래서 저장은 브라우저가 GitHub 의 REST API 를 직접 불러
 * FOLDER/data/posts.json 파일 자체를 고치는 커밋을 만드는 방식으로 한다.
 * 폰이든 PC든 브라우저만 있으면 되고, 파이썬이나 git 을 설치할 필요가 없다.
 *
 * 이러려면 이 저장소에 쓰기 권한이 있는 GitHub 토큰이 필요하다. 처음 쓸 때
 * 한 번 물어보고, 그 다음부터는 이 브라우저에만 저장해 둔다(localStorage) —
 * 서버가 없으니 그 외에는 저장할 곳이 없고, 저장소 파일에 넣는 것도 아니다.
 *
 *   ⚠ 이 사이트는 공개 사이트다. 토큰은 반드시 이 저장소 하나에만,
 *      Contents 읽기/쓰기 권한만 준 "fine-grained" 토큰으로 만들고,
 *      다른 사람과 공유되는 기기에서는 쓰지 않는다.
 */
(function () {
    'use strict';

    var OWNER = 'pearljitter';
    var REPO = 'pearljitter.github.io';
    var FILE_PATH = 'FOLDER/data/posts.json';
    var BRANCH = 'main';
    var API = 'https://api.github.com/repos/' + OWNER + '/' + REPO + '/contents/' + FILE_PATH;
    var TOKEN_KEY = 'pj_blog_token';

    var mount = document.getElementById('composer-mount');
    var postsContainer = document.getElementById('posts');
    if (!mount || !postsContainer) return;

    // ------------------------------------------------------------ base64 (UTF-8 안전)

    function utf8ToBase64(str) {
        var bytes = new TextEncoder().encode(str);
        var binary = '';
        bytes.forEach(function (b) { binary += String.fromCharCode(b); });
        return btoa(binary);
    }

    function base64ToUtf8(b64) {
        var binary = atob(b64.replace(/\n/g, ''));
        var bytes = Uint8Array.from(binary, function (c) { return c.charCodeAt(0); });
        return new TextDecoder('utf-8').decode(bytes);
    }

    // ------------------------------------------------------------------- 토큰

    function getToken() {
        try { return localStorage.getItem(TOKEN_KEY) || ''; } catch (e) { return ''; }
    }
    function setToken(value) {
        try { localStorage.setItem(TOKEN_KEY, value); } catch (e) { /* 저장 안 되면 그냥 매번 물어본다 */ }
    }
    function clearToken() {
        try { localStorage.removeItem(TOKEN_KEY); } catch (e) { /* 무시 */ }
    }

    // -------------------------------------------------------------- GitHub API

    function githubGet(token) {
        return fetch(API + '?ref=' + BRANCH, {
            headers: {
                Authorization: 'Bearer ' + token,
                Accept: 'application/vnd.github+json'
            }
        }).then(function (response) {
            if (!response.ok) {
                return response.json().catch(function () { return {}; }).then(function (body) {
                    var err = new Error(body.message || ('GitHub ' + response.status));
                    err.status = response.status;
                    throw err;
                });
            }
            return response.json();
        });
    }

    function githubPut(token, posts, sha, message) {
        var content = utf8ToBase64(JSON.stringify(posts, null, 2) + '\n');
        return fetch(API, {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + token,
                Accept: 'application/vnd.github+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                content: content,
                sha: sha,
                branch: BRANCH
            })
        }).then(function (response) {
            if (!response.ok) {
                return response.json().catch(function () { return {}; }).then(function (body) {
                    var err = new Error(body.message || ('GitHub ' + response.status));
                    err.status = response.status;
                    throw err;
                });
            }
            return response.json();
        });
    }

    function friendlyError(err) {
        if (err.status === 401) return '토큰이 잘못됐거나 만료됐습니다. 아래에서 새 토큰을 넣어 주세요.';
        if (err.status === 403) return '이 토큰에 저장소에 쓸 권한이 없습니다. Contents: Read and write 권한으로 다시 만들어 주세요.';
        if (err.status === 404) return '저장소나 파일을 찾을 수 없습니다.';
        if (err.status === 409) return '방금 다른 곳에서 먼저 저장됐습니다. 다시 시도해 주세요.';
        return err.message || '알 수 없는 오류가 발생했습니다.';
    }

    // ------------------------------------------------------------------ 화면

    var hasToken = !!getToken();

    mount.innerHTML =
        '<button type="button" class="composer-toggle" id="composer-open">+ 새 글 쓰기</button>' +
        '<form class="composer" id="composer" hidden>' +
        '  <div class="token-step" id="token-step"' + (hasToken ? ' hidden' : '') + '>' +
        '    <p class="token-help">' +
        '      이 기기에서 처음 글을 씁니다. 이 저장소에만 쓰기 권한이 있는 GitHub 토큰이 한 번 필요합니다.<br>' +
        '      <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">여기서 만들기</a> →' +
        '      "Only select repositories"에서 <strong>' + REPO + '</strong> 선택 →' +
        '      Repository permissions의 <strong>Contents</strong>를 <strong>Read and write</strong>로 → Generate.<br>' +
        '      ⚠ 이 사이트는 공개 사이트입니다. 토큰을 다른 사람과 공유되는 기기에 남기지 마세요.' +
        '    </p>' +
        '    <label for="composer-token">GitHub 토큰</label>' +
        '    <input type="password" id="composer-token" autocomplete="off" placeholder="github_pat_...">' +
        '  </div>' +
        '  <label for="composer-title">제목</label>' +
        '  <input type="text" id="composer-title" autocomplete="off">' +
        '  <label for="composer-date">날짜</label>' +
        '  <input type="date" id="composer-date">' +
        '  <label for="composer-body">본문</label>' +
        '  <textarea id="composer-body" placeholder="빈 줄로 문단을 나눕니다. [ANT, OOO] 처럼 대괄호로만 된 줄은 소제목이 됩니다."></textarea>' +
        '  <p class="hint">저장하면 이 저장소에 바로 커밋됩니다. 방문자에게 실제로 보이기까지 GitHub Pages 가 반영되는 1~2분이 걸릴 수 있어요(이 화면에는 바로 나타납니다).</p>' +
        '  <div class="actions">' +
        '    <button type="submit" class="primary" id="composer-save">저장</button>' +
        '    <button type="button" class="plain" id="composer-cancel">취소</button>' +
        '    <button type="button" class="plain" id="composer-forget"' + (hasToken ? '' : ' hidden') + '>이 기기의 토큰 지우기</button>' +
        '  </div>' +
        '  <p class="composer__status" id="composer-status"></p>' +
        '</form>';

    var openBtn = document.getElementById('composer-open');
    var form = document.getElementById('composer');
    var tokenStep = document.getElementById('token-step');
    var tokenInput = document.getElementById('composer-token');
    var titleInput = document.getElementById('composer-title');
    var dateInput = document.getElementById('composer-date');
    var bodyInput = document.getElementById('composer-body');
    var saveBtn = document.getElementById('composer-save');
    var cancelBtn = document.getElementById('composer-cancel');
    var forgetBtn = document.getElementById('composer-forget');
    var statusEl = document.getElementById('composer-status');

    function today() {
        var d = new Date();
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') +
            '-' + String(d.getDate()).padStart(2, '0');
    }

    function toDotDate(isoDate) {
        return isoDate ? isoDate.replace(/-/g, '.') : '';
    }

    function setStatus(text, kind) {
        statusEl.textContent = text || '';
        statusEl.className = 'composer__status' + (kind ? ' is-' + kind : '');
    }

    function openForm() {
        dateInput.value = today();
        tokenStep.hidden = !!getToken();
        form.hidden = false;
        openBtn.hidden = true;
        setStatus('');
        titleInput.focus();
    }

    function closeForm() {
        form.hidden = true;
        openBtn.hidden = false;
        titleInput.value = '';
        bodyInput.value = '';
        setStatus('');
    }

    openBtn.addEventListener('click', openForm);
    cancelBtn.addEventListener('click', closeForm);

    forgetBtn.addEventListener('click', function () {
        clearToken();
        tokenInput.value = '';
        tokenStep.hidden = false;
        forgetBtn.hidden = true;
        setStatus('이 기기에서 토큰을 지웠습니다.', 'ok');
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        var title = titleInput.value.trim();
        var body = window.BlogRender.splitParagraphs(bodyInput.value);
        var date = toDotDate(dateInput.value);
        var token = tokenStep.hidden ? getToken() : tokenInput.value.trim();

        if (!title) { setStatus('제목을 입력하세요.', 'error'); titleInput.focus(); return; }
        if (!body.length) { setStatus('본문을 입력하세요.', 'error'); bodyInput.focus(); return; }
        if (!token) { setStatus('토큰을 입력하세요.', 'error'); tokenInput.focus(); return; }

        saveBtn.disabled = true;
        setStatus('저장 중…');

        githubGet(token)
            .then(function (file) {
                var posts;
                try {
                    posts = JSON.parse(base64ToUtf8(file.content));
                } catch (e) {
                    throw new Error('posts.json 형식이 이상합니다: ' + e.message);
                }
                posts.push({ title: title, date: date, body: body });
                return githubPut(token, posts, file.sha, 'Add post: ' + title).then(function () {
                    return posts;
                });
            })
            .then(function (posts) {
                setToken(token);
                forgetBtn.hidden = false;
                window.__posts = posts;
                postsContainer.innerHTML = window.BlogRender.renderList(posts);
                setStatus('저장했습니다. 위 목록에 바로 반영했어요 — 다른 사람에게 보이기까지는 1~2분 걸릴 수 있습니다.', 'ok');
                titleInput.value = '';
                bodyInput.value = '';
            })
            .catch(function (err) {
                setStatus(friendlyError(err), 'error');
                if (err.status === 401 || err.status === 403) {
                    clearToken();
                    tokenStep.hidden = false;
                }
            })
            .then(function () { saveBtn.disabled = false; });
    });
}());
