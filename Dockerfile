# --- Stage 1: Build Backend ---
FROM node:18-slim AS backend-builder
WORKDIR /app/backend

# Dependencias para Prisma y compilación
RUN apt-get update && apt-get install -y openssl python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY backend/package*.json ./
RUN npm install
COPY backend/ .
RUN npx prisma generate

# --- Stage 2: Build Frontends ---
FROM node:18-slim AS frontend-builder
WORKDIR /app

# Argumento para la URL de la API (por defecto localhost:5000/api)
ARG REACT_APP_API_URL=http://localhost:5000/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Copiar y construir cada front
# Accessible
COPY apps/accessible-usable/package*.json ./apps/accessible-usable/
RUN cd apps/accessible-usable && npm install
COPY apps/accessible-usable/ ./apps/accessible-usable/
RUN cd apps/accessible-usable && npm run build

# Non-accessible
COPY apps/non-accessible/package*.json ./apps/non-accessible/
RUN cd apps/non-accessible && npm install
COPY apps/non-accessible/ ./apps/non-accessible/
RUN cd apps/non-accessible && npm run build

# Non-usable
COPY apps/non-usable/package*.json ./apps/non-usable/
RUN cd apps/non-usable && npm install
COPY apps/non-usable/ ./apps/non-usable/
RUN cd apps/non-usable && npm run build

# --- Stage 3: Runtime Stage ---
FROM node:18-slim
WORKDIR /app

# Instalar Nginx y dependencias de runtime para el backend
RUN apt-get update && apt-get install -y nginx openssl && rm -rf /var/lib/apt/lists/*

# Copiar el backend construido
COPY --from=backend-builder /app/backend ./backend

# Copiar las builds de los frontends a carpetas específicas
RUN mkdir -p /usr/share/nginx/html/accessible \
             /usr/share/nginx/html/non-accessible \
             /usr/share/nginx/html/non-usable

COPY --from=frontend-builder /app/apps/accessible-usable/build /usr/share/nginx/html/accessible
COPY --from=frontend-builder /app/apps/non-accessible/build /usr/share/nginx/html/non-accessible
COPY --from=frontend-builder /app/apps/non-usable/build /usr/share/nginx/html/non-usable

# Configurar Nginx para escuchar en los 3 puertos solicitados
RUN echo ' \
server { \
    listen 3000; \
    location / { \
        root /usr/share/nginx/html/accessible; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
} \
server { \
    listen 3001; \
    location / { \
        root /usr/share/nginx/html/non-accessible; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
} \
server { \
    listen 3002; \
    location / { \
        root /usr/share/nginx/html/non-usable; \
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

# Exponer los puertos: 3 frontends (3000-3002) y 1 backend (5000)
EXPOSE 3000 3001 3002 5000

CMD ["/app/start.sh"]
