import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import PrivateRoute from './PrivateRoute';

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

const { useAuth } = require('../context/AuthContext');

describe('PrivateRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza children cuando usuario está autenticado', () => {
    useAuth.mockReturnValue({ isAuthenticated: true, loading: false });

    render(
      <MemoryRouter initialEntries={['/dashboard-no-usable']}>
        <Routes>
          <Route
            path="*"
            element={
              <PrivateRoute>
                <div>Contenido privado</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Contenido privado')).toBeInTheDocument();
  });

  test('redirige a login preservando sufijo de flujo', () => {
    useAuth.mockReturnValue({ isAuthenticated: false, loading: false });

    render(
      <MemoryRouter initialEntries={['/dashboard-no-accesible']}>
        <Routes>
          <Route path="/login-no-accesible" element={<div>Login variante</div>} />
          <Route
            path="*"
            element={
              <PrivateRoute>
                <div>Contenido privado</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login variante')).toBeInTheDocument();
  });
});
