@echo off
REM Script para lanzar backend y frontend simultáneamente
REM Uso: Doble clic en este archivo

echo.
echo ========================================
echo  🚀 Iniciando MTG-Nexus-Hub
echo ========================================
echo.

REM Obtener ruta del proyecto
set PROJECT_ROOT=%~dp0

REM Lanzar backend en nueva ventana
echo 🔧 Iniciando Backend...
cd /d "%PROJECT_ROOT%backend"
start "MTG-Nexus Backend" npm run dev

REM Esperar 3 segundos antes de lanzar frontend
timeout /t 3 /nobreak

REM Lanzar frontend en nueva ventana
echo 🎨 Iniciando Frontend...
cd /d "%PROJECT_ROOT%frontend"
start "MTG-Nexus Frontend" npm start

REM Esperar a que ambos servicios se inicien
timeout /t 8 /nobreak

REM Abrir navegador
echo.
echo ========================================
echo  ✨ ¡Todo está listo!
echo ========================================
echo.
echo 📱 Frontend:  http://localhost:3000
echo 🔌 Backend:   http://localhost:5000
echo.

start http://localhost:3000

echo.
echo 💡 Usa Ctrl+C en cada ventana para detener los servicios.
echo.
pause
