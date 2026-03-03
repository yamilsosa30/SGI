================================================================================
                    SGIK POS - Instalacion en Windows
                         (Sin Docker)
================================================================================

REQUISITOS:
-----------
1. Java 17        - https://adoptium.net/temurin/releases/?version=17
2. Node.js 20     - https://nodejs.org/
3. MySQL 8        - Ya instalado en esta PC


PASOS DE INSTALACION:
---------------------

1. INSTALAR JAVA 17
   - Descarga de: https://adoptium.net/temurin/releases/?version=17
   - Selecciona: Windows x64, .msi
   - Ejecuta el instalador

2. INSTALAR NODE.JS
   - Descarga de: https://nodejs.org/ (version LTS)
   - Ejecuta el instalador

3. CREAR BASE DE DATOS
   - Ejecuta: CREAR-BASE-DATOS.bat
   - Ingresa usuario y password de MySQL

4. INSTALAR DEPENDENCIAS
   - Ejecuta: INSTALAR-DEPENDENCIAS.bat
   - Espera a que termine (puede tardar unos minutos)

5. INICIAR EL SISTEMA
   - Ejecuta: INICIAR-SISTEMA.bat
   - Se abriran 2 ventanas (backend y frontend)
   - Espera a que cargue y se abre el navegador

6. ACCEDER
   - URL: http://localhost:3000
   - Usuario: admin
   - Password: admin123


SCRIPTS DISPONIBLES:
--------------------
- INICIAR-SISTEMA.bat      -> Inicia backend y frontend
- DETENER-SISTEMA.bat      -> Detiene todo
- INSTALAR-DEPENDENCIAS.bat -> Instala dependencias (ejecutar 1 vez)
- CREAR-BASE-DATOS.bat     -> Crea la base de datos (ejecutar 1 vez)
- BACKUP-BASE-DATOS.bat    -> Crea backup de los datos


SOLUCION DE PROBLEMAS:
----------------------

"Java no encontrado"
  -> Instala Java 17 y reinicia la PC

"Node.js no encontrado"  
  -> Instala Node.js y reinicia la PC

"MySQL no esta corriendo"
  -> Abre Servicios (services.msc) e inicia MySQL

"Puerto 8080 en uso"
  -> Cierra otras aplicaciones que usen ese puerto
  -> O ejecuta: netstat -ano | findstr :8080

"Puerto 3000 en uso"
  -> Cierra otras aplicaciones que usen ese puerto
  -> O ejecuta: netstat -ano | findstr :3000


CONFIGURACION MYSQL:
--------------------
El sistema usa estos valores por defecto:
- Host: localhost
- Puerto: 3306
- Base de datos: sgik
- Usuario: root
- Password: root

Si tu MySQL tiene otra configuracion, edita:
backend\src\main\resources\application.properties

USUARIOS DEL SISTEMA:
---------------------
Al crear la base de datos se crean automáticamente:
- Usuario: admin / Password: admin123 (Administrador)
- Usuario: cajero / Password: cajero123 (Cajero)

================================================================================

