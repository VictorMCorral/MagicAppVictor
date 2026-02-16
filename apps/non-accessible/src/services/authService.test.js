import authService from './authService';
import api from './api';

// Mockear la instancia de API
jest.mock('./api');

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('debería guardar el token y usuario en localStorage tras un login exitoso', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            token: 'fake-token',
            user: { id: '1', username: 'testuser' }
          }
        }
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await authService.login('test@example.com', 'password123');

      expect(result.success).toBe(true);
      expect(localStorage.getItem('token')).toBe('fake-token');
      expect(JSON.parse(localStorage.getItem('user'))).toEqual({ id: '1', username: 'testuser' });
    });
  });

  describe('logout', () => {
    it('debería limpiar el localStorage', () => {
      localStorage.setItem('token', 'some-token');
      authService.logout();
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('debería retornar true si hay un token', () => {
      localStorage.setItem('token', 'some-token');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('debería retornar false si no hay token', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });
  });
});
