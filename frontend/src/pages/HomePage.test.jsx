import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

const { useAuth } = require('../context/AuthContext');

describe('HomePage - v2.0 Release', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      logout: jest.fn(),
      login: jest.fn(),
      register: jest.fn(),
    });
  });

  describe('Renderizado básico', () => {
    it('debería renderizar sin errores', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByText(/MTG NEXUS HUB/i)).toBeInTheDocument();
    });

    it('debería mostrar descripción de la plataforma', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByText(/Tu Plataforma Integral para Magic/i)).toBeInTheDocument();
    });

    it('debería mostrar descripción general', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByText(/Gestiona mazos, analiza tu colección/i)).toBeInTheDocument();
    });
  });

  describe('Características v1.0', () => {
    it('debería mostrar sección de características v1.0', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByText(/Características v1.0/i)).toBeInTheDocument();
    });

    it('debería listar característica Buscador Scryfall', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByText(/Buscador Scryfall/i)).toBeInTheDocument();
    });

    it('debería listar característica Creador de Mazos', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByText(/Creador de Mazos/i)).toBeInTheDocument();
    });
  });

  describe('Características v2.0', () => {
    it('debería mostrar sección de características v2.0', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByText(/Próximas Características v2.0/i)).toBeInTheDocument();
    });

    it('debería mostrar versión 2.0.0', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByText(/2\.0\.0/i)).toBeInTheDocument();
    });

    it('debería listar Escaneo OCR', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByText(/Escaneo OCR/i)).toBeInTheDocument();
    });

    it('debería listar Gestión de Colecciones', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByText(/Gestión de Colecciones/i)).toBeInTheDocument();
    });
  });

  describe('Llamadas a la acción', () => {
    it('debería tener link "Comenzar Gratis"', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByText(/Comenzar Gratis/i)).toBeInTheDocument();
    });

    it('debería tener link "Iniciar Sesión"', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByText(/Iniciar Sesión/i)).toBeInTheDocument();
    });
  });

  describe('Tema y estilos MTG', () => {
    it('debería aplicar tema oscuro', () => {
      const { container } = render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      const mainDiv = container.querySelector('[class*="min-h-screen"]');
      expect(mainDiv).toBeInTheDocument();
    });

    it('debería usar gradiente MTG', () => {
      const { container } = render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      const gradient = container.querySelector('[class*="bg-mtg-gradient"]');
      expect(gradient).toBeInTheDocument();
    });

    it('debería mostrar colores MTG en títulos', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      const goldTitle = screen.getByText(/MTG NEXUS HUB/i);
      expect(goldTitle).toHaveClass('text-mtg-gold-bright');
    });
  });

  describe('Logo MTG', () => {
    it('debería mostrar logo de MTG', () => {
      const { container } = render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      const logo = container.querySelector('img[alt*="MTG"]');
      expect(logo).toBeInTheDocument();
    });
  });

  describe('Estado sin autenticación', () => {
    it('debería renderizar para usuario no autenticado', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByText(/MTG NEXUS HUB/i)).toBeInTheDocument();
    });
  });

  describe('Información del producto', () => {
    it('debería mostrar información de construcción', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getByText(/React.js/i)).toBeInTheDocument();
    });

    it('debería mostrar Scryfall API', () => {
      render(
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      );
      expect(screen.getAllByText(/Scryfall/i).length).toBeGreaterThan(0);
    });
  });
});
