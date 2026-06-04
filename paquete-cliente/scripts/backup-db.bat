@echo off
title SGIK POS - Backup
cd /d "%~dp0.."

if not exist "backups" mkdir backups

for /f "tokens=1-3 delims=/" %%a in ("%date%") do set fecha=%%c-%%b-%%a
for /f "tokens=1-2 delims=:" %%a in ("%time%") do set hora=%%a%%b
set hora=%hora: =0%
set backup_file=backups\sgik_backup_%fecha%_%hora%.sql

docker exec sgik-mysql mysqldump -u root -proot sgik > "%backup_file%" 2>nul
if errorlevel 1 (
    echo [ERROR] No se pudo crear el backup.
    del "%backup_file%" 2>nul
    pause
    exit /b 1
)

echo Backup creado en %backup_file%
pause
