@echo off
REM =============================================================================
REM SGIK POS - Ver Logs del Sistema
REM =============================================================================

title SGIK POS - Logs

echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                        SGIK POS - Logs del Sistema                       ║
echo ╠══════════════════════════════════════════════════════════════════════════╣
echo ║   1. Ver logs de todos los servicios                                     ║
echo ║   2. Ver logs del Frontend                                               ║
echo ║   3. Ver logs del Backend                                                ║
echo ║   4. Ver logs de MySQL                                                   ║
echo ║   5. Salir                                                               ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

set /p opcion="Selecciona una opcion (1-5): "

cd /d "%~dp0.."

if "%opcion%"=="1" (
    echo.
    echo Mostrando logs de todos los servicios (Ctrl+C para salir)...
    echo.
    docker compose -f docker-compose.offline.yml logs -f
) else if "%opcion%"=="2" (
    echo.
    echo Mostrando logs del Frontend (Ctrl+C para salir)...
    echo.
    docker logs -f sgik-frontend
) else if "%opcion%"=="3" (
    echo.
    echo Mostrando logs del Backend (Ctrl+C para salir)...
    echo.
    docker logs -f sgik-backend
) else if "%opcion%"=="4" (
    echo.
    echo Mostrando logs de MySQL (Ctrl+C para salir)...
    echo.
    docker logs -f sgik-mysql
) else if "%opcion%"=="5" (
    exit /b 0
) else (
    echo Opcion invalida.
    pause
)

