# Script para lanzar backend y frontends simultáneamente
# Uso: .\start-all.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Iniciando MTG-Nexus-Hub (Multi-App)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Obtener la ruta del proyecto (padre del directorio de scripts)
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $projectRoot  # Ir un nivel arriba para estar en la raíz

# Rutas de carpetas
$backendPath = Join-Path $projectRoot "backend"
$appsPath = Join-Path $projectRoot "apps"
$accessiblePath = Join-Path $appsPath "accessible-usable"
$nonAccessiblePath = Join-Path $appsPath "non-accessible"
$nonUsablePath = Join-Path $appsPath "non-usable"

Write-Host " Rutas detectadas:" -ForegroundColor Yellow
Write-Host "   Backend:       $backendPath"
Write-Host "   Accessible:    $accessiblePath"
Write-Host "   Non-Accessible:$nonAccessiblePath"
Write-Host "   Non-Usable:    $nonUsablePath"
Write-Host ""

# Función para esperar a que un servicio esté listo
function Wait-ForService {
    param(
        [string]$Port,
        [string]$ServiceName,
        [int]$MaxAttempts = 30
    )
    
    Write-Host " Esperando a que $ServiceName esté listo en puerto $Port..."
    $attempt = 0
    
    while ($attempt -lt $MaxAttempts) {
        try {
            $test = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue -ErrorAction Stop
            if ($test.TcpTestSucceeded) {
                Write-Host " $ServiceName está listo!" -ForegroundColor Green
                return $true
            }
        }
        catch {
            # Continuar intentando
        }
        
        Start-Sleep -Seconds 1
        $attempt++
        Write-Host "   Intento $attempt de $MaxAttempts..."
    }
    
    Write-Host " Timeout esperando a $ServiceName" -ForegroundColor Red
    return $false
}

# Iniciar Backend
Write-Host " Iniciando Backend..." -ForegroundColor Cyan
if (Test-Path $backendPath) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npm run dev" -WindowStyle Normal
} else {
    Write-Host " No se encontró la carpeta backend" -ForegroundColor Red
}

# Esperar a que el backend esté listo
Start-Sleep -Seconds 2
Wait-ForService -Port 5000 -ServiceName "Backend"

Write-Host ""

# Iniciar Frontend Accesible
Write-Host " Iniciando Front Accesible y Usable..." -ForegroundColor Cyan
if (Test-Path $accessiblePath) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$accessiblePath'; npm start" -WindowStyle Normal
}

# Iniciar Frontend No Accesible
Write-Host " Iniciando Front No Accesible..." -ForegroundColor Cyan
if (Test-Path $nonAccessiblePath) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$nonAccessiblePath'; npm start" -WindowStyle Normal
}

# Iniciar Frontend No Usable
Write-Host " Iniciando Front No Usable..." -ForegroundColor Cyan
if (Test-Path $nonUsablePath) {
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$nonUsablePath'; npm start" -WindowStyle Normal
}

# Esperar a que el frontend principal esté listo
Start-Sleep -Seconds 3
Wait-ForService -Port 3000 -ServiceName "Frontend Accesible"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " ¡Todo está listo!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host " Accesible:     http://localhost:3000" -ForegroundColor Yellow
Write-Host " No Accesible:  http://localhost:3001" -ForegroundColor Yellow
Write-Host " No Usable:     http://localhost:3002" -ForegroundColor Yellow
Write-Host " Backend:       http://localhost:5000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Abriendo versión accesible..." -ForegroundColor Cyan

# Abrir navegador
Start-Sleep -Seconds 2
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host " Nota: Las ventanas de terminal se mantendrán abiertas."
