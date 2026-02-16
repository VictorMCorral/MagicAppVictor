import api from './api';

/**
 * Servicio para gestión de mazos
 */
const deckService = {
  /**
   * Obtener todos los mazos del usuario
   */
  getMyDecks: async () => {
    const response = await api.get('/decks');
    return response.data;
  },

  /**
   * Obtener mazo por ID
   */
  getDeckById: async (id) => {
    const response = await api.get(`/decks/${id}`);
    return response.data;
  },

  /**
   * Crear nuevo mazo
   */
  createDeck: async (deckData) => {
    const response = await api.post('/decks', deckData);
    return response.data;
  },

  /**
   * Actualizar mazo
   */
  updateDeck: async (id, deckData) => {
    const response = await api.put(`/decks/${id}`, deckData);
    return response.data;
  },

  /**
   * Eliminar mazo
   */
  deleteDeck: async (id) => {
    const response = await api.delete(`/decks/${id}`);
    return response.data;
  },

  /**
   * Añadir carta al mazo
   */
  addCardToDeck: async (deckId, scryfallId, quantity = 1) => {
    const response = await api.post(`/decks/${deckId}/cards`, {
      scryfallId,
      quantity
    });
    return response.data;
  },

  /**
   * Actualizar cantidad de carta
   */
  updateCardQuantity: async (deckId, cardId, quantity) => {
    const response = await api.put(`/decks/${deckId}/cards/${cardId}`, {
      quantity
    });
    return response.data;
  },

  /**
   * Eliminar carta del mazo
   */
  removeCardFromDeck: async (deckId, cardId) => {
    const response = await api.delete(`/decks/${deckId}/cards/${cardId}`);
    return response.data;
  },

  /**
   * Importar mazo desde texto
   */
  importDeck: async (deckId, deckList, clearExisting = false) => {
    const response = await api.post(`/decks/${deckId}/import`, {
      deckList,
      clearExisting
    });
    return response.data;
  },

  /**
   * Exportar mazo a texto
   */
  exportDeck: async (deckId) => {
    const response = await api.get(`/decks/${deckId}/export`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

export default deckService;
