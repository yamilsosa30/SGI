@echo off
chcp 65001 >nul
title SGIK POS - Backup

echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                   SGIK POS - Backup de Base de Datos                     ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0.."

REM Crear carpeta de backups
if not exist "backups" mkdir backups

set /p MYSQL_USER="Usuario MySQL (default: root): "
if "%MYSQL_USER%"=="" set MYSQL_USER=root

set /p MYSQL_PASS="Password MySQL: "

REM Generar nombre con fecha
for /f "tokens=1-3 delims=/" %%a in ("%date%") do set fecha=%%c-%%b-%%a
for /f "tokens=1-2 delims=:" %%a in ("%time%") do set hora=%%a%%b
set hora=%hora: =0%

set backup_file=backups\sgik_backup_%fecha%_%hora%.sql

echo.
echo Creando backup...
mysqldump -u %MYSQL_USER% -p%MYSQL_PASS% sgik > "%backup_file%"

if errorlevel 1 (
    echo [ERROR] No se pudo crear el backup.
    del "%backup_file%" 2>nul
    pause
    exit /b 1
)

echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                         BACKUP CREADO                                    ║
echo ╠══════════════════════════════════════════════════════════════════════════╣
echo ║   Archivo: %backup_file%
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

pause

