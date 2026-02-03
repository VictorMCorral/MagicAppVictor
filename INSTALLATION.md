# Guía de Instalación y Configuración - MTG Nexus Hub v1.0

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 18 o superior ([Descargar aquí](https://nodejs.org/))
- **PostgreSQL** 14 o superior ([Descargar aquí](https://www.postgresql.org/download/))
- **npm** (incluido con Node.js)

## 🚀 Instalación Paso a Paso

### 1. Configurar Base de Datos PostgreSQL

```bash
# Acceder a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE mtg_nexus;

# Crear usuario (opcional pero recomendado)
CREATE USER mtg_user WITH PASSWORD 'tu_password_seguro';
GRANT ALL PRIVILEGES ON DATABASE mtg_nexus TO mtg_user;

# Salir de psql
\q
```

### 2. Configurar Backend

```bash
# Navegar a la carpeta backend
cd backend

# Instalar dependencias
npm install

# Crear archivo .env desde el ejemplo
copy .env.example .env

# Editar .env con tus configuraciones
# - DATABASE_URL: postgresql://mtg_user:tu_password_seguro@localhost:5432/mtg_nexus?schema=public
# - JWT_SECRET: genera un string aleatorio seguro
# - PORT: 5000 (o el que prefieras)
```

### 3. Ejecutar Migraciones de Prisma

```bash
# Desde la carpeta backend
npx prisma generate
npx prisma migrate dev --name init

# (Opcional) Abrir Prisma Studio para ver la BD
npx prisma studio
```

### 4. Configurar Frontend

```bash
# Navegar a la carpeta frontend (desde la raíz del proyecto)
cd frontend

# Instalar dependencias
npm install

# Crear archivo .env desde el ejemplo
copy .env.example .env

# Editar .env si es necesario
# - REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Iniciar Aplicación

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

El servidor debería iniciar en `http://localhost:5000`

#### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

El frontend debería abrirse automáticamente en `http://localhost:3000`

## 🔧 Configuración Avanzada

### Variables de Entorno Backend (.env)

```env
# Base de Datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/mtg_nexus?schema=public"

# JWT
JWT_SECRET="tu_secreto_super_seguro_cambiar_en_produccion"
JWT_EXPIRES_IN="7d"

# Servidor
PORT=5000
NODE_ENV=development

# CORS
CORS_ORIGIN="http://localhost:3000"
```

### Variables de Entorno Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📱 Probar la Aplicación

1. Abre tu navegador en `http://localhost:3000`
2. Haz clic en "Registrarse" y crea una cuenta
3. Una vez autenticado, ve a "Mis Mazos"
4. Crea tu primer mazo
5. Añade cartas buscándolas por nombre
6. ¡Explora todas las funcionalidades!

## 🔍 Endpoints API Disponibles

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil (requiere auth)

### Cartas (Scryfall)
- `GET /api/cards/search?q={query}` - Buscar cartas
- `GET /api/cards/:id` - Obtener carta por ID
- `GET /api/cards/autocomplete?q={query}` - Autocompletado

### Mazos (requieren autenticación)
- `GET /api/decks` - Listar mis mazos
- `POST /api/decks` - Crear mazo
- `GET /api/decks/:id` - Ver mazo
- `PUT /api/decks/:id` - Actualizar mazo
- `DELETE /api/decks/:id` - Eliminar mazo
- `POST /api/decks/:id/cards` - Añadir carta
- `DELETE /api/decks/:id/cards/:cardId` - Eliminar carta
- `POST /api/decks/:id/import` - Importar desde .txt
- `GET /api/decks/:id/export` - Exportar a .txt

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"
- Verifica que PostgreSQL esté corriendo
- Confirma que la DATABASE_URL en .env sea correcta
- Verifica las credenciales del usuario

### Error: "Port 5000 already in use"
- Cambia el PORT en backend/.env
- O detén el proceso que está usando el puerto 5000

### Error: "CORS policy"
- Verifica que CORS_ORIGIN en backend/.env coincida con la URL del frontend
- Por defecto debe ser `http://localhost:3000`

### Error al importar mazos
- Verifica el formato: `cantidad nombre_carta` (ej: `4 Lightning Bolt`)
- La API de Scryfall tiene rate limiting, importaciones grandes pueden tardar

## 📚 Recursos Adicionales

- [Documentación de Scryfall API](https://scryfall.com/docs/api)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🎯 Próximos Pasos (Roadmap)

### v2.0 - Inventory & Scan
- Escaneo por cámara (OCR con Tesseract.js)
- Gestión de colección personal
- Sincronización automática de precios

### v3.0 - Playroom
- Tablero virtual manual
- Salas multijugador con WebSockets
- Contador de vida y estados de juego

## 💡 Consejos

1. **Desarrollo**: Mantén ambos servidores (backend y frontend) corriendo en terminales separadas
2. **Base de Datos**: Usa Prisma Studio (`npx prisma studio`) para visualizar y editar datos fácilmente
3. **Testing**: Prueba primero con la API directamente usando herramientas como Postman
4. **Scryfall**: La API es gratuita pero tiene rate limiting (50-100ms entre requests)

## 🤝 Contribución

Si encuentras algún bug o quieres proponer mejoras:
1. Abre un issue describiendo el problema/mejora
2. Si quieres contribuir código, crea un fork y envía un pull request

---

¡Disfruta construyendo y gestionando tus mazos de Magic: The Gathering! 🎴✨
