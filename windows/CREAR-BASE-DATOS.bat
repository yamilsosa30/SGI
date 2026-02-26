@echo off
chcp 65001 >nul
title SGIK POS - Crear Base de Datos

echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                   SGIK POS - Crear Base de Datos                         ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0.."

set /p MYSQL_USER="Usuario MySQL (default: root): "
if "%MYSQL_USER%"=="" set MYSQL_USER=root

set /p MYSQL_PASS="Password MySQL: "

echo.
echo [1/2] Creando base de datos...
mysql -u %MYSQL_USER% -p%MYSQL_PASS% -e "CREATE DATABASE IF NOT EXISTS sgik CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"

if errorlevel 1 (
    echo [ERROR] No se pudo crear la base de datos.
    echo         Verifica que MySQL este corriendo y las credenciales sean correctas.
    pause
    exit /b 1
)

echo       Base de datos 'sgik' creada.

echo [2/2] Importando esquema...
mysql -u %MYSQL_USER% -p%MYSQL_PASS% sgik < database\schema-mysql.sql

if errorlevel 1 (
    echo [ERROR] No se pudo importar el esquema.
    pause
    exit /b 1
)

echo       Esquema importado correctamente.

echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                    BASE DE DATOS CREADA                                  ║
echo ╠══════════════════════════════════════════════════════════════════════════╣
echo ║   Base de datos: sgik                                                    ║
echo ║   El sistema creara las tablas automaticamente al iniciar.              ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

pause

