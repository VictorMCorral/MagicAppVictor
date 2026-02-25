@echo off
setlocal EnableDelayedExpansion

echo.
echo ========================================
echo   MTG Nexus - No usable
echo ========================================
echo.

REM Rutas del proyecto
cd /d "%~dp0.."
set "PROJECT_ROOT=%CD%"
set "APP_DIR=%PROJECT_ROOT%\apps\non-usable"
set "BACKEND_DIR=%PROJECT_ROOT%\backend"

REM Encender Docker si es necesario
echo [1/3] Verificando Docker...
docker info >nul 2>&1
if errorlevel 1 (
    echo  Docker no esta corriendo. Iniciando Docker Desktop...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe" >nul 2>&1
    echo  Esperando 30 segundos...
    timeout /t 30 /nobreak >nul
    docker info >nul 2>&1
    if errorlevel 1 (
        echo  No se pudo establecer conexion con Docker. Inicia Docker manualmente e intenta de nuevo.
        exit /b 1
    )
)

echo  Docker OK
set "COMPOSE_CMD=docker compose"
%COMPOSE_CMD% version >nul 2>&1
if errorlevel 1 (
    set "COMPOSE_CMD=docker-compose"
    %COMPOSE_CMD% version >nul 2>&1
    if errorlevel 1 (
        echo  No se encontro docker compose. Actualiza Docker Desktop.
        exit /b 1
    )
)
echo [2/4] Iniciando base de datos...
%COMPOSE_CMD% -f "%PROJECT_ROOT%\docker-compose.yml" up -d db >nul
if errorlevel 1 (
    echo  Error al iniciar la base de datos.
    exit /b 1
)
set "DB_READY="
for /L %%S in (1,1,15) do (
    for /f "tokens=*" %%I in ('docker ps -q -f "name=mtg-nexus-db" 2^>nul') do set "DB_READY=%%I"
    if defined DB_READY goto :DB_OK
    timeout /t 2 /nobreak >nul
)
echo  La base de datos no respondio a tiempo. Revisa Docker Desktop.
exit /b 1

:DB_OK
echo  DB lista (contenedor !DB_READY!)

echo [3/4] Verificando backend...
powershell -NoLogo -Command "try { (Invoke-WebRequest -Uri 'http://localhost:5000/health' -UseBasicParsing -TimeoutSec 3) | Out-Null; exit 0 } catch { exit 1 }" >nul 2>&1
if errorlevel 1 (
    echo  Backend no responde, iniciandolo en nueva ventana...
    start "backend :5000" powershell -NoExit -Command "Set-Location '%BACKEND_DIR%' ; npm run dev"
    echo  Esperando 5 segundos a que inicie...
    timeout /t 5 /nobreak >nul
) else (
    echo  Backend ya estaba en marcha.
)

echo [4/4] Compilando no usable...
pushd "%APP_DIR%"
cmd /c "set CI=false && set GENERATE_SOURCEMAP=false && npm run build"
if errorlevel 1 (
    popd
    echo  Error durante la compilacion del frontend.
    exit /b 1
)
popd
echo  Build completado

echo Lanzando servidor estatico en http://localhost:3002 ...
start "no-usable :3002" powershell -NoExit -Command "serve -l 3002 --no-clipboard -s '%APP_DIR%\build'"
start "" http://localhost:3002 >nul 2>&1
echo Todo listo. Cierra la ventana del servidor cuando termines.

endlocal
