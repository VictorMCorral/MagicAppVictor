# 📊 Estructura Completa del Proyecto - MTG Nexus Hub v1.0 MVP

```
MagicAppVictor/
│
├── 📄 README.md                      # Documentación principal del proyecto
├── 📄 INSTALLATION.md                # Guía de instalación paso a paso
├── 📄 ARCHITECTURE.md                # Arquitectura y decisiones técnicas
├── 📄 TESTING.md                     # Guía de pruebas y QA
├── 📄 SCRIPTS.md                     # Scripts útiles de desarrollo
├── 📄 .gitignore                     # Archivos ignorados por Git
├── 📄 informacion_extra.json         # Requisitos y roadmap del proyecto
├── 📄 Prompt.txt                     # Prompt original
│
├── 📁 Imagenes_IA_/                  # Imágenes de referencia
│   ├── ChatGPT Image 3 feb 2026, 20_45_34.png
│   ├── ChatGPT Image 3 feb 2026, 20_59_07 copy.png
│   ├── ChatGPT Image 3 feb 2026, 20_59_07.png
│   ├── Gemini_Generated_Image_ss7du6ss7du6ss7d.png
│   ├── unnamed (1).jpg
│   └── unnamed.jpg
│
├── 📁 Wireframes/                    # Wireframes Excalidraw
│   ├── H01.excalidraw
│   ├── H02.excalidraw
│   ├── H03.excalidraw
│   ├── H04.excalidraw
│   └── H05.excalidraw
│
├── 📁 backend/                       # ⚙️ SERVIDOR BACKEND
│   │
│   ├── 📁 prisma/
│   │   └── 📄 schema.prisma          # Esquema de base de datos
│   │       ├── User (usuarios)
│   │       ├── Deck (mazos)
│   │       └── DeckCard (cartas en mazos)
│   │
│   ├── 📁 src/
│   │   │
│   │   ├── 📁 controllers/           # 🎮 Controladores (lógica de negocio)
│   │   │   ├── 📄 authController.js
│   │   │   │   ├── register()        # Registro de usuarios
│   │   │   │   ├── login()           # Login con JWT
│   │   │   │   └── getProfile()      # Perfil del usuario
│   │   │   │
│   │   │   ├── 📄 cardController.js
│   │   │   │   ├── searchCards()     # Buscar cartas en Scryfall
│   │   │   │   ├── getCardById()     # Obtener carta por ID
│   │   │   │   ├── getCardByName()   # Búsqueda exacta
│   │   │   │   ├── findCardByName()  # Búsqueda fuzzy
│   │   │   │   ├── autocomplete()    # Autocompletado
│   │   │   │   ├── searchByColors()  # Filtrar por colores
│   │   │   │   └── searchByFormat()  # Filtrar por formato
│   │   │   │
│   │   │   ├── 📄 deckController.js
│   │   │   │   ├── getMyDecks()      # Listar mazos del usuario
│   │   │   │   ├── getDeckById()     # Ver mazo con cartas
│   │   │   │   ├── createDeck()      # Crear nuevo mazo
│   │   │   │   ├── updateDeck()      # Actualizar mazo
│   │   │   │   ├── deleteDeck()      # Eliminar mazo
│   │   │   │   ├── addCardToDeck()   # Añadir carta
│   │   │   │   ├── updateCardQuantity() # Actualizar cantidad
│   │   │   │   └── removeCardFromDeck() # Eliminar carta
│   │   │   │
│   │   │   └── 📄 deckImportExportController.js
│   │   │       ├── importDeck()      # Importar desde .txt
│   │   │       └── exportDeck()      # Exportar a .txt
│   │   │
│   │   ├── 📁 routes/                # 🛣️ Definición de rutas
│   │   │   ├── 📄 authRoutes.js      # POST /auth/register, /auth/login
│   │   │   ├── 📄 cardRoutes.js      # GET /cards/search, /cards/:id
│   │   │   └── 📄 deckRoutes.js      # CRUD /decks, /decks/:id/cards
│   │   │
│   │   ├── 📁 services/              # 🔌 Integraciones externas
│   │   │   └── 📄 scryfallService.js
│   │   │       ├── searchCards()
│   │   │       ├── getCardById()
│   │   │       ├── getCardByName()
│   │   │       ├── findCardByName()
│   │   │       ├── autocomplete()
│   │   │       ├── searchByColors()
│   │   │       ├── searchByFormat()
│   │   │       └── normalizeCardData()
│   │   │
│   │   ├── 📁 middleware/            # 🛡️ Middleware
│   │   │   └── 📄 auth.js
│   │   │       └── authenticate()    # Verificación de JWT
│   │   │
│   │   ├── 📁 utils/                 # 🔧 Utilidades
│   │   │   ├── 📄 jwt.js
│   │   │   │   ├── generateToken()
│   │   │   │   └── verifyToken()
│   │   │   │
│   │   │   └── 📄 prisma.js          # Cliente Prisma singleton
│   │   │
│   │   └── 📄 server.js              # 🚀 Servidor Express principal
│   │       ├── Middleware (CORS, body-parser)
│   │       ├── Rutas (/api/auth, /api/cards, /api/decks)
│   │       └── Error handling
│   │
│   ├── 📄 .env.example               # Template de variables de entorno
│   └── 📄 package.json               # Dependencias backend
│       ├── express
│       ├── @prisma/client
│       ├── bcryptjs
│       ├── jsonwebtoken
│       ├── axios
│       └── cors
│
└── 📁 frontend/                      # 🎨 APLICACIÓN REACT
    │
    ├── 📁 public/
    │   └── 📄 index.html             # HTML principal
    │
    ├── 📁 src/
    │   │
    │   ├── 📁 components/            # 🧩 Componentes reutilizables
    │   │   ├── 📄 CardDisplay.jsx    # Tarjeta de carta MTG
    │   │   ├── 📄 Navbar.jsx         # Barra de navegación
    │   │   └── 📄 PrivateRoute.jsx   # HOC para rutas protegidas
    │   │
    │   ├── 📁 pages/                 # 📃 Páginas principales
    │   │   ├── 📄 HomePage.jsx       # / - Landing page
    │   │   ├── 📄 LoginPage.jsx      # /login - Iniciar sesión
    │   │   ├── 📄 RegisterPage.jsx   # /register - Registro
    │   │   ├── 📄 DashboardPage.jsx  # /dashboard - Mis mazos
    │   │   ├── 📄 CardSearchPage.jsx # /cards - Buscador
    │   │   ├── 📄 DeckBuilderPage.jsx # /deck/new - Crear mazo
    │   │   └── 📄 DeckViewPage.jsx   # /deck/:id - Ver/editar mazo
    │   │
    │   ├── 📁 services/              # 🌐 Servicios API
    │   │   ├── 📄 api.js             # Cliente Axios configurado
    │   │   ├── 📄 authService.js
    │   │   │   ├── register()
    │   │   │   ├── login()
    │   │   │   ├── logout()
    │   │   │   ├── getProfile()
    │   │   │   ├── isAuthenticated()
    │   │   │   └── getCurrentUser()
    │   │   │
    │   │   ├── 📄 cardService.js
    │   │   │   ├── searchCards()
    │   │   │   ├── getCardById()
    │   │   │   ├── getCardByName()
    │   │   │   ├── findCardByName()
    │   │   │   ├── autocomplete()
    │   │   │   ├── searchByColors()
    │   │   │   └── searchByFormat()
    │   │   │
    │   │   └── 📄 deckService.js
    │   │       ├── getMyDecks()
    │   │       ├── getDeckById()
    │   │       ├── createDeck()
    │   │       ├── updateDeck()
    │   │       ├── deleteDeck()
    │   │       ├── addCardToDeck()
    │   │       ├── updateCardQuantity()
    │   │       ├── removeCardFromDeck()
    │   │       ├── importDeck()
    │   │       └── exportDeck()
    │   │
    │   ├── 📁 context/               # ⚡ React Context
    │   │   └── 📄 AuthContext.jsx    # Estado global de autenticación
    │   │
    │   ├── 📄 App.jsx                # 🎯 Componente principal
    │   │   └── Router + Routes
    │   │
    │   ├── 📄 index.js               # 🚪 Punto de entrada
    │   └── 📄 index.css              # 🎨 Estilos globales + Tailwind
    │
    ├── 📄 .env.example               # Template de variables de entorno
    ├── 📄 tailwind.config.js         # Configuración Tailwind
    ├── 📄 postcss.config.js          # PostCSS config
    └── 📄 package.json               # Dependencias frontend
        ├── react
        ├── react-router-dom
        ├── axios
        ├── lucide-react
        └── tailwindcss

```

