@echo off
setlocal EnableDelayedExpansion

echo.
echo ========================================
echo   MTG Nexus - Inicio Unificado
echo ========================================
echo.

cd /d "%~dp0.."
set "PROJECT_ROOT=%CD%"
set "BACKEND_DIR=%PROJECT_ROOT%\backend"
set "FRONTEND_DIR=%PROJECT_ROOT%\apps\accessible-usable"

echo [1/4] Verificando Docker...
docker info >nul 2>&1
if errorlevel 1 (
    echo  Docker no esta corriendo. Iniciando Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe" >nul 2>&1
    timeout /t 30 /nobreak >nul
    docker info >nul 2>&1
    if errorlevel 1 (
        echo  No se pudo establecer conexion con Docker.
        exit /b 1
    )
)

set "COMPOSE_CMD=docker compose"
%COMPOSE_CMD% version >nul 2>&1
if errorlevel 1 (
    set "COMPOSE_CMD=docker-compose"
    %COMPOSE_CMD% version >nul 2>&1
    if errorlevel 1 (
        echo  No se encontro docker compose.
        exit /b 1
    )
)

echo [2/4] Iniciando base de datos...
%COMPOSE_CMD% -f "%PROJECT_ROOT%\docker-compose.yml" up -d db >nul
if errorlevel 1 (
    echo  Error al iniciar la base de datos.
    exit /b 1
)

echo [3/4] Iniciando backend (puerto 5000)...
powershell -NoLogo -Command "try { (Invoke-WebRequest -Uri 'http://localhost:5000/health' -UseBasicParsing -TimeoutSec 3) | Out-Null; exit 0 } catch { exit 1 }" >nul 2>&1
if errorlevel 1 (
    start "backend :5000" powershell -NoExit -Command "Set-Location '%BACKEND_DIR%' ; npm run dev"
    timeout /t 5 /nobreak >nul
) else (
    echo  Backend ya estaba en marcha.
)

echo [4/4] Iniciando frontend unificado (puerto 3000)...
start "frontend :3000" powershell -NoExit -Command "Set-Location '%FRONTEND_DIR%' ; npm start"

timeout /t 2 /nobreak >nul
start "" http://localhost:3000 >nul 2>&1

echo.
echo Todo listo:
echo  - DB: docker compose (servicio db)
echo  - Backend: http://localhost:5000
echo  - Frontend: http://localhost:3000
echo.

endlocal
