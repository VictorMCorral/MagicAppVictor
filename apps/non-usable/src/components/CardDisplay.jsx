import React from 'react';
import { Star } from 'lucide-react';
import { Card, Badge } from 'react-bootstrap';

const CardDisplay = ({ card, onClick }) => {
  const getColorBorder = (colors) => {
    if (!colors || colors.length === 0) return '#6c757d';
    if (colors.length > 1) return '#FFD700'; // Multicolor
    
    const colorMap = {
      W: '#f8f9fa',
      U: '#0d6efd',
      B: '#212529',
      R: '#dc3545',
      G: '#198754'
    };
    return colorMap[colors[0]] || '#6c757d';
  };

  const getColorBg = (colors) => {
    if (!colors || colors.length === 0) return '#f8f9fa';
    if (colors.length > 1) return '#fff3cd';
    
    const colorMap = {
      W: '#fff9e6',
      U: '#cfe2ff',
      B: '#212529',
      R: '#f8d7da',
      G: '#d1e7dd'
    };
    return colorMap[colors[0]] || '#f8f9fa';
  };

  const getRarityVariant = (rarity) => {
    const rarityMap = {
      'common': 'secondary',
      'uncommon': 'success',
      'rare': 'warning',
      'mythic': 'danger'
    };
    return rarityMap[rarity?.toLowerCase()] || 'secondary';
  };

  // Detect format
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
    <Card
      onClick={onClick}
      className="mtg-card h-100 cursor-pointer transition-all"
      style={{
        borderWidth: '3px',
        borderColor: getColorBorder(colors),
        backgroundColor: '#ffffff'
      }}
    >
      {/* Image */}
      <div className="position-relative" style={{backgroundColor: '#f0f0f0'}}>
        {imageUrl ? (
          <Card.Img
            variant="top"
            src={imageUrl}
            alt={name}
            className="aspect-card"
            style={{objectFit: 'cover'}}
          />
        ) : (
          <div 
            className="d-flex flex-column justify-content-between p-3 aspect-card"
            style={{backgroundColor: getColorBg(colors)}}
          >
            <div>
              <h6 className="fw-bold text-dark mb-1" style={{fontSize: '0.875rem'}}>{name}</h6>
              <small className="text-dark fw-semibold">{manaCost}</small>
            </div>
            <small className="text-dark fw-medium">{type}</small>
          </div>
        )}
        
        {/* Rarity badge */}
        {rarity && (
          <Badge 
            bg={getRarityVariant(rarity)}
            className="position-absolute d-flex align-items-center gap-1"
            style={{top: '0.5rem', right: '0.5rem'}}
          >
            <Star size={12} />
            <span className="text-capitalize">{rarity}</span>
          </Badge>
        )}
      </div>

      {/* Info */}
      <Card.Body className="d-flex flex-column p-2">
        <h6 className="fw-bold text-dark mb-1" style={{fontSize: '0.875rem'}}>{name}</h6>
        {manaCost && (
          <small className="text-secondary fw-semibold mb-1">{manaCost}</small>
        )}
        {type && (
          <small className="text-muted fst-italic mb-2">{type}</small>
        )}
        {power && toughness && (
          <div className="bg-danger bg-opacity-10 border border-danger rounded p-1 text-center mb-2">
            <span className="fw-bold text-danger">{power}/{toughness}</span>
          </div>
        )}
        {setName && (
          <small className="text-muted">
            <span className="fw-semibold">Set:</span> {setName}
          </small>
        )}
      </Card.Body>

      {/* Footer */}
      <Card.Footer className="bg-light d-flex justify-content-between align-items-end">
        <small className="text-muted fw-semibold">MTG</small>
        {price ? (
          <div className="text-end">
            <small className="d-block text-muted">Precio</small>
            <span className="fw-bold text-success">
              €{typeof price === 'number' ? price.toFixed(2) : price}
            </span>
          </div>
        ) : (
          <small className="text-muted fst-italic">Sin precio</small>
        )}
      </Card.Footer>
    </Card>
  );
};

export default CardDisplay;
