@echo off
REM =============================================================================
REM SGIK POS - Instalación Offline
REM 
REM Este script carga las imágenes Docker pre-construidas desde archivos .tar
REM Ejecutar este script UNA VEZ después de copiar los archivos a la PC destino
REM =============================================================================

title SGIK POS - Instalacion Offline

echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                    SGIK POS - Instalacion Offline                        ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0.."

REM Verificar si Docker está corriendo
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker no esta corriendo.
    echo.
    echo Por favor:
    echo   1. Instala Docker Desktop desde: https://www.docker.com/products/docker-desktop
    echo   2. Inicia Docker Desktop
    echo   3. Espera a que Docker este listo (icono verde en la barra de tareas)
    echo   4. Ejecuta este script nuevamente
    echo.
    pause
    exit /b 1
)

echo [OK] Docker esta corriendo.
echo.

REM Verificar que existan los archivos de imágenes
if not exist "images" (
    echo [ERROR] No se encontro la carpeta 'images'.
    echo         Asegurate de haber copiado toda la carpeta del instalador.
    pause
    exit /b 1
)

set missing=0
if not exist "images\mysql_8.tar" (
    echo [ERROR] Falta: images\mysql_8.tar
    set missing=1
)
if not exist "images\sgik-backend_1.0.tar" (
    echo [ERROR] Falta: images\sgik-backend_1.0.tar
    set missing=1
)
if not exist "images\sgik-frontend_1.0.tar" (
    echo [ERROR] Falta: images\sgik-frontend_1.0.tar
    set missing=1
)

if %missing%==1 (
    echo.
    echo Faltan archivos de imagenes. Asegurate de tener todos los .tar
    pause
    exit /b 1
)

echo [1/4] Cargando imagen de MySQL (esto puede tardar unos minutos)...
docker load -i images\mysql_8.tar
if errorlevel 1 (
    echo [ERROR] Fallo al cargar imagen de MySQL.
    pause
    exit /b 1
)
echo       [OK] MySQL cargado.

echo.
echo [2/4] Cargando imagen del Backend...
docker load -i images\sgik-backend_1.0.tar
if errorlevel 1 (
    echo [ERROR] Fallo al cargar imagen del Backend.
    pause
    exit /b 1
)
echo       [OK] Backend cargado.

echo.
echo [3/4] Cargando imagen del Frontend...
docker load -i images\sgik-frontend_1.0.tar
if errorlevel 1 (
    echo [ERROR] Fallo al cargar imagen del Frontend.
    pause
    exit /b 1
)
echo       [OK] Frontend cargado.

echo.
echo [4/4] Verificando imagenes instaladas...
docker images | findstr "mysql sgik"

echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                    INSTALACION COMPLETADA                                ║
echo ╠══════════════════════════════════════════════════════════════════════════╣
echo ║   Las imagenes de Docker han sido cargadas correctamente.                ║
echo ║                                                                          ║
echo ║   Para iniciar el sistema ejecuta: start.bat                             ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

pause

