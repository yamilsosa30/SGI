# SGIK - Sistema de Gestión para Kioscos

Un sistema de punto de venta simple y práctico para kioscos y comercios chicos.

## ¿Qué necesitas instalado?

Antes de arrancar, vas a necesitar:

| Programa | Versión | Cómo verificar |
|----------|---------|----------------|
| Java JDK | 17+ | `java -version` |
| Maven | 3.6+ | `mvn -version` |
| Node.js | 18+ | `node -v` |
| npm | Viene con Node.js | `npm -v` |
| MySQL | 8.0+ | `mysql --version` |

Si no tenés alguno, los links de descarga están al final de este archivo.

## Instalación paso a paso

### 1. Instalar Homebrew (macOS)

Si usás macOS y no tenés Homebrew, primero instalalo. Es un gestor de paquetes muy útil que te va a facilitar instalar todo lo demás:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Seguí las instrucciones en pantalla. Después de instalar, verificá que funcione:

```bash
brew --version
```

### 2. Instalar Java JDK

El backend está hecho en Java y necesita JDK 17 o superior. Si no lo tenés:

**Opción A: Con Homebrew (macOS)**
```bash
brew install openjdk@17
```

**Opción B: Instalador oficial (Windows/macOS/Linux)**
1. Descargá el instalador de https://adoptium.net/
2. Ejecutá el instalador y seguí los pasos

**Opción C: Con SDKMAN (Linux/macOS)**
```bash
curl -s "https://get.sdkman.io" | bash
sdk install java 17.0.12-tem
```

Verificá que esté instalado:
```bash
java -version
```

### 3. Instalar Maven

Maven se usa para compilar y ejecutar el backend Java. Si no lo tenés:

**Opción A: Con Homebrew (macOS)**
```bash
brew install maven
```

**Opción B: Instalador oficial (Windows/Linux)**
1. Descargá Maven de https://maven.apache.org/download.cgi
2. Extraé el archivo y movelo a una carpeta (ej: `C:\Program Files\Apache\maven` en Windows o `/opt/maven` en Linux)
3. Agregá la carpeta `bin` al PATH del sistema

**Opción C: Con SDKMAN (Linux/macOS)**
```bash
curl -s "https://get.sdkman.io" | bash
sdk install maven
```

Verificá que esté instalado:
```bash
mvn -version
```

### 4. Instalar Node.js y npm

Si no tenés Node.js (que incluye npm), hay varias formas de instalarlo:

**Opción A: Con Homebrew (macOS)**
```bash
brew install node
```

**Opción B: Instalador oficial (Windows/macOS/Linux)**
1. Descargá el instalador de https://nodejs.org/
2. Ejecutá el instalador y seguí los pasos

**Opción C: Con nvm (recomendado para desarrolladores)**
Permite tener múltiples versiones de Node.js:
```bash
# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
# Instalar Node.js LTS
nvm install --lts
```

Verificá que esté instalado:
```bash
node -v
npm -v
```

### 5. Clonar y entrar al proyecto

```bash
git clone <url-del-repo> sgik
cd sgik
```

### 6. Crear la base de datos

Primero instalá MySQL si no lo tenés. En macOS con Homebrew es simple:

```bash
brew install mysql
brew services start mysql
```

En Windows, bajá el instalador de la página de MySQL y seguí los pasos.

Una vez que tengas MySQL corriendo, creá la base:

```bash
mysql -u root -p < database/schema-mysql.sql
```

Si querés cargar algunos datos de prueba para empezar:

```bash
mysql -u root -p < database/data-mysql.sql
```

### 7. Configurar la conexión

Por defecto el sistema usa `root`/`root` como usuario y contraseña de MySQL. Si usás otra cosa, editá `backend/src/main/resources/application.properties`:

```properties
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password
```

### 8. Instalar dependencias del frontend

```bash
npm install
```

### 9. Iniciar el backend

```bash
cd backend
mvn spring-boot:run
```

El backend va a estar en http://localhost:8080

La primera vez que inicia, si la tabla de usuarios está vacía, crea automáticamente un admin y un cajero.

### 10. Iniciar el frontend

En otra terminal, desde la raíz del proyecto:

```bash
npm run dev
```

Abrí http://localhost:3000 en el navegador.

## Usuarios por defecto

| Usuario | Password | Rol |
|---------|----------|-----|
| admin | admin123 | Administrador |
| cajero | cajero123 | Cajero |

**Importante:** Cambiá estas contraseñas si vas a usar el sistema en producción.

## Script de inicio rápido (macOS/Linux)

Si querés arrancar todo de una:

```bash
chmod +x start-all.sh
./start-all.sh
```

Este script verifica que tengas todo instalado, compila el backend, instala dependencias del frontend y arranca ambos.

## Problemas comunes

### "Java no encontrado"

Instalalo como se indica en la sección 2 de este documento:
- macOS: `brew install openjdk@17`
- Ubuntu: `sudo apt install openjdk-17-jdk`
- Windows: Descargalo de https://adoptium.net/

### "Puerto 8080 ocupado"

```bash
# Ver qué proceso está usando el puerto
lsof -i :8080
# Matarlo
kill -9 <PID>
```

O cambiá el puerto en `application.properties`:
```properties
server.port=8081
```

### "No conecta a MySQL"

Verificá que MySQL esté corriendo:
```bash
# macOS
brew services list

# Linux
sudo systemctl status mysql
```

Y que la base de datos exista:
```bash
mysql -u root -p -e "SHOW DATABASES LIKE 'sgik';"
```

### "mvn no encontrado" o "npm no encontrado"

**Instalá Maven:**
- macOS: `brew install maven`
- Linux: `sudo apt install maven`
- Windows: Descargalo de https://maven.apache.org/download.cgi y agregalo al PATH

**Instalá Node.js y npm:**
- macOS: `brew install node`
- Windows/Linux: Descargalo de https://nodejs.org/
- O usá nvm: https://github.com/nvm-sh/nvm

## Estructura del proyecto

```
sgik/
├── app/                 # Páginas Next.js
├── components/
│   ├── pos/            # Vistas de cada sección
│   └── ui/             # Componentes reutilizables
├── hooks/              # Custom hooks
├── lib/                # Utilidades
├── backend/            # API Spring Boot
│   └── src/main/java/com/kiosk/pos/
│       ├── model/      # Entidades
│       ├── repository/ # Acceso a datos
│       ├── service/    # Lógica de negocio
│       └── controller/ # Endpoints REST
└── database/           # Scripts SQL
```

## Links útiles

- Java: https://adoptium.net/
- Maven: https://maven.apache.org/download.cgi
- Node.js: https://nodejs.org/
- MySQL: https://dev.mysql.com/downloads/mysql/
