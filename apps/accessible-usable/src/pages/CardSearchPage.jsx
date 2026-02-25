import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { Search } from 'lucide-react';
import cardService from '../services/cardService';
import CardDetailsModal from '../components/CardDetailsModal';
import { isNoUsableFlow } from '../utils/flowMode';

const CardSearchPage = () => {
  const noUsableMode = isNoUsableFlow(window.location.pathname || '/home');
  const [query, setQuery] = useState('');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const searchQuery = noUsableMode ? `!"${query}"` : query;
      const response = await cardService.searchCards(searchQuery);
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
      <p className="mb-4 ux-helper-text" style={{ color: 'var(--mtg-text-muted)' }}>Encuentra cualquier carta de Magic The Gathering</p>

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
            <p className="mt-3 mb-0 small ux-helper-text" style={{ color: 'var(--mtg-text-muted)' }}>
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
          <Row xs={1} sm={3} md={4} lg={5} xl={6} className="g-4">
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
                      <img
                        src={imageUrl || `${process.env.PUBLIC_URL}/logo.jpg`}
                        alt={card.name}
                        className="w-100 h-100 object-fit-cover"
                        loading="lazy"
                        onError={(event) => {
                          event.target.onerror = null;
                          event.target.src = `${process.env.PUBLIC_URL}/mtg-nexus-logo.svg`;
                        }}
                      />
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

      <CardDetailsModal card={selectedCard} show={!!selectedCard} onHide={() => setSelectedCard(null)} />
    </Container>
  );
};

export default CardSearchPage;
