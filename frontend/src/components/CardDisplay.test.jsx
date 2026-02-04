import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CardDisplay from './CardDisplay';

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Star: () => <div data-testid="star-icon" />
}));

const mockCard = {
  name: 'Lightning Bolt',
  mana_cost: '{R}',
  type_line: 'Instant',
  rarity: 'common',
  set_name: 'Masters 25',
  prices: { eur: '0.50' },
  image_uris: { normal: 'https://example.com/bolt.jpg' },
  colors: ['R']
};

describe('CardDisplay Component', () => {
  it('debería renderizar el nombre de la carta', () => {
    render(<CardDisplay card={mockCard} />);
    const cardNames = screen.getAllByText('Lightning Bolt');
    expect(cardNames.length).toBeGreaterThan(0);
  });

  it('debería mostrar el precio formateado', () => {
    render(<CardDisplay card={mockCard} />);
    expect(screen.getByText('€0.50')).toBeInTheDocument();
  });

  it('debería mostrar el badge de rareza', () => {
    render(<CardDisplay card={mockCard} />);
    expect(screen.getByText('common')).toBeInTheDocument();
    expect(screen.getByTestId('star-icon')).toBeInTheDocument();
  });

  it('debería llamar al onClick cuando se hace clic', () => {
    const handleClick = jest.fn();
    render(<CardDisplay card={mockCard} onClick={handleClick} />);
    
    const cardContainer = screen.getAllByText('Lightning Bolt')[0].closest('.mtg-card');
    fireEvent.click(cardContainer);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('debería mostrar Power/Toughness si es una criatura', () => {
    const creatureCard = {
      ...mockCard,
      type_line: 'Creature — Goblin',
      power: '2',
      toughness: '2'
    };
    render(<CardDisplay card={creatureCard} />);
    expect(screen.getByText('2/2')).toBeInTheDocument();
  });
});
