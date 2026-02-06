# Script de Despliegue Remoto para MagicApp
# Ejecuta este script desde tu PC local para actualizar el servidor

$SERVER_IP = "192.168.5.41"
$SERVER_USER = "victor" # Actualizado
$REMOTE_PATH = "~/MagicApp"
$PASSWORD = "Prieto*2" # Contraseña automatizada

Write-Host "----------------------------------------------------" -ForegroundColor Cyan
Write-Host "🚀 Iniciando actualización remota en $SERVER_IP" -ForegroundColor Green
Write-Host "----------------------------------------------------" -ForegroundColor Cyan

# Instalar sshpass si no está disponible (opcional, pero mejor usar la contraseña directamente en el comando si es posible)
# En Windows, lo más sencillo es usar una variable de entorno para la contraseña o enviarla al comando

# Comando a ejecutar incluyendo el paso de la contraseña al sudo mediante el script de ubuntu
$REMOTE_COMMAND = "cd $REMOTE_PATH && git pull origin main && chmod +x ubuntu-deploy.sh && echo '$PASSWORD' | sudo -S ./ubuntu-deploy.sh $SERVER_IP '$PASSWORD'"

# Ejecutar vía SSH (se recomienda instalar la clave SSH para evitar pedir pas de ssh, 
# pero aquí intentamos automatizarlo con la contraseña proporcionada)
# Nota: ssh nativo de Windows no soporta pasar contraseña por parámetro fácilmente sin herramientas como sshpass o PuTTY.
# Se asume que el usuario tiene la clave SSH configurada o que la escribirá una vez para la conexión inicial.
ssh -t "$SERVER_USER@$SERVER_IP" "$REMOTE_COMMAND"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ ¡Despliegue completado con éxito!" -ForegroundColor Green
    Write-Host "📡 Accede en: http://$SERVER_IP" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Error en el despliegue remoto. Revisa la conexión SSH." -ForegroundColor Red
}
Write-Host "----------------------------------------------------" -ForegroundColor Cyan
