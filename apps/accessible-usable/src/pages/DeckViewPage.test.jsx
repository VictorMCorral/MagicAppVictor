import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DeckViewPage from './DeckViewPage';
import deckService from '../services/deckService';
import { act } from 'react';

// Mock dependencies
jest.mock('../services/deckService');
jest.mock('../services/cardService');

describe('DeckViewPage', () => {
  const mockDeck = {
    id: '1',
    name: 'Test Deck',
    description: 'A test deck description',
    format: 'Commander',
    updatedAt: new Date().toISOString(),
    stats: {
      totalCards: 100,
      uniqueCards: 60,
      avgCmc: 3.5,
      totalValueEur: 250.50
    },
    cards: [
      {
        id: 'c1',
        name: 'Sol Ring',
        type: 'Artifact',
        scryfallId: '123',
        quantity: 1,
        imageUrl: 'http://example.com/solring.jpg',
        priceEur: 2.50
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    // Return a promise that never resolves immediately to test loading state
    deckService.getDeckById.mockImplementation(() => new Promise(() => {}));
    
    await act(async () => {
      render(
        <BrowserRouter>
          <DeckViewPage />
        </BrowserRouter>
      );
    });

    expect(screen.getByText(/Invocando mazo.../i)).toBeInTheDocument();
  });

  it('renders deck details after loading', async () => {
    deckService.getDeckById.mockResolvedValue({ data: mockDeck });

    await act(async () => {
      render(
        <BrowserRouter>
          <DeckViewPage />
        </BrowserRouter>
      );
    });

    // Wait for content to load
    await waitFor(() => {
      expect(screen.getByText('Test Deck')).toBeInTheDocument();
      expect(screen.getByText(/A test deck description/i)).toBeInTheDocument();
      expect(screen.getByText('Commander')).toBeInTheDocument();
      expect(screen.getByText('Sol Ring')).toBeInTheDocument();
    });
  });

  it('handles error when loading deck', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    deckService.getDeckById.mockRejectedValue(new Error('Failed to load'));

    await act(async () => {
      render(
        <BrowserRouter>
          <DeckViewPage />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      // Should redirect or handle error (in this case acts as redirect in component)
      expect(deckService.getDeckById).toHaveBeenCalled();
    });
    
    consoleSpy.mockRestore();
  });

  it('muestra modal de importación al pulsar importar', async () => {
    deckService.getDeckById.mockResolvedValue({ data: mockDeck });

    await act(async () => {
      render(
        <BrowserRouter>
          <DeckViewPage />
        </BrowserRouter>
      );
    });

    await waitFor(() => expect(screen.getByText('Test Deck')).toBeInTheDocument());

    fireEvent.click(screen.getByTitle('Subir lista'));

    expect(screen.getByText('Importar Lista de Mazo')).toBeInTheDocument();
    expect(screen.getByText('Procesar Importación')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/4 Lightning Bolt/i)).toBeInTheDocument();
  });

  it('botón importar se deshabilita mientras importa', async () => {
    deckService.getDeckById.mockResolvedValue({ data: mockDeck });
    deckService.importDeck.mockImplementation(() => new Promise(() => {}));

    await act(async () => {
      render(
        <BrowserRouter>
          <DeckViewPage />
        </BrowserRouter>
      );
    });

    await waitFor(() => expect(screen.getByText('Test Deck')).toBeInTheDocument());

    fireEvent.click(screen.getByTitle('Subir lista'));
    fireEvent.change(screen.getByPlaceholderText(/4 Lightning Bolt/i), {
      target: { value: '4 Lightning Bolt' },
    });

    fireEvent.click(screen.getByText('Procesar Importación'));

    await waitFor(() =>
      expect(screen.getByText('Importando...')).toBeInTheDocument()
    );
  });
});
