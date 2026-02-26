@echo off
REM =============================================================================
REM SGIK POS - Iniciar Sistema
REM =============================================================================

title SGIK POS - Iniciando...

echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                        SGIK POS - Sistema de Kiosco                      ║
echo ║                            Iniciando servicios...                         ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0.."

REM Verificar si Docker está corriendo
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker no esta corriendo.
    echo         Por favor, inicia Docker Desktop primero.
    echo.
    pause
    exit /b 1
)

echo [1/3] Verificando imagenes...

REM Verificar si existen las imágenes
docker image inspect sgik-backend:1.0 >nul 2>&1
if errorlevel 1 (
    echo [AVISO] No se encontraron las imagenes pre-construidas.
    echo         Ejecuta primero: install-offline.bat
    echo         O usa docker-compose.yml para construir desde codigo.
    echo.
    pause
    exit /b 1
)

echo [2/3] Iniciando contenedores...
docker compose -f docker-compose.offline.yml up -d

if errorlevel 1 (
    echo [ERROR] Fallo al iniciar los contenedores.
    pause
    exit /b 1
)

echo [3/3] Esperando a que los servicios esten listos...

REM Esperar a que el backend esté listo (máximo 2 minutos)
set /a count=0
:wait_backend
set /a count+=1
if %count% gtr 24 (
    echo [AVISO] El backend esta tardando mas de lo esperado.
    echo         Puedes revisar los logs con: logs.bat
    goto :open_browser
)
timeout /t 5 /nobreak >nul
docker exec sgik-backend wget --spider -q http://localhost:8080/actuator/health 2>nul
if errorlevel 1 (
    echo         Esperando... (%count%/24)
    goto :wait_backend
)

:open_browser
echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                           SISTEMA INICIADO                               ║
echo ╠══════════════════════════════════════════════════════════════════════════╣
echo ║   Frontend:  http://localhost:3000                                       ║
echo ║   Backend:   http://localhost:8080                                       ║
echo ║   MySQL:     localhost:3306                                              ║
echo ╠══════════════════════════════════════════════════════════════════════════╣
echo ║   Usuario:   admin                                                       ║
echo ║   Password:  admin123                                                    ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

REM Abrir navegador automáticamente
start http://localhost:3000

echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul

