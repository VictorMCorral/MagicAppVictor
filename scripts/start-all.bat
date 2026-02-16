@echo off
REM Script para lanzar backend y frontends simultáneamente
REM Uso: Doble clic en este archivo

echo.
echo ========================================
echo   Iniciando MTG-Nexus-Hub (Multi-App)
echo ========================================
echo.

REM Obtener ruta del proyecto (sitio del script)
set PROJECT_ROOT=%~dp0..

REM Lanzar backend en nueva ventana
echo  Iniciando Backend...
start "MTG-Nexus Backend" /d "%PROJECT_ROOT%\backend" cmd /k "npm run dev"

REM Esperar 3 segundos antes de lanzar frontends
timeout /t 3 /nobreak

REM Lanzar Frontend Accesible
echo  Iniciando Front Accesible y Usable...
start "MTG-Nexus Frontend Accesible" /d "%PROJECT_ROOT%\apps\accessible-usable" cmd /k "npm start"

REM Lanzar Frontend No Accesible
echo  Iniciando Front No Accesible...
start "MTG-Nexus Frontend NO Accesible" /d "%PROJECT_ROOT%\apps\non-accessible" cmd /k "npm start"

REM Lanzar Frontend No Usable
echo  Iniciando Front No Usable...
start "MTG-Nexus Frontend NO Usable" /d "%PROJECT_ROOT%\apps\non-usable" cmd /k "npm start"

REM Esperar a que los servicios se inicien
timeout /t 10 /nobreak

REM Abrir navegador en puerto 3000
echo.
echo ========================================
echo   ¡Todo está listo!
echo ========================================
echo.
echo  Accesible:     http://localhost:3000
echo  No Accesible:  http://localhost:3001
echo  No Usable:     http://localhost:3002
echo  Backend:       http://localhost:5000
echo.

start http://localhost:3000

echo.
echo  Usa Ctrl+C en cada ventana para detener los servicios.
echo.
pause
