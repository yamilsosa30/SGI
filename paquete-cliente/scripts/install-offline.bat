@echo off
title SGIK POS - Instalacion Offline

echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                    SGIK POS - Instalacion Offline                        ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0.."

docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker no esta corriendo.
    echo Inicia Docker Desktop y vuelve a ejecutar este archivo.
    pause
    exit /b 1
)

if not exist "images" (
    echo [ERROR] No se encontro la carpeta images.
    pause
    exit /b 1
)

set missing=0
if not exist "images\mysql_8.tar" set missing=1
if not exist "images\sgik-backend_1.0.tar" set missing=1
if not exist "images\sgik-frontend_1.0.tar" set missing=1

if %missing%==1 (
    echo [ERROR] Faltan archivos .tar dentro de images.
    pause
    exit /b 1
)

echo [1/3] Cargando MySQL...
docker load -i images\mysql_8.tar || goto :error

echo [2/3] Cargando Backend...
docker load -i images\sgik-backend_1.0.tar || goto :error

echo [3/3] Cargando Frontend...
docker load -i images\sgik-frontend_1.0.tar || goto :error

echo.
echo Instalacion completada.
echo Ahora ejecuta 2-INICIAR-SISTEMA.bat
echo.
pause
exit /b 0

:error
echo.
echo [ERROR] No se pudieron cargar las imagenes.
pause
exit /b 1
