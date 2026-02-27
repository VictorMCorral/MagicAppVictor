param(
    [string]$SshUser = "diego",
    [string]$SshHost = "192.168.5.51",
    [SecureString]$SshPassword,
    [string]$RepoUrl = "https://github.com/VictorMCorral/MagicAppVictor.git",
    [string]$RemoteRepoDir = "/home/diego/MagicAppVictor",
    [string]$RemoteVideosDir,
    [string]$FrontendBuildDir = "/var/www/magicapp-frontend",
    [string]$NginxSiteName = "magicapp"
)

$ErrorActionPreference = 'Stop'
$scriptName = Split-Path -Leaf $MyInvocation.MyCommand.Path
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $scriptDir

function Write-Info {
    param([string]$Message)
    Write-Host "[$scriptName] $Message" -ForegroundColor Cyan
}

function Write-Warn {
    param([string]$Message)
    Write-Warning "[$scriptName] $Message"
}

function ConvertTo-PlainText {
    param([SecureString]$Secure)
    $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Secure)
    try {
        return [Runtime.InteropServices.Marshal]::PtrToStringUni($ptr)
    }
    finally {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
    }
}

function Ensure-Module {
    param([string]$ModuleName)
    if (-not (Get-Module -ListAvailable -Name $ModuleName)) {
        Write-Info "Instalando módulo $ModuleName desde PSGallery (solo la primera vez)..."
        Install-Module -Name $ModuleName -Scope CurrentUser -Force -AllowClobber
    }
    Import-Module $ModuleName -ErrorAction Stop
}

function ConvertTo-ShellLiteral {
    param([string]$Value)
    if ($null -eq $Value) { return '' }
    $single = "'"
    $double = '"'
    $slash = '\\'
    $replacement = $single + $slash + $double + $single + $slash + $double + $single
    return $Value -replace "'", $replacement
}

if (-not $RemoteVideosDir) {
    $RemoteVideosDir = "$RemoteRepoDir/apps/accessible-usable/public/videos/visual-studies"
}

if (-not $SshPassword) {
    $SshPassword = Read-Host -AsSecureString "Introduce la contraseña SSH para $SshUser@$SshHost"
}

Ensure-Module -ModuleName Posh-SSH

$plainPassword = ConvertTo-PlainText -Secure $SshPassword
$credential = New-Object System.Management.Automation.PSCredential ($SshUser, $SshPassword)

$sshSession = $null
try {
    Write-Info "Abriendo sesión SSH con $SshHost"
    $sshSession = New-SSHSession -ComputerName $SshHost -Credential $credential -AcceptKey
}
catch {
    throw "No se pudo establecer la sesión SSH/SFTP: $($_.Exception.Message)"
}

function Invoke-RemoteScript {
    param(
        [string]$Content,
        [int]$TimeOutSeconds = 600
    )
    $tempFile = New-TemporaryFile
    $tempName = [System.IO.Path]::GetFileName($tempFile)
    try {
        $normalized = $Content -replace "`r", ""
        if ($env:DEPLOY_LOG_SCRIPTS -eq '1') {
            Write-Host "----- script begin -----" -ForegroundColor Yellow
            Write-Host $normalized
            Write-Host "----- script end -----" -ForegroundColor Yellow
        }
        $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
        [System.IO.File]::WriteAllText($tempFile, $normalized, $utf8NoBom)
        $remoteFileName = "magicapp-" + ([System.Guid]::NewGuid().ToString('N')) + ".sh"
        $remoteFile = "$remoteTempDir/$remoteFileName"
        Set-SCPItem -ComputerName $SshHost -Credential $credential -Path $tempFile -Destination $remoteTempDir -NewName $remoteFileName -AcceptKey -ConnectionTimeout 30 -OperationTimeout 120 | Out-Null
        $command = "chmod +x '$remoteFile' && /bin/bash '$remoteFile'"
        $execution = Invoke-SSHCommand -SessionId $sshSession.SessionId -Command $command -TimeOut $TimeOutSeconds
        if ($execution.Output) { $execution.Output | ForEach-Object { Write-Host $_ } }
        if ($execution.Error) { $execution.Error | ForEach-Object { Write-Warn $_ } }
        if ($execution.ExitStatus -ne 0) {
            throw "El script remoto finalizó con estado $($execution.ExitStatus)."
        }
        Invoke-SSHCommand -SessionId $sshSession.SessionId -Command "rm -f '$remoteFile'" | Out-Null
    }
    finally {
        Remove-Item -Path $tempFile -ErrorAction SilentlyContinue
    }
}

