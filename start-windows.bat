@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo   Запуск «Люмена»...
echo   Не закрывайте это окно. Остановить — Ctrl+C.
echo.

rem Браузер открываем через пару секунд, когда сервер уже поднялся.
start "" cmd /c "timeout /t 2 >nul & start "" http://localhost:12000/"

rem На Windows надёжнее запускатель «py», но он есть не всегда.
where py >nul 2>nul
if %errorlevel%==0 (
  py server.py 12000
) else (
  python server.py 12000
)

echo.
echo Сервер остановлен.
pause
