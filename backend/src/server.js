require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT || 5000;

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 MTG-Nexus-Hub API v1.0.0`);
  console.log(`📡 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🔧 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS habilitado para: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
  console.log('='.repeat(50));
  console.log('\n📋 Endpoints disponibles:');
  console.log('  GET  /health');
  console.log('  POST /api/auth/register');
  console.log('  POST /api/auth/login');
  console.log('  GET  /api/auth/profile');
  console.log('  GET  /api/cards/search?q=...');
  console.log('  GET  /api/cards/:id');
  console.log('  GET  /api/decks');
  console.log('  POST /api/decks');
  console.log('  GET  /api/decks/:id');
  console.log('  POST /api/decks/:id/cards');
  console.log('  POST /api/decks/:id/import');
  console.log('  GET  /api/decks/:id/export');
  console.log('\n✨ Listo para recibir peticiones!\n');
});

// Manejo de errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
