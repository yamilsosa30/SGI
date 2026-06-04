@echo off
title SGIK POS - Logs
cd /d "%~dp0.."
docker compose logs -f
