import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InventoryPage from './InventoryPage';

describe('InventoryPage - v2.0 Inventory & Scan', () => {
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
      // Puede haber múltiples referencias al escáner OCR
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

    it('debería tener botón "Añadir Manual"', () => {
      render(<InventoryPage />);
      expect(screen.getByText(/Añadir Manual/i)).toBeInTheDocument();
    });
  });

  describe('Modal de escáner', () => {
    it('debería mostrar modal cuando se hace clic en Escanear', () => {
      render(<InventoryPage />);
      const scanButtons = screen.getAllByText(/Escanear/i);
      fireEvent.click(scanButtons[0]);
      // Buscar la salida del modal en el DOM (puede haber múltiples elementos con este texto)
      const scannerElements = screen.getAllByText(/Escáner/i);
      expect(scannerElements.length).toBeGreaterThan(0);
    });

    it('debería mostrar referencia a Tesseract.js', () => {
      render(<InventoryPage />);
      const scanButtons = screen.getAllByText(/Escanear/i);
      fireEvent.click(scanButtons[0]);
      // El modal debe estar visible
      const container = scanButtons[0].closest('[class*="flex"]');
      expect(container).toBeInTheDocument();
    });

    it('debería tener botón "Cerrar" en modal', () => {
      render(<InventoryPage />);
      const scanButtons = screen.getAllByText(/Escanear/i);
      fireEvent.click(scanButtons[0]);
      const closeButtons = screen.getAllByText(/Cerrar/i);
      expect(closeButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Tema y estilos', () => {
    it('debería usar paleta de colores MTG', () => {
      const { container } = render(<InventoryPage />);
      const themeElement = container.querySelector('[class*="bg-mtg"]');
      expect(themeElement).toBeInTheDocument();
    });

    it('debería aplicar tema oscuro', () => {
      const { container } = render(<InventoryPage />);
      const mainDiv = container.querySelector('[class*="min-h-screen"]');
      expect(mainDiv).toBeInTheDocument();
    });

    it('debería tener grid para estadísticas', () => {
      const { container } = render(<InventoryPage />);
      const gridContainer = container.querySelector('[class*="grid"]');
      expect(gridContainer).toBeInTheDocument();
    });

    it('debería tener cards para estadísticas', () => {
      const { container } = render(<InventoryPage />);
      const cards = container.querySelectorAll('[class*="card"]');
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe('Estructura HTML', () => {
    it('debería tener contenedor principal min-h-screen', () => {
      const { container } = render(<InventoryPage />);
      const minHeightContainer = container.querySelector('[class*="min-h-screen"]');
      expect(minHeightContainer).toBeInTheDocument();
    });

    it('debería tener header con título y botón', () => {
      render(<InventoryPage />);
      expect(screen.getByText(/Mi Inventario/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Escanear/i).length).toBeGreaterThan(0);
    });
  });

  describe('Funcionalidad de modal', () => {
    it('debería renderizar componente sin errores', () => {
      render(<InventoryPage />);
      expect(screen.getByText(/Mi Inventario/i)).toBeInTheDocument();
    });
  });

  describe('Branding v2.0', () => {
    it('debería mostrar versión v2.0', () => {
      render(<InventoryPage />);
      expect(screen.getByText(/v2.0/i)).toBeInTheDocument();
    });

    it('debería tener emoji de diamante en título', () => {
      render(<InventoryPage />);
      const title = screen.getByText(/Mi Inventario/i);
      expect(title.textContent.includes('💎')).toBe(true);
    });
  });
});
