# Arquitectura del Proyecto - MTG Nexus Hub v1.0 MVP

## 📐 Visión General de la Arquitectura

MTG Nexus Hub sigue una arquitectura **Cliente-Servidor** con separación clara entre Frontend y Backend, utilizando una **API REST** para la comunicación.

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENTE (Frontend)                      │
│  React.js + Tailwind CSS + Lucide Icons                    │
│  ├─ Context API (Autenticación)                            │
│  ├─ React Router (Navegación)                              │
│  ├─ Axios (HTTP Client)                                    │
│  └─ Services (API Layer)                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/HTTPS (REST API)
                     │
┌────────────────────┴────────────────────────────────────────┐
│                    SERVIDOR (Backend)                        │
│  Node.js + Express.js                                       │
│  ├─ Routes (Endpoints)                                      │
│  ├─ Controllers (Lógica de negocio)                        │
│  ├─ Middleware (Auth, Validación)                          │
│  ├─ Services (Integración Scryfall)                        │
│  └─ Prisma ORM                                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Prisma Client
                     │
┌────────────────────┴────────────────────────────────────────┐
│                BASE DE DATOS (PostgreSQL)                    │
│  ├─ users (Usuarios)                                        │
│  ├─ decks (Mazos)                                           │
│  └─ deck_cards (Cartas en mazos)                           │
└─────────────────────────────────────────────────────────────┘
                     
                     │ HTTP REST API
                     │
┌────────────────────┴────────────────────────────────────────┐
│              API EXTERNA (Scryfall API)                      │
│  Datos de cartas, precios, búsquedas                        │
└─────────────────────────────────────────────────────────────┘
```

## 🗂️ Estructura de Carpetas

### Backend
```
backend/
├── prisma/
│   └── schema.prisma          # Esquema de base de datos
├── src/
│   ├── controllers/           # Lógica de negocio
│   │   ├── authController.js
│   │   ├── cardController.js
│   │   ├── deckController.js
│   │   └── deckImportExportController.js
│   ├── routes/                # Definición de rutas
│   │   ├── authRoutes.js
│   │   ├── cardRoutes.js
│   │   └── deckRoutes.js
│   ├── services/              # Servicios externos
│   │   └── scryfallService.js
│   ├── middleware/            # Middleware personalizado
│   │   └── auth.js
│   ├── utils/                 # Utilidades
│   │   ├── jwt.js
│   │   └── prisma.js
│   └── server.js              # Punto de entrada
├── .env.example
└── package.json
```

### Frontend
```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/            # Componentes reutilizables
│   │   ├── CardDisplay.jsx
│   │   ├── Navbar.jsx
│   │   └── PrivateRoute.jsx
│   ├── pages/                 # Páginas principales
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── CardSearchPage.jsx
│   │   ├── DeckBuilderPage.jsx
│   │   └── DeckViewPage.jsx
│   ├── services/              # Capa de servicios API
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── cardService.js
│   │   └── deckService.js
│   ├── context/               # React Context
│   │   └── AuthContext.jsx
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── .env.example
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🔐 Flujo de Autenticación

```
1. Usuario envía credenciales (email + password)
   │
   ▼
2. Backend valida credenciales
   │
   ├─ ✓ Válidas → Genera JWT Token
   │              └─ Token contiene: { id, email, username }
   │              └─ Expira en 7 días
   │
   └─ ✗ Inválidas → Error 401
   
3. Frontend guarda token en localStorage
   
4. Todas las requests protegidas incluyen:
   Header: Authorization: Bearer {token}
   
5. Middleware auth.js verifica el token
   │
   ├─ ✓ Válido → Permite acceso + añade req.user
   │
   └─ ✗ Inválido/Expirado → Error 401
```

## 🎨 Patrón de Diseño del Backend

### Arquitectura en Capas

1. **Capa de Rutas** (`routes/`)
   - Define endpoints y métodos HTTP
   - Aplica middleware (auth, validaciones)
   - Delega a controladores

2. **Capa de Controladores** (`controllers/`)
   - Maneja request/response
   - Valida entrada con express-validator
   - Ejecuta lógica de negocio
   - Retorna respuestas JSON estandarizadas

3. **Capa de Servicios** (`services/`)
   - Integración con APIs externas (Scryfall)
   - Lógica reutilizable
   - Sin dependencia de HTTP (testeable)

