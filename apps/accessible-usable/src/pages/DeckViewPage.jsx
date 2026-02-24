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
  const [importing, setImporting] = useState(false);

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
      setImporting(true);
      await deckService.importDeck(id, importText, false);
      setImportText('');
      setShowImport(false);
      loadDeck();
      alert('Mazo importado exitosamente');
    } catch (error) {
      console.error('Error al importar:', error);
      alert('Error al importar mazo');
    } finally {
      setImporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-mtg-darker">
        <div className="text-center">
          <div className="spinner-border text-warning mb-3" role="status"></div>
          <p className="text-xl text-mtg-gold font-semibold animate-pulse">Invocando mazo...</p>
        </div>
      </div>
    );
  }

  if (!deck) return (
    <div className="min-vh-100 flex items-center justify-center text-white">Mazo no encontrado</div>
  );

  return (
    <div className="deck-view-container py-5 px-3 md:px-5">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header Superior & Acciones */}
        <div className="deck-header-card relative overflow-hidden group">
          {/* Fondo decorativo sutil */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500 opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {deck.format || 'Casual'}
                </span>
                <span className="text-gray-400 text-xs flex items-center gap-1">
                  📅 {new Date(deck.updatedAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight drop-shadow-lg">
                {deck.name}
              </h1>
              {deck.description && (
                <p className="text-gray-300 max-w-2xl text-lg leading-relaxed">{deck.description}</p>
              )}
            </div>

            <div className="deck-actions-bar">
              <button 
                onClick={handleExport}
                className="btn-mtg-secondary flex items-center gap-2 shadow-lg hover:shadow-yellow-500/20"
                title="Descargar lista"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Exportar</span>
              </button>
              
              <button 
                onClick={() => setShowImport(true)}
                className="btn-mtg-secondary flex items-center gap-2 shadow-lg hover:shadow-blue-500/20"
                title="Subir lista"
              >
                <Upload size={18} />
                <span className="hidden sm:inline">Importar</span>
              </button>
              
              <button 
                onClick={() => setShowAddCard(true)}
                className="btn-mtg-primary flex items-center gap-2 shadow-xl hover:shadow-yellow-500/30 transform hover:-translate-y-1 transition-all"
              >
                <Plus size={20} />
                <span className="font-bold">Añadir Carta</span>
              </button>
            </div>
          </div>

          {/* Grid de Estadísticas */}
          {deck.stats && (
            <div className="deck-stats-grid mt-8 pt-6 border-t border-white/10">
              <div className="deck-stat-item">
                <div className="deck-stat-value yellow">{deck.stats.totalCards}</div>
                <div className="deck-stat-label">Cartas</div>
              </div>
              <div className="deck-stat-item">
                <div className="deck-stat-value green">{deck.stats.uniqueCards}</div>
                <div className="deck-stat-label">Únicas</div>
              </div>
              <div className="deck-stat-item">
                <div className="deck-stat-value blue">{deck.stats.avgCmc}</div>
                <div className="deck-stat-label">CMC Medio</div>
              </div>
              <div className="deck-stat-item border-yellow-500/30 bg-yellow-500/5">
                <div className="deck-stat-value yellow">€{deck.stats.totalValueEur}</div>
                <div className="deck-stat-label gold">Valor Est.</div>
              </div>
            </div>
          )}
        </div>

        {/* Sección de Cartas */}
        <div className="deck-cards-section shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-white/10 gap-4">
            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                📚 Biblioteca
              </h2>
              <span className="text-gray-400 text-sm font-medium">
                ({deck.cards.length} cartas totales)
              </span>
            </div>
            
            {/* Filtros o vista (placeholder para futuro) */}
            <div className="flex gap-2">
              <div className="px-3 py-1 rounded bg-black/30 border border-white/10 text-xs text-gray-400">
                Vista: Grid
              </div>
            </div>
          </div>

          {deck.cards.length === 0 ? (
            <div className="text-center py-20 bg-black/20 rounded-xl border border-dashed border-white/10">
              <div className="mb-4 text-gray-600">
                <Plus className="w-16 h-16 mx-auto opacity-20" />
              </div>
              <h3 className="text-xl font-bold text-gray-300 mb-2">Tu mazo está vacío</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Comienza añadiendo cartas individualmente o importa una lista completa.
              </p>
              <button 
                onClick={() => setShowAddCard(true)}
                className="btn-mtg-outline hover:bg-yellow-500 hover:text-black transition-colors"
              >
                Comenzar a construir
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {deck.cards.map((card) => (
                <div key={card.id} className="deck-card-item group relative">
                  
                  {/* Badge de Cantidad - Estilo mejorado */}
                  <div className="absolute -top-3 -right-3 z-20">
                    <span className="flex items-center justify-center w-8 h-8 bg-yellow-500 text-black font-extrabold text-sm rounded-full shadow-lg border-2 border-[#1a1b26]">
                      {card.quantity}
                    </span>
                  </div>

                  {/* Imagen de carta con efecto hover */}
                  <div className="deck-card-image-wrapper">
                    {card.imageUrl ? (
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-4">
                        <span className="text-gray-600 text-xs text-center font-mono">Sin imagen disponible</span>
                      </div>
                    )}
                    {/* Overlay gradiente para legibilidad si es necesario */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                  </div>

                  {/* Información de la carta */}
                  <div className="deck-card-info">
                    <h3 className="deck-card-name" title={card.name}>{card.name}</h3>
                    <p className="deck-card-type" title={card.type}>{card.type}</p>
                    
                    <div className="mt-auto pt-3 flex items-center justify-between border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">Precio</span>
                        <span className="deck-card-price">
                          {card.priceEur ? `€${(card.priceEur * card.quantity).toFixed(2)}` : '-'}
                        </span>
                      </div>
                      
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemoveCard(card.id); }}
                        className="p-2 rounded-full text-red-500 hover:text-red-300 hover:bg-red-500/20 transition-colors"
                        title="Eliminar carta"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Añadir Carta - Reestilizado */}
      {showAddCard && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#12121a] border border-yellow-500/30 rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600"></div>
            
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-2">Añadir Nueva Carta</h2>
              <p className="text-gray-400 text-sm mb-6">Busca por el nombre exacto de la carta (en inglés) para añadirla a tu mazo.</p>
              
              <div className="relative mb-6">
                <input
                  type="text"
                  value={cardSearch}
                  onChange={(e) => setCardSearch(e.target.value)}
                  placeholder="Ej: Black Lotus"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCard()}
                  autoFocus
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <Plus size={20} />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowAddCard(false)} 
                  className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition font-medium"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleAddCard} 
                  disabled={!cardSearch.trim()}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold hover:from-yellow-500 hover:to-yellow-400 shadow-lg shadow-yellow-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buscar y Añadir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Importar - Reestilizado */}
      {showImport && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#12121a] border border-blue-500/30 rounded-2xl w-full max-w-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600"></div>
            
            <div className="p-8 pb-0">
              <h2 className="text-2xl font-bold text-white mb-2">Importar Lista de Mazo</h2>
              <p className="text-gray-400 text-sm mb-6">
                Pega tu lista de cartas abajo. Formato aceptado: <code className="bg-white/10 px-1 rounded text-yellow-500">Cantidad Nombre</code>
              </p>
            </div>
            
            <div className="px-8 flex-1 min-h-0">
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="4 Lightning Bolt&#10;2 Counterspell&#10;1 Black Lotus"
                className="w-full h-full min-h-[300px] bg-black/40 border border-white/10 rounded-xl p-5 text-gray-300 placeholder-gray-700 font-mono text-sm focus:outline-none focus:border-blue-500/50 resize-none"
              />
            </div>

            <div className="p-8 flex gap-3">
              <button 
                onClick={() => setShowImport(false)} 
                className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition font-medium"
              >
                Cancelar
              </button>
              <button 
                onClick={handleImport}
                disabled={importing || !importText.trim()}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {importing ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Importando...
                  </>
                ) : 'Procesar Importación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeckViewPage;
