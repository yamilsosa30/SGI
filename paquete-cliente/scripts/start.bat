@echo off
title SGIK POS - Iniciando

echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                        SGIK POS - Iniciando                              ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0.."

docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker no esta corriendo.
    pause
    exit /b 1
)

docker image inspect sgik-backend:1.0 >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Las imagenes no estan cargadas.
    echo Ejecuta primero 1-INSTALAR-PRIMERA-VEZ.bat
    pause
    exit /b 1
)

echo [1/2] Iniciando contenedores...
docker compose up -d
if errorlevel 1 (
    echo [ERROR] No se pudo iniciar el sistema.
    pause
    exit /b 1
)

echo [2/2] Esperando backend...
set /a count=0
:wait_backend
set /a count+=1
if %count% gtr 24 goto :open_browser
timeout /t 5 /nobreak >nul
curl -s http://localhost:8080/actuator/health 2>nul | findstr "UP" >nul
if errorlevel 1 goto :wait_backend

:open_browser
echo.
echo Sistema iniciado.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8080
echo Usuario:  admin
echo Password: admin123
echo.
start http://localhost:3000
pause
