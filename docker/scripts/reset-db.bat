@echo off
REM =============================================================================
REM SGIK POS - Reiniciar Base de Datos (ELIMINA TODOS LOS DATOS)
REM =============================================================================

title SGIK POS - Reset DB

echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║              SGIK POS - Reiniciar Base de Datos                          ║
echo ╠══════════════════════════════════════════════════════════════════════════╣
echo ║   ADVERTENCIA: Esta operacion ELIMINARA TODOS LOS DATOS                  ║
echo ║   incluyendo productos, ventas, clientes, etc.                           ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

set /p confirmar="Estas SEGURO que deseas eliminar todos los datos? (S/N): "

if /i not "%confirmar%"=="S" (
    echo Operacion cancelada.
    pause
    exit /b 0
)

echo.
set /p confirmar2="Escribe ELIMINAR para confirmar: "

if not "%confirmar2%"=="ELIMINAR" (
    echo Operacion cancelada.
    pause
    exit /b 0
)

cd /d "%~dp0.."

echo.
echo [1/3] Deteniendo servicios...
docker compose -f docker-compose.offline.yml down

echo [2/3] Eliminando volumen de datos...
docker volume rm sgik_mysql_data 2>nul

echo [3/3] Reiniciando servicios...
docker compose -f docker-compose.offline.yml up -d

echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                   BASE DE DATOS REINICIADA                               ║
echo ║                                                                          ║
echo ║   Los datos iniciales han sido restaurados.                              ║
echo ║   Usuario: admin / Password: admin123                                    ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

pause

