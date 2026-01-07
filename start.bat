@echo off
title Praxis Auto Sorter

echo.
echo ========================================
echo    Praxis Auto Sorter
echo ========================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please download and install Node.js from:
    echo https://nodejs.org/
    echo.
    echo After installing, close this window and double-click start.bat again.
    echo.
    pause
    exit /b 1
)

:: Show Node version
echo Found Node.js:
node --version
echo.

:: Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies... (this only happens once)
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo ERROR: Failed to install dependencies.
        echo Please check your internet connection and try again.
        pause
        exit /b 1
    )
    echo.
    echo Dependencies installed successfully!
    echo.
)

:: Start the server
echo Starting server...
echo.
echo The app will open in your browser automatically.
echo Keep this window open while using the app.
echo Press Ctrl+C to stop the server when done.
echo.
echo ========================================
echo.

:: Wait a moment then open browser
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:3000"

:: Run the server (this blocks until Ctrl+C)
node server.js

echo.
echo Server stopped.
pause
