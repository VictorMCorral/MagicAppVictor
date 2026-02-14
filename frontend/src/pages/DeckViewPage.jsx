import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form, Spinner, Badge } from 'react-bootstrap';
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

  const loadDeck = useCallback(async () => {
    try {
      const response = await deckService.getDeckById(id);
      setDeck(response.data);
    } catch (error) {
      console.error('Error al cargar mazo:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadDeck();
  }, [loadDeck]);

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
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="fs-5 mt-3">Cargando mazo...</p>
        </div>
      </div>
    );
  }

  if (!deck) return null;

  return (
    <Container className="py-4">
      {/* Header */}
      <Card className="card-mtg mb-4">
        <Card.Body>
          <Row className="align-items-start mb-4">
            <Col>
              <h1 className="display-6 fw-bold text-dark">{deck.name}</h1>
              {deck.format && (
                <p className="text-muted">{deck.format}</p>
              )}
            </Col>
            <Col xs="auto">
              <div className="d-flex gap-2 flex-wrap">
                <Button 
                  className="btn-mtg-secondary d-flex align-items-center gap-1"
                  onClick={handleExport}
                >
                  <Download size={16} />
                  <span>Exportar</span>
                </Button>
                <Button 
                  className="btn-mtg-secondary d-flex align-items-center gap-1"
                  onClick={() => setShowImport(true)}
                >
                  <Upload size={16} />
                  <span>Importar</span>
                </Button>
                <Button 
                  className="btn-mtg-primary d-flex align-items-center gap-1"
                  onClick={() => setShowAddCard(true)}
                >
                  <Plus size={16} />
                  <span>Añadir Carta</span>
                </Button>
              </div>
            </Col>
          </Row>

          {/* Estadísticas */}
          {deck.stats && (
            <Row className="g-3 mt-2">
              <Col xs={6} md={3}>
                <div className="text-center">
                  <p className="display-6 fw-bold text-primary mb-0">{deck.stats.totalCards}</p>
                  <p className="small text-muted">Total Cartas</p>
                </div>
              </Col>
              <Col xs={6} md={3}>
                <div className="text-center">
                  <p className="display-6 fw-bold text-success mb-0">{deck.stats.uniqueCards}</p>
                  <p className="small text-muted">Cartas Únicas</p>
                </div>
              </Col>
              <Col xs={6} md={3}>
                <div className="text-center">
                  <p className="display-6 fw-bold mb-0" style={{ color: '#8b5cf6' }}>{deck.stats.avgCmc}</p>
                  <p className="small text-muted">CMC Promedio</p>
                </div>
              </Col>
              <Col xs={6} md={3}>
                <div className="text-center">
                  <p className="display-6 fw-bold text-warning mb-0">€{deck.stats.totalValueEur}</p>
                  <p className="small text-muted">Valor Total</p>
                </div>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Cartas del mazo */}
      <Card className="card-mtg">
        <Card.Body>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h2 className="h4 fw-bold mb-0">Cartas ({deck.cards.length})</h2>
            <small className="text-muted">Vista de cartas (tamaño completo)</small>
          </div>

          {deck.cards.length === 0 ? (
            <p className="text-muted text-center py-5">
              No hay cartas en este mazo todavía
            </p>
          ) : (
            <Row xs={2} sm={3} md={4} lg={5} xl={6} className="g-3">
              {deck.cards.map((card) => (
                <Col key={card.id}>
                  <div className="position-relative">
                    <Badge 
                      bg="dark" 
                      className="position-absolute top-0 start-0 m-2 z-1"
                    >
                      {card.quantity}x
                    </Badge>
                    {card.imageUrl ? (
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        className="w-100 rounded shadow"
                        loading="lazy"
                      />
                    ) : (
                      <div 
                        className="w-100 bg-secondary rounded"
                        style={{ aspectRatio: '63/88' }}
                      />
                    )}
                    <div className="mt-2">
                      <p className="fw-semibold text-truncate small mb-0" title={card.name}>{card.name}</p>
                      <p className="text-muted text-truncate small mb-0" title={card.type}>{card.type}</p>
                    </div>
                    <div className="d-flex align-items-center justify-content-between mt-2">
                      {card.priceEur && (
                        <span className="text-success fw-medium small">
                          €{(card.priceEur * card.quantity).toFixed(2)}
                        </span>
                      )}
                      <Button
                        variant="link"
                        className="p-0 text-danger opacity-75"
                        onClick={() => handleRemoveCard(card.id)}
                        title="Eliminar carta"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Modal Añadir Carta */}
      <Modal show={showAddCard} onHide={() => setShowAddCard(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Carta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={cardSearch}
            onChange={(e) => setCardSearch(e.target.value)}
            placeholder="Nombre de la carta..."
            className="form-control-mtg mb-3"
            onKeyPress={(e) => e.key === 'Enter' && handleAddCard()}
          />
          <div className="d-flex gap-3">
            <Button 
              className="btn-mtg-secondary flex-grow-1"
              onClick={() => setShowAddCard(false)}
            >
              Cancelar
            </Button>
            <Button 
              className="btn-mtg-primary flex-grow-1"
              onClick={handleAddCard}
            >
              Añadir
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal Importar */}
      <Modal show={showImport} onHide={() => setShowImport(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Importar Mazo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="small text-muted mb-3">
            Formato: cantidad nombre_carta (ej: 4 Lightning Bolt)
          </p>
          <Form.Control
            as="textarea"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder={"4 Lightning Bolt\n2 Counterspell\n1 Black Lotus"}
            className="form-control-mtg font-monospace small mb-3"
            style={{ height: '256px' }}
          />
          <div className="d-flex gap-3">
            <Button 
              className="btn-mtg-secondary flex-grow-1"
              onClick={() => setShowImport(false)}
            >
              Cancelar
            </Button>
            <Button 
              className="btn-mtg-primary flex-grow-1"
              onClick={handleImport}
            >
              Importar
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default DeckViewPage;
