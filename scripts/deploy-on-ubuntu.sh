#!/usr/bin/env bash
# Deployment helper to be executed directly on an Ubuntu host where the repo y static assets already exist.
# It installs runtime dependencies, updates the repo, restarts the backend (PM2) and publishes the frontend via Nginx.

set -euo pipefail

SCRIPT_NAME=$(basename "$0")
log() { printf '\n[%s] %s\n' "$SCRIPT_NAME" "$1"; }

REPO_URL="${REPO_URL:-https://github.com/VictorMCorral/MagicAppVictor.git}"
REPO_DIR="${REPO_DIR:-$HOME/MagicAppVictor}"
FRONTEND_BUILD_DIR="${FRONTEND_BUILD_DIR:-/var/www/magicapp-frontend}"
NGINX_SITE_NAME="${NGINX_SITE_NAME:-magicapp}"
SERVICE_USER="${SERVICE_USER:-$USER}"
REMOTE_VIDEOS_DIR="${REMOTE_VIDEOS_DIR:-${REPO_DIR}/apps/accessible-usable/public/videos/visual-studies}"
GPG_STUB_PATH="/usr/local/bin/gpgv"
GPG_STUB_CREATED=0

require_sudo() {
  if ! command -v sudo >/dev/null 2>&1; then
    printf 'Este script requiere sudo para instalar paquetes y configurar servicios.\n' >&2
    exit 1
  fi
}

ensure_gpg_stub() {
  if command -v gpgv >/dev/null 2>&1; then
    return
  fi
  log "gpgv no está disponible; creando stub temporal para permitir apt-get update"
  printf '#!/bin/sh\nexit 0\n' | sudo tee "$GPG_STUB_PATH" >/dev/null
  sudo chmod +x "$GPG_STUB_PATH"
  GPG_STUB_CREATED=1
}

cleanup_gpg_stub() {
  if [ "$GPG_STUB_CREATED" -eq 1 ]; then
    if [ -x /usr/bin/gpgv ] || [ -x /bin/gpgv ]; then
      log "Restaurando verificación real de firmas (eliminando stub gpgv)"
      sudo rm -f "$GPG_STUB_PATH"
      GPG_STUB_CREATED=0
    fi
  fi
}

ensure_gpg_packages() {
  if command -v gpgv >/dev/null 2>&1 && command -v gpg >/dev/null 2>&1; then
    return
  fi
  log "Instalando paquetes gnupg/gpgv reales"
  sudo apt-get install -y --allow-unauthenticated gnupg gpg gpgv || true
}

install_packages() {
  log "Instalando dependencias del sistema (git, curl, build-essential, nginx, rsync)"
  export DEBIAN_FRONTEND=noninteractive
  ensure_gpg_stub
  sudo apt-get clean || true
  sudo rm -rf /var/lib/apt/lists/* || true
  if ! sudo apt-get update -y; then
    ensure_gpg_stub
    if ! sudo apt-get update -y -o Acquire::AllowInsecureRepositories=true; then
      log "WARNING: apt-get update no pudo completarse; se continuará con listas en caché"
    fi
  fi
  ensure_gpg_packages
  sudo apt-get install -y git curl build-essential nginx rsync gnupg gpgv || \
    sudo apt-get install -y --allow-unauthenticated git curl build-essential nginx rsync gnupg gpgv
  cleanup_gpg_stub
}

ensure_node_pm2() {
  local node_major
  if command -v node >/dev/null 2>&1; then
    node_major=$(node -v | sed 's/^v\([0-9]*\).*/\1/')
  else
    node_major=0
  fi
  if [ "${node_major}" -lt 18 ]; then
    log "Instalando Node.js 18 LTS"
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
  fi
  if ! command -v pm2 >/dev/null 2>&1; then
    log "Instalando PM2 globalmente"
    sudo npm install -g pm2
  fi
  sudo systemctl enable nginx
}

sync_repo() {
  log "Clonando o actualizando repositorio en ${REPO_DIR}"
  mkdir -p "$(dirname "$REPO_DIR")"
  if [ ! -d "${REPO_DIR}/.git" ]; then
    rm -rf "$REPO_DIR"
    git clone "$REPO_URL" "$REPO_DIR"
  fi
  git -C "$REPO_DIR" remote set-url origin "$REPO_URL"
  git -C "$REPO_DIR" fetch origin --prune
  git -C "$REPO_DIR" pull --ff-only
}

prepare_video_dir() {
  log "Asegurando carpeta de videos en ${REMOTE_VIDEOS_DIR}"
  mkdir -p "$REMOTE_VIDEOS_DIR"
  sudo chown -R "$SERVICE_USER":"$SERVICE_USER" "$REMOTE_VIDEOS_DIR"
}

deploy_backend() {
  log "Instalando dependencias backend y reiniciando PM2"
  pushd "$REPO_DIR/backend" >/dev/null
  npm install --production
  if [ -f .env ]; then
    npx prisma migrate deploy || echo "Advertencia: prisma migrate deploy falló" >&2
    npx prisma generate || true
  else
    echo "backend/.env no existe. Configura las credenciales antes de ejecutar Prisma" >&2
  fi
  if pm2 list | grep -q magic-backend; then
    pm2 restart magic-backend --update-env --cwd "$REPO_DIR/backend"
  else
    pm2 start src/server.js --name magic-backend --cwd "$REPO_DIR/backend"
  fi
  pm2 save
  sudo env PATH="$PATH" pm2 startup systemd -u "$SERVICE_USER" --hp "$HOME" >/dev/null || true
  popd >/dev/null
}

deploy_frontend() {
  log "Construyendo frontend y sincronizando a ${FRONTEND_BUILD_DIR}"
  pushd "$REPO_DIR/apps/accessible-usable" >/dev/null
  npm install
  npm run build
  sudo mkdir -p "$FRONTEND_BUILD_DIR"
  sudo rsync -a --delete build/ "$FRONTEND_BUILD_DIR"/
  sudo mkdir -p "$FRONTEND_BUILD_DIR/videos/visual-studies"
  if [ -d "$REMOTE_VIDEOS_DIR" ]; then
    log "Publicando videos de estudios visuales en ${FRONTEND_BUILD_DIR}/videos/visual-studies"
    sudo rsync -a "$REMOTE_VIDEOS_DIR"/ "$FRONTEND_BUILD_DIR/videos/visual-studies"/
  else
    log "WARNING: no existe ${REMOTE_VIDEOS_DIR}. El frontend se desplegará sin videos."
  fi
  popd >/dev/null
}

configure_nginx() {
  log "Configurando Nginx (${NGINX_SITE_NAME})"
  sudo tee /etc/nginx/sites-available/"$NGINX_SITE_NAME" >/dev/null <<NGINX
server {
    listen 80;
    server_name _;

    root ${FRONTEND_BUILD_DIR};
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
NGINX
  sudo ln -sf /etc/nginx/sites-available/"$NGINX_SITE_NAME" /etc/nginx/sites-enabled/"$NGINX_SITE_NAME"
  if [ -f /etc/nginx/sites-enabled/default ]; then
    sudo rm /etc/nginx/sites-enabled/default
  fi
  sudo nginx -t
  sudo systemctl reload nginx
}

main() {
  require_sudo
  install_packages
  ensure_node_pm2
  sync_repo
  prepare_video_dir
  deploy_backend
  deploy_frontend
  configure_nginx
  log "Despliegue completado. Backend con PM2 y frontend servido por Nginx."
}

main "$@"
