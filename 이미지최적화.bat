@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
set PYTHONIOENCODING=utf-8

echo.
echo ==========================================
echo   이미지 최장변 2000px 이내로 줄이기
echo ==========================================
echo.
echo 대상: FOLDER\ 안의 모든 jpg / png
echo  - 최장변이 2000px 를 넘으면 줄입니다.
echo  - 갤러리 폴더의 thumbs\ 를 원본에 맞춰 다시 만듭니다.
echo  - 각 프로젝트 1번 이미지로 아카이브 썸네일을 다시 만듭니다.
echo    (새 이미지를 넣거나 갈아끼웠으면 이것만 돌리면 됩니다)
echo.

where python >nul 2>&1
if errorlevel 1 (
    echo [오류] python 을 찾을 수 없습니다.
    echo        https://www.python.org 에서 설치하고 다시 실행하세요.
    goto :end
)

echo [1/3] 먼저 무엇이 바뀔지 확인합니다...
echo ------------------------------------------
python tools\resize_images.py --dry-run
echo ------------------------------------------
echo.

set OK=
set /p OK=위 내용대로 진행할까요? (y 를 누르고 Enter):

if /i not "%OK%"=="y" (
    echo.
    echo 취소했습니다. 이미지는 그대로입니다.
    goto :end
)

echo.
echo [2/3] 크기 조절과 갤러리 썸네일...
python tools\resize_images.py
if errorlevel 1 (
    echo.
    echo [오류] 실행에 실패했습니다. 위 메시지를 확인하세요.
    goto :end
)

echo.
echo [3/3] 아카이브 썸네일 (각 프로젝트 1번 이미지의 중심부)...
python tools\make_project_thumbs.py
if errorlevel 1 (
    echo.
    echo [오류] 아카이브 썸네일 생성에 실패했습니다.
    goto :end
)
echo    더 당겨 자르려면:  python tools\make_project_thumbs.py --zoom 1.8

echo.
echo 끝났습니다. 사이트에 올리려면 배포.bat 을 실행하세요.
echo 되돌리려면 (아직 커밋 전이라면)  git checkout -- FOLDER

:end
echo.
pause
endlocal