function Apply-Replacements {
    param(
        [string]$Text,
        [hashtable]$Map
    )
    $result = $Text
    foreach ($key in $Map.Keys) {
        $result = $result.Replace($key, $Map[$key])
    }
    return $result
}

function Assert-RemoteSpace {
    param(
        [string]$Path,
        [int]$RequiredMB,
        [string]$Label
    )

    $command = "df -Pk '{0}'" -f $Path
        $result = Invoke-SSHCommand -SessionId $sshSession.SessionId -Command $command -TimeOut 60
    if ($result.ExitStatus -ne 0) {
        $detail = @($result.Error + $result.Output) -join "`n"
        throw "No se pudo verificar el espacio libre en $Label. Detalle: $detail"
    }

    $lastLine = ($result.Output | Where-Object { $_ } | Select-Object -Last 1).Trim()
    $parts = $lastLine -split '\s+'
    if ($parts.Count -lt 4) {
        throw "No se pudo interpretar el espacio libre reportado para ${Label}: '$lastLine'"
    }
    [long]$availableKB = 0
    if (-not [long]::TryParse($parts[3], [ref]$availableKB)) {
        throw "No se pudo interpretar el espacio libre reportado para ${Label}: '$lastLine'"
    }
    [long]$requiredKB = [long]$RequiredMB * 1024
    if ($availableKB -lt $requiredKB) {
        $availableMB = [math]::Round($availableKB / 1024.0, 1)
        throw "El servidor solo tiene ${availableMB}MB libres en ${Label}. Libera espacio antes de desplegar (mínimo ${RequiredMB}MB)."
    }
}

$remoteRepoParent = if ($RemoteRepoDir.Contains('/')) { $RemoteRepoDir.Substring(0, $RemoteRepoDir.LastIndexOf('/')) } else { '/' }
if (-not $remoteRepoParent) { $remoteRepoParent = '/' }
$remoteUserHome = "/home/$SshUser"
$remoteTempDir = $remoteUserHome

$replacements = @{
    '__SUDO_PASSWORD__'      = ConvertTo-ShellLiteral $plainPassword
    '__REMOTE_REPO_DIR__'    = ConvertTo-ShellLiteral $RemoteRepoDir
    '__REMOTE_REPO_PARENT__' = ConvertTo-ShellLiteral $remoteRepoParent
    '__REMOTE_VIDEOS_DIR__'  = ConvertTo-ShellLiteral $RemoteVideosDir
    '__REPO_URL__'           = ConvertTo-ShellLiteral $RepoUrl
    '__SSH_USER__'           = ConvertTo-ShellLiteral $SshUser
    '__FRONTEND_BUILD__'     = ConvertTo-ShellLiteral $FrontendBuildDir
    '__NGINX_SITE__'         = ConvertTo-ShellLiteral $NginxSiteName
    '__REMOTE_HOME__'        = ConvertTo-ShellLiteral $remoteUserHome
}

$scriptHeader = @'
set -euo pipefail 2>/dev/null || set -eu
SUDO_PASSWORD='__SUDO_PASSWORD__'
run_sudo() {
  echo "$SUDO_PASSWORD" | sudo -S -p '' "$@"
}

'@

try {
Write-Info "Verificando espacio libre en el servidor"
Assert-RemoteSpace -Path "/" -RequiredMB 2048 -Label "/"
Assert-RemoteSpace -Path $remoteUserHome -RequiredMB 512 -Label $remoteUserHome
Write-Info "Espacio suficiente, iniciando despliegue"
Write-Info "Instalando dependencias básicas en el servidor"
$installScript = $scriptHeader + @'
export DEBIAN_FRONTEND=noninteractive
ensure_gpg() {
    if ! command -v gpgv >/dev/null 2>&1; then
        run_sudo apt-get install -y --allow-unauthenticated gpgv gnupg || run_sudo apt-get install -y gpgv gnupg || true
    fi
}
ensure_gpg
run_sudo apt-get clean || true
run_sudo rm -rf /var/lib/apt/lists/* || true
if ! run_sudo apt-get update; then
    ensure_gpg
    if ! run_sudo apt-get update -o Acquire::AllowInsecureRepositories=true; then
        echo "WARNING: apt-get update no pudo completarse; se continuará con listas en caché." >&2
    fi
fi
run_sudo apt-get install -y git curl build-essential nginx rsync gnupg gpgv || run_sudo apt-get install -y --allow-unauthenticated git curl build-essential nginx rsync gnupg gpgv
if command -v node >/dev/null 2>&1; then
  NODE_MAJOR=$(node -v | sed 's/^v\([0-9]*\).*/\1/')
else
  NODE_MAJOR=0
fi
if [ "$NODE_MAJOR" -lt 18 ]; then
  curl -fsSL https://deb.nodesource.com/setup_18.x -o /tmp/nodesource_setup.sh
  run_sudo bash /tmp/nodesource_setup.sh
  rm -f /tmp/nodesource_setup.sh
  run_sudo apt-get install -y nodejs
fi
if ! command -v pm2 >/dev/null 2>&1; then
  run_sudo npm install -g pm2
fi
run_sudo systemctl enable nginx
'@
Invoke-RemoteScript -Content (Apply-Replacements -Text $installScript -Map $replacements) -TimeOutSeconds 900

Write-Info "Verificando o clonando el repositorio remoto"
$repoScript = $scriptHeader + @'
mkdir -p '__REMOTE_REPO_PARENT__'
if [ ! -d '__REMOTE_REPO_DIR__/.git' ]; then
    rm -rf '__REMOTE_REPO_DIR__'
    git clone '__REPO_URL__' '__REMOTE_REPO_DIR__'
fi
cd '__REMOTE_REPO_DIR__'
git remote set-url origin '__REPO_URL__'
git reset --hard HEAD || true
git clean -fd || true
git fetch origin --prune
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo main)
if [ "$CURRENT_BRANCH" = "HEAD" ] || [ -z "$CURRENT_BRANCH" ]; then
    CURRENT_BRANCH=main
