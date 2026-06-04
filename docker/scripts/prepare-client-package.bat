@echo off
title SGIK POS - Preparar Paquete Cliente

cd /d "%~dp0..\.."

set PACKAGE_DIR=dist\sgik-cliente-windows

echo Preparando paquete cliente en %PACKAGE_DIR%

if exist "%PACKAGE_DIR%" rmdir /s /q "%PACKAGE_DIR%"

mkdir "%PACKAGE_DIR%"
mkdir "%PACKAGE_DIR%\images"
mkdir "%PACKAGE_DIR%\mysql"
mkdir "%PACKAGE_DIR%\mysql\init"
mkdir "%PACKAGE_DIR%\scripts"

copy /y "paquete-cliente\LEEME.txt" "%PACKAGE_DIR%\" >nul
copy /y "paquete-cliente\.env.example" "%PACKAGE_DIR%\" >nul
copy /y "paquete-cliente\docker-compose.yml" "%PACKAGE_DIR%\" >nul
copy /y "paquete-cliente\*.bat" "%PACKAGE_DIR%\" >nul
copy /y "paquete-cliente\scripts\*.bat" "%PACKAGE_DIR%\scripts\" >nul
copy /y "docker\mysql\init\*.sql" "%PACKAGE_DIR%\mysql\init\" >nul
copy /y "docker\images\*.tar" "%PACKAGE_DIR%\images\" >nul

echo.
echo Paquete listo en %PACKAGE_DIR%
pause
