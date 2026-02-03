const axios = require('axios');

const SCRYFALL_API_BASE = 'https://api.scryfall.com';

/**
 * Servicio de integración con la API de Scryfall
 * Documentación: https://scryfall.com/docs/api
 */
class ScryfallService {
  /**
   * Buscar cartas por nombre o texto
   * @param {string} query - Término de búsqueda
   * @param {object} options - Opciones adicionales (página, ordenamiento, etc.)
   * @returns {Promise<object>} - Respuesta de Scryfall
   */
  async searchCards(query, options = {}) {
    try {
      const params = {
        q: query,
        page: options.page || 1,
        order: options.order || 'name',
        unique: options.unique || 'cards',
        ...options
      };

      const response = await axios.get(`${SCRYFALL_API_BASE}/cards/search`, {
        params,
        timeout: 10000
      });

      return {
        success: true,
        data: response.data.data,
        total_cards: response.data.total_cards,
        has_more: response.data.has_more,
        next_page: response.data.next_page || null
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          success: true,
          data: [],
          total_cards: 0,
          has_more: false,
          message: 'No se encontraron cartas con esos criterios'
        };
      }

      throw new Error(`Error al buscar cartas en Scryfall: ${error.message}`);
    }
  }

  /**
   * Obtener una carta por su ID de Scryfall
   * @param {string} id - ID de Scryfall
   * @returns {Promise<object>} - Datos de la carta
   */
  async getCardById(id) {
    try {
      const response = await axios.get(`${SCRYFALL_API_BASE}/cards/${id}`, {
        timeout: 10000
      });

      return {
        success: true,
        data: this.normalizeCardData(response.data)
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Carta no encontrada');
      }
      throw new Error(`Error al obtener carta: ${error.message}`);
    }
  }

  /**
   * Buscar carta por nombre exacto
   * @param {string} cardName - Nombre exacto de la carta
   * @returns {Promise<object>} - Datos de la carta
   */
  async getCardByName(cardName) {
    try {
      const response = await axios.get(`${SCRYFALL_API_BASE}/cards/named`, {
        params: { exact: cardName },
        timeout: 10000
      });

      return {
        success: true,
        data: this.normalizeCardData(response.data)
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`No se encontró la carta "${cardName}"`);
      }
      throw new Error(`Error al buscar carta: ${error.message}`);
    }
  }

  /**
   * Buscar carta por nombre (fuzzy search - búsqueda aproximada)
   * @param {string} cardName - Nombre aproximado de la carta
   * @returns {Promise<object>} - Datos de la carta
   */
  async findCardByName(cardName) {
    try {
      const response = await axios.get(`${SCRYFALL_API_BASE}/cards/named`, {
        params: { fuzzy: cardName },
        timeout: 10000
      });

      return {
        success: true,
        data: this.normalizeCardData(response.data)
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`No se encontró ninguna carta similar a "${cardName}"`);
      }
      throw new Error(`Error al buscar carta: ${error.message}`);
    }
  }

  /**
   * Obtener autocompletado de nombres de cartas
   * @param {string} query - Texto parcial
   * @returns {Promise<Array>} - Lista de sugerencias
   */
  async autocomplete(query) {
    try {
      const response = await axios.get(`${SCRYFALL_API_BASE}/cards/autocomplete`, {
        params: { q: query },
        timeout: 5000
      });

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      throw new Error(`Error en autocompletado: ${error.message}`);
    }
  }

  /**
   * Buscar cartas por color
   * @param {Array} colors - Array de colores ['W', 'U', 'B', 'R', 'G']
   * @param {string} operator - 'exact', 'including', 'at-most'
   * @returns {Promise<object>} - Resultados
   */
  async searchByColors(colors, operator = 'including') {
    const colorQuery = colors.join('');
    const operatorMap = {
      'exact': '=',
      'including': ':',
      'at-most': '<='
    };

    const query = `c${operatorMap[operator]}${colorQuery}`;
    return this.searchCards(query);
  }

  /**
   * Buscar cartas por formato legal
   * @param {string} format - 'standard', 'modern', 'commander', 'legacy', etc.
   * @returns {Promise<object>} - Resultados
   */
  async searchByFormat(format) {
    const query = `legal:${format}`;
    return this.searchCards(query);
  }

  /**
   * Normalizar datos de carta de Scryfall a nuestro formato
   * @param {object} scryfallCard - Datos de Scryfall
   * @returns {object} - Datos normalizados
   */
  normalizeCardData(scryfallCard) {
    return {
      scryfallId: scryfallCard.id,
      name: scryfallCard.name,
      manaCost: scryfallCard.mana_cost || '',
      type: scryfallCard.type_line,
      rarity: scryfallCard.rarity,
      setCode: scryfallCard.set,
      setName: scryfallCard.set_name,
      imageUrl: scryfallCard.image_uris?.normal || scryfallCard.image_uris?.large || null,
      oracleText: scryfallCard.oracle_text || '',
      colors: scryfallCard.colors || [],
      cmc: scryfallCard.cmc || 0,
      priceEur: scryfallCard.prices?.eur ? parseFloat(scryfallCard.prices.eur) : null,
      priceUsd: scryfallCard.prices?.usd ? parseFloat(scryfallCard.prices.usd) : null,
      // Datos adicionales útiles
      power: scryfallCard.power || null,
      toughness: scryfallCard.toughness || null,
      loyalty: scryfallCard.loyalty || null,
      colorIdentity: scryfallCard.color_identity || [],
      legalities: scryfallCard.legalities || {},
      // URLs
      scryfallUri: scryfallCard.scryfall_uri,
      purchaseUris: scryfallCard.purchase_uris || {}
    };
  }

  /**
   * Validar si una carta es legal en un formato
   * @param {object} card - Carta normalizada
   * @param {string} format - Formato a validar
   * @returns {boolean}
   */
  isLegalInFormat(card, format) {
    return card.legalities?.[format] === 'legal';
  }
}

module.exports = new ScryfallService();
