# -*- coding: utf-8 -*-
"""
폴더 안 이미지의 최장변을 지정한 크기(기본 2000px) 이내로 줄인다.

사용법:
    python tools/resize_images.py                 FOLDER/ 전체를 검사
    python tools/resize_images.py FOLDER/0A_15_yujinmansions
    python tools/resize_images.py --max 1600 어떤/폴더
    python tools/resize_images.py --dry-run       무엇이 바뀔지만 출력

동작:
    - 최장변이 기준을 넘는 이미지만 줄인다. 이미 작은 것은 건드리지 않는다.
    - 갤러리 폴더(0A_*)의 thumbs/ 를 원본에 맞춰 다시 만든다.
      새 이미지를 넣거나 기존 이미지를 갈아끼우고 이 스크립트를 돌리면
      그리드에 쓰는 썸네일도 함께 갱신된다. (--no-thumbs 로 끌 수 있다)
    - JPEG는 progressive로 다시 저장하고, PNG는 PNG로 남긴다.
    - 스케치용 스프라이트 폴더는 기본으로 건너뛴다 (아래 SKIP_DIRS 참고).
      전부 포함하려면 --all 을 붙인다.
    - 되돌리려면 git checkout -- <경로> (커밋 전이라면).

Pillow가 필요하다:  pip install Pillow
"""
import argparse
import os
import sys

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit('Pillow가 필요합니다.  설치:  pip install Pillow')

EXTENSIONS = ('.jpg', '.jpeg', '.png')
DEFAULT_ROOT = 'FOLDER'
# 원본이 이미 강하게 압축된 경우 82로 다시 저장하면 픽셀이 줄어도
# 용량은 늘어난다. 위에서부터 시도해 원본보다 커지지 않는 값을 쓴다.
JPEG_QUALITIES = (82, 78, 74, 70, 66)

# 스케치가 image() 로 원본 크기 그대로 그리는 스프라이트들이다.
# 픽셀 크기를 바꾸면 게임 화면의 배치가 어긋나므로 기본으로 제외한다.
SKIP_DIRS = {'0G_2_chunking', '0G_3_ski'}

# 갤러리 그리드가 쓰는 축소본. 원본과 같은 이름으로 thumbs/ 안에 둔다.
THUMB_DIR = 'thumbs'
THUMB_MAX = 480
THUMB_QUALITY = 78


def collect(paths, include_all):
    """주어진 경로들(파일 또는 폴더) 아래의 이미지 파일을 모은다."""
    found = []
    skipped = []
    for path in paths:
        if os.path.isfile(path):
            if path.lower().endswith(EXTENSIONS):
                found.append(path)
        elif os.path.isdir(path):
            for dirpath, dirnames, filenames in os.walk(path):
                if not include_all:
                    for d in list(dirnames):
                        if d in SKIP_DIRS:
                            dirnames.remove(d)
                            skipped.append(os.path.join(dirpath, d))
                dirnames[:] = [d for d in dirnames
                               if d != '.git' and d != THUMB_DIR]
                for name in sorted(filenames):
                    if name.lower().endswith(EXTENSIONS):
                        found.append(os.path.join(dirpath, name))
        else:
            print('건너뜀 (없는 경로): %s' % path)
    return sorted(set(found)), sorted(set(skipped))


def save(image, path, source_ext, budget):
    """원본 확장자에 맞춰 저장한다. JPEG는 budget 바이트 안에 들도록 시도한다."""
    if source_ext == '.png':
        image.save(path, 'PNG', optimize=True)
        return None

    if image.mode in ('RGBA', 'LA', 'P'):
        image = image.convert('RGB')

    for quality in JPEG_QUALITIES:
        image.save(path, 'JPEG', quality=quality, optimize=True, progressive=True)
        if os.path.getsize(path) <= budget:
            return quality
    return JPEG_QUALITIES[-1]


def resize_one(path, longest, dry_run):
    """한 장을 처리하고 (바뀜?, 이전크기, 이후크기, 메모)를 돌려준다."""
    before = os.path.getsize(path)
    try:
        image = ImageOps.exif_transpose(Image.open(path))
    except Exception as exc:
        return False, before, before, '열 수 없음: %s' % exc

    width, height = image.size
    if max(width, height) <= longest:
        return False, before, before, '그대로 (%dx%d)' % (width, height)

    ratio = longest / float(max(width, height))
    new_size = (max(1, round(width * ratio)), max(1, round(height * ratio)))
    note = '%dx%d -> %dx%d' % (width, height, new_size[0], new_size[1])

    if dry_run:
        return True, before, before, note + ' (미리보기)'

    ext = os.path.splitext(path)[1].lower()
    temp = path + '.tmp'
    try:
        quality = save(image.resize(new_size, Image.LANCZOS), temp, ext, before)
        after = os.path.getsize(temp)
        os.replace(temp, path)
        if quality and quality != JPEG_QUALITIES[0]:
            note += ' · 품질 %d' % quality
        # 목적은 해상도 상한이라, 그래도 용량이 늘면 적용하되 알려준다.
        if after > before:
            note += ' (용량은 늘었음)'
        return True, before, after, note
    except Exception as exc:
        if os.path.exists(temp):
            os.remove(temp)
        return False, before, before, '실패: %s' % exc


def sources_in(folder):
    """폴더 바로 아래의 원본 이미지를 {이름: 경로} 로 돌려준다."""
    found = {}
    for name in sorted(os.listdir(folder)):
        path = os.path.join(folder, name)
        if os.path.isfile(path) and name.lower().endswith(EXTENSIONS):
            found[os.path.splitext(name)[0]] = path
    return found


