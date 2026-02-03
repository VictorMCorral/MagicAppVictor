import React, { useState } from 'react';
import { Search } from 'lucide-react';
import cardService from '../services/cardService';
import CardDisplay from '../components/CardDisplay';

const CardSearchPage = () => {
  const [query, setQuery] = useState('');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await cardService.searchCards(query);
      setCards(response.data || []);
    } catch (error) {
      console.error('Error al buscar cartas:', error);
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Buscar Cartas</h1>

      {/* Buscador */}
      <form onSubmit={handleSearch} className="card mb-8">
        <div className="flex space-x-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre, tipo, texto..."
            className="input-field flex-1"
          />
          <button type="submit" className="btn-primary flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Buscar</span>
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-4">
          Ejemplos: "Lightning Bolt", "type:creature", "c:red"
        </p>
      </form>

      {/* Resultados */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-xl">Buscando cartas...</div>
        </div>
      ) : cards.length > 0 ? (
        <>
          <p className="text-gray-600 mb-4">{cards.length} cartas encontradas</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {cards.map((card) => (
              <CardDisplay
                key={card.id}
                card={card}
                onClick={() => setSelectedCard(card)}
              />
            ))}
          </div>
        </>
      ) : query && !loading ? (
        <div className="card text-center py-12">
          <p className="text-gray-600">No se encontraron cartas</p>
        </div>
      ) : null}

      {/* Modal de detalle */}
      {selectedCard && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col md:flex-row gap-6">
              {selectedCard.image_uris?.normal && (
                <img
                  src={selectedCard.image_uris.normal}
                  alt={selectedCard.name}
                  className="w-full md:w-1/2 rounded-lg"
                />
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{selectedCard.name}</h2>
                <p className="text-gray-600 mb-2">{selectedCard.type_line}</p>
                <p className="text-gray-600 mb-4">{selectedCard.mana_cost}</p>
                
                {selectedCard.oracle_text && (
                  <p className="text-gray-800 mb-4">{selectedCard.oracle_text}</p>
                )}

                <div className="space-y-2 text-sm">
                  <p><strong>Set:</strong> {selectedCard.set_name}</p>
                  <p><strong>Rareza:</strong> {selectedCard.rarity}</p>
                  {selectedCard.prices?.eur && (
                    <p><strong>Precio:</strong> €{selectedCard.prices.eur}</p>
                  )}
                </div>

                <button
                  onClick={() => setSelectedCard(null)}
                  className="btn-secondary w-full mt-6"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardSearchPage;
