# Script para lanzar backend y frontend simultáneamente
# Uso: .\start-all.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 Iniciando MTG-Nexus-Hub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Obtener la ruta del proyecto
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

# Rutas de carpetas
$backendPath = Join-Path $projectRoot "backend"
$frontendPath = Join-Path $projectRoot "frontend"

Write-Host "📂 Rutas detectadas:" -ForegroundColor Yellow
Write-Host "   Backend:  $backendPath"
Write-Host "   Frontend: $frontendPath"
Write-Host ""

# Función para esperar a que un servicio esté listo
function Wait-ForService {
    param(
        [string]$Port,
        [string]$ServiceName,
        [int]$MaxAttempts = 30
    )
    
    Write-Host "⏳ Esperando a que $ServiceName esté listo en puerto $Port..."
    $attempt = 0
    
    while ($attempt -lt $MaxAttempts) {
        try {
            $test = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue -ErrorAction Stop
            if ($test.TcpTestSucceeded) {
                Write-Host "✅ $ServiceName está listo!" -ForegroundColor Green
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
    
    Write-Host "❌ Timeout esperando a $ServiceName" -ForegroundColor Red
    return $false
}

# Iniciar Backend
Write-Host "🔧 Iniciando Backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npm run dev" -WindowStyle Normal

# Esperar a que el backend esté listo
Start-Sleep -Seconds 2
Wait-ForService -Port 5000 -ServiceName "Backend"

Write-Host ""

# Iniciar Frontend
Write-Host "🎨 Iniciando Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm start" -WindowStyle Normal

# Esperar a que el frontend esté listo
Start-Sleep -Seconds 3
Wait-ForService -Port 3000 -ServiceName "Frontend"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✨ ¡Todo está listo!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Frontend:  http://localhost:3000" -ForegroundColor Yellow
Write-Host "🔌 Backend:   http://localhost:5000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Abriendo navegador..." -ForegroundColor Cyan

# Abrir navegador
Start-Sleep -Seconds 2
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "💡 Nota: Las ventanas del Backend y Frontend se cerraron automáticamente."
Write-Host "   Este script permanecerá abierto para referencias."
Write-Host ""
