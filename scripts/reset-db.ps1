# Script para reiniciar la base de datos con datos de ejemplo
# Uso: .\reset-db.ps1

$BackendDir = Join-Path $PSScriptRoot "backend"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "     REINICIO DE BASE DE DATOS MTG-NEXUS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Push-Location $BackendDir

if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias del backend..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

Write-Host "🔄 Ejecutando reinicio de base de datos..." -ForegroundColor Yellow
Write-Host ""

npm run db:reset

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "✅ REINICIO EXITOSO" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Red
    Write-Host "❌ ERROR DURANTE EL REINICIO" -ForegroundColor Red
    Write-Host "============================================" -ForegroundColor Red
    Pop-Location
    exit 1
}

Pop-Location
