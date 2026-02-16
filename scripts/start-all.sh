#!/bin/bash
# Script para lanzar backend y frontends simultáneamente

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND_PATH="$PROJECT_ROOT/backend"
APPS_PATH="$PROJECT_ROOT/apps"
ACCESSIBLE_PATH="$APPS_PATH/accessible-usable"
NON_ACCESSIBLE_PATH="$APPS_PATH/non-accessible"
NON_USABLE_PATH="$APPS_PATH/non-usable"

echo ""
echo "========================================"
echo " Iniciando MTG-Nexus-Hub (Multi-App)"
echo "========================================"
echo ""

# Iniciar Backend
echo " Iniciando Backend..."
cd "$BACKEND_PATH"
npm run dev &
BACKEND_PID=$!

sleep 3

# Iniciar Frontend Accesible
echo " Iniciando Front Accesible..."
cd "$ACCESSIBLE_PATH"
PORT=3000 npm start &
ACC_PID=$!

# Iniciar Frontend No Accesible
echo " Iniciando Front No Accesible..."
cd "$NON_ACCESSIBLE_PATH"
PORT=3001 npm start &
NON_ACC_PID=$!

# Iniciar Frontend No Usable
echo " Iniciando Front No Usable..."
cd "$NON_USABLE_PATH"
PORT=3002 npm start &
NON_US_PID=$!


echo ""
echo "========================================"
echo " ¡Todo está listo!"
echo "========================================"
echo ""
echo " Accesible:     http://localhost:3000"
echo " No Accesible:  http://localhost:3001"
echo " No Usable:     http://localhost:3002"
echo " Backend:       http://localhost:5000"
echo ""

# Wait for Ctrl+C
trap "kill \ \ \ \" EXIT
wait
