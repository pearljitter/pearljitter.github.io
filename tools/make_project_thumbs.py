# -*- coding: utf-8 -*-
"""
건축 프로젝트(0A_*)의 아카이브 썸네일을 각 폴더 1번 이미지에서 만든다.

pc.html 의 3D 아카이브와 mobile.html 카드가 쓰는 thumbnail/<번호>.jpg 를 만든다.
번호는 pc.html 의 works 배열 순서라서, 여기서 직접 읽어 맞춘다.
프로젝트를 더하거나 순서를 바꿔도 이 스크립트를 다시 돌리면 맞춰진다.

만드는 방식:
    1번 이미지의 한가운데를 정사각형으로 잘라내되, 짧은 변보다 조금 작게 잘라
    확대한 효과를 준다(ZOOM). 결과는 SIZE x SIZE 정사각형.

사용법:
    python tools/make_project_thumbs.py
    python tools/make_project_thumbs.py --zoom 1.2
    python tools/make_project_thumbs.py --dry-run

소스는 각 프로젝트의 실내 렌더링 한 장으로 고정한다 (SOURCE_OVERRIDES).
외관 사진이나 도면이 아니라 내부를 보여주는 이미지를 쓰기 위함이다.
기본 zoom 은 1.0 — 추가로 당겨 자르지 않고 중앙을 정사각형으로만 자른다.
"""
import argparse
import io
import os
import re
import sys

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit('Pillow가 필요합니다.  설치:  pip install Pillow')

ROOT = 'FOLDER'
WORKS_JS = os.path.join(ROOT, 'js', 'works.js')
THUMB_DIR = os.path.join(ROOT, 'thumbnail')
SOURCE = '1.jpg'      # 지정이 없는 폴더에 쓰는 기본값

# 폴더 -> 대표 이미지 번호. 외관 사진 대신 그 프로젝트의 실내 렌더링을 고른다.
SOURCE_OVERRIDES = {
    '0A_11_homeostasis': 4,          # 쉼터 내부, 초록 플랫폼
    '0A_12_verticalfarms': 5,        # 팜 아래 다이닝 공간
    '0A_13_condcomp': 4,             # 유닛 내부
    '0A_14_uptownrunwayorigin': 12,  # 커뮤니티 마켓 내부
    '0A_15_yujinmansions': 8,        # F&B 골목 내부
    '0A_16_diningway': 7,            # 다이닝 프롬나드 내부
    '0A_17_uptownrunway': 7,         # 처리동 내부
}
SIZE = 400            # 화면에는 200px 로 나오므로 2배
QUALITY = 82
ZOOM = 1.0            # 1.0 이면 짧은 변 그대로 정사각 크롭, 클수록 더 당겨서 자른다


def project_thumbs():
    """thumbnail 번호 -> 프로젝트 폴더. js/works.js 의 작업 순서를 따른다."""
    text = io.open(WORKS_JS, encoding='utf-8').read()
    works = re.findall(r"'(0[AGT]_[^']+\.html)'", text)
    found = {}
    for index, page in enumerate(works, 1):
        if not page.startswith('0A_'):
            continue
        folder = os.path.join(ROOT, os.path.splitext(page)[0])
        if os.path.isdir(folder):
            found[index] = folder
    return found


def crop_square(image, zoom):
    """한가운데를 정사각형으로 잘라낸다. zoom 이 클수록 좁게 잘린다."""
    side = int(min(image.size) / zoom)
    left = (image.width - side) // 2
    top = (image.height - side) // 2
    return image.crop((left, top, left + side, top + side))


def main():
    parser = argparse.ArgumentParser(
        description='0A_* 프로젝트의 아카이브 썸네일을 1번 이미지에서 만듭니다.')
    parser.add_argument('--zoom', type=float, default=ZOOM,
                        help='클수록 중심부를 더 당겨서 자름 (기본: %.2f)' % ZOOM)
    parser.add_argument('--dry-run', action='store_true',
                        help='실제로 쓰지 않고 대상만 출력')
    args = parser.parse_args()

    targets = project_thumbs()
    if not targets:
        print('pc.html 에서 0A_* 프로젝트를 찾지 못했습니다.')
        return 1

    for index, folder in sorted(targets.items()):
        name = os.path.basename(folder)
        source_name = '%d.jpg' % SOURCE_OVERRIDES[name] if name in SOURCE_OVERRIDES else SOURCE
        source = os.path.join(folder, source_name)
        target = os.path.join(THUMB_DIR, '%d.jpg' % index)
        if not os.path.exists(source):
            print('  건너뜀: %s 없음' % source.replace(os.sep, '/'))
            continue

        image = ImageOps.exif_transpose(Image.open(source))
        note = '%dx%d -> %dx%d' % (image.width, image.height, SIZE, SIZE)

        if args.dry_run:
            print('  %-2d  %-26s %s  (미리보기)'
                  % (index, os.path.basename(folder), note))
            continue

        square = crop_square(image, args.zoom).resize((SIZE, SIZE), Image.LANCZOS)
        if square.mode in ('RGBA', 'LA', 'P'):
            square = square.convert('RGB')
        square.save(target, 'JPEG', quality=QUALITY, optimize=True, progressive=True)
        print('  %-2d  %-26s %s  %.1fKB'
              % (index, os.path.basename(folder), note,
                 os.path.getsize(target) / 1024))

    print('')
    print('zoom %.2f · 프로젝트별로 지정된 실내 렌더링에서 생성' % args.zoom)
    return 0


if __name__ == '__main__':
    sys.exit(main())
