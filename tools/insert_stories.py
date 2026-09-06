# -*- coding: utf-8 -*-
"""연도(h2) 아래에 프로젝트 본문을 넣는다. 갤러리는 그 아래에 그대로 둔다."""
import io
import os
import re
import sys

from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from stories import STORIES

ROOT = 'FOLDER'

# 폴더 -> (PC 페이지, 모바일 페이지)
PAGES = {
    '0A_11_homeostasis': ('0A_11_homeostasis.html', '0A_11_m_homeostasis.html'),
    '0A_12_verticalfarms': ('0A_12_verticalfarms.html', '0A_12_m_verticalfarms.html'),
    '0A_13_condcomp': ('0A_13_condcomp.html', '0A_13_m_condcomp.html'),
    '0A_14_uptownrunwayorigin': ('0A_14_uptownrunwayorigin.html',
                                 '0A_14_m_uptownrunwayorigin.html'),
    '0A_15_yujinmansions': ('0A_15_yujinmansions.html', '0A_15_m_yujinmansions.html'),
    '0A_16_diningway': ('0A_16_diningway.html', '0A_16_m_diningway.html'),
    '0A_17_uptownrunway': ('0A_17_uptownrunway.html', '0A_17_m_uptownrunway.html'),
}


def esc(text):
    return (text.replace('&', '&amp;').replace('<', '&lt;')
                .replace('>', '&gt;').replace('"', '&quot;'))


def build(folder, blocks):
    out = ['    <article class="story">']
    used = []
    for block in blocks:
        kind = block[0]
        if kind == 'lede':
            out.append('        <p class="lede">%s</p>' % esc(block[1]))
        elif kind == 'p':
            out.append('        <p>%s</p>' % esc(block[1]))
        elif kind == 'h':
            out.append('        <h3>%s</h3>' % esc(block[1]))
        elif kind == 'fig':
            _, n, caption, alt = block
            used.append(n)
            out.append('        <figure>')
            # 본문 그림은 최대 980px 로 커지므로 480px 썸네일만으로는 흐리다.
            # 실제 픽셀 폭을 읽어 srcset 을 주고 브라우저가 고르게 한다.
            thumb_w = Image.open('%s/%s/thumbs/%d.jpg' % (ROOT, folder, n)).width
            full_w = Image.open('%s/%s/%d.jpg' % (ROOT, folder, n)).width
            out.append('            <img src="%s/%d.jpg"' % (folder, n))
            out.append('                 srcset="%s/thumbs/%d.jpg %dw, %s/%d.jpg %dw"'
                       % (folder, n, thumb_w, folder, n, full_w))
            out.append('                 sizes="(max-width: 700px) calc(100vw - 36px), 620px"')
            out.append('                 data-full="%s/%d.jpg"' % (folder, n))
            out.append('                 alt="%s" loading="lazy" decoding="async">'
                       % esc(alt))
            out.append('            <figcaption>%s</figcaption>' % esc(caption))
            out.append('        </figure>')
        else:
            raise SystemExit('unknown block: %r' % kind)
    out.append('    </article>')
    out.append('')
    out.append('    <hr class="story-end">')
    return '\n'.join(out), used


problems = []
for folder, (pc, mobile) in sorted(PAGES.items()):
    blocks = STORIES[folder]
    html, used = build(folder, blocks)

    # 폴더의 모든 이미지가 본문에 쓰였는지 확인한다.
    available = sorted(int(os.path.splitext(f)[0])
                       for f in os.listdir(os.path.join(ROOT, folder))
                       if f.lower().endswith('.jpg'))
    missing = sorted(set(available) - set(used))
    duplicated = sorted(n for n in set(used) if used.count(n) > 1)
    if missing:
        problems.append('%s: 본문에 빠진 이미지 %s' % (folder, missing))
    if duplicated:
        problems.append('%s: 본문에 중복된 이미지 %s' % (folder, duplicated))

    for name in (pc, mobile):
        path = os.path.join(ROOT, name)
        text = io.open(path, encoding='utf-8').read()
        if '<article class="story">' in text:
            text = re.sub(r'\n    <article class="story">.*?<hr class="story-end">',
                          '', text, flags=re.S)
        new, count = re.subn(r'(<h2>[^<]*</h2>\n)(\n    <div class="gallery">)',
                             lambda m: m.group(1) + '\n' + html + m.group(2),
                             text, count=1)
        if count != 1:
            raise SystemExit('삽입 지점을 찾지 못함: %s' % name)
        io.open(path, 'w', encoding='utf-8', newline='\n').write(new)

    print('%-26s 본문 %2d문단 · 그림 %2d/%2d장'
          % (folder,
             sum(1 for b in blocks if b[0] in ('p', 'lede')),
             len(used), len(available)))

print('')
if problems:
    print('확인 필요:')
    for p in problems:
        print('  ' + p)
else:
    print('모든 폴더의 이미지가 빠짐없이, 중복 없이 본문에 쓰였습니다.')
