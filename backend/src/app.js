require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const cardRoutes = require('./routes/cardRoutes');
const deckRoutes = require('./routes/deckRoutes');

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// CORS
// Permitir múltiples orígenes en desarrollo (3000, 3001, 3002)
const corsOptions = {
  credentials: true
};

const normalizeOrigin = (value = '') => String(value || '').trim().replace(/\/$/, '');

const getAllowedOrigins = () => {
  const configured = process.env.CORS_ORIGIN || 'http://localhost:3000';
  return configured
    .split(',')
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);
};

if (process.env.NODE_ENV === 'development') {
  // En desarrollo, permitir cualquier origen para facilitar pruebas en LAN
  corsOptions.origin = (origin, callback) => {
    callback(null, true);
  };
} else {
  // En producción, permitir los orígenes configurados en CORS_ORIGIN separados por comas
  const allowedOrigins = getAllowedOrigins();
  corsOptions.origin = (origin, callback) => {
    // Permitir requests sin origin (curl, health checks, server-to-server)
    if (!origin) {
      callback(null, true);
      return;
    }

    const normalizedOrigin = normalizeOrigin(origin);
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
      return;
    }

    callback(new Error('CORS no permitido'));
  };
}

app.use(cors(corsOptions));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger simple (desactivado en tests)
if (process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// RUTAS
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'MTG-Nexus-Hub API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/decks', deckRoutes);

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado'
  });
});

// ============================================
// MANEJO DE ERRORES GLOBAL
// ============================================

app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('Error no manejado:', err);
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
