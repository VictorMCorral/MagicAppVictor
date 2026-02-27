#!/usr/bin/env bash
# Automated SSH deployment script for MagicAppVictor without containers.
# Depends on sshpass, scp, and rsync on the local machine.

set -euo pipefail

SCRIPT_NAME=$(basename "$0")
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

SSH_USER="${SSH_USER:-diego}"
SSH_HOST="${SSH_HOST:-192.168.5.51}"
SSH_PASSWORD="${SSH_PASSWORD:-Prieto*2}"
REPO_URL="${REPO_URL:-https://github.com/VictorMCorral/MagicAppVictor.git}"

REMOTE_REPO_DIR="${REMOTE_REPO_DIR:-/MagicAppVictor}"
REMOTE_REPO_PARENT="$(dirname "$REMOTE_REPO_DIR")"
REMOTE_VIDEOS_DIR="${REMOTE_VIDEOS_DIR:-${REMOTE_REPO_DIR}/apps/accessible-usable/public/videos/visual-studies}"
FRONTEND_BUILD_DIR="${FRONTEND_BUILD_DIR:-/var/www/magicapp-frontend}"
NGINX_SITE_NAME="${NGINX_SITE_NAME:-magicapp}"

REQUIRED_CMDS=(sshpass git)

echo_info() {
  printf '\n[%s] %s\n' "$SCRIPT_NAME" "$1"
}

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

require_commands() {
  local missing=()
  for cmd in "${REQUIRED_CMDS[@]}"; do
    if ! command_exists "$cmd"; then
      missing+=("$cmd")
    fi
  done

  if [ "${#missing[@]}" -gt 0 ]; then
    printf 'Missing required commands: %s\n' "${missing[*]}" >&2
    printf 'Install them via your package manager (e.g., apt, brew, choco) and retry.\n' >&2
    exit 1
  fi
}

remote_bash() {
  sshpass -p "$SSH_PASSWORD" ssh \
    -o StrictHostKeyChecking=no \
    -o UserKnownHostsFile=/dev/null \
    "$SSH_USER@$SSH_HOST" \
    REMOTE_REPO_DIR="$REMOTE_REPO_DIR" \
    REMOTE_REPO_PARENT="$REMOTE_REPO_PARENT" \
    REMOTE_VIDEOS_DIR="$REMOTE_VIDEOS_DIR" \
    REPO_URL="$REPO_URL" \
    FRONTEND_BUILD_DIR="$FRONTEND_BUILD_DIR" \
    NGINX_SITE_NAME="$NGINX_SITE_NAME" \
    SSH_USER_NAME="$SSH_USER" \
    bash -se
}

install_remote_prereqs() {
  echo_info "Installing base packages, Node.js 18+, and PM2 on $SSH_HOST"
  remote_bash <<'EOF'
set -euo pipefail
export DEBIAN_FRONTEND=noninteractive
sudo apt-get update -y
sudo apt-get install -y git curl build-essential nginx rsync
if command -v node >/dev/null 2>&1; then
  NODE_MAJOR=$(node -v | sed 's/^v\([0-9]*\).*/\1/')
else
  NODE_MAJOR=0
fi
if [ "$NODE_MAJOR" -lt 18 ]; then
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
if ! command -v pm2 >/dev/null 2>&1; then
  sudo npm install -g pm2
fi
sudo systemctl enable nginx
EOF
}

ensure_remote_repo() {
  echo_info "Ensuring MagicAppVictor repository exists on $SSH_HOST"
  remote_bash <<'EOF'
set -euo pipefail
mkdir -p "$REMOTE_REPO_PARENT"
if [ ! -d "$REMOTE_REPO_DIR/.git" ]; then
  git clone "$REPO_URL" "$REMOTE_REPO_DIR"
fi
cd "$REMOTE_REPO_DIR"
git fetch origin --prune
git pull --ff-only
EOF
}

prepare_remote_video_dir() {
  echo_info "Preparing remote videos directory"
  remote_bash <<'EOF'
set -euo pipefail
mkdir -p "$REMOTE_VIDEOS_DIR"
sudo chown -R "$SSH_USER_NAME":"$SSH_USER_NAME" "$REMOTE_VIDEOS_DIR"
EOF
}

deploy_backend() {
  echo_info "Installing backend dependencies, running Prisma, and restarting PM2"
  remote_bash <<'EOF'
set -euo pipefail
cd "$REMOTE_REPO_DIR/backend"
npm install --production
if [ -f .env ]; then
  ENV_READY=1
elif [ -f .env.example ]; then
  cp .env.example .env
  echo "backend/.env missing. Copied .env.example; update credentials manually." >&2
  ENV_READY=0
else
  ENV_READY=0
  echo "backend/.env missing and no template found." >&2
fi
if [ "$ENV_READY" -eq 1 ]; then
  npx prisma migrate deploy || echo "Warning: prisma migrate deploy failed (check DATABASE_URL)." >&2
  npx prisma generate || true
else
  echo "Skipping Prisma commands until backend/.env is configured." >&2
fi
if pm2 list | grep -q magic-backend; then
  pm2 restart magic-backend --update-env --cwd "$REMOTE_REPO_DIR/backend"
else
  pm2 start src/server.js --name magic-backend --cwd "$REMOTE_REPO_DIR/backend"
fi
pm2 save
sudo env PATH=$PATH pm2 startup systemd -u "$SSH_USER_NAME" --hp "/home/$SSH_USER_NAME" >/dev/null || true
EOF
}

deploy_frontend() {
  echo_info "Building frontend and publishing static files"
  remote_bash <<'EOF'
set -euo pipefail
cd "$REMOTE_REPO_DIR/apps/accessible-usable"
npm install
npm run build
sudo mkdir -p "$FRONTEND_BUILD_DIR"
sudo rsync -a --delete build/ "$FRONTEND_BUILD_DIR"/
EOF
}

configure_nginx() {
  echo_info "Configuring Nginx reverse proxy"
  remote_bash <<'EOF'
set -euo pipefail
sudo tee /etc/nginx/sites-available/"$NGINX_SITE_NAME" >/dev/null <<NGINX
server {
    listen 80;
    server_name _;

    root $FRONTEND_BUILD_DIR;
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
EOF
}

main() {
  require_commands
  install_remote_prereqs
  ensure_remote_repo
  prepare_remote_video_dir
  deploy_backend
  deploy_frontend
  configure_nginx
  echo_info "Deployment complete. The frontend is served by Nginx and the backend runs with PM2."
}

main "$@"
