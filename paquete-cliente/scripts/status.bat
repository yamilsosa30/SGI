@echo off
title SGIK POS - Estado
cd /d "%~dp0.."
echo.
docker ps -a --filter "name=sgik" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo.
curl -s http://localhost:8080/actuator/health 2>nul | findstr "UP" >nul
if errorlevel 1 (
    echo Backend: OFFLINE
) else (
    echo Backend: OK
)
curl -s http://localhost:3000 2>nul >nul
if errorlevel 1 (
    echo Frontend: OFFLINE
) else (
    echo Frontend: OK
)
pause
