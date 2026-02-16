import api from './api';

/**
 * Servicio de autenticación
 */
const authService = {
  /**
   * Registrar nuevo usuario
   */
  register: async (email, username, password) => {
    const response = await api.post('/auth/register', {
      email,
      username,
      password
    });
    
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  },

  /**
   * Iniciar sesión
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password
    });
    
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  },

  /**
   * Cerrar sesión
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Obtener perfil del usuario
   */
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  /**
   * Verificar si hay sesión activa
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  /**
   * Obtener usuario actual
   */
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService;