fi
git checkout "$CURRENT_BRANCH" || git checkout -b "$CURRENT_BRANCH" "origin/$CURRENT_BRANCH"
git reset --hard "origin/$CURRENT_BRANCH" || git pull --ff-only
'@
Invoke-RemoteScript -Content (Apply-Replacements -Text $repoScript -Map $replacements) -TimeOutSeconds 300

Write-Info "Preparando la carpeta remota de videos"
$videosScript = $scriptHeader + @'
run_sudo mkdir -p '__REMOTE_VIDEOS_DIR__'
run_sudo chown -R '__SSH_USER__':'__SSH_USER__' '__REMOTE_VIDEOS_DIR__'
'@
Invoke-RemoteScript -Content (Apply-Replacements -Text $videosScript -Map $replacements) -TimeOutSeconds 300

Write-Info "Instalando dependencias y reiniciando backend con PM2"
$backendScript = $scriptHeader + @'
cd '__REMOTE_REPO_DIR__/backend'
npm install --production
if [ -f .env ]; then
  npx prisma migrate deploy || echo "Advertencia: prisma migrate deploy falló. Revisa DATABASE_URL." >&2
  npx prisma generate || true
else
  echo "backend/.env no existe. Copia tus credenciales antes de ejecutar Prisma." >&2
fi
if pm2 list | grep -q magic-backend; then
  pm2 restart magic-backend --update-env --cwd '__REMOTE_REPO_DIR__/backend'
else
  pm2 start src/server.js --name magic-backend --cwd '__REMOTE_REPO_DIR__/backend'
fi
pm2 save
run_sudo env PATH="$PATH" pm2 startup systemd -u '__SSH_USER__' --hp '__REMOTE_HOME__' >/dev/null || true
'@
Invoke-RemoteScript -Content (Apply-Replacements -Text $backendScript -Map $replacements) -TimeOutSeconds 1200

Write-Info "Construyendo frontend y publicando archivos estáticos"
$frontendScript = $scriptHeader + @'
cd '__REMOTE_REPO_DIR__/apps/accessible-usable'
npm install
npm run build
run_sudo mkdir -p '__FRONTEND_BUILD__'
run_sudo rsync -a --delete build/ '__FRONTEND_BUILD__'/
'@
Invoke-RemoteScript -Content (Apply-Replacements -Text $frontendScript -Map $replacements) -TimeOutSeconds 1800

Write-Info "Configurando Nginx"
$nginxScript = $scriptHeader + @'
run_sudo bash -c "cat <<'NGINX' > /etc/nginx/sites-available/__NGINX_SITE__
server {
    listen 80;
    server_name _;

    root __FRONTEND_BUILD__;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location / {
        try_files \$uri /index.html;
    }
}
NGINX"
run_sudo ln -sf /etc/nginx/sites-available/__NGINX_SITE__ /etc/nginx/sites-enabled/__NGINX_SITE__
if [ -f /etc/nginx/sites-enabled/default ]; then
  run_sudo rm /etc/nginx/sites-enabled/default
fi
run_sudo nginx -t
run_sudo systemctl reload nginx
'@
Invoke-RemoteScript -Content (Apply-Replacements -Text $nginxScript -Map $replacements) -TimeOutSeconds 300

Write-Info "Despliegue completado correctamente"

}

finally {
    if ($sshSession) { Remove-SSHSession -SessionId $sshSession.SessionId -ErrorAction SilentlyContinue }
}
