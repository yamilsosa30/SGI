@echo off
REM =============================================================================
REM SGIK POS - Estado del Sistema
REM =============================================================================

title SGIK POS - Estado

echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                     SGIK POS - Estado del Sistema                        ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0.."

echo ═══════════════════════════════════════════════════════════════════════════
echo   CONTENEDORES
echo ═══════════════════════════════════════════════════════════════════════════
docker ps -a --filter "name=sgik" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo.
echo ═══════════════════════════════════════════════════════════════════════════
echo   IMAGENES INSTALADAS
echo ═══════════════════════════════════════════════════════════════════════════
docker images --filter "reference=sgik*" --filter "reference=mysql*" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

echo.
echo ═══════════════════════════════════════════════════════════════════════════
echo   VOLUMENES (Datos persistentes)
echo ═══════════════════════════════════════════════════════════════════════════
docker volume ls --filter "name=sgik"

echo.
echo ═══════════════════════════════════════════════════════════════════════════
echo   HEALTH CHECK
echo ═══════════════════════════════════════════════════════════════════════════

REM Verificar MySQL
docker exec sgik-mysql mysqladmin ping -u root -proot 2>nul | findstr "alive" >nul
if errorlevel 1 (
    echo   MySQL:    [OFFLINE]
) else (
    echo   MySQL:    [OK]
)

REM Verificar Backend
curl -s http://localhost:8080/actuator/health 2>nul | findstr "UP" >nul
if errorlevel 1 (
    echo   Backend:  [OFFLINE]
) else (
    echo   Backend:  [OK]
)

REM Verificar Frontend
curl -s http://localhost:3000 2>nul >nul
if errorlevel 1 (
    echo   Frontend: [OFFLINE]
) else (
    echo   Frontend: [OK]
)

echo.
pause

