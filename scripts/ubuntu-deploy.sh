#!/bin/bash

# MTG Nexus Hub - Script de Despliegue Manual (Sin Docker) para Ubuntu
# Instala Node.js, PostgreSQL, Nginx y PM2 para desplegar la aplicación.

set -e

echo "----------------------------------------------------"
echo "🚀 Iniciando despliegue manual de MTG Nexus Hub"
echo "----------------------------------------------------"

# 1. Actualizar el código desde el repositorio (Forzando coincidencia con main)
echo "🔄 Sincronizando código con el repositorio (Hard Reset)..."
git fetch --all
git reset --hard origin/main

# 2. Actualizar el sistema (opcional/rápido)
echo "📦 Comprobando actualizaciones del sistema..."
sudo apt-get update -y

# 3. Instalar dependencias básicas
echo "🛠️ Comprobando dependencias básicas..."
sudo apt-get install -y curl git build-essential openssl

# 3. Instalar Node.js (v18)
if ! [ -x "$(command -v node)" ]; then
    echo "🟢 Instalando Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "✅ Node.js instalado: $(node -v)"
else
    echo "✅ Node.js ya está instalado: $(node -v)"
fi

# 4. Instalar PostgreSQL
if ! [ -x "$(command -v psql)" ]; then
    echo "🐘 Instalando PostgreSQL..."
    sudo apt-get install -y postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    echo "✅ PostgreSQL instalado."
else
    echo "✅ PostgreSQL ya está instalado."
fi

# 5. Instalar Nginx y PM2
echo "🌐 Instalando Nginx y PM2..."
sudo apt-get install -y nginx
sudo npm install -g pm2
echo "✅ Nginx y PM2 instalados."

# 6. Configurar variables de entorno y Base de Datos
echo "⚙️ Configurando variables de entorno y base de datos..."

# Parámetros
IP_PUBLICA="$1"

if [ -z "$IP_PUBLICA" ]; then
    IP_PUBLICA=$(hostname -I | awk '{print $1}')
fi

echo "📍 Usando IP: $IP_PUBLICA"
DB_NAME="mtg_nexus"
DB_USER="mtg_user"
APP_PATH=$(pwd)

# Gestionar credenciales persistentes con lógica de auto-reparación
if [ -f "$APP_PATH/backend/.env" ]; then
    echo "📄 Intentando recuperar credenciales existentes..."
    DB_URL_LINE=$(grep DATABASE_URL "$APP_PATH/backend/.env" | tr -d '"' | tr -d "'")
    EXTRACTED_PASS=$(echo "$DB_URL_LINE" | sed -n 's/.*:\/\/.*:\(.*\)@.*/\1/p')
    EXTRACTED_JWT=$(grep JWT_SECRET "$APP_PATH/backend/.env" | cut -d'=' -f2- | tr -d '"' | tr -d "'")
    
    if [[ -z "$EXTRACTED_PASS" || "$EXTRACTED_PASS" == *"@"* || "$EXTRACTED_PASS" == *":"* ]]; then
        echo "⚠️ Credenciales corruptas detectadas. Regenerando..."
        DB_PASS=$(openssl rand -base64 12 | tr -dc 'a-zA-Z0-9' | head -c 12)
        JWT_SECRET=$(openssl rand -base64 32)
    else
        DB_PASS=$EXTRACTED_PASS
        JWT_SECRET=$EXTRACTED_JWT
        echo "✅ Credenciales recuperadas correctamente."
    fi
else
    echo "🔑 Generando nuevas credenciales iniciales..."
    DB_PASS=$(openssl rand -base64 12 | tr -dc 'a-zA-Z0-9' | head -c 12)
    JWT_SECRET=$(openssl rand -base64 32)
fi

# Crear base de datos y usuario
echo "🐘 Asegurando base de datos y permisos..."
sudo -u postgres psql <<PSQL
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = '$DB_USER') THEN
        CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';
    ELSE
        ALTER USER $DB_USER WITH PASSWORD '$DB_PASS';
    END IF;
END
\$\$;
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
PSQL

sudo -u postgres psql -c "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

# 7. Configurar Backend
echo "🏗️ Configurando Backend..."
cd $APP_PATH/backend

# Crear .env para el backend
cat <<EOT > .env
NODE_ENV=production
PORT=5000
DATABASE_URL="postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME?schema=public"
JWT_SECRET="$JWT_SECRET"
CORS_ORIGIN="http://$IP_PUBLICA"
EOT

echo "📦 Instalando dependencias del backend..."
npm install
echo "🔄 Ejecutando Prisma..."
npx prisma generate
npx prisma migrate deploy
echo "🌱 Ejecutando seed de datos demo (admin/admin)..."
node scripts/seed-demo-data.js || echo "⚠️  Seed omitido (puede que ya existan los datos)."

# Iniciar o reiniciar con PM2
pm2 stop mtg-backend 2>/dev/null || true
pm2 start src/server.js --name mtg-backend --update-env
echo "✅ Backend configurado e iniciado con PM2."

# 8. Configurar Frontend (Aplicación Principal - Accesible y Usable)
echo "🎨 Configurando Frontend (apps/accessible-usable)..."
cd $APP_PATH/apps/accessible-usable

# Crear .env para el frontend (importante antes del build)
cat <<EOT > .env
REACT_APP_API_URL=http://$IP_PUBLICA:5000/api
EOT

echo "📦 Instalando dependencias del frontend..."
npm install
echo "🏗️ Construyendo el frontend para producción (con límite de memoria aumentado)..."
NODE_OPTIONS="--max-old-space-size=2048" npm run build

# 9. Configurar Nginx para servir el Frontend y actuar como Proxy
echo "🌐 Configurando Nginx y permisos..."
NGINX_CONF="/etc/nginx/sites-available/mtg-nexus"
PUBLIC_WEB_ROOT="/var/www/mtg-nexus"

# Crear directorio público y copiar archivos (evita problemas de permisos en /home)
sudo mkdir -p $PUBLIC_WEB_ROOT
sudo cp -r $APP_PATH/apps/accessible-usable/build/* $PUBLIC_WEB_ROOT/
sudo chown -R www-data:www-data $PUBLIC_WEB_ROOT
sudo chmod -R 755 $PUBLIC_WEB_ROOT

cat <<EOT | sudo tee $NGINX_CONF > /dev/null
server {
    listen 80;
    server_name $IP_PUBLICA;

    # Directorio de los archivos construidos del frontend
    location / {
        root $PUBLIC_WEB_ROOT;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }

    # Proxy para la API del backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOT

# Habilitar el sitio y reiniciar Nginx
sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# 10. Persistencia de PM2
echo "💾 Configurando persistencia de PM2..."
pm2 save
# Generar y ejecutar el comando de startup para el usuario actual
# Esto evita el error de 'pm2-root.service' al detectar correctamente al usuario
STARTUP_CMD=$(pm2 startup systemd -u $USER --hp $HOME | grep "sudo env" || true)
if [ -n "$STARTUP_CMD" ]; then
    echo "🔄 Configurando inicio automático..."
    eval "$STARTUP_CMD"
fi

echo "----------------------------------------------------"
echo "🎉 Despliegue manual completado con éxito!"
echo "📡 La aplicación está disponible en:"
echo "   - Frontend: http://$IP_PUBLICA"
echo "   - Backend API: http://$IP_PUBLICA:5000"
echo "----------------------------------------------------"
echo "Logs del backend: pm2 logs mtg-backend"
echo "Estado de servicios: pm2 list"
echo "----------------------------------------------------"