@echo off
chcp 65001 >nul
title SGIK POS - Instalacion

echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                   SGIK POS - Instalacion de Dependencias                 ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.
echo Este script instala las dependencias necesarias para el sistema.
echo Ejecutar UNA VEZ despues de copiar el proyecto.
echo.

cd /d "%~dp0.."

REM Verificar Java
echo [1/4] Verificando Java...
java -version >nul 2>&1
if errorlevel 1 (
    echo       [X] Java NO encontrado
    echo.
    echo       Descarga e instala Java 17 de:
    echo       https://adoptium.net/temurin/releases/?version=17
    echo.
    echo       Despues de instalar, ejecuta este script nuevamente.
    pause
    exit /b 1
)
echo       [OK] Java encontrado

REM Verificar Node.js
echo [2/4] Verificando Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    echo       [X] Node.js NO encontrado
    echo.
    echo       Descarga e instala Node.js de:
    echo       https://nodejs.org/
    echo.
    echo       Despues de instalar, ejecuta este script nuevamente.
    pause
    exit /b 1
)
echo       [OK] Node.js encontrado

REM Verificar MySQL
echo [3/4] Verificando MySQL...
net start | findstr /i "mysql" >nul 2>&1
if errorlevel 1 (
    echo       [!] MySQL no esta corriendo
    echo       Asegurate de tener MySQL instalado e iniciado.
) else (
    echo       [OK] MySQL corriendo
)

REM Instalar dependencias de Node
echo [4/4] Instalando dependencias del frontend...
echo       Esto puede tardar unos minutos...
call npm install

if errorlevel 1 (
    echo [ERROR] Fallo la instalacion de dependencias.
    pause
    exit /b 1
)

echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                     INSTALACION COMPLETADA                               ║
echo ╠══════════════════════════════════════════════════════════════════════════╣
echo ║   Para iniciar el sistema ejecuta: INICIAR-SISTEMA.bat                  ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

pause

