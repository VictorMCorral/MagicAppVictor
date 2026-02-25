import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form, Spinner, Badge } from 'react-bootstrap';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import deckService from '../services/deckService';
import { resolveFlowPath } from '../utils/versionRouting';
import ConfirmActionModal from '../components/ConfirmActionModal';
import FlashMessage from '../components/FlashMessage';

const DashboardPage = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deckToDelete, setDeckToDelete] = useState(null);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckFormat, setNewDeckFormat] = useState('');
  const [flash, setFlash] = useState({ show: false, message: '', variant: 'success' });
  const location = useLocation();

  const toFlowPath = (path) => resolveFlowPath(path, location.pathname);

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
      await loadDecks();
      setFlash({ show: true, message: 'Mazo creado correctamente.', variant: 'success' });
    } catch (error) {
      console.error('Error al crear mazo:', error);
      setFlash({ show: true, message: 'No se pudo crear el mazo.', variant: 'danger' });
    }
  };

  const handleDeleteDeck = (id) => {
    setDeckToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteDeck = async () => {
    if (!deckToDelete) return;
    try {
      await deckService.deleteDeck(deckToDelete);
      await loadDecks();
      setFlash({ show: true, message: 'Mazo eliminado.', variant: 'warning' });
    } catch (error) {
      console.error('Error al eliminar mazo:', error);
      setFlash({ show: true, message: 'No se pudo eliminar el mazo.', variant: 'danger' });
    } finally {
      setDeckToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div 
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)' }}
      >
        <div className="text-center">
          <Spinner animation="border" style={{ color: 'var(--mtg-gold-bright)' }} />
          <p className="fs-4 mt-3" style={{ color: 'var(--mtg-gold-bright)' }}>Cargando mazos...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-vh-100 py-4"
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)' }}
    >
      <Container>
        <FlashMessage
          show={flash.show}
          message={flash.message}
          variant={flash.variant}
          onClose={() => setFlash((previous) => ({ ...previous, show: false }))}
        />

        {/* Header */}
        <Row className="mb-5 align-items-center">
          <Col>
            <h1 className="display-5 fw-bold" style={{ color: 'var(--mtg-gold-bright)' }}>
              💎 Mis Mazos
            </h1>
          </Col>
          <Col xs="auto">
            <Button 
              className="btn-mtg-primary d-flex align-items-center gap-2"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={20} />
              <span>Nuevo Mazo</span>
            </Button>
          </Col>
        </Row>

        {/* Empty State */}
        {decks.length === 0 ? (
          <Card className="card-mtg text-center py-5">
            <Card.Body>
              <Sparkles size={64} className="mb-4" style={{ color: 'var(--mtg-gold-bright)' }} />
              <p className="fs-5 mb-4" style={{ color: 'var(--mtg-text-light)' }}>
                No tienes mazos todavía
              </p>
              <Button 
                className="btn-mtg-primary d-inline-flex align-items-center gap-2"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus size={20} />
                <span>Crear tu primer mazo</span>
              </Button>
            </Card.Body>
          </Card>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {decks.map((deck) => (
              <Col key={deck.id}>
                <Card className="card-mtg h-100">
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <Card.Title className="h5 fw-bold" style={{ color: 'var(--mtg-gold-bright)' }}>
                          {deck.name}
                        </Card.Title>
                        {deck.format && (
                          <Badge 
                            bg="transparent" 
                            className="mt-2"
                            style={{ 
                              color: 'var(--mtg-gold-dark)', 
                              background: 'rgba(212, 175, 55, 0.1)',
                              border: '1px solid rgba(212, 175, 55, 0.3)'
                            }}
                          >
                            {deck.format}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="link"
                        className="p-0 text-danger"
                        onClick={() => handleDeleteDeck(deck.id)}
                      >
                        <Trash2 size={20} />
                      </Button>
                    </div>

                    {deck.description && (
                      <Card.Text className="text-muted small mb-3">
                        {deck.description}
                      </Card.Text>
                    )}

                    <div 
                      className="d-flex justify-content-between align-items-center small text-muted mb-4 pb-3 border-bottom"
                      style={{ borderColor: 'rgba(212, 175, 55, 0.2) !important' }}
                    >
                      <span>📊 {deck._count.cards} cartas</span>
                      <span>📅 {new Date(deck.updatedAt).toLocaleDateString('es-ES')}</span>
                    </div>

                    <Link
                      to={toFlowPath(`/decks/${deck.id}`)}
                      className="btn btn-mtg-primary w-100 mt-auto"
                    >
                      Ver Mazo
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Modal Crear Mazo */}
        <Modal 
          show={showCreateModal} 
          onHide={() => setShowCreateModal(false)}
          centered
          contentClassName="card-mtg-premium"
        >
          <Modal.Header className="border-0">
            <Modal.Title className="fw-bold" style={{ color: 'var(--mtg-gold-bright)' }}>
              ✨ Crear Nuevo Mazo
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleCreateDeck}>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-mtg">Nombre del Mazo *</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={newDeckName}
                  onChange={(e) => setNewDeckName(e.target.value)}
                  className="form-control-mtg"
                  placeholder="Mi Mazo Increíble"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="form-label-mtg">Formato (opcional)</Form.Label>
                <Form.Select
                  value={newDeckFormat}
                  onChange={(e) => setNewDeckFormat(e.target.value)}
                  className="form-control-mtg"
                >
                  <option value="">Seleccionar formato...</option>
                  <option value="Standard">Standard</option>
                  <option value="Modern">Modern</option>
                  <option value="Commander">Commander</option>
                  <option value="Legacy">Legacy</option>
                  <option value="Vintage">Vintage</option>
                  <option value="Pauper">Pauper</option>
                </Form.Select>
              </Form.Group>

              <div className="d-flex gap-3">
                <Button
                  type="button"
                  className="btn-mtg-secondary flex-grow-1"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="btn-mtg-primary flex-grow-1">
                  Crear
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        <ConfirmActionModal
          show={showDeleteConfirm}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setDeckToDelete(null);
          }}
          onConfirm={confirmDeleteDeck}
          title="Eliminar mazo"
          message="¿Estás seguro de eliminar este mazo? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
          confirmVariant="danger"
        />
      </Container>
    </div>
  );
};

export default DashboardPage;
