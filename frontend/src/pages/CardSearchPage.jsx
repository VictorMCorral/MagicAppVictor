import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner, Modal } from 'react-bootstrap';
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
    <Container className="py-4">
      <h1 className="display-5 fw-bold mb-2" style={{ color: 'var(--mtg-gold-bright)' }}>🔍 Buscar Cartas</h1>
      <p className="mb-4" style={{ color: 'var(--mtg-text-muted)' }}>Encuentra cualquier carta de Magic The Gathering</p>

      {/* Buscador */}
      <Card className="card-mtg mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="g-3 align-items-end">
              <Col>
                <Form.Control
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por nombre, tipo, texto..."
                  className="form-control-mtg"
                />
              </Col>
              <Col xs="auto">
                <Button type="submit" className="btn-mtg-primary d-flex align-items-center gap-2">
                  <Search size={20} />
                  <span>Buscar</span>
                </Button>
              </Col>
            </Row>
            <p className="mt-3 mb-0 small" style={{ color: 'var(--mtg-text-muted)' }}>
              💡 Ejemplos: "Lightning Bolt", "type:creature", "c:red"
            </p>
          </Form>
        </Card.Body>
      </Card>

      {/* Resultados */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" style={{ color: 'var(--mtg-gold-bright)' }} />
          <p className="fs-5 mt-3" style={{ color: 'var(--mtg-gold-bright)' }}>Buscando cartas...</p>
        </div>
      ) : cards.length > 0 ? (
        <>
          <p className="mb-4 fs-5 fw-semibold" style={{ color: 'var(--mtg-text-light)' }}>
            ✨ {cards.length} {cards.length === 1 ? 'carta encontrada' : 'cartas encontradas'}
          </p>
          <Row xs={2} sm={3} md={4} lg={5} xl={6} className="g-4">
            {cards.map((card) => {
              const imageUrl = card.image_uris?.normal || card.imageUrl;
              const price = card.prices?.eur || card.priceEur;

              return (
                <Col key={card.id}>
                  <div 
                    onClick={() => setSelectedCard(card)} 
                    className="inventory-card-item h-100 cursor-pointer position-relative d-flex flex-column"
                    style={{ cursor: 'pointer', background: 'linear-gradient(145deg, #1a1a2e 0%, #0a0a15 100%)', border: '1px solid rgba(255, 215, 0, 0.2)' }}
                  >
                    {/* Imagen */}
                    <div className="card-image-container mb-2 position-relative overflow-hidden rounded" style={{ aspectRatio: '63/88' }}>
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={card.name}
                          className="w-100 h-100 object-fit-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-dark text-center p-2">
                          <span className="fw-bold" style={{ color: 'var(--mtg-gold-bright)' }}>{card.name}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="mt-auto p-2">
                      <h6 className="fw-bold text-truncate mb-1" style={{ fontSize: '0.9rem', color: 'var(--mtg-text-light)' }}>{card.name}</h6>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-truncate flex-grow-1 me-2" style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                          {card.type_line}
                        </small>
                        {price && (
                          <span className="fw-bold small" style={{ color: '#4ade80' }}>
                            €{parseFloat(price).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </>
      ) : query && !loading ? (
        <Card className="card-mtg text-center py-5">
          <Card.Body>
            <p className="fs-5 mb-2" style={{ color: 'var(--mtg-gold-bright)' }}>No se encontraron cartas para "{query}"</p>
            <p className="small" style={{ color: 'var(--mtg-text-muted)' }}>Intenta con otro nombre o criterio de búsqueda</p>
          </Card.Body>
        </Card>
      ) : null}

      {/* Modal de detalle ESTILIZADO */}
      <Modal 
        show={!!selectedCard} 
        onHide={() => setSelectedCard(null)} 
        size="lg" 
        centered
        contentClassName="card-mtg-premium"
      >
        {selectedCard && (
          <>
            <Modal.Header className="border-0">
              <Modal.Title className="fw-bold" style={{ color: 'var(--mtg-gold-bright)' }}>
                {selectedCard.name}
              </Modal.Title>
              <Button 
                variant="link" 
                className="p-0 text-decoration-none"
                onClick={() => setSelectedCard(null)}
                style={{ color: 'var(--mtg-text-light)' }}
              >
                ✕
              </Button>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col md={5} className="mb-4 mb-md-0 d-flex justify-content-center">
                  {selectedCard.image_uris?.normal ? (
                    <img
                      src={selectedCard.image_uris.normal}
                      alt={selectedCard.name}
                      className="img-fluid rounded shadow-lg"
                      style={{ maxHeight: '450px', border: '1px solid rgba(212, 175, 55, 0.3)' }}
                    />
                  ) : (
                    <div 
                      className="d-flex align-items-center justify-content-center rounded border border-warning w-100" 
                      style={{ height: '300px', background: 'rgba(0,0,0,0.3)' }}
                    >
                      <span className="text-light">Imagen no disponible</span>
                    </div>
                  )}
                </Col>
                <Col md={7}>
                  <div className="mb-4">
                    <h5 className="mb-2" style={{ color: 'var(--mtg-text-light)' }}>{selectedCard.type_line}</h5>
                    <p className="fs-5 mb-0" style={{ color: 'var(--mtg-gold-dark)', fontFamily: 'serif' }}>
                      {selectedCard.mana_cost || 'Sin coste'}
                    </p>
                  </div>
                  
                  {selectedCard.oracle_text && (
                    <div 
                      className="p-3 rounded mb-4" 
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.05)', 
                        borderLeft: '4px solid var(--mtg-gold-bright)',
                        color: 'var(--mtg-text-light)'
                      }}
                    >
                      <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{selectedCard.oracle_text}</p>
                    </div>
                  )}

                  <Row className="g-3 mb-4">
                    <Col xs={6}>
                      <div className="p-2 rounded" style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <small className="d-block text-uppercase" style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Set</small>
                        <span style={{ color: 'var(--mtg-text-light)' }}>{selectedCard.set_name}</span>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="p-2 rounded" style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <small className="d-block text-uppercase" style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Rareza</small>
                        <span className="text-capitalize" style={{ color: 'var(--mtg-gold-bright)' }}>{selectedCard.rarity}</span>
                      </div>
                    </Col>
                    {selectedCard.prices?.eur && (
                      <Col xs={6}>
                        <div className="p-2 rounded" style={{ background: 'rgba(74, 222, 128, 0.1)' }}>
                          <small className="d-block text-uppercase" style={{ fontSize: '0.7rem', color: '#4ade80' }}>Precio Est.</small>
                          <span className="fw-bold fs-5" style={{ color: '#4ade80' }}>
                            €{parseFloat(selectedCard.prices.eur).toFixed(2)}
                          </span>
                        </div>
                      </Col>
                    )}
                    {selectedCard.power && selectedCard.toughness && (
                      <Col xs={6}>
                        <div className="p-2 rounded" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                          <small className="d-block text-uppercase" style={{ fontSize: '0.7rem', color: '#f87171' }}>P/T</small>
                          <span className="fw-bold fs-5" style={{ color: '#f87171' }}>
                            {selectedCard.power}/{selectedCard.toughness}
                          </span>
                        </div>
                      </Col>
                    )}
                  </Row>

                  <Button
                    className="btn-mtg-secondary w-100"
                    onClick={() => setSelectedCard(null)}
                  >
                    Cerrar Detalle
                  </Button>
                </Col>
              </Row>
            </Modal.Body>
          </>
        )}
      </Modal>
    </Container>
  );
};

export default CardSearchPage;
