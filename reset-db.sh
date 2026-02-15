#!/bin/bash
# Script para reiniciar la base de datos con datos de ejemplo
# Uso: ./reset-db.sh

BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/backend"

echo ""
echo "============================================"
echo "     REINICIO DE BASE DE DATOS MTG-NEXUS"
echo "============================================"
echo ""

cd "$BACKEND_DIR" || exit 1

if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del backend..."
    npm install
    echo ""
fi

echo "🔄 Ejecutando reinicio de base de datos..."
echo ""

npm run db:reset

if [ $? -eq 0 ]; then
    echo ""
    echo "============================================"
    echo "✅ REINICIO EXITOSO"
    echo "============================================"
    echo ""
else
    echo ""
    echo "============================================"
    echo "❌ ERROR DURANTE EL REINICIO"
    echo "============================================"
    echo ""
    exit 1
fi
