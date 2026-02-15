import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InventoryPage from './InventoryPage';

describe('InventoryPage - v2.0 Inventory & Scan (Bootstrap)', () => {
  describe('Renderizado básico', () => {
    it('debería renderizar sin errores', () => {
      render(<InventoryPage />);
      expect(screen.getByText(/Mi Inventario/i)).toBeInTheDocument();
    });

    it('debería mostrar título con emoji', () => {
      render(<InventoryPage />);
      const title = screen.getByText(/Mi Inventario/i);
      expect(title).toBeInTheDocument();
    });

    it('debería mostrar subtítulo de versión', () => {
      render(<InventoryPage />);
      expect(screen.getByText(/v2.0 - Inventory & Scan Edition/i)).toBeInTheDocument();
    });
  });

  describe('Sección de estadísticas', () => {
    it('debería mostrar Total de Cartas', () => {
      render(<InventoryPage />);
      expect(screen.getByText(/Total de Cartas/i)).toBeInTheDocument();
    });

    it('debería mostrar Valor Total', () => {
      render(<InventoryPage />);
      expect(screen.getByText(/Valor Total/i)).toBeInTheDocument();
    });

    it('debería mostrar Tipos Únicos', () => {
      render(<InventoryPage />);
      expect(screen.getByText(/Tipos Únicos/i)).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('debería mostrar mensaje de inventario vacío', () => {
      render(<InventoryPage />);
      expect(screen.getByText(/Tu inventario está vacío/i)).toBeInTheDocument();
    });

    it('debería mostrar descripción del empty state', () => {
      render(<InventoryPage />);
      expect(screen.getByText(/Comienza a añadir cartas/i)).toBeInTheDocument();
    });

    it('debería mostrar instrucciones con escáner OCR', () => {
      render(<InventoryPage />);
      const scannerReferences = screen.getAllByText(/escáner ocr/i);
      expect(scannerReferences.length).toBeGreaterThan(0);
    });
  });

  describe('Botones de acción', () => {
    it('debería tener múltiples botones "Escanear"', () => {
      render(<InventoryPage />);
      const scanButtons = screen.getAllByText(/Escanear/i);
      expect(scanButtons.length).toBeGreaterThanOrEqual(2);
    });

    it('debería tener botón "Subir Foto" cuando el scanner está activo', () => {
      render(<InventoryPage />);
      const scanButtons = screen.getAllByText(/Escanear/i);
      fireEvent.click(scanButtons[0]);
      expect(screen.getByText(/Subir/i)).toBeInTheDocument();
    });
  });

  describe('Modal de escáner', () => {
    it('debería mostrar modal cuando se hace clic en Escanear', () => {
      render(<InventoryPage />);
      const scanButtons = screen.getAllByText(/Escanear/i);
      fireEvent.click(scanButtons[0]);
      const scannerElements = screen.getAllByText(/Escáner/i);
      expect(scannerElements.length).toBeGreaterThan(0);
    });

    it('debería mostrar mensaje de cámara no disponible si falla', () => {
      render(<InventoryPage />);
      const scanButtons = screen.getAllByText(/Escanear/i);
      fireEvent.click(scanButtons[0]);
      expect(screen.getByText(/Cámara no disponible/i)).toBeInTheDocument();
    });

    it('debería tener botón "Cancelar" en modal', () => {
      render(<InventoryPage />);
      const scanButtons = screen.getAllByText(/Escanear/i);
      fireEvent.click(scanButtons[0]);
      const cancelButtons = screen.getAllByText(/Cancelar/i);
      expect(cancelButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Tema y estilos Bootstrap', () => {
    it('debería usar clase min-vh-100 para altura completa', () => {
      const { container } = render(<InventoryPage />);
      const mainDiv = container.querySelector('.min-vh-100');
      expect(mainDiv).toBeInTheDocument();
    });

    it('debería tener Cards de Bootstrap para estadísticas', () => {
      const { container } = render(<InventoryPage />);
      const cards = container.querySelectorAll('.card');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('debería usar Container de Bootstrap', () => {
      const { container } = render(<InventoryPage />);
      const containerElement = container.querySelector('.container');
      expect(containerElement).toBeInTheDocument();
    });

    it('debería tener stats-card para estadísticas', () => {
      const { container } = render(<InventoryPage />);
      const statsCards = container.querySelectorAll('.stats-card');
      expect(statsCards.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Estructura HTML Bootstrap', () => {
    it('debería tener Row para layout', () => {
      const { container } = render(<InventoryPage />);
      const rows = container.querySelectorAll('.row');
      expect(rows.length).toBeGreaterThan(0);
    });

    it('debería tener header con título y botón', () => {
      render(<InventoryPage />);
      expect(screen.getByText(/Mi Inventario/i)).toBeInTheDocument();
      const scanButtons = screen.getAllByText(/Escanear/i);
      expect(scanButtons.length).toBeGreaterThan(0);
    });
  });
});
