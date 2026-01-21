@echo off
echo ===============================================
echo   Velion DKN - Starting Servers
echo ===============================================
echo.

echo Starting Backend Server...
start "DKN Backend" cmd /k "cd /d %~dp0backend && npm start"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "DKN Frontend" cmd /k "cd /d %~dp0frontend && npx http-server -p 3000 -c-1"

timeout /t 2 /nobreak > nul

echo.
echo ===============================================
echo   Both servers are starting...
echo   Backend: http://localhost:3002
echo   Frontend: http://localhost:3000
echo ===============================================
echo.
echo Opening browser in 5 seconds...
timeout /t 5 /nobreak > nul

start http://localhost:3000

echo.
echo Servers are running!
echo Press any key to close this window...
pause > nul
