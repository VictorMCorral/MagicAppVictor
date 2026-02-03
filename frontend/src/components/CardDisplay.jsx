import React from 'react';

const CardDisplay = ({ card, onClick }) => {
  const getColorBorder = (colors) => {
    if (!colors || colors.length === 0) return 'border-gray-400';
    if (colors.length > 1) return 'border-yellow-500'; // Multicolor/Gold
    
    const colorMap = {
      W: 'border-yellow-100',
      U: 'border-blue-500',
      B: 'border-gray-900',
      R: 'border-red-600',
      G: 'border-green-600'
    };
    
    return colorMap[colors[0]] || 'border-gray-400';
  };

  return (
    <div
      onClick={onClick}
      className={`mtg-card border-4 ${getColorBorder(card.colors)} bg-white`}
    >
      {card.imageUrl ? (
        <img
          src={card.imageUrl}
          alt={card.name}
          className="w-full h-auto"
        />
      ) : (
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2">{card.name}</h3>
          <p className="text-sm text-gray-600">{card.manaCost}</p>
          <p className="text-sm text-gray-700 mt-2">{card.type}</p>
          <p className="text-xs text-gray-600 mt-2">{card.setName}</p>
        </div>
      )}
      
      <div className="p-2 bg-gray-50">
        <div className="flex justify-between items-center text-sm">
          <span className="font-semibold">{card.name}</span>
          {card.priceEur && (
            <span className="text-green-600 font-medium">
              €{card.priceEur.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDisplay;
