const express = require('express');
const {
  searchCards,
  getCardById,
  getCardByName,
  findCardByName,
  autocomplete,
  searchByColors,
  searchByFormat
} = require('../controllers/cardController');

const router = express.Router();

// Todas las rutas de cartas son públicas (lectura de Scryfall)
router.get('/search', searchCards);
router.get('/autocomplete', autocomplete);
router.get('/by-name', getCardByName);
router.get('/find', findCardByName);
router.get('/by-colors', searchByColors);
router.get('/by-format', searchByFormat);
router.get('/:id', getCardById);

module.exports = router;
