# 🚀 Guía de Instalación - Sistema POS Kioscos

## Requisitos del Sistema

### Obligatorios
- **Java 17** (JDK, no JRE)
- **Maven 3.6+**
- **Node.js 16+** con npm
- **Git** para clonar el repositorio

### Opcionales (Producción)
- **MySQL 8.0+** para base de datos persistente
- **IntelliJ IDEA** o IDE de preferencia

## 🔧 Instalación Rápida

### 1. Clonar y Configurar
\`\`\`bash
git clone <tu-repositorio>
cd sistema-pos-kioscos

# Hacer ejecutables los scripts
chmod +x scripts/start-backend.sh
chmod +x scripts/start-frontend.sh
\`\`\`

### 2. Desarrollo (H2 en memoria)
\`\`\`bash
# Terminal 1: Backend
./scripts/start-backend.sh

# Terminal 2: Frontend
./scripts/start-frontend.sh
\`\`\`

### 3. Producción (MySQL)
\`\`\`bash
# Configurar MySQL
mysql -u root -p < database/mysql-setup.sql

# Iniciar con perfil de producción
cd backend
mvn spring-boot:run -Dspring.profiles.active=prod
\`\`\`

## 🌐 URLs del Sistema

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Consola H2** (desarrollo): http://localhost:8080/h2-console
- **Health Check**: http://localhost:8080/api/actuator/health

## 📊 Datos de Prueba

El sistema incluye automáticamente:
- 8 productos con códigos de barras
- 3 categorías (Bebidas, Snacks, Cigarrillos)
- 1 cliente por defecto
- Productos con alertas de stock y vencimiento

## 🛠️ Desarrollo en IntelliJ IDEA

1. **Importar Backend**: File → Open → `backend/pom.xml`
2. **Configurar JDK 17**: Project Structure → Project SDK
3. **Run Configuration**: Main class `com.kiosk.pos.KioskPosApplication`
4. **Frontend**: Terminal integrada para comandos npm

## 🔍 Verificación de Instalación

### Backend Funcionando
\`\`\`bash
curl http://localhost:8080/api/products
# Debe retornar JSON con productos
\`\`\`

### Frontend Funcionando
- Abrir http://localhost:3000
- Verificar dashboard con métricas
- Probar escáner de códigos de barras

## 🚨 Solución de Problemas

### Error: Java no encontrado
\`\`\`bash
# Verificar versión
java -version
# Debe mostrar Java 17

# Ubuntu/Debian
sudo apt install openjdk-17-jdk

# macOS
brew install openjdk@17
\`\`\`

### Error: Puerto ocupado
\`\`\`bash
# Cambiar puerto backend (application.properties)
server.port=8081

# Cambiar puerto frontend (package.json)
"start": "PORT=3001 react-scripts start"
\`\`\`

### Error: Base de datos
- **H2**: Verificar consola en http://localhost:8080/h2-console
- **MySQL**: Verificar servicio activo y credenciales

## 📈 Próximos Pasos

1. **Personalizar productos**: Usar API `/api/products`
2. **Configurar impresora**: Integrar con hardware POS
3. **Backup automático**: Configurar respaldos de MySQL
4. **Monitoreo**: Usar endpoints de Actuator
