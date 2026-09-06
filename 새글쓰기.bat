@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
cd /d "%~dp0"
set PYTHONIOENCODING=utf-8

echo.
echo ==========================================
echo   THOUGHTS 새 글 쓰기
echo ==========================================
echo.

where python >nul 2>&1
if errorlevel 1 (
    echo [오류] python 을 찾을 수 없습니다.
    echo        https://www.python.org 에서 설치하고 다시 실행하세요.
    goto :end
)

set TITLE=
set /p TITLE=글 제목을 입력하세요 (그냥 Enter 치면 취소):

if "%TITLE%"=="" (
    echo.
    echo 취소했습니다.
    goto :end
)

set DRAFT=%TEMP%\thoughts_draft_%RANDOM%.txt
type nul > "%DRAFT%"

echo.
echo 메모장이 열립니다. 본문을 쓰고 저장한 뒤 메모장을 닫으면 이어집니다.
echo  - 빈 줄로 문단을 나눕니다.
echo  - [ANT, OOO] 처럼 대괄호로만 된 줄은 글 안의 소제목이 됩니다.
echo.
pause

start "" /wait notepad.exe "%DRAFT%"

for %%F in ("%DRAFT%") do set DRAFT_SIZE=%%~zF
if "%DRAFT_SIZE%"=="0" (
    echo.
    echo 빈 채로 닫혔습니다. 저장하지 않았습니다.
    del "%DRAFT%" >nul 2>&1
    goto :end
)

echo.
echo 저장 중...
python tools\add_post.py "%TITLE%" "%DRAFT%"
if errorlevel 1 (
    echo.
    echo [오류] 저장에 실패했습니다. 위 메시지를 확인하세요.
    echo        임시 파일은 남겨 두었습니다:  %DRAFT%
    goto :end
)

python tools\stamp_assets.py >nul

del "%DRAFT%" >nul 2>&1

echo.
echo 끝났습니다. 사이트에 올리려면 배포.bat 을 실행하세요.
echo 되돌리려면 (아직 배포 전이라면)  git checkout -- tools\posts.json FOLDER\0T_9_blog.html

:end
echo.
pause
endlocal
