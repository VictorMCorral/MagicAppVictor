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

if (process.env.NODE_ENV === 'development') {
  // En desarrollo, acepta localhost en cualquier puerto
  corsOptions.origin = (origin, callback) => {
    // Permitir requests sin origin (como curl o requests del servidor)
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, true);
    } else {
      callback(new Error('CORS no permitido'));
    }
  };
} else {
  // En producción, usar solo el origen configurado
  corsOptions.origin = process.env.CORS_ORIGIN || 'http://localhost:3000';
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
