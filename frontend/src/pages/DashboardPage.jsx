import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit, Sparkles } from 'lucide-react';
import deckService from '../services/deckService';

const DashboardPage = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckFormat, setNewDeckFormat] = useState('');

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    try {
      const response = await deckService.getMyDecks();
      setDecks(response.data);
    } catch (error) {
      console.error('Error al cargar mazos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeck = async (e) => {
    e.preventDefault();
    try {
      await deckService.createDeck({
        name: newDeckName,
        format: newDeckFormat || undefined
      });
      setNewDeckName('');
      setNewDeckFormat('');
      setShowCreateModal(false);
      loadDecks();
    } catch (error) {
      console.error('Error al crear mazo:', error);
    }
  };

  const handleDeleteDeck = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este mazo?')) {
      try {
        await deckService.deleteDeck(id);
        loadDecks();
      } catch (error) {
        console.error('Error al eliminar mazo:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-mtg-gradient flex items-center justify-center">
        <div className="text-2xl text-mtg-gold-bright font-nexus animate-pulse">Cargando mazos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mtg-gradient py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-mtg-gold-bright font-nexus">
            💎 Mis Mazos
          </h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Mazo</span>
          </button>
        </div>

        {decks.length === 0 ? (
          <div className="card text-center py-16">
            <Sparkles className="w-16 h-16 text-mtg-gold-bright mx-auto mb-4" />
            <p className="text-mtg-text-light text-lg mb-6">
              No tienes mazos todavía
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Crear tu primer mazo</span>
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.map((deck) => (
              <div key={deck.id} className="card hover:border-mtg-gold-bright">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-mtg-gold-bright">{deck.name}</h3>
                    {deck.format && (
                      <span className="inline-block text-xs text-mtg-gold-dark bg-mtg-gold-bright/10 px-2 py-1 rounded mt-2">
                        {deck.format}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteDeck(deck.id)}
                    className="text-mtg-red hover:text-mtg-red-deep transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {deck.description && (
                  <p className="text-mtg-text-muted text-sm mb-4">{deck.description}</p>
                )}

                <div className="flex justify-between items-center text-sm text-mtg-text-muted mb-6 pb-4 border-b border-mtg-gold-bright/20">
                  <span>📊 {deck._count.cards} cartas</span>
                  <span>📅 {new Date(deck.updatedAt).toLocaleDateString('es-ES')}</span>
                </div>

                <Link
                  to={`/deck/${deck.id}`}
                  className="block w-full text-center btn-primary"
                >
                  Ver Mazo
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Modal Crear Mazo */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="card-premium max-w-md w-full">
              <h2 className="text-2xl font-bold text-mtg-gold-bright mb-6 font-nexus">
                ✨ Crear Nuevo Mazo
              </h2>
              <form onSubmit={handleCreateDeck}>
                <div className="space-y-4">
                  <div>
                    <label className="label-form">
                      Nombre del Mazo *
                    </label>
                    <input
                      type="text"
                      required
                      value={newDeckName}
                      onChange={(e) => setNewDeckName(e.target.value)}
                      className="input-field"
                      placeholder="Mi Mazo Increíble"
                    />
                  </div>

                  <div>
                    <label className="label-form">
                      Formato (opcional)
                    </label>
                    <select
                      value={newDeckFormat}
                      onChange={(e) => setNewDeckFormat(e.target.value)}
                      className="input-field"
                    >
                      <option value="">Seleccionar formato...</option>
                      <option value="Standard">Standard</option>
                      <option value="Modern">Modern</option>
                      <option value="Commander">Commander</option>
                      <option value="Legacy">Legacy</option>
                      <option value="Vintage">Vintage</option>
                      <option value="Pauper">Pauper</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="flex-1 btn-primary">
                    Crear
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
