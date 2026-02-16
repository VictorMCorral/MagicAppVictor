# Script de Despliegue Remoto para MagicApp
# Ejecuta este script desde tu PC local para actualizar el servidor

$SERVER_IP = "192.168.5.41"
$SERVER_USER = "diego" 
$REMOTE_PATH = "~/MagicAppVictor"

Write-Host "----------------------------------------------------" -ForegroundColor Cyan
Write-Host "🚀 Iniciando actualización remota en $SERVER_IP" -ForegroundColor Green
Write-Host "----------------------------------------------------" -ForegroundColor Cyan
http://192.168.5.41/
# Comando a ejecutar en el servidor: Limpiar cambios locales, actualizar y ejecutar deploy
$REMOTE_COMMAND = "cd $REMOTE_PATH && git fetch --all && git reset --hard origin/main && chmod +x ubuntu-deploy.sh && ./ubuntu-deploy.sh $SERVER_IP"

# Ejecutar vía SSH con -t para permitir interactividad si hace falta sudo
ssh -t "$SERVER_USER@$SERVER_IP" "$REMOTE_COMMAND"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ ¡Despliegue completado con éxito!" -ForegroundColor Green
    Write-Host "📡 Accede en: http://$SERVER_IP" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Error en el despliegue remoto. Revisa la conexión SSH." -ForegroundColor Red
}
Write-Host "----------------------------------------------------" -ForegroundColor Cyan
