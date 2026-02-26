#!/bin/bash
echo "🚀 Iniciando Frontend React..."
echo "📋 Verificando requisitos..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no encontrado"
    echo "   Instalar desde: https://nodejs.org/"
    exit 1
fi

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm no encontrado"
    exit 1
fi

echo "✅ Node.js y npm encontrados"
echo "📦 Instalando dependencias..."

npm install

echo "🌐 Iniciando aplicación en puerto 3000..."
echo "   - URL: http://localhost:3000"
echo "   - Backend: http://localhost:8080"

npm run dev
