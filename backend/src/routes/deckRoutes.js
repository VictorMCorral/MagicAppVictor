const express = require('express');
const {
  getMyDecks,
  getDeckById,
  createDeck,
  updateDeck,
  deleteDeck,
  addCardToDeck,
  updateCardQuantity,
  removeCardFromDeck,
  createDeckValidation
} = require('../controllers/deckController');
const {
  importDeck,
  exportDeck
} = require('../controllers/deckImportExportController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas de mazos requieren autenticación
router.use(authenticate);

// CRUD de mazos
router.get('/', getMyDecks);
router.get('/:id', getDeckById);
router.post('/', createDeckValidation, createDeck);
router.put('/:id', updateDeck);
router.delete('/:id', deleteDeck);

// Gestión de cartas en mazos
router.post('/:id/cards', addCardToDeck);
router.put('/:id/cards/:cardId', updateCardQuantity);
router.delete('/:id/cards/:cardId', removeCardFromDeck);

// Importar/Exportar
router.post('/:id/import', importDeck);
router.get('/:id/export', exportDeck);

module.exports = router;
