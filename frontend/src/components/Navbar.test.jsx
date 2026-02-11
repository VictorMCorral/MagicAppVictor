import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

// Mock del contexto de autenticación
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock de useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

import { useAuth } from '../context/AuthContext';

describe('Navbar Component - v2.0 MTG Branding', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Logo y Branding', () => {
    it('debería renderizar sin errores cuando usuario no está autenticado', () => {
      useAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.getByText('MTG NEXUS')).toBeInTheDocument();
    });

    it('debería mostrar versión v2.0', () => {
      useAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.getByText('Hub v2.0')).toBeInTheDocument();
    });

    it('debería mostrar logo SVG', () => {
      useAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      const logo = screen.getByAltText('MTG Nexus');
      expect(logo).toBeInTheDocument();
    });
  });

  describe('Navegación pública', () => {
    beforeEach(() => {
      useAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });
    });

    it('debería mostrar enlace "Inicio"', () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.getByText('Inicio')).toBeInTheDocument();
    });

    it('debería mostrar enlace "Buscar"', () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.getByText('Buscar')).toBeInTheDocument();
    });

    it('debería mostrar botón "Iniciar Sesión"', () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    });
  });

  describe('Navegación autenticada', () => {
    beforeEach(() => {
      useAuth.mockReturnValue({
        isAuthenticated: true,
        user: { username: 'testuser' },
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });
    });

    it('debería mostrar enlace "Mazos" cuando está autenticado', () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.getByText('Mazos')).toBeInTheDocument();
    });

    it('debería mostrar nuevo enlace "Inventario" (v2.0)', () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.getByText('Inventario')).toBeInTheDocument();
    });

    it('debería mostrar nombre de usuario', () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.getByText('testuser')).toBeInTheDocument();
    });

    it('debería mostrar botón "Salir"', () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.getByText('Salir')).toBeInTheDocument();
    });
  });

  describe('Estilos MTG', () => {
    it('debería aplicar clase text-mtg-gold-bright al título', () => {
      useAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      const { container } = render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      const title = screen.getByText('MTG NEXUS');
      expect(title).toHaveClass('text-mtg-gold-bright');
    });

    it('debería aplicar tema oscuro (bg-mtg-bg-dark)', () => {
      useAuth.mockReturnValue({
        isAuthenticated: false,
        user: null,
        logout: jest.fn(),
        login: jest.fn(),
        register: jest.fn(),
      });

      const { container } = render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('bg-mtg-bg-dark');
    });
  });
});
