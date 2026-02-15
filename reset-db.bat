@echo off
REM Script para reiniciar la base de datos con datos de ejemplo
REM Uso: reset-db.bat

set "BACKEND_DIR=%~dp0backend"

echo.
echo ============================================
echo     REINICIO DE BASE DE DATOS MTG-NEXUS
echo ============================================
echo.

cd /d "%BACKEND_DIR%"

if not exist "node_modules" (
    echo 📦 Instalando dependencias del backend...
    call npm install
    echo.
)

echo 🔄 Ejecutando reinicio de base de datos...
echo.

call npm run db:reset

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo ✅ REINICIO EXITOSO
    echo ============================================
) else (
    echo.
    echo ============================================
    echo ❌ ERROR DURANTE EL REINICIO
    echo ============================================
    pause
    exit /b 1
)

pause
