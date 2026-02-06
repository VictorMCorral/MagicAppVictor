# Usar una imagen de Node.js estable
FROM node:18-slim

# Directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema necesarias
RUN apt-get update && apt-get install -y \
    openssl \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (incluyendo dev si es necesario para build pero aquí solo production)
RUN npm install

# Copiar el resto del código
COPY . .

# Generar cliente de Prisma
RUN npx prisma generate

# Exponer el puerto
EXPOSE 5000

# Comando para arrancar: Aplicar migraciones y luego iniciar el servidor
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
