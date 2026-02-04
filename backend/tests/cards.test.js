const request = require('supertest');
const app = require('../src/app');
const scryfallService = require('../src/services/scryfallService');

// Mockear el servicio de Scryfall
jest.mock('../src/services/scryfallService');

describe('Card Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/cards/search', () => {
    it('debería buscar cartas exitosamente', async () => {
      const mockResult = {
        success: true,
        data: [
          { id: '1', name: 'Black Lotus' },
          { id: '2', name: 'Lightning Bolt' }
        ],
        total_cards: 2,
        has_more: false
      };

      scryfallService.searchCards.mockResolvedValue(mockResult);

      const response = await request(app)
        .get('/api/cards/search?q=lotus');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(scryfallService.searchCards).toHaveBeenCalledWith('lotus', expect.any(Object));
    });

    it('debería retornar 400 si no hay query', async () => {
      const response = await request(app)
        .get('/api/cards/search');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('requerido');
    });
  });

  describe('GET /api/cards/:id', () => {
    it('debería obtener una carta por ID', async () => {
      const mockCard = {
        success: true,
        data: { name: 'Lightning Bolt', manaCost: '{R}' }
      };

      scryfallService.getCardById.mockResolvedValue(mockCard);

      const response = await request(app)
        .get('/api/cards/123');

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('Lightning Bolt');
    });

    it('debería retornar 404 si la carta no existe', async () => {
      scryfallService.getCardById.mockRejectedValue(new Error('no encontrada'));

      const response = await request(app)
        .get('/api/cards/invalid_id');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
