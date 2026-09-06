# -*- coding: utf-8 -*-
"""
새 글 한 편을 tools/posts.json 끝에 붙이고 0T_9_blog.html 을 다시 만든다.
보통은 새글쓰기.bat 이 이 스크립트를 부르지만, 직접 써도 된다:

    python tools/add_post.py "글 제목" 본문.txt

본문 파일은 그냥 텍스트 파일이다. 빈 줄로 문단을 나눈다. 한 줄이 통째로
대괄호로 싸여 있으면([ANT, OOO] 처럼) 문단이 아니라 글 안의 작은 소제목으로
다룬다.
"""
import io
import json
import os
import sys
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
POSTS_JSON = os.path.join(ROOT, 'tools', 'posts.json')


def split_paragraphs(text):
    # 빈 줄(연속 줄바꿈)로 문단을 나누고, 문단 안의 홑줄바꿈은 띄어쓰기로 합친다.
    blocks = [b.strip() for b in text.replace('\r\n', '\n').split('\n\n')]
    paragraphs = []
    for block in blocks:
        if not block:
            continue
        lines = [ln.strip() for ln in block.split('\n') if ln.strip()]
        if len(lines) == 1 and lines[0].startswith('[') and lines[0].endswith(']'):
            paragraphs.append(lines[0])   # 소제목 한 줄은 그대로 둔다
        else:
            paragraphs.append(' '.join(lines))
    return paragraphs


def main():
    if len(sys.argv) != 3:
        sys.exit('사용법: python tools/add_post.py "글 제목" 본문파일.txt')

    title = sys.argv[1].strip()
    body_path = sys.argv[2]

    if not title:
        sys.exit('제목이 비어 있습니다.')
    if not os.path.exists(body_path):
        sys.exit('본문 파일을 찾을 수 없습니다: %s' % body_path)

    text = io.open(body_path, encoding='utf-8-sig').read()
    paragraphs = split_paragraphs(text)
    if not paragraphs:
        sys.exit('본문이 비어 있습니다. 저장하지 않았습니다.')

    posts = json.loads(io.open(POSTS_JSON, encoding='utf-8').read())
    posts.append({
        'title': title,
        'date': date.today().strftime('%Y.%m.%d'),
        'body': paragraphs,
    })
    io.open(POSTS_JSON, 'w', encoding='utf-8', newline='\n').write(
        json.dumps(posts, ensure_ascii=False, indent=2) + '\n'
    )
    print('추가됨: %s (%s, 문단 %d개)' % (title, posts[-1]['date'], len(paragraphs)))

    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    import build_blog
    build_blog.build()


if __name__ == '__main__':
    main()
