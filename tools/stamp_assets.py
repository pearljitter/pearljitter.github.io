# -*- coding: utf-8 -*-
"""
공용 CSS / JS 링크에 내용 해시를 붙인다.

파일명이 그대로면 브라우저는 예전 gallery.css / gallery.js 를 계속 쓴다.
스타일이나 동작을 고쳐 올려도 방문자 화면은 그대로인 문제가 생기므로,
내용이 바뀌면 주소도 바뀌도록 ?v=<해시> 를 붙여 둔다.
이미지는 파일명이 바뀌지 않아도 되게 두었으니 여기서는 다루지 않는다.

사용법:
    python tools/stamp_assets.py            바꾸고 결과 출력
    python tools/stamp_assets.py --check    바꿀 것이 있는지만 확인 (CI/배포용)
"""
import glob
import hashlib
import io
import os
import re
import sys

ROOT = 'FOLDER'
ASSETS = [
    'css/gallery.css', 'js/gallery.js',
    'css/archive.css',
    'js/works.js', 'js/archive.js',
    'js/mode-grid.js', 'js/mode-tunnel.js', 'js/mode-list.js',
    'js/blog.js', 'js/blog-render.js', 'js/blog-editor.js',
]
# css/base.css is only reached via @import from the two stylesheets above
# (never linked directly from an HTML page), so stamping it here would be a
# no-op; it changes rarely enough that this is an acceptable gap for now.


def digest(path):
    return hashlib.sha256(io.open(path, 'rb').read()).hexdigest()[:8]


def main():
    check_only = '--check' in sys.argv

    versions = {}
    for asset in ASSETS:
        path = os.path.join(ROOT, asset)
        if not os.path.exists(path):
            print('없는 파일: %s' % path)
            return 1
        versions[asset] = digest(path)

    changed = []
    for page in sorted(glob.glob(os.path.join(ROOT, '*.html'))):
        text = io.open(page, encoding='utf-8').read()
        before = text
        for asset, version in versions.items():
            # href="css/gallery.css" 또는 이미 붙어 있는 ?v=... 를 모두 잡는다
            text = re.sub(
                r'(["\'])' + re.escape(asset) + r'(?:\?v=[0-9a-f]+)?\1',
                lambda m: '%s%s?v=%s%s' % (m.group(1), asset, version, m.group(1)),
                text)
        if text != before:
            changed.append(os.path.basename(page))
            if not check_only:
                io.open(page, 'w', encoding='utf-8', newline='\n').write(text)

    for asset, version in sorted(versions.items()):
        print('  %-18s v=%s' % (asset, version))

    if not changed:
        print('  모든 페이지가 최신입니다.')
        return 0

    if check_only:
        print('  갱신 필요 %d개: %s' % (len(changed), ', '.join(changed)))
        return 1

    print('  %d개 페이지 갱신: %s' % (len(changed), ', '.join(changed)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
