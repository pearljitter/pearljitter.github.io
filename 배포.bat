@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo ==========================================
echo   pearljitter.github.io  배포
echo ==========================================
echo.

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo [오류] 여기는 git 저장소가 아닙니다.
    echo        이 파일이 프로젝트 폴더 안에 있는지 확인하세요.
    goto :end
)

for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD') do set BRANCH=%%b

set CHANGED=
for /f "delims=" %%i in ('git status --porcelain') do set CHANGED=1

if not defined CHANGED (
    echo 변경된 내용이 없습니다. 배포할 것이 없습니다.
    echo.
    echo 현재 사이트:  https://pearljitter.github.io/
    goto :end
)

rem CSS/JS 는 파일명이 그대로라, 고쳐 올려도 방문자 브라우저가 예전 것을
rem 계속 쓴다. 링크에 내용 해시를 붙여 바뀐 것만 다시 받게 한다.
where python >nul 2>&1
if not errorlevel 1 (
    echo [1/5] 스타일/스크립트 버전 갱신
    python tools\stamp_assets.py
    echo.
)

echo [2/5] 변경된 파일
echo ------------------------------------------
git -c core.quotepath=false status --short
echo ------------------------------------------
echo.

set MSG=
set /p MSG=커밋 메시지를 입력하세요 (그냥 Enter 치면 취소):

if "%MSG%"=="" (
    echo.
    echo 취소했습니다. 아무것도 바뀌지 않았습니다.
    goto :end
)

echo.
echo [3/5] 변경 사항 담는 중...
git add -A
if errorlevel 1 goto :failed

echo [4/5] 커밋 중...
git commit -m "%MSG%"
if errorlevel 1 goto :failed

echo [5/5] GitHub 으로 올리는 중... (브랜치: %BRANCH%)
git push origin %BRANCH%
if errorlevel 1 (
    echo.
    echo [오류] 푸시에 실패했습니다.
    echo        커밋은 끝났으니 인터넷 연결이나 GitHub 로그인을 확인한 뒤
    echo        이 파일을 다시 실행하거나  git push origin %BRANCH%  를 실행하세요.
    goto :end
)

echo.
echo ==========================================
echo   배포 완료
echo ==========================================
echo.
echo   https://pearljitter.github.io/
echo.
echo   반영까지 보통 1~2분 걸립니다.
echo   진행 상황: https://github.com/pearljitter/pearljitter.github.io/actions
echo.
goto :end

:failed
echo.
echo [오류] 중간에 실패했습니다. 위 메시지를 확인하세요.

:end
echo.
pause
endlocal
