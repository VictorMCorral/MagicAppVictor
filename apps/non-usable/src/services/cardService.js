import api from './api';

/**
 * Servicio para interactuar con la API de cartas (Scryfall)
 */
const cardService = {
  /**
   * Buscar cartas
   */
  searchCards: async (query, options = {}) => {
    const params = new URLSearchParams({
      q: query,
      ...options
    });
    
    const response = await api.get(`/cards/search?${params}`);
    return response.data;
  },

  /**
   * Obtener carta por ID
   */
  getCardById: async (id) => {
    const response = await api.get(`/cards/${id}`);
    return response.data;
  },

  /**
   * Buscar carta por nombre exacto
   */
  getCardByName: async (name) => {
    const response = await api.get('/cards/by-name', {
      params: { name }
    });
    return response.data;
  },

  /**
   * Buscar carta por nombre (fuzzy)
   */
  findCardByName: async (name) => {
    const response = await api.get('/cards/find', {
      params: { name }
    });
    return response.data;
  },

  /**
   * Autocompletado de nombres
   */
  autocomplete: async (query) => {
    const response = await api.get('/cards/autocomplete', {
      params: { q: query }
    });
    return response.data;
  },

  /**
   * Buscar por colores
   */
  searchByColors: async (colors, operator = 'including') => {
    const response = await api.get('/cards/by-colors', {
      params: { colors: colors.join(','), operator }
    });
    return response.data;
  },

  /**
   * Buscar por formato
   */
  searchByFormat: async (format) => {
    const response = await api.get('/cards/by-format', {
      params: { format }
    });
    return response.data;
  }
};

export default cardService;
