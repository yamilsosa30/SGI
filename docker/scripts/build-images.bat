@echo off
REM =============================================================================
REM SGIK POS - Construir y Exportar Imágenes Docker
REM 
REM EJECUTAR EN PC CON INTERNET
REM Este script construye las imágenes y las exporta a archivos .tar
REM para poder instalarlas offline en otra PC
REM =============================================================================

title SGIK POS - Build Images

echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║           SGIK POS - Construir Imagenes para Instalacion Offline         ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.
echo [REQUISITO] Este script necesita conexion a Internet para:
echo             - Descargar la imagen de MySQL
echo             - Descargar dependencias de Maven (Java)
echo             - Descargar dependencias de npm (Node.js)
echo.

cd /d "%~dp0..\.."

REM Verificar si Docker está corriendo
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker no esta corriendo.
    echo         Por favor, inicia Docker Desktop primero.
    pause
    exit /b 1
)

echo [OK] Docker esta corriendo.
echo.

REM Crear carpeta de imágenes
if not exist "docker\images" mkdir docker\images

echo ═══════════════════════════════════════════════════════════════════════════
echo [1/6] Descargando imagen de MySQL 8...
echo ═══════════════════════════════════════════════════════════════════════════
docker pull mysql:8.0
if errorlevel 1 (
    echo [ERROR] No se pudo descargar MySQL. Verifica tu conexion a internet.
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════════════════════
echo [2/6] Construyendo imagen del Backend (Spring Boot)...
echo       Esto puede tardar varios minutos la primera vez...
echo ═══════════════════════════════════════════════════════════════════════════
docker build -t sgik-backend:1.0 ./backend
if errorlevel 1 (
    echo [ERROR] Fallo al construir el backend.
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════════════════════
echo [3/6] Construyendo imagen del Frontend (Next.js)...
echo       Esto puede tardar varios minutos la primera vez...
echo ═══════════════════════════════════════════════════════════════════════════
docker build -t sgik-frontend:1.0 .
if errorlevel 1 (
    echo [ERROR] Fallo al construir el frontend.
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════════════════════
echo [4/6] Exportando imagen de MySQL...
echo ═══════════════════════════════════════════════════════════════════════════
docker save -o docker\images\mysql_8.tar mysql:8.0
if errorlevel 1 (
    echo [ERROR] Fallo al exportar imagen de MySQL.
    pause
    exit /b 1
)
echo       [OK] Guardado en: docker\images\mysql_8.tar

echo.
echo ═══════════════════════════════════════════════════════════════════════════
echo [5/6] Exportando imagen del Backend...
echo ═══════════════════════════════════════════════════════════════════════════
docker save -o docker\images\sgik-backend_1.0.tar sgik-backend:1.0
if errorlevel 1 (
    echo [ERROR] Fallo al exportar imagen del backend.
    pause
    exit /b 1
)
echo       [OK] Guardado en: docker\images\sgik-backend_1.0.tar

echo.
echo ═══════════════════════════════════════════════════════════════════════════
echo [6/6] Exportando imagen del Frontend...
echo ═══════════════════════════════════════════════════════════════════════════
docker save -o docker\images\sgik-frontend_1.0.tar sgik-frontend:1.0
if errorlevel 1 (
    echo [ERROR] Fallo al exportar imagen del frontend.
    pause
    exit /b 1
)
echo       [OK] Guardado en: docker\images\sgik-frontend_1.0.tar

echo.
echo ═══════════════════════════════════════════════════════════════════════════
echo                          CONSTRUCCION COMPLETADA
echo ═══════════════════════════════════════════════════════════════════════════
echo.
echo Imagenes exportadas en: docker\images\
echo.
dir docker\images\*.tar
echo.
echo Preparando carpeta de entrega para cliente...
call docker\scripts\prepare-client-package.bat
echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                    SIGUIENTE PASO                                        ║
echo ╠══════════════════════════════════════════════════════════════════════════╣
echo ║   1. Copia la carpeta 'dist\sgik-cliente-windows' a un USB              ║
echo ║   2. En la PC destino (offline):                                         ║
echo ║      - Instala Docker Desktop                                            ║
echo ║      - Copia la carpeta desde el USB                                     ║
echo ║      - Ejecuta: 1-INSTALAR-PRIMERA-VEZ.bat                               ║
echo ║      - Ejecuta: 2-INICIAR-SISTEMA.bat                                    ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

pause
