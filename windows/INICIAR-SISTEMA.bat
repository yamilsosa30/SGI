@echo off
chcp 65001 >nul
title SGIK POS - Sistema de Kiosco

echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                        SGIK POS - Sistema de Kiosco                      ║
echo ║                           Iniciando servicios...                         ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0.."

REM Verificar Java
java -version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Java no esta instalado.
    echo         Descarga Java 17 de: https://adoptium.net/temurin/releases/?version=17
    pause
    exit /b 1
)
echo [OK] Java encontrado

REM Verificar Node.js
node -v >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js no esta instalado.
    echo         Descarga Node.js de: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js encontrado

REM Verificar MySQL
net start | findstr /i "mysql" >nul 2>&1
if errorlevel 1 (
    echo [AVISO] MySQL no parece estar corriendo.
    echo         Asegurate de que MySQL este iniciado.
    echo.
)

echo.
echo [1/2] Iniciando Backend (Spring Boot)...
start "SGIK Backend" cmd /k "cd /d "%~dp0..\backend" && call mvnw.cmd spring-boot:run"

echo      Esperando a que el backend inicie (30 segundos)...
timeout /t 30 /nobreak >nul

echo.
echo [2/2] Iniciando Frontend (Next.js)...
start "SGIK Frontend" cmd /k "cd /d "%~dp0.." && npm run dev"

echo.
echo      Esperando a que el frontend inicie (10 segundos)...
timeout /t 10 /nobreak >nul

echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                           SISTEMA INICIADO                               ║
echo ╠══════════════════════════════════════════════════════════════════════════╣
echo ║   Frontend:  http://localhost:3000                                       ║
echo ║   Backend:   http://localhost:8080                                       ║
echo ╠══════════════════════════════════════════════════════════════════════════╣
echo ║   Usuario:   admin                                                       ║
echo ║   Password:  admin123                                                    ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

start http://localhost:3000

echo Presiona cualquier tecla para cerrar esta ventana...
echo (Los servicios seguiran corriendo en las otras ventanas)
pause >nul

