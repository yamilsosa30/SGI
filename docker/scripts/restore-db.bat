@echo off
REM =============================================================================
REM SGIK POS - Restaurar Base de Datos desde Backup
REM =============================================================================

title SGIK POS - Restaurar Backup

echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                SGIK POS - Restaurar Base de Datos                        ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0.."

REM Listar backups disponibles
echo Backups disponibles:
echo.
if exist "backups\*.sql" (
    dir /b backups\*.sql
) else (
    echo No hay backups disponibles en la carpeta 'backups'.
    pause
    exit /b 1
)

echo.
set /p backup_file="Ingresa el nombre del archivo (sin la carpeta): "

if not exist "backups\%backup_file%" (
    echo [ERROR] Archivo no encontrado: backups\%backup_file%
    pause
    exit /b 1
)

echo.
echo [ADVERTENCIA] Esto reemplazara TODOS los datos actuales.
set /p confirmar="Estas seguro? (S/N): "

if /i not "%confirmar%"=="S" (
    echo Operacion cancelada.
    pause
    exit /b 0
)

echo.
echo [1/2] Restaurando backup...

REM Restaurar usando mysql dentro del contenedor
type "backups\%backup_file%" | docker exec -i sgik-mysql mysql -u root -proot sgik

if errorlevel 1 (
    echo [ERROR] No se pudo restaurar el backup.
    pause
    exit /b 1
)

echo [2/2] Restauracion completada!
echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                      BASE DE DATOS RESTAURADA                            ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

pause

