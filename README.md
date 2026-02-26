# SGIK - Sistema de Gestión para Kioscos

Un sistema de punto de venta simple y práctico para kioscos y comercios chicos.

## ¿Qué necesitas instalado?

Antes de arrancar, vas a necesitar:

| Programa | Versión | Cómo verificar |
|----------|---------|----------------|
| Java JDK | 17+ | `java -version` |
| Maven | 3.6+ | `mvn -version` |
| Node.js | 18+ | `node -v` |
| MySQL | 8.0+ | `mysql --version` |

Si no tenés alguno, los links de descarga están al final de este archivo.

## Instalación paso a paso

### 1. Clonar y entrar al proyecto

```bash
git clone <url-del-repo> sgik
cd sgik
```

### 2. Crear la base de datos

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

### 3. Configurar la conexión

Por defecto el sistema usa `root`/`root` como usuario y contraseña de MySQL. Si usás otra cosa, editá `backend/src/main/resources/application.properties`:

```properties
spring.datasource.username=tu_usuario
spring.datasource.password=tu_password
```

### 4. Instalar dependencias del frontend

```bash
npm install
```

### 5. Iniciar el backend

```bash
cd backend
mvn spring-boot:run
```

El backend va a estar en http://localhost:8080

La primera vez que inicia, si la tabla de usuarios está vacía, crea automáticamente un admin y un cajero.

### 6. Iniciar el frontend

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

Instalalo:
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

### "mvn no encontrado"

Instalá Maven:
- macOS: `brew install maven`
- Linux: `sudo apt install maven`
- Windows: Descargalo de https://maven.apache.org/download.cgi y agregalo al PATH

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
