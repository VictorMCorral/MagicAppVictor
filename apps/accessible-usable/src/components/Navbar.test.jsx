import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

// Mock del AuthContext
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

const { useAuth } = require('../context/AuthContext');

describe('Navbar Component - v2.0 MTG Branding (Bootstrap)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderizado básico', () => {
    it('debería renderizar sin errores', () => {
      useAuth.mockReturnValue({
        isAuthenticated: false,
        logout: jest.fn()
      });

      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.getByText('MTG NEXUS')).toBeInTheDocument();
    });

    it('debería mostrar logo/título MTG NEXUS', () => {
      useAuth.mockReturnValue({
        isAuthenticated: false,
        logout: jest.fn()
      });

      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      const logo = screen.getByText('MTG NEXUS');
      expect(logo).toBeInTheDocument();
    });
  });

  describe('Usuario no autenticado', () => {
    beforeEach(() => {
      useAuth.mockReturnValue({
        isAuthenticated: false,
        logout: jest.fn()
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

    it('debería mostrar botón de Iniciar Sesión', () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument();
    });
  });

  describe('Usuario autenticado', () => {
    const mockLogout = jest.fn();

    beforeEach(() => {
      useAuth.mockReturnValue({
        isAuthenticated: true,
        logout: mockLogout
      });
    });

    it('debería mostrar enlace "Mazos"', () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.getByText('Mazos')).toBeInTheDocument();
    });

    it('debería mostrar enlace "Inventario"', () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.getByText('Inventario')).toBeInTheDocument();
    });

    it('debería mostrar botón de Salir', () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(screen.getByRole('button', { name: /Salir/i })).toBeInTheDocument();
    });

    it('debería llamar a logout al hacer click en Salir', () => {
      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      const logoutButton = screen.getByRole('button', { name: /Salir/i });
      logoutButton.click();

      expect(mockLogout).toHaveBeenCalled();
    });
  });

  describe('Estilos MTG Bootstrap', () => {
    it('debería aplicar clase text-mtg-gold al título', () => {
      useAuth.mockReturnValue({
        isAuthenticated: false,
        logout: jest.fn()
      });

      render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      const title = screen.getByText('MTG NEXUS');
      expect(title).toHaveClass('text-mtg-gold');
    });

    it('debería aplicar clase navbar-mtg al nav', () => {
      useAuth.mockReturnValue({
        isAuthenticated: false,
        logout: jest.fn()
      });

      const { container } = render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('navbar-mtg');
    });

    it('debería usar componentes Bootstrap navbar', () => {
      useAuth.mockReturnValue({
        isAuthenticated: false,
        logout: jest.fn()
      });

      const { container } = render(
        <BrowserRouter>
          <Navbar />
        </BrowserRouter>
      );

      expect(container.querySelector('.navbar')).toBeInTheDocument();
      expect(container.querySelector('.container')).toBeInTheDocument();
    });
  });
});
