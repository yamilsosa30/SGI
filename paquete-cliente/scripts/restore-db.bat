@echo off
title SGIK POS - Restaurar Backup
cd /d "%~dp0.."

echo Backups disponibles:
if exist "backups\*.sql" (
    dir /b backups\*.sql
) else (
    echo No hay backups disponibles.
    pause
    exit /b 1
)

set /p backup_file="Ingresa el nombre del backup: "
if not exist "backups\%backup_file%" (
    echo [ERROR] No existe el archivo indicado.
    pause
    exit /b 1
)

set /p confirmar="Esto reemplazara todos los datos. Confirmar (S/N): "
if /i not "%confirmar%"=="S" exit /b 0

type "backups\%backup_file%" | docker exec -i sgik-mysql mysql -u root -proot sgik
if errorlevel 1 (
    echo [ERROR] No se pudo restaurar el backup.
    pause
    exit /b 1
)

echo Restauracion completada.
pause