## 🔑 Archivos Clave

### Backend
| Archivo | Propósito | Líneas |
|---------|-----------|--------|
| `server.js` | Servidor Express principal | ~100 |
| `schema.prisma` | Esquema de base de datos | ~80 |
| `scryfallService.js` | Integración Scryfall API | ~250 |
| `authController.js` | Autenticación y registro | ~150 |
| `deckController.js` | CRUD de mazos | ~300 |
| `deckImportExportController.js` | Import/Export .txt | ~200 |

### Frontend
| Archivo | Propósito | Líneas |
|---------|-----------|--------|
| `App.jsx` | Router principal | ~50 |
| `AuthContext.jsx` | Estado global auth | ~60 |
| `DashboardPage.jsx` | Vista de mazos | ~200 |
| `DeckViewPage.jsx` | Detalle de mazo | ~300 |
| `CardSearchPage.jsx` | Buscador de cartas | ~150 |

## 📊 Estadísticas del Proyecto

- **Total de archivos creados:** ~40
- **Líneas de código (estimado):** ~3,500
- **Componentes React:** 7 páginas + 3 componentes
- **Endpoints API:** 20+
- **Modelos de datos:** 3 (User, Deck, DeckCard)

## 🎯 Funcionalidades Implementadas (v1.0 MVP)

✅ **Autenticación**
- Registro de usuarios
- Login con JWT
- Protección de rutas

✅ **Búsqueda de Cartas**
- Integración completa con Scryfall
- Búsqueda por nombre, tipo, color
- Autocompletado
- Vista de detalles

✅ **Gestión de Mazos**
- Crear, ver, editar, eliminar mazos
- Añadir/eliminar cartas
- Estadísticas automáticas (CMC, colores, valor)
- Soporte para formatos (Commander, Modern, etc.)

✅ **Importación/Exportación**
- Importar desde .txt
- Exportar a .txt
- Formato estándar compatible

## 🚀 Próximas Versiones

### v2.0 - Inventory & Scan
- Escaneo OCR de cartas físicas
- Gestión de colección personal
- Seguimiento de precios

### v3.0 - Playroom
- Tablero virtual con WebSockets
- Salas multijugador
- Contador de vida y estados

---

**Estado del Proyecto:** ✅ MVP v1.0 Completado  
**Tecnologías:** React, Node.js, Express, PostgreSQL, Prisma, Tailwind CSS  
**API Externa:** Scryfall API  
**Arquitectura:** REST API + Cliente SPA
