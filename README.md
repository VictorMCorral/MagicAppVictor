# MTG-Nexus-Hub

**Versión:** 1.0.0 - MVP Core

Plataforma integral para jugadores, coleccionistas y vendedores de Magic: The Gathering con gestión de mazos, escaneo OCR y tablero virtual manual.

## 🚀 Características v1.0 - MVP Core

- ✅ Buscador de cartas integrado con Scryfall API
- ✅ Creador y gestor de mazos
- ✅ Autenticación de usuarios (JWT)
- ✅ Importación/Exportación de mazos en formato .txt

## 🛠️ Stack Tecnológico

### Frontend
- **React.js** 18+
- **Tailwind CSS** - Estilos
- **Lucide Icons** - Iconografía
- **Axios** - Cliente HTTP

### Backend
- **Node.js** 18+
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos
- **Prisma ORM** - ORM para PostgreSQL
- **JWT** - Autenticación

### APIs Externas
- **Scryfall API** - Datos de cartas y precios de Cardmarket

## 📁 Estructura del Proyecto

```
MTG-Nexus-Hub/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Lógica de negocio
│   │   ├── routes/           # Definición de rutas
│   │   ├── services/         # Integraciones externas (Scryfall)
│   │   ├── middleware/       # Auth, validaciones
│   │   ├── utils/            # Utilidades y helpers
│   │   └── server.js         # Punto de entrada
│   ├── prisma/
│   │   └── schema.prisma     # Esquema de base de datos
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── pages/           # Páginas principales
│   │   ├── services/        # Servicios API
│   │   ├── hooks/           # Custom hooks
│   │   ├── context/         # Context API (Auth)
│   │   └── App.jsx
│   ├── public/
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

## 🔧 Instalación y Configuración

### Requisitos Previos
- Node.js 18 o superior
- PostgreSQL 14 o superior
- npm o yarn

### Backend

```bash
cd backend
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Ejecutar migraciones de Prisma
npx prisma migrate dev

# Iniciar servidor de desarrollo
npm run dev
```

### Frontend

```bash
cd frontend
npm install

# Iniciar aplicación React
npm start
```

## 🔑 Variables de Entorno

### Backend (.env)
```
DATABASE_URL="postgresql://user:password@localhost:5432/mtg_nexus"
JWT_SECRET="tu_secreto_super_seguro"
PORT=5000
NODE_ENV=development
```

## 📡 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login de usuario

### Cartas (Scryfall)
- `GET /api/cards/search?q={query}` - Buscar cartas
- `GET /api/cards/:id` - Obtener carta por ID

### Mazos
- `GET /api/decks` - Listar mazos del usuario
- `POST /api/decks` - Crear nuevo mazo
- `GET /api/decks/:id` - Obtener mazo específico
- `PUT /api/decks/:id` - Actualizar mazo
- `DELETE /api/decks/:id` - Eliminar mazo
- `POST /api/decks/:id/cards` - Añadir carta al mazo
- `DELETE /api/decks/:id/cards/:cardId` - Eliminar carta del mazo
- `POST /api/decks/:id/import` - Importar mazo desde .txt
- `GET /api/decks/:id/export` - Exportar mazo a .txt

## 🎯 Roadmap

### v2.0 - Inventory & Scan
- Escaneo por cámara (OCR)
- Gestión de colección personal
- Sincronización de precios Cardmarket

### v3.0 - Playroom
- Tablero virtual manual
- Salas multijugador via WebSockets
- Contador de vida y estados

## 📄 Licencia

MIT License - Ver LICENSE para más detalles

## 👥 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría realizar.

---

**Desarrollado con ❤️ para la comunidad de Magic: The Gathering**
