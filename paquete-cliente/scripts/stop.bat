@echo off
title SGIK POS - Detener
cd /d "%~dp0.."
docker compose down
echo.
echo Sistema detenido.
pause
