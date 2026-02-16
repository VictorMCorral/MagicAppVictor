import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CardSearchPage from './CardSearchPage';
import cardService from '../services/cardService';

// Mocks
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(() => ({ isAuthenticated: true, user: { id: 1 } }))
}));
jest.mock('../services/cardService');

describe('CardSearchPage', () => {
  beforeEach(() => {
    cardService.searchCards.mockResolvedValue({
      data: [
        {
          id: '1',
          name: 'Test Card',
          mana_cost: '{1}{W}',
          type_line: 'Creature',
          oracle_text: 'Test oracle text',
          image_uris: { normal: 'http://test.com/image.jpg' },
          set_name: 'Test Set',
          prices: { usd: '1.00', eur: '0.90' },
          rarity: 'common'
        }
      ]
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza el componente correctamente', () => {
    render(
      <BrowserRouter>
        <CardSearchPage />
      </BrowserRouter>
    );

    // Busca coincidencia parcial para el título
    expect(screen.getByText('Buscar Cartas', { exact: false })).toBeInTheDocument();
  });

  test('realiza una búsqueda y muestra resultados con el nuevo estilo', async () => {
    render(
      <BrowserRouter>
        <CardSearchPage />
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText('Buscar por nombre, tipo, texto...');
    const searchButton = screen.getByText('Buscar');

    // Simula la escritura en el input
    fireEvent.change(input, { target: { value: 'Test' } });
    
    // Simula el click en buscar
    fireEvent.click(searchButton);

    // Esperar a que aparezca la carta (esto maneja implícitamente la espera del re-render y evita errores de act)
    await waitFor(() => {
      expect(screen.getByText('Test Card')).toBeInTheDocument();
    });
    
    // Verificar que se llamó al servicio
    expect(cardService.searchCards).toHaveBeenCalled();

    // Verificar elementos específicos del nuevo diseño estilo inventario/mazo
    expect(screen.getByText('Creature')).toBeInTheDocument();
  });
});
