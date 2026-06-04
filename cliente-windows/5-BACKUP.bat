@echo off
cd /d "%~dp0.."
call docker\scripts\backup-db.bat
