# -*- coding: utf-8 -*-
"""
tools/posts.json 에서 FOLDER/0T_9_blog.html 을 다시 만든다.

글을 쓰는 흐름은:
    새글쓰기.bat 실행 -> 제목 입력, 메모장에서 본문 작성 -> 저장하고 닫기
    -> tools/add_post.py 가 posts.json 에 새 글을 추가하고 이 스크립트를 부른다
    -> 배포.bat 으로 올린다

posts.json 을 직접 손으로 고쳐도 되고(글 순서를 바꾸거나 지울 때), 그 다음
이 스크립트만 다시 돌리면 0T_9_blog.html 이 맞춰진다:
    python tools/build_blog.py

글은 위에서 아래로, 쓴 순서 그대로 보여준다(맨 위가 가장 오래된 글) —
새 글은 add_post.py 가 목록 맨 끝에 붙인다. 최신 글이 위로 오게 하려면
아래 ORDER 를 'newest-first' 로 바꾸면 된다.
"""
import io
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS_JSON = os.path.join(ROOT, 'tools', 'posts.json')
OUT_HTML = os.path.join(ROOT, 'FOLDER', '0T_9_blog.html')

ORDER = 'oldest-first'   # 'oldest-first' 또는 'newest-first'

PAGE_TITLE = 'Thoughts — pearl jitter'
PAGE_DESCRIPTION = 'Notes on architecture, philosophy and the work itself, by pearl jitter.'
H1 = 'THOUGHTS'
H2 = 'notes on architecture, philosophy and the work itself'


def esc(text):
    return (text.replace('&', '&amp;').replace('<', '&lt;')
                .replace('>', '&gt;').replace('"', '&quot;'))


def render_paragraph(text):
    # 대괄호로만 된 줄은 글 안의 소제목으로 다룬다 (예: "[ANT, OOO]").
    stripped = text.strip()
    if stripped.startswith('[') and stripped.endswith(']'):
        return '            <p class="post__sub">%s</p>' % esc(stripped[1:-1])
    return '            <p>%s</p>' % esc(text)


def render_post(post):
    out = ['        <section class="post">']
    if post.get('date'):
        out.append('            <h3 class="post__date">%s</h3>' % esc(post['date']))
    out.append('            <p class="post__title">%s</p>' % esc(post['title']))
    out.extend(render_paragraph(p) for p in post['body'])
    out.append('        </section>')
    return '\n'.join(out)


def build():
    posts = json.loads(io.open(POSTS_JSON, encoding='utf-8').read())
    if not posts:
        raise SystemExit('posts.json 이 비어 있습니다.')

    ordered = posts if ORDER == 'oldest-first' else list(reversed(posts))

    sections = []
    for i, post in enumerate(ordered):
        sections.append(render_post(post))
        if i < len(ordered) - 1:
            sections.append('        <hr class="story-end">')
    body = '\n\n'.join(sections)

    html = '''<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>%(title)s</title>
    <meta name="description" content="%(description)s">
    <link rel="stylesheet" href="pageStyle.css">
    <link rel="stylesheet" href="css/gallery.css">
</head>

<body class="gallery-page">
    <h1>%(h1)s</h1>
    <h2>%(h2)s</h2>

    <article class="story">
%(body)s
    </article>

    <div class="decontainer">
        <div class="moveback-link">
            <a href="pc.html" class="btn">BACK</a>
        </div>
    </div>
</body>

</html>
''' % {
        'title': esc(PAGE_TITLE),
        'description': esc(PAGE_DESCRIPTION),
        'h1': esc(H1),
        'h2': esc(H2),
        'body': body,
    }

    io.open(OUT_HTML, 'w', encoding='utf-8', newline='\n').write(html)
    print('0T_9_blog.html 갱신: 글 %d개 (%s)' % (len(posts), ORDER))


if __name__ == '__main__':
    build()
