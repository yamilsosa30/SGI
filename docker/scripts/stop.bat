@echo off
REM =============================================================================
REM SGIK POS - Detener Sistema
REM =============================================================================

title SGIK POS - Deteniendo...

echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                        SGIK POS - Sistema de Kiosco                      ║
echo ║                           Deteniendo servicios...                         ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0.."

echo [1/2] Deteniendo contenedores...
docker compose -f docker-compose.offline.yml down

if errorlevel 1 (
    echo [AVISO] Hubo un problema al detener los contenedores.
    echo         Intentando detener individualmente...
    docker stop sgik-frontend sgik-backend sgik-mysql 2>nul
    docker rm sgik-frontend sgik-backend sgik-mysql 2>nul
)

echo [2/2] Limpiando...
echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                        SISTEMA DETENIDO                                  ║
echo ║                                                                          ║
echo ║   NOTA: Los datos de la base de datos se conservan.                      ║
echo ║         Para eliminarlos ejecuta: reset-db.bat                           ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

pause

