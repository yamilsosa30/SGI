@echo off
REM Acceso directo para crear backup de SGIK POS
cd /d "%~dp0"
call docker\scripts\backup-db.bat

