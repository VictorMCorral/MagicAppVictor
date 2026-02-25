import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';

// Mock del AuthContext
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

const { useAuth } = require('../context/AuthContext');

describe('HomePage - v2.0 Release (Bootstrap)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      isAuthenticated: false
    });
  });

  describe('Renderizado básico', () => {
    it('debería renderizar sin errores', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(document.body).toBeTruthy();
    });

    it('debería mostrar el título principal MTG NEXUS HUB', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByText(/MTG NEXUS HUB/i)).toBeInTheDocument();
    });

    it('debería mostrar subtítulo descriptivo', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByText(/Plataforma Integral/i)).toBeInTheDocument();
    });
  });

  describe('Sección de características implantadas', () => {
    it('debería mostrar título Ya implantadas', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByText(/Ya implantadas/i)).toBeInTheDocument();
    });

    it('debería mostrar característica Buscador Scryfall', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByText(/Buscador Scryfall/i)).toBeInTheDocument();
    });

    it('debería mostrar característica Creador de Mazos', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByText(/Creador de Mazos/i)).toBeInTheDocument();
    });

    it('debería mostrar característica Importar Mazos', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByText(/Importación\/Exportación \.txt/i)).toBeInTheDocument();
    });
  });

  describe('Botones de acción (CTA) - Usuario no autenticado', () => {
    it('debería mostrar botón Comenzar Gratis', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByRole('button', { name: /Comenzar Gratis/i })).toBeInTheDocument();
    });

    it('debería mostrar botón Iniciar Sesión', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument();
    });
  });

  describe('Botones de acción (CTA) - Usuario autenticado', () => {
    beforeEach(() => {
      useAuth.mockReturnValue({
        isAuthenticated: true
      });
    });

    it('debería mostrar botón Mis Mazos', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByRole('button', { name: /Mis Mazos/i })).toBeInTheDocument();
    });

    it('debería mostrar botón Mi Inventario', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByRole('button', { name: /Mi Inventario/i })).toBeInTheDocument();
    });
  });

  describe('Tema y estilos Bootstrap', () => {
    it('debería usar clase page-container', () => {
      const { container } = render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      const mainDiv = container.querySelector('.page-container');
      expect(mainDiv).toBeInTheDocument();
    });

    it('debería mostrar colores MTG en títulos', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      const goldTitle = screen.getByText(/MTG NEXUS HUB/i);
      expect(goldTitle).toHaveClass('text-mtg-gold');
    });

    it('debería usar Container de Bootstrap', () => {
      const { container } = render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(container.querySelector('.container')).toBeInTheDocument();
    });
  });

  describe('Sección Próximamente', () => {
    it('debería mostrar título de próximas características v3.0', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByText(/Próximamente/i)).toBeInTheDocument();
    });

    it('debería mostrar Tablero virtual manual como próxima funcionalidad', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByText(/Tablero virtual manual/i)).toBeInTheDocument();
    });

    it('debería mostrar Salas multijugador via WebSockets', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByText(/Salas multijugador via WebSockets/i)).toBeInTheDocument();
    });
  });

  describe('Footer', () => {
    it('debería mostrar versión', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByText(/Versión 2.0.0/i)).toBeInTheDocument();
    });

    it('debería mostrar tecnologías usadas', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByText(/React.js/i)).toBeInTheDocument();
    });
  });
});
