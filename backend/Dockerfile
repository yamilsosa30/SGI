# =============================================================================
# Dockerfile para Backend Spring Boot - SGIK POS
# Multi-stage build para optimizar tamaño de imagen
# Compatible con ARM64 (Apple Silicon) y AMD64 (Windows/Intel)
# =============================================================================

# -----------------------------------------
# Stage 1: Build con Maven
# -----------------------------------------
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copiar archivos de dependencias primero (cache de Docker)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar código fuente y compilar
COPY src ./src
RUN mvn clean package -DskipTests -B

# -----------------------------------------
# Stage 2: Runtime con JRE mínimo
# -----------------------------------------
FROM eclipse-temurin:17-jre

LABEL maintainer="SGIK POS Team"
LABEL description="Backend API para Sistema de Gestión de Inventario Kiosco"
LABEL version="1.0"

WORKDIR /app

# Crear usuario no-root para seguridad
RUN groupadd -g 1001 appgroup && \
    useradd -u 1001 -g appgroup -s /bin/bash appuser

# Copiar JAR desde stage de build
COPY --from=builder /app/target/*.jar app.jar

# Cambiar a usuario no-root
USER appuser

# Puerto expuesto
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Variables de entorno por defecto
ENV SPRING_PROFILES_ACTIVE=docker
ENV JAVA_OPTS="-Xms256m -Xmx512m"

# Comando de inicio
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
