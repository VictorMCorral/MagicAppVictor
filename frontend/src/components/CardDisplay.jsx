import React from 'react';
import { Star } from 'lucide-react';

const CardDisplay = ({ card, onClick }) => {
  // Soporta tanto formato interno como Scryfall
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

  const getColorBg = (colors) => {
    if (!colors || colors.length === 0) return 'bg-gray-50';
    if (colors.length > 1) return 'bg-yellow-50';
    
    const colorMap = {
      W: 'bg-yellow-50',
      U: 'bg-blue-50',
      B: 'bg-gray-900',
      R: 'bg-red-50',
      G: 'bg-green-50'
    };
    
    return colorMap[colors[0]] || 'bg-gray-50';
  };

  const getRarityColor = (rarity) => {
    const rarityMap = {
      'common': 'text-gray-600',
      'uncommon': 'text-green-600',
      'rare': 'text-yellow-600',
      'mythic': 'text-red-600'
    };
    return rarityMap[rarity?.toLowerCase()] || 'text-gray-600';
  };

  const getRarityBg = (rarity) => {
    const rarityMap = {
      'common': 'bg-gray-100',
      'uncommon': 'bg-green-100',
      'rare': 'bg-yellow-100',
      'mythic': 'bg-red-100'
    };
    return rarityMap[rarity?.toLowerCase()] || 'bg-gray-100';
  };

  // Detectar si es formato Scryfall o interno
  const imageUrl = card.image_uris?.normal || card.imageUrl;
  const colors = card.colors || card.color || [];
  const price = card.prices?.eur || card.priceEur;
  const name = card.name;
  const manaCost = card.mana_cost || card.manaCost;
  const type = card.type_line || card.type;
  const setName = card.set_name || card.setName;
  const rarity = card.rarity;
  const power = card.power;
  const toughness = card.toughness;

  return (
    <div
      onClick={onClick}
      className={`mtg-card border-4 ${getColorBorder(colors)} bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 flex flex-col h-full`}
    >
      {/* Imagen */}
      <div className="relative overflow-hidden bg-gray-100 flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-auto object-cover aspect-card"
          />
        ) : (
          <div className={`w-full aspect-card ${getColorBg(colors)} flex flex-col justify-between p-3`}>
            <div>
              <h3 className="font-bold text-sm line-clamp-2 text-gray-900">{name}</h3>
              <p className="text-xs text-gray-700 font-semibold mt-1">{manaCost}</p>
            </div>
            <div>
              <p className="text-xs text-gray-700 font-medium line-clamp-2">{type}</p>
            </div>
          </div>
        )}
        
        {/* Rareza badge */}
        {rarity && (
          <div className={`absolute top-2 right-2 ${getRarityBg(rarity)} ${getRarityColor(rarity)} px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1`}>
            <Star className="w-3 h-3" />
            <span className="capitalize">{rarity}</span>
          </div>
        )}
      </div>

      {/* Información principal */}
      <div className="p-3 flex-grow flex flex-col">
        {/* Nombre y costo */}
        <div className="mb-2">
          <h3 className="font-bold text-sm line-clamp-2 text-gray-900">{name}</h3>
          {manaCost && (
            <p className="text-xs font-semibold text-gray-700 mt-1">{manaCost}</p>
          )}
        </div>

        {/* Tipo */}
        {type && (
          <p className="text-xs text-gray-600 line-clamp-2 mb-2 italic">{type}</p>
        )}

        {/* Power/Toughness si es criatura */}
        {power && toughness && (
          <div className="mb-2 p-2 bg-red-50 rounded border border-red-200 text-center">
            <p className="text-lg font-bold text-red-600">{power}/{toughness}</p>
          </div>
        )}

        {/* Set */}
        {setName && (
          <div className="text-xs text-gray-600 mb-2 line-clamp-1">
            <span className="font-semibold">Set:</span> {setName}
          </div>
        )}
      </div>

      {/* Footer con precio */}
      <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 border-t">
        <div className="flex justify-between items-end gap-2">
          <div className="text-xs">
            <p className="text-gray-600 font-semibold">MTG</p>
          </div>
          {price ? (
            <div className="text-right">
              <p className="text-xs text-gray-600">Precio</p>
              <p className="text-sm font-bold text-green-600">
                €{typeof price === 'number' ? price.toFixed(2) : price}
              </p>
            </div>
          ) : (
            <div className="text-xs text-gray-500 italic">
              Sin precio
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDisplay;
