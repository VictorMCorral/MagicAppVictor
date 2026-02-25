# --- Stage 1: Build Backend ---
FROM node:18-slim AS backend-builder
WORKDIR /app/backend

# Dependencias para Prisma y compilación
RUN apt-get update && apt-get install -y openssl python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY backend/package*.json ./
RUN npm install
COPY backend/ .
RUN npx prisma generate

# --- Stage 2: Build Frontend ---
FROM node:18-slim AS frontend-builder
WORKDIR /app

# Argumento para la URL de la API (por defecto localhost:5000/api)
ARG REACT_APP_API_URL=http://localhost:5000/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Copiar y construir frontend unificado
COPY apps/accessible-usable/package*.json ./apps/accessible-usable/
RUN cd apps/accessible-usable && npm install
COPY apps/accessible-usable/ ./apps/accessible-usable/
RUN cd apps/accessible-usable && npm run build

# --- Stage 3: Runtime Stage ---
FROM node:18-slim
WORKDIR /app

# Instalar Nginx y dependencias de runtime para el backend
RUN apt-get update && apt-get install -y nginx openssl && rm -rf /var/lib/apt/lists/*

# Copiar el backend construido
COPY --from=backend-builder /app/backend ./backend

# Copiar la build del frontend unificado
RUN mkdir -p /usr/share/nginx/html/app
COPY --from=frontend-builder /app/apps/accessible-usable/build /usr/share/nginx/html/app

# Configurar Nginx para frontend unificado
RUN echo ' \
server { \
    listen 3000; \
    location / { \
        root /usr/share/nginx/html/app; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/sites-available/default && \
ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Script de inicio para lanzar Nginx y el Backend
RUN echo "#!/bin/sh\n\
nginx\n\
cd /app/backend\n\
# Intentar aplicar migraciones y cargar datos de inicio (admin/admin)\n\
npx prisma migrate deploy || echo 'Saltando migraciones...'\n\
node scripts/seed-demo-data.js || echo 'Saltando seeding...'\n\
npm start" > /app/start.sh && chmod +x /app/start.sh

# Exponer los puertos: frontend (3000) y backend (5000)
EXPOSE 3000 5000

CMD ["/app/start.sh"]
