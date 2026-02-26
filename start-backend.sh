#!/bin/bash
echo "🚀 Iniciando Backend Spring Boot..."
echo "📋 Verificando requisitos..."

# Forzar Java 17 en macOS si está disponible
if command -v /usr/libexec/java_home >/dev/null 2>&1; then
  JAVA_17=$(/usr/libexec/java_home -v 17 2>/dev/null)
  if [ -n "$JAVA_17" ]; then
    export JAVA_HOME="$JAVA_17"
    export PATH="$JAVA_HOME/bin:$PATH"
  fi
fi

# Verificar Java 17
if ! java -version 2>&1 | grep -Eq "version \"17"; then
    echo "❌ Error: Se requiere Java 17 (detected: $(java -version 2>&1 | head -n 1))"
    echo "   Instalar desde: https://adoptium.net/ y/o configurar JAVA_HOME"
    exit 1
fi
echo "🧩 Java en uso: $(java -version 2>&1 | head -n 1)"

# Verificar Maven
if ! command -v mvn &> /dev/null; then
    echo "❌ Error: Maven no encontrado"
    echo "   Instalar Maven desde: https://maven.apache.org/"
    exit 1
fi

echo "✅ Java 17 y Maven encontrados"
echo "📦 Compilando proyecto..."

cd backend
echo "🧱 Compilando backend..."
mvn -q -DskipTests clean compile || { echo "❌ Falló la compilación"; exit 1; }

echo "🗄️  Configurando base de datos MySQL..."
echo "   - Base: sgik"
echo "   - URL: jdbc:mysql://localhost:3306/sgik"
echo "   - Usuario: root"
echo "   - Contraseña: root"
echo "   - Recuerda ejecutar database/schema-mysql.sql y database/data-mysql.sql"

echo "🌐 Iniciando servidor en puerto 8080..."
mvn -q -DskipTests spring-boot:run
