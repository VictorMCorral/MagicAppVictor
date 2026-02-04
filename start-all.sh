#!/bin/bash

# Script para lanzar backend y frontend simultáneamente
# Uso: bash start-all.sh

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_PATH="$PROJECT_ROOT/backend"
FRONTEND_PATH="$PROJECT_ROOT/frontend"

echo ""
echo "========================================"
echo "🚀 Iniciando MTG-Nexus-Hub"
echo "========================================"
echo ""

echo "📂 Rutas detectadas:"
echo "   Backend:  $BACKEND_PATH"
echo "   Frontend: $FRONTEND_PATH"
echo ""

# Función para esperar a que un servicio esté listo
wait_for_service() {
    local port=$1
    local service_name=$2
    local max_attempts=30
    local attempt=0
    
    echo "⏳ Esperando a que $service_name esté listo en puerto $port..."
    
    while [ $attempt -lt $max_attempts ]; do
        if nc -z localhost $port 2>/dev/null; then
            echo "✅ $service_name está listo!"
            return 0
        fi
        
        sleep 1
        attempt=$((attempt + 1))
        echo "   Intento $attempt de $max_attempts..."
    done
    
    echo "❌ Timeout esperando a $service_name"
    return 1
}

# Iniciar Backend
echo "🔧 Iniciando Backend..."
cd "$BACKEND_PATH"
npm run dev &
BACKEND_PID=$!

# Esperar a que el backend esté listo
sleep 2
wait_for_service 5000 "Backend"

echo ""

# Iniciar Frontend
echo "🎨 Iniciando Frontend..."
cd "$FRONTEND_PATH"
npm start &
FRONTEND_PID=$!

# Esperar a que el frontend esté listo
sleep 3
wait_for_service 3000 "Frontend"

echo ""
echo "========================================"
echo "✨ ¡Todo está listo!"
echo "========================================"
echo ""
echo "📱 Frontend:  http://localhost:3000"
echo "🔌 Backend:   http://localhost:5000"
echo ""

# Abrir navegador si es disponible
if command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:3000" 2>/dev/null &
elif command -v open &> /dev/null; then
    open "http://localhost:3000" 2>/dev/null &
elif command -v start &> /dev/null; then
    start "http://localhost:3000" 2>/dev/null &
fi

echo "💡 Presiona Ctrl+C para detener todos los servicios."
echo ""

# Mantener el script abierto
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo ''; echo 'Servicios detenidos.'; exit 0" SIGINT

wait
