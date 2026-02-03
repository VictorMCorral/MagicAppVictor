const scryfallService = require('../services/scryfallService');

/**
 * Buscar cartas en Scryfall
 */
const searchCards = async (req, res) => {
  try {
    const { q, page, order, unique } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'El parámetro de búsqueda "q" es requerido'
      });
    }

    const result = await scryfallService.searchCards(q, {
      page: page ? parseInt(page) : 1,
      order,
      unique
    });

    res.json(result);
  } catch (error) {
    console.error('Error en búsqueda de cartas:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al buscar cartas'
    });
  }
};

/**
 * Obtener carta por ID de Scryfall
 */
const getCardById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await scryfallService.getCardById(id);

    res.json(result);
  } catch (error) {
    console.error('Error al obtener carta:', error);
    const statusCode = error.message.includes('no encontrada') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error al obtener carta'
    });
  }
};

/**
 * Buscar carta por nombre exacto
 */
const getCardByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'El parámetro "name" es requerido'
      });
    }

    const result = await scryfallService.getCardByName(name);

    res.json(result);
  } catch (error) {
    console.error('Error al buscar carta por nombre:', error);
    const statusCode = error.message.includes('no encontró') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error al buscar carta'
    });
  }
};

/**
 * Buscar carta por nombre (fuzzy)
 */
const findCardByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'El parámetro "name" es requerido'
      });
    }

    const result = await scryfallService.findCardByName(name);

    res.json(result);
  } catch (error) {
    console.error('Error al buscar carta (fuzzy):', error);
    const statusCode = error.message.includes('no encontró') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error al buscar carta'
    });
  }
};

/**
 * Autocompletado de nombres de cartas
 */
const autocomplete = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'El parámetro "q" es requerido'
      });
    }

    const result = await scryfallService.autocomplete(q);

    res.json(result);
  } catch (error) {
    console.error('Error en autocompletado:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error en autocompletado'
    });
  }
};

/**
 * Buscar cartas por color
 */
const searchByColors = async (req, res) => {
  try {
    const { colors, operator } = req.query;

    if (!colors) {
      return res.status(400).json({
        success: false,
        message: 'El parámetro "colors" es requerido (ej: W,U,B)'
      });
    }

    const colorArray = colors.split(',').map(c => c.trim().toUpperCase());
    const validColors = ['W', 'U', 'B', 'R', 'G', 'C'];
    
    const invalidColors = colorArray.filter(c => !validColors.includes(c));
    if (invalidColors.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Colores inválidos: ${invalidColors.join(', ')}. Usa: W, U, B, R, G, C`
      });
    }

    const result = await scryfallService.searchByColors(colorArray, operator || 'including');

    res.json(result);
  } catch (error) {
    console.error('Error al buscar por colores:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al buscar cartas'
    });
  }
};

/**
 * Buscar cartas legales en un formato
 */
const searchByFormat = async (req, res) => {
  try {
    const { format } = req.query;

    if (!format) {
      return res.status(400).json({
        success: false,
        message: 'El parámetro "format" es requerido'
      });
    }

    const result = await scryfallService.searchByFormat(format);

    res.json(result);
  } catch (error) {
    console.error('Error al buscar por formato:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al buscar cartas'
    });
  }
};

module.exports = {
  searchCards,
  getCardById,
  getCardByName,
  findCardByName,
  autocomplete,
  searchByColors,
  searchByFormat
};