4. **Capa de Datos** (`Prisma ORM`)
   - Acceso a base de datos
   - Migraciones automáticas
   - Type-safe queries

### Formato de Respuestas API

Todas las respuestas siguen este formato:

```json
{
  "success": true/false,
  "message": "Mensaje descriptivo",
  "data": { /* datos */ },
  "errors": [ /* errores de validación */ ]
}
```

## 🎯 Modelo de Datos (Prisma Schema)

### User
```
- id: UUID
- email: String (unique)
- username: String (unique)
- password: String (hash bcrypt)
- createdAt: DateTime
- updatedAt: DateTime
- decks: Deck[] (relación)
```

### Deck
```
- id: UUID
- name: String
- description: String?
- format: String? (Commander, Standard, etc.)
- isPublic: Boolean
- createdAt: DateTime
- updatedAt: DateTime
- userId: UUID (FK a User)
- cards: DeckCard[] (relación)
```

### DeckCard
```
- id: UUID
- quantity: Int
- scryfallId: String
- name: String
- manaCost: String?
- type: String
- rarity: String
- setCode: String
- setName: String
- imageUrl: String?
- oracleText: Text?
- colors: String[]
- cmc: Float
- priceEur: Float?
- priceUsd: Float?
- createdAt: DateTime
- deckId: UUID (FK a Deck)
```

## 🔄 Flujo de Datos Principales

### Buscar Cartas
```
1. Usuario escribe query en frontend
2. Frontend → GET /api/cards/search?q={query}
3. Backend → scryfallService.searchCards()
4. scryfallService → Scryfall API
5. Normaliza datos y retorna
6. Frontend muestra cartas en grid
```

### Añadir Carta a Mazo
```
1. Usuario selecciona carta y mazo
2. Frontend → POST /api/decks/:id/cards
   Body: { scryfallId, quantity }
3. Backend obtiene datos de Scryfall
4. Backend guarda en deck_cards (Prisma)
5. Retorna carta añadida
6. Frontend actualiza vista del mazo
```

### Importar Mazo desde .txt
```
1. Usuario pega deck list en formato:
   4 Lightning Bolt
   2 Counterspell
2. Frontend → POST /api/decks/:id/import
   Body: { deckList: "..." }
3. Backend parsea líneas
4. Para cada línea:
   a. Busca carta en Scryfall (fuzzy search)
   b. Guarda en deck_cards
   c. Espera 100ms (rate limiting)
5. Retorna resumen (éxitos/fallos)
6. Frontend muestra resultados
```

## 🛡️ Seguridad

### Backend
- **Contraseñas**: Hash con bcrypt (10 rounds)
- **JWT**: HS256, secret en variable de entorno
- **CORS**: Configurado para origen específico
- **Validación**: express-validator en todos los inputs
- **SQL Injection**: Protegido por Prisma (prepared statements)

### Frontend
- **Token**: Almacenado en localStorage
- **Interceptor Axios**: Añade token automáticamente
- **Manejo de expiración**: Redirect a /login en 401
- **Rutas protegidas**: HOC PrivateRoute

## 📊 Optimizaciones Implementadas

1. **Cache de datos de cartas**: Una vez añadida a un mazo, se cachea en deck_cards
2. **Índices de BD**: En userId, deckId para queries rápidas
3. **Rate Limiting respetado**: 100ms entre requests a Scryfall
4. **Lazy loading**: Componentes de React con imports dinámicos (preparado)
5. **Validación frontend + backend**: Doble capa de seguridad

## 🚀 Escalabilidad Futura

### v2.0 - Preparado para:
- Upload de imágenes (Multer + S3)
- OCR con Tesseract.js (worker threads)
- Gestión de colecciones (nuevas tablas Prisma)

### v3.0 - Preparado para:
- WebSockets con Socket.io (ya en stack)
- Redis para cache y sessions
- Tablero virtual (state management complejo)

## 🧪 Testing (Preparado para)

### Backend
- Jest para unit tests
- Supertest para integration tests
- Prisma mock para tests de DB

### Frontend
- Jest + React Testing Library
- Cypress para E2E tests

## 📈 Métricas y Monitoreo (Futuro)

- Morgan para logs HTTP
- Winston para logs estructurados
- Sentry para error tracking
- Analytics de uso de mazos

---

**Autor:** Senior Fullstack Developer  
**Versión:** 1.0.0 - MVP Core  
**Fecha:** 2026