def needs_thumbs(folder):
    """갤러리 페이지가 그리드에 쓰는 폴더인가."""
    name = os.path.basename(folder.rstrip('/' + os.sep))
    return os.path.isdir(os.path.join(folder, THUMB_DIR)) or name.startswith('0A_')


def make_thumb(source, thumb):
    image = ImageOps.exif_transpose(Image.open(source))
    ratio = min(1.0, THUMB_MAX / float(max(image.size)))
    if ratio < 1.0:
        image = image.resize(
            (max(1, round(image.width * ratio)), max(1, round(image.height * ratio))),
            Image.LANCZOS)
    if image.mode in ('RGBA', 'LA', 'P'):
        image = image.convert('RGB')
    image.save(thumb, 'JPEG', quality=THUMB_QUALITY, optimize=True, progressive=True)


def sync_thumbs(folder, dry_run):
    """thumbs/ 를 원본과 맞춘다. (새로 만든 수, 지운 수)를 돌려준다."""
    thumb_dir = os.path.join(folder, THUMB_DIR)
    sources = sources_in(folder)
    made = 0
    removed = 0

    for stem, source in sources.items():
        thumb = os.path.join(thumb_dir, stem + '.jpg')
        # 없거나, 원본이 썸네일보다 최근이면 다시 만든다.
        if (os.path.exists(thumb)
                and os.path.getmtime(thumb) >= os.path.getmtime(source)):
            continue
        made += 1
        print('  %s %s' % ('생성 예정' if dry_run else '갱신  ',
                           thumb.replace(os.sep, '/')))
        if dry_run:
            continue
        if not os.path.isdir(thumb_dir):
            os.makedirs(thumb_dir)
        make_thumb(source, thumb)

    # 원본이 사라진 썸네일은 남겨둘 이유가 없다.
    if os.path.isdir(thumb_dir):
        for name in sorted(os.listdir(thumb_dir)):
            path = os.path.join(thumb_dir, name)
            if not os.path.isfile(path):
                continue
            if os.path.splitext(name)[0] in sources:
                continue
            removed += 1
            print('  %s %s  (원본 없음)'
                  % ('삭제 예정' if dry_run else '삭제  ', path.replace(os.sep, '/')))
            if not dry_run:
                os.remove(path)

    return made, removed


def main():
    parser = argparse.ArgumentParser(
        description='이미지 최장변을 지정 크기 이내로 줄입니다.')
    parser.add_argument('paths', nargs='*', default=[DEFAULT_ROOT],
                        help='대상 폴더 또는 파일 (기본: %s)' % DEFAULT_ROOT)
    parser.add_argument('--max', type=int, default=2000, dest='longest',
                        help='최장변 상한 픽셀 (기본: 2000)')
    parser.add_argument('--dry-run', action='store_true',
                        help='실제로 바꾸지 않고 대상만 출력')
    parser.add_argument('--all', action='store_true', dest='include_all',
                        help='스케치 스프라이트 폴더(%s)까지 포함'
                             % ', '.join(sorted(SKIP_DIRS)))
    parser.add_argument('--no-thumbs', action='store_true', dest='no_thumbs',
                        help='thumbs/ 갱신을 건너뜀')
    args = parser.parse_args()

    paths = args.paths or [DEFAULT_ROOT]
    images, skipped = collect(paths, args.include_all)
    if not images:
        print('이미지를 찾지 못했습니다: %s' % ', '.join(paths))
        return 0

    for folder in skipped:
        print('제외: %s  (스케치가 원본 크기로 그리는 스프라이트)'
              % folder.replace(os.sep, '/'))
    if skipped:
        print('      포함하려면 --all 을 붙이세요.')
        print('')

    print('대상 %d장 · 최장변 %dpx 이내%s\n'
          % (len(images), args.longest, ' · 미리보기' if args.dry_run else ''))

    changed = 0
    total_before = 0
    total_after = 0
    for path in images:
        did, before, after, note = resize_one(path, args.longest, args.dry_run)
        total_before += before
        total_after += after
        if did or '실패' in note or '열 수 없음' in note:
            changed += did
            print('  %-52s %8.1fKB -> %7.1fKB  %s'
                  % (path.replace(os.sep, '/'), before / 1024, after / 1024, note))

    if not changed:
        print('  줄일 이미지가 없습니다. 이미 모두 %dpx 이내입니다.' % args.longest)

    # 원본을 손본 뒤에 썸네일을 맞춰야 순서가 맞다.
    if not args.no_thumbs:
        folders = sorted({os.path.dirname(path) for path in images})
        folders = [f for f in folders if needs_thumbs(f)]
        if folders:
            print('')
            print('갤러리 썸네일 (%s/)' % THUMB_DIR)
            made = 0
            removed = 0
            for folder in folders:
                a, b = sync_thumbs(folder, args.dry_run)
                made += a
                removed += b
            if made or removed:
                print('  %d개 갱신, %d개 삭제' % (made, removed))
            else:
                print('  모두 최신입니다.')

    print('')
    if not changed:
        pass
    else:
        print('%d장 변경 · %.1fMB -> %.1fMB (%.1fMB 절약)'
              % (changed, total_before / 1048576, total_after / 1048576,
                 (total_before - total_after) / 1048576))
        if args.dry_run:
            print('미리보기였습니다. 실제로 적용하려면 --dry-run 없이 다시 실행하세요.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
