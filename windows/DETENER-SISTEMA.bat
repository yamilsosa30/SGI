@echo off
chcp 65001 >nul
title SGIK POS - Deteniendo Sistema

echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                        SGIK POS - Sistema de Kiosco                      ║
echo ║                          Deteniendo servicios...                         ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

echo [1/2] Deteniendo Backend...
taskkill /FI "WINDOWTITLE eq SGIK Backend*" /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
    taskkill /PID %%a /F >nul 2>&1
)
echo      Backend detenido.

echo [2/2] Deteniendo Frontend...
taskkill /FI "WINDOWTITLE eq SGIK Frontend*" /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /PID %%a /F >nul 2>&1
)
echo      Frontend detenido.

echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                        SISTEMA DETENIDO                                  ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

pause

