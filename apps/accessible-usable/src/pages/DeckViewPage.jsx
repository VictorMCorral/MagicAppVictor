import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Alert, Badge, Button, Card, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { Download, Upload, Plus, Trash2 } from 'lucide-react';
import deckService from '../services/deckService';
import cardService from '../services/cardService';
import { resolveFlowPath } from '../utils/versionRouting';
import CardDetailsModal from '../components/CardDetailsModal';
import { isNoUsableFlow } from '../utils/flowMode';
import ConfirmActionModal from '../components/ConfirmActionModal';
import FlashMessage from '../components/FlashMessage';

const DeckViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const noUsableMode = isNoUsableFlow(location.pathname);

  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardSearch, setCardSearch] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [importing, setImporting] = useState(false);
  const [actionError, setActionError] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [cardToRemoveId, setCardToRemoveId] = useState(null);
  const [flash, setFlash] = useState({ show: false, message: '', variant: 'success' });

  const toFlowPath = useCallback(
    (path) => resolveFlowPath(path, location.pathname),
    [location.pathname]
  );

  const loadDeck = useCallback(async () => {
    try {
      const response = await deckService.getDeckById(id);
      setDeck(response.data);
      setActionError('');
    } catch (error) {
      console.error('Error al cargar mazo:', error);
      navigate(toFlowPath('/dashboard'));
    } finally {
      setLoading(false);
    }
  }, [id, navigate, toFlowPath]);

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
        await loadDeck();
        setFlash({ show: true, message: 'Carta añadida al mazo.', variant: 'success' });
      }
    } catch (error) {
      console.error('Error al añadir carta:', error);
      setActionError('No se pudo añadir la carta. Comprueba el nombre e inténtalo nuevamente.');
      setFlash({ show: true, message: 'No se pudo añadir la carta.', variant: 'danger' });
    }
  };

  const handleRemoveCard = (cardId) => {
    setCardToRemoveId(cardId);
    setShowRemoveConfirm(true);
  };

  const confirmRemoveCard = async () => {
    if (!cardToRemoveId) return;
    try {
      await deckService.removeCardFromDeck(id, cardToRemoveId);
      await loadDeck();
      setFlash({ show: true, message: 'Carta eliminada del mazo.', variant: 'warning' });
    } catch (error) {
      console.error('Error al eliminar carta:', error);
      setActionError('No se pudo eliminar la carta seleccionada.');
      setFlash({ show: true, message: 'No se pudo eliminar la carta.', variant: 'danger' });
    } finally {
      setCardToRemoveId(null);
      setShowRemoveConfirm(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await deckService.exportDeck(id);
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${deck.name}.txt`;
      anchor.click();
      window.URL.revokeObjectURL(url);
      setFlash({ show: true, message: 'Exportación completada.', variant: 'info' });
    } catch (error) {
      console.error('Error al exportar:', error);
      setActionError('No se pudo exportar el mazo.');
      setFlash({ show: true, message: 'No se pudo exportar el mazo.', variant: 'danger' });
    }
  };

  const handleImport = async () => {
    try {
      setImporting(true);

      if (noUsableMode) {
        const proprietaryFormatPattern = /^MTG\|[A-Za-z0-9\s'\-,]+\|\d+$/;
        const lines = importText
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean);

        const invalidLine = lines.find((line) => !proprietaryFormatPattern.test(line));
        if (invalidLine) {
          throw new Error('FORMATO_PROPIETARIO_INVALIDO');
        }

        const normalizedImport = lines
          .map((line) => {
            const [, cardName, quantity] = line.split('|');
            return `${quantity} ${cardName}`;
          })
          .join('\n');

        await deckService.importDeck(id, normalizedImport, false);
      } else {
        await deckService.importDeck(id, importText, false);
      }

      setImportText('');
      setShowImport(false);
      await loadDeck();
      setFlash({ show: true, message: 'Mazo importado correctamente.', variant: 'success' });
    } catch (error) {
      console.error('Error al importar:', error);
      if (error?.message === 'FORMATO_PROPIETARIO_INVALIDO') {
        setActionError('En este flujo solo se admite formato propietario: MTG|Nombre Carta|Cantidad');
        setFlash({ show: true, message: 'Formato inválido para este flujo.', variant: 'danger' });
      } else {
        setActionError('Error al importar el mazo. Revisa el formato del texto.');
        setFlash({ show: true, message: 'No se pudo importar el mazo.', variant: 'danger' });
      }
    } finally {
      setImporting(false);
    }
  };

  const displayedCards = noUsableMode
    ? (deck?.cards || []).flatMap((card) =>
        Array.from({ length: Math.max(card.quantity || 1, 1) }, (_, index) => ({
          ...card,
          quantity: 1,
          originalId: card.id,
          id: `${card.id}-split-${index}`
        }))
      )
    : (deck?.cards || []);

  const handleOpenCardDetails = async (card) => {
    try {
      const cardDetailResponse = await cardService.getCardByName(card.name);
      if (cardDetailResponse?.success && cardDetailResponse?.data) {
        const detailedCard = cardDetailResponse.data;
        setSelectedCard({
          ...card,
          ...detailedCard,
          manaCost: detailedCard.manaCost,
          oracleText: detailedCard.oracleText,
          setName: detailedCard.setName,
          priceEur: detailedCard.priceEur
        });
        return;
      }
      setSelectedCard(card);
    } catch (error) {
      console.error('Error al cargar detalle de carta:', error);
      setSelectedCard(card);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-mtg-darker">
        <div className="text-center">
          <Spinner animation="border" variant="warning" className="mb-3" />
          <p className="fs-5 text-mtg-gold fw-semibold mb-0">Invocando mazo...</p>
        </div>
      </div>
    );
  }

  if (!deck) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="mb-0">Mazo no encontrado.</Alert>
      </Container>
    );
  }

  return (
    <div className="deck-view-container py-4">
      <Container>
        <FlashMessage
          show={flash.show}
          message={flash.message}
          variant={flash.variant}
          onClose={() => setFlash((previous) => ({ ...previous, show: false }))}
        />

        {actionError && (
          <Alert variant="danger" onClose={() => setActionError('')} dismissible>
            {actionError}
          </Alert>
        )}

        <Card className="deck-header-card mb-4">
          <Card.Body>
            <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Badge bg="warning" text="dark">{deck.format || 'Casual'}</Badge>
                  <small className="text-mtg-muted">{new Date(deck.updatedAt || Date.now()).toLocaleDateString()}</small>
                </div>
                <h1 className="text-mtg-gold mb-1">{deck.name}</h1>
                {deck.description && <p className="text-mtg-light mb-0">{deck.description}</p>}
              </div>

              <div className="d-flex flex-wrap gap-2 align-self-start">
                <Button variant="secondary" className="btn-mtg-secondary" onClick={handleExport} title="Descargar lista">
                  <Download size={16} className="me-2" />
                  Exportar
                </Button>
                <Button variant="secondary" className="btn-mtg-secondary" onClick={() => setShowImport(true)} title="Subir lista">
                  <Upload size={16} className="me-2" />
                  Importar
                </Button>
                <Button variant="primary" className="btn-mtg-primary" onClick={() => setShowAddCard(true)}>
                  <Plus size={16} className="me-2" />
                  Añadir Carta
                </Button>
              </div>
            </div>

            {deck.stats && (
              <Row className="mt-4 g-3">
                <Col xs={6} md={3}>
                  <Card className="card-mtg text-center h-100"><Card.Body><div className="h4 text-mtg-gold mb-0">{deck.stats.totalCards}</div><small className="text-mtg-muted">Cartas</small></Card.Body></Card>
                </Col>
                <Col xs={6} md={3}>
                  <Card className="card-mtg text-center h-100"><Card.Body><div className="h4 text-success mb-0">{deck.stats.uniqueCards}</div><small className="text-mtg-muted">Únicas</small></Card.Body></Card>
                </Col>
                <Col xs={6} md={3}>
                  <Card className="card-mtg text-center h-100"><Card.Body><div className="h4 text-info mb-0">{deck.stats.avgCmc}</div><small className="text-mtg-muted">CMC Medio</small></Card.Body></Card>
                </Col>
                <Col xs={6} md={3}>
                  <Card className="card-mtg text-center h-100"><Card.Body><div className="h4 text-warning mb-0">€{deck.stats.totalValueEur}</div><small className="text-mtg-muted">Valor Est.</small></Card.Body></Card>
                </Col>
              </Row>
            )}
          </Card.Body>
        </Card>

        <Card className="deck-cards-section">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h4 text-mtg-light mb-0">Biblioteca</h2>
              <small className="text-mtg-muted">{displayedCards.length} cartas</small>
            </div>

            {displayedCards.length === 0 ? (
              <Alert variant="secondary" className="mb-0 text-center">
                Tu mazo está vacío. Añade cartas o importa una lista.
              </Alert>
            ) : (
              <Row className="g-3">
                {displayedCards.map((card) => (
                  <Col key={card.id} xs={12} sm={6} md={4} lg={3} xl={2}>
                    <Card
                      className="h-100 card-mtg deck-grid-card cursor-pointer"
                      onClick={() => handleOpenCardDetails(card)}
                      role="button"
                      aria-label={`Ver detalle de ${card.name}`}
                    >
                      <div className="deck-card-media">
                        <Card.Img
                          variant="top"
                          src={card.imageUrl || `${process.env.PUBLIC_URL}/logo.jpg`}
                          alt={card.name}
                          className="deck-card-media-img"
                          onError={(event) => {
                            event.target.onerror = null;
                            event.target.src = `${process.env.PUBLIC_URL}/mtg-nexus-logo.svg`;
                          }}
                        />
                      </div>
                      <Card.Body className="d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <small className="text-mtg-muted">x{card.quantity}</small>
                          <Button
                            variant="link"
                            className="text-danger p-0"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleRemoveCard(card.originalId || card.id);
                            }}
                            title="Eliminar carta"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                        <h6 className="text-mtg-light mb-1">{card.name}</h6>
                        <small className="text-mtg-muted mb-2">{card.type}</small>
                        <small className="text-mtg-gold mt-auto">
                          {card.priceEur ? `€${(card.priceEur * card.quantity).toFixed(2)}` : '-'}
                        </small>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Card.Body>
        </Card>
      </Container>

      <Modal show={showAddCard} onHide={() => setShowAddCard(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Nueva Carta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={cardSearch}
            onChange={(event) => setCardSearch(event.target.value)}
            placeholder="Ej: Black Lotus"
            onKeyDown={(event) => event.key === 'Enter' && handleAddCard()}
            autoFocus
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddCard(false)}>
            Cancelar
          </Button>
          <Button variant="warning" onClick={handleAddCard} disabled={!cardSearch.trim()}>
            Buscar y Añadir
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showImport} onHide={() => setShowImport(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Importar Lista de Mazo</Modal.Title>
        </Modal.Header>
        <Modal.Body className="position-relative">
          {importing && (
            <div
              className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
              style={{
                backgroundColor: 'rgba(5, 8, 16, 0.78)',
                backdropFilter: 'blur(2px)',
                zIndex: 10
              }}
            >
              <Spinner animation="border" variant="warning" className="mb-3" />
              <p className="mb-0 fw-semibold text-mtg-gold">Importando mazo...</p>
            </div>
          )}
          <p className="small mb-3 text-mtg-light ux-helper-text">
            {noUsableMode ? (
              <>
                Formato obligatorio en este flujo: <strong>MTG|Nombre Carta|Cantidad</strong>.<br />
                Ejemplo: <strong>MTG|Lightning Bolt|4</strong>.
              </>
            ) : (
              <>
                Formato recomendado: una carta por línea con la estructura <strong>cantidad nombre_carta</strong>.
                Ejemplo: <strong>4 Lightning Bolt</strong>.
              </>
            )}
          </p>
          <Form.Control
            as="textarea"
            rows={12}
            value={importText}
            onChange={(event) => setImportText(event.target.value)}
            placeholder={noUsableMode ? 'MTG|Lightning Bolt|4&#10;MTG|Counterspell|2' : '4 Lightning Bolt&#10;2 Counterspell&#10;1 Black Lotus'}
            disabled={importing}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImport(false)} disabled={importing}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleImport} disabled={importing || !importText.trim()}>
            {importing ? 'Importando...' : 'Procesar Importación'}
          </Button>
        </Modal.Footer>
      </Modal>

      <ConfirmActionModal
        show={showRemoveConfirm}
        onCancel={() => {
          setShowRemoveConfirm(false);
          setCardToRemoveId(null);
        }}
        onConfirm={confirmRemoveCard}
        title="Eliminar carta"
        message="¿Eliminar esta carta del mazo?"
        confirmText="Eliminar"
        cancelText="Cancelar"
        confirmVariant="danger"
      />

      <CardDetailsModal card={selectedCard} show={!!selectedCard} onHide={() => setSelectedCard(null)} />
    </div>
  );
};

export default DeckViewPage;
