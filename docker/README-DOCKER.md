# 🐳 SGIK POS - Guía de Docker

## Instalación Offline (PC sin Internet)

Esta guía explica cómo instalar SGIK POS en una PC con Windows que **no tiene conexión a Internet**.

---

## 📋 Requisitos

- **Windows 10/11** (64-bit)
- **8 GB RAM** mínimo (16 GB recomendado)
- **10 GB** de espacio en disco
- **Docker Desktop** instalado

---

## 🔧 Paso 1: Preparar el Paquete (PC con Internet)

En una PC **con acceso a Internet**, ejecuta:

```batch
cd ruta\a\sgik
docker\scripts\build-images.bat
```

Esto:
1. Descarga la imagen de MySQL
2. Construye la imagen del Backend (Spring Boot)
3. Construye la imagen del Frontend (Next.js)
4. Exporta todo a archivos `.tar` en `docker\images\`

**Archivos generados** (~1.5 GB total):
- `docker\images\mysql_8.tar` (~500 MB)
- `docker\images\sgik-backend_1.0.tar` (~300 MB)
- `docker\images\sgik-frontend_1.0.tar` (~400 MB)

---

## 📦 Paso 2: Copiar a USB

Copia **toda la carpeta `sgik`** a un USB:

```
USB:\
└── sgik\
    ├── docker\
    │   ├── images\
    │   │   ├── mysql_8.tar
    │   │   ├── sgik-backend_1.0.tar
    │   │   └── sgik-frontend_1.0.tar
    │   ├── mysql\
    │   │   └── init\
    │   └── scripts\
    │       ├── start.bat
    │       ├── stop.bat
    │       └── ...
    ├── docker-compose.offline.yml
    └── ...
```

---

## 💻 Paso 3: Instalar en PC Destino (Offline)

### 3.1 Instalar Docker Desktop (una sola vez)

1. Descarga Docker Desktop previamente: https://www.docker.com/products/docker-desktop
2. Copia el instalador al USB
3. Instala en la PC destino
4. Reinicia la PC
5. Inicia Docker Desktop y espera a que esté listo (icono verde)

### 3.2 Cargar Imágenes Docker

```batch
cd USB:\sgik
docker\scripts\install-offline.bat
```

Este script carga las 3 imágenes de Docker desde los archivos `.tar`.

### 3.3 Iniciar el Sistema

```batch
docker\scripts\start.bat
```

El navegador se abrirá automáticamente en: **http://localhost:3000**

---

## 📁 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `start.bat` | Inicia todos los servicios |
| `stop.bat` | Detiene todos los servicios |
| `logs.bat` | Muestra logs del sistema |
| `status.bat` | Muestra estado de los servicios |
| `backup-db.bat` | Crea backup de la base de datos |
| `restore-db.bat` | Restaura desde un backup |
| `reset-db.bat` | ⚠️ Elimina todos los datos |
| `install-offline.bat` | Carga imágenes desde .tar |
| `build-images.bat` | Construye y exporta imágenes |

---

## 🔐 Credenciales por Defecto

| Servicio | Usuario | Contraseña |
|----------|---------|------------|
| **Aplicación** | admin | admin123 |
| **MySQL** | root | root |
| **MySQL** | sgik_user | sgik_pass |

---

## 🌐 URLs

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| MySQL | localhost:3306 |

---

## 🔄 Actualizar el Sistema

Si hay una nueva versión:

1. En la PC con Internet:
   - Descarga el nuevo código
   - Ejecuta `build-images.bat` (regenera los `.tar`)

2. En la PC destino:
   - Detén el sistema: `stop.bat`
   - Copia los nuevos archivos `.tar`
   - Ejecuta `install-offline.bat`
   - Inicia el sistema: `start.bat`

---

## 💾 Backups

### Crear Backup
```batch
docker\scripts\backup-db.bat
```
Los backups se guardan en: `backups\sgik_backup_FECHA_HORA.sql`

### Restaurar Backup
```batch
docker\scripts\restore-db.bat
```

### Backup Manual (avanzado)
```batch
docker exec sgik-mysql mysqldump -u root -proot sgik > mi_backup.sql
```

---

## 🛠️ Solución de Problemas

### Docker no inicia
1. Verifica que Hyper-V o WSL2 estén habilitados
2. Reinicia Docker Desktop
3. Reinicia la PC

### El backend no conecta a MySQL
1. Espera 30-60 segundos (MySQL tarda en iniciar)
2. Revisa logs: `docker\scripts\logs.bat`

### Error "image not found"
1. Ejecuta `install-offline.bat` primero
2. Verifica que los `.tar` existan en `docker\images\`

### Puertos en uso
Si hay error de puerto, otro programa está usando 3000, 8080 o 3306:
```batch
netstat -ano | findstr :3000
netstat -ano | findstr :8080
netstat -ano | findstr :3306
```

### Ver logs detallados
```batch
docker logs sgik-backend
docker logs sgik-frontend
docker logs sgik-mysql
```

---

## 📊 Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                     Red Docker (sgik-network)               │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  Frontend   │───▶│   Backend   │───▶│    MySQL    │     │
│  │  (Next.js)  │    │(Spring Boot)│    │    (8.0)    │     │
│  │   :3000     │    │    :8080    │    │    :3306    │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                              │              │
│                                              ▼              │
│                                    ┌─────────────────┐      │
│                                    │  Volume: datos  │      │
│                                    │  (persistente)  │      │
│                                    └─────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Comandos Docker Útiles

```batch
# Ver contenedores corriendo
docker ps

# Ver todos los contenedores
docker ps -a

# Reiniciar un servicio
docker restart sgik-backend

# Entrar al contenedor MySQL
docker exec -it sgik-mysql mysql -u root -proot sgik

# Ver uso de recursos
docker stats
```

