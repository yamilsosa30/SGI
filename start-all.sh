#!/bin/bash
set -e

# ================================
#  POS: Arranque Frontend + Backend
# ================================
# - Compila e inicia Spring Boot (8080)
# - Instala deps e inicia Next.js en dev (3000)
# - Mata procesos previos en 8080 y 3000
# - Registra logs en ./logs
#
# Uso:
#   chmod +x start-all.sh
#   ./start-all.sh
# ================================

ROOT_DIR=$(cd "$(dirname "$0")" && pwd)
LOG_DIR="$ROOT_DIR/logs"
PID_DIR="$ROOT_DIR/.pids"
mkdir -p "$LOG_DIR" "$PID_DIR"

# ===== Java 17 =====
JAVA_HOME_17=$(/usr/libexec/java_home -v 17 2>/dev/null || true)
if [ -z "$JAVA_HOME_17" ]; then
  echo "❌ Error: No se encontró JDK 17. Instalar desde https://adoptium.net/ y reintentar."
  exit 1
fi
export JAVA_HOME="$JAVA_HOME_17"
export PATH="$JAVA_HOME/bin:$PATH"
echo "🧩 Usando Java: $(java -version 2>&1 | head -n 1)"

# ===== Prechequeos de herramientas =====
check_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "❌ Error: $1 no encontrado."
    case "$1" in
      mvn)  echo "   Instalar Maven: https://maven.apache.org/" ;;
      node) echo "   Instalar Node.js: https://nodejs.org/" ;;
      npm)  echo "   npm viene con Node.js (https://nodejs.org/)" ;;
      curl) echo "   Instalar curl (brew install curl) o equivalente" ;;
    esac
    exit 1
  fi
}

check_cmd mvn
check_cmd node
check_cmd npm
check_cmd curl

kill_if_running() {
  local name="$1" pid_file="$2" port="$3"
  if [ -f "$pid_file" ]; then
    local pid
    pid=$(cat "$pid_file" || true)
    if [ -n "$pid" ] && ps -p "$pid" >/dev/null 2>&1; then
      echo "🛑 Deteniendo $name (PID $pid)"
      kill "$pid" || true
      sleep 1
    fi
    rm -f "$pid_file" || true
  fi
  # Fallback por puerto
  if lsof -ti tcp:"$port" >/dev/null 2>&1; then
    echo "🛑 Liberando puerto $port para $name"
    kill $(lsof -ti tcp:"$port") || true
    sleep 1
  fi
}

wait_for_http() {
  local url="$1" label="$2"
  echo "⏳ Esperando $label en $url ..."
  for i in {1..60}; do
    # Obtenemos el HTTP status code; 000 indica que no conecta aún
    local code
    code=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
    if [ "$code" != "000" ]; then
      echo "✅ $label activo (HTTP $code)"
      return 0
    fi
    sleep 1
  done
  echo "⚠️ Tiempo de espera agotado para $label ($url), revisa logs."
  return 1
}

BACKEND_LOG="$LOG_DIR/backend.log"
FRONTEND_LOG="$LOG_DIR/frontend.log"
BACKEND_PID_FILE="$PID_DIR/backend.pid"
FRONTEND_PID_FILE="$PID_DIR/frontend.pid"

echo "📦 Directorio raíz: $ROOT_DIR"
echo "🗒️  Logs: $LOG_DIR"

echo
echo "===== Paso 1: Limpiar procesos previos ====="
kill_if_running "Frontend" "$FRONTEND_PID_FILE" 3000
kill_if_running "Backend"  "$BACKEND_PID_FILE"  8080

########## Backend ##########
echo
echo "===== Paso 2: Compilar Backend ====="
echo "🧱 Compilando backend..." | tee "$BACKEND_LOG"
(
  cd "$ROOT_DIR/backend"
  mvn -q -DskipTests clean compile >> "$BACKEND_LOG" 2>&1
) || { echo "❌ Falló la compilación backend. Revisá $BACKEND_LOG"; exit 1; }

echo "===== Paso 3: Iniciar Backend (Spring Boot) ====="
(
  cd "$ROOT_DIR/backend"
  echo "🚀 Iniciando Spring Boot en 8080..." >> "$BACKEND_LOG"
  mvn -q -DskipTests spring-boot:run -Dspring-boot.run.jvmArguments="-Djava.net.preferIPv4Stack=true -Dserver.address=0.0.0.0" >> "$BACKEND_LOG" 2>&1
) &
BACK_PID=$!
echo "$BACK_PID" > "$BACKEND_PID_FILE"
echo "📝 Log backend: $BACKEND_LOG (PID $BACK_PID)"

# Esperar que el backend responda (intentamos /api/products; si falla, cualquier 200 de /)
if ! wait_for_http "http://localhost:8080/api/products" "Backend API"; then
  wait_for_http "http://localhost:8080" "Backend"
fi

# ========= Frontend =========
echo
echo "===== Paso 4: Iniciar Frontend (Next.js dev) ====="
(
  cd "$ROOT_DIR"
  echo "📦 Instalando dependencias npm..." | tee "$FRONTEND_LOG"
  npm install >> "$FRONTEND_LOG" 2>&1
  echo "🚀 Iniciando Next.js en 3000..." >> "$FRONTEND_LOG"
  npm run dev >> "$FRONTEND_LOG" 2>&1
) &
FRONT_PID=$!
echo "$FRONT_PID" > "$FRONTEND_PID_FILE"
echo "📝 Log frontend: $FRONTEND_LOG (PID $FRONT_PID)"

wait_for_http "http://localhost:3000" "Frontend"

echo
echo "====================================="
echo "✅ Todo listo"
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend:  http://localhost:8080"
echo "📄 Logs:     $LOG_DIR"
echo "====================================="

# Abrir navegador en macOS si 'open' existe
if command -v open >/dev/null 2>&1; then
  open "http://localhost:3000" || true
fi

# Mantener script vivo si lanzó procesos en background desde un doble clic
# Comentar si preferís que termine inmediatamente.
wait $BACK_PID $FRONT_PID || true
