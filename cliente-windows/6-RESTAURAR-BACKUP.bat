@echo off
cd /d "%~dp0.."
call docker\scripts\restore-db.bat
