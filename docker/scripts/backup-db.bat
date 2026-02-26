@echo off
REM =============================================================================
REM SGIK POS - Backup de Base de Datos
REM =============================================================================

title SGIK POS - Backup

echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                   SGIK POS - Backup de Base de Datos                     ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0.."

REM Crear directorio de backups si no existe
if not exist "backups" mkdir backups

REM Generar nombre de archivo con fecha y hora
for /f "tokens=1-3 delims=/" %%a in ("%date%") do set fecha=%%c-%%b-%%a
for /f "tokens=1-2 delims=:" %%a in ("%time%") do set hora=%%a%%b
set hora=%hora: =0%
set backup_file=backups\sgik_backup_%fecha%_%hora%.sql

echo [1/2] Creando backup...

REM Ejecutar mysqldump dentro del contenedor
docker exec sgik-mysql mysqldump -u root -proot sgik > "%backup_file%" 2>nul

if errorlevel 1 (
    echo [ERROR] No se pudo crear el backup.
    echo         Asegurate de que el sistema este corriendo.
    del "%backup_file%" 2>nul
    pause
    exit /b 1
)

echo [2/2] Backup completado!
echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                         BACKUP CREADO                                    ║
echo ╠══════════════════════════════════════════════════════════════════════════╣
echo ║   Archivo: %backup_file%
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

REM Mostrar tamaño del archivo
for %%A in ("%backup_file%") do echo    Tamano: %%~zA bytes
echo.

pause

