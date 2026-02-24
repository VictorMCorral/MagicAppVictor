# Usar Nginx para servir el contenido
FROM nginx:alpine

# Copiar tus archivos a la carpeta que Nginx usa por defecto
COPY . /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Nginx se arranca solo por defecto