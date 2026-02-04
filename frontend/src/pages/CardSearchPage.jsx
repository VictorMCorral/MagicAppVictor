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
          <div className="animate-spin inline-block">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
          <p className="text-xl mt-4 text-gray-600">Buscando cartas...</p>
        </div>
      ) : cards.length > 0 ? (
        <>
          <p className="text-gray-600 mb-6 text-lg font-semibold">
            {cards.length} {cards.length === 1 ? 'carta encontrada' : 'cartas encontradas'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {cards.map((card) => (
              <div key={card.id} onClick={() => setSelectedCard(card)}>
                <CardDisplay card={card} />
              </div>
            ))}
          </div>
        </>
      ) : query && !loading ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 text-lg">No se encontraron cartas para "{query}"</p>
          <p className="text-gray-500 mt-2">Intenta con otro nombre o criterio de búsqueda</p>
        </div>
      ) : null}

      {/* Modal de detalle */}
      {selectedCard && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="bg-white rounded-xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col lg:flex-row gap-8">
              {selectedCard.image_uris?.normal && (
                <div className="lg:w-1/2 flex-shrink-0">
                  <img
                    src={selectedCard.image_uris.normal}
                    alt={selectedCard.name}
                    className="w-full rounded-lg shadow-lg"
                  />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2 text-gray-900">{selectedCard.name}</h2>
                <p className="text-lg text-gray-700 font-semibold mb-1">{selectedCard.type_line}</p>
                <p className="text-lg text-gray-600 mb-6">{selectedCard.mana_cost}</p>
                
                {selectedCard.oracle_text && (
                  <div className="bg-gray-50 p-4 rounded-lg mb-6 border-l-4 border-blue-600">
                    <p className="text-gray-800">{selectedCard.oracle_text}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-gray-600 text-sm"><strong>Set:</strong></p>
                    <p className="text-gray-900">{selectedCard.set_name}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-gray-600 text-sm"><strong>Rareza:</strong></p>
                    <p className="text-gray-900 capitalize">{selectedCard.rarity}</p>
                  </div>
                  {selectedCard.prices?.eur && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-gray-600 text-sm"><strong>Precio:</strong></p>
                      <p className="text-green-600 font-bold text-lg">€{parseFloat(selectedCard.prices.eur).toFixed(2)}</p>
                    </div>
                  )}
                  {selectedCard.power && selectedCard.toughness && (
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-gray-600 text-sm"><strong>P/T:</strong></p>
                      <p className="text-gray-900 text-lg font-bold">{selectedCard.power}/{selectedCard.toughness}</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedCard(null)}
                  className="btn-secondary w-full"
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
