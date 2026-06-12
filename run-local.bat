@echo off
title DSE Insight Pro - Local Server
echo Starting DSE Insight Pro local server...

netstat -ano | findstr :8080 >nul
if %errorlevel% equ 0 (
    echo Port 8080 is already in use. Opening app in browser...
    start http://localhost:8080
    exit /b
)

echo Starting Python HTTP server on port 8080...
start /min python -m http.server 8080

timeout /t 1 /nobreak >nul
start http://localhost:8080
echo Local server started successfully!
