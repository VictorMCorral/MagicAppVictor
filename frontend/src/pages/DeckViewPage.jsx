import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Upload, Plus, Trash2 } from 'lucide-react';
import deckService from '../services/deckService';
import cardService from '../services/cardService';

const DeckViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardSearch, setCardSearch] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');

  useEffect(() => {
    loadDeck();
  }, [id]);

  const loadDeck = async () => {
    try {
      const response = await deckService.getDeckById(id);
      setDeck(response.data);
    } catch (error) {
      console.error('Error al cargar mazo:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async () => {
    if (!cardSearch.trim()) return;

    try {
      const cardResponse = await cardService.findCardByName(cardSearch);
      if (cardResponse.success) {
        await deckService.addCardToDeck(id, cardResponse.data.scryfallId, 1);
        setCardSearch('');
        setShowAddCard(false);
        loadDeck();
      }
    } catch (error) {
      console.error('Error al añadir carta:', error);
      alert('No se pudo añadir la carta');
    }
  };

  const handleRemoveCard = async (cardId) => {
    if (window.confirm('¿Eliminar esta carta del mazo?')) {
      try {
        await deckService.removeCardFromDeck(id, cardId);
        loadDeck();
      } catch (error) {
        console.error('Error al eliminar carta:', error);
      }
    }
  };

  const handleExport = async () => {
    try {
      const blob = await deckService.exportDeck(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${deck.name}.txt`;
      a.click();
    } catch (error) {
      console.error('Error al exportar:', error);
    }
  };

  const handleImport = async () => {
    try {
      await deckService.importDeck(id, importText, false);
      setImportText('');
      setShowImport(false);
      loadDeck();
      alert('Mazo importado exitosamente');
    } catch (error) {
      console.error('Error al importar:', error);
      alert('Error al importar mazo');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando mazo...</div>
      </div>
    );
  }

  if (!deck) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="card mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{deck.name}</h1>
            {deck.format && (
              <p className="text-gray-600 mt-1">{deck.format}</p>
            )}
          </div>
          <div className="flex space-x-2">
            <button onClick={handleExport} className="btn-secondary flex items-center space-x-1">
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
            <button onClick={() => setShowImport(true)} className="btn-secondary flex items-center space-x-1">
              <Upload className="w-4 h-4" />
              <span>Importar</span>
            </button>
            <button onClick={() => setShowAddCard(true)} className="btn-primary flex items-center space-x-1">
              <Plus className="w-4 h-4" />
              <span>Añadir Carta</span>
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        {deck.stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{deck.stats.totalCards}</p>
              <p className="text-sm text-gray-600">Total Cartas</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{deck.stats.uniqueCards}</p>
              <p className="text-sm text-gray-600">Cartas Únicas</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{deck.stats.avgCmc}</p>
              <p className="text-sm text-gray-600">CMC Promedio</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">€{deck.stats.totalValueEur}</p>
              <p className="text-sm text-gray-600">Valor Total</p>
            </div>
          </div>
        )}
      </div>

      {/* Cartas del mazo en vista tipo grid */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Cartas ({deck.cards.length})</h2>
          <div className="text-sm text-gray-600">
            Vista de cartas (tamaño completo)
          </div>
        </div>
        {deck.cards.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No hay cartas en este mazo todavía
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {deck.cards.map((card) => (
              <div key={card.id} className="relative group">
                <div className="absolute top-2 left-2 z-10 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                  {card.quantity}x
                </div>
                {card.imageUrl ? (
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="w-full h-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full aspect-[63/88] bg-gray-200 rounded-lg" />
                )}
                <div className="mt-2 text-sm">
                  <p className="font-semibold truncate" title={card.name}>{card.name}</p>
                  <p className="text-gray-600 truncate" title={card.type}>{card.type}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  {card.priceEur && (
                    <span className="text-green-600 font-medium text-sm">
                      €{(card.priceEur * card.quantity).toFixed(2)}
                    </span>
                  )}
                  <button
                    onClick={() => handleRemoveCard(card.id)}
                    className="text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Eliminar carta"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Añadir Carta */}
      {showAddCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6">Añadir Carta</h2>
            <input
              type="text"
              value={cardSearch}
              onChange={(e) => setCardSearch(e.target.value)}
              placeholder="Nombre de la carta..."
              className="input-field mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCard()}
            />
            <div className="flex space-x-4">
              <button onClick={() => setShowAddCard(false)} className="flex-1 btn-secondary">
                Cancelar
              </button>
              <button onClick={handleAddCard} className="flex-1 btn-primary">
                Añadir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Importar */}
      {showImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-6">Importar Mazo</h2>
            <p className="text-sm text-gray-600 mb-4">
              Formato: cantidad nombre_carta (ej: 4 Lightning Bolt)
            </p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="4 Lightning Bolt&#10;2 Counterspell&#10;1 Black Lotus"
              className="input-field h-64 font-mono text-sm mb-4"
            />
            <div className="flex space-x-4">
              <button onClick={() => setShowImport(false)} className="flex-1 btn-secondary">
                Cancelar
              </button>
              <button onClick={handleImport} className="flex-1 btn-primary">
                Importar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeckViewPage;
