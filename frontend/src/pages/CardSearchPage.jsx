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
      <h1 className="display-5 fw-bold text-dark mb-4">Buscar Cartas</h1>

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
            <p className="small text-muted mt-3 mb-0">
              Ejemplos: "Lightning Bolt", "type:creature", "c:red"
            </p>
          </Form>
        </Card.Body>
      </Card>

      {/* Resultados */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="fs-5 mt-3 text-muted">Buscando cartas...</p>
        </div>
      ) : cards.length > 0 ? (
        <>
          <p className="text-muted mb-4 fs-5 fw-semibold">
            {cards.length} {cards.length === 1 ? 'carta encontrada' : 'cartas encontradas'}
          </p>
          <Row xs={2} sm={3} md={4} lg={5} xl={6} className="g-3">
            {cards.map((card) => (
              <Col key={card.id}>
                <div 
                  onClick={() => setSelectedCard(card)} 
                  style={{ cursor: 'pointer' }}
                >
                  <CardDisplay card={card} />
                </div>
              </Col>
            ))}
          </Row>
        </>
      ) : query && !loading ? (
        <Card className="card-mtg text-center py-5">
          <Card.Body>
            <p className="text-muted fs-5 mb-2">No se encontraron cartas para "{query}"</p>
            <p className="text-muted small">Intenta con otro nombre o criterio de búsqueda</p>
          </Card.Body>
        </Card>
      ) : null}

      {/* Modal de detalle */}
      <Modal 
        show={!!selectedCard} 
        onHide={() => setSelectedCard(null)} 
        size="lg" 
        centered
      >
        {selectedCard && (
          <>
            <Modal.Header closeButton className="border-0">
              <Modal.Title className="fw-bold">{selectedCard.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                {selectedCard.image_uris?.normal && (
                  <Col lg={5} className="mb-4 mb-lg-0">
                    <img
                      src={selectedCard.image_uris.normal}
                      alt={selectedCard.name}
                      className="w-100 rounded shadow"
                    />
                  </Col>
                )}
                <Col lg={7}>
                  <p className="fs-5 fw-semibold text-dark mb-1">{selectedCard.type_line}</p>
                  <p className="fs-5 text-muted mb-4">{selectedCard.mana_cost}</p>
                  
                  {selectedCard.oracle_text && (
                    <div className="bg-light p-3 rounded mb-4 border-start border-4 border-primary">
                      <p className="text-dark mb-0">{selectedCard.oracle_text}</p>
                    </div>
                  )}

                  <Row className="g-3 mb-4">
                    <Col xs={6}>
                      <div className="bg-primary bg-opacity-10 p-3 rounded">
                        <p className="text-muted small mb-1"><strong>Set:</strong></p>
                        <p className="text-dark mb-0">{selectedCard.set_name}</p>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="bg-purple bg-opacity-10 p-3 rounded" style={{ background: 'rgba(128, 0, 128, 0.1)' }}>
                        <p className="text-muted small mb-1"><strong>Rareza:</strong></p>
                        <p className="text-dark mb-0 text-capitalize">{selectedCard.rarity}</p>
                      </div>
                    </Col>
                    {selectedCard.prices?.eur && (
                      <Col xs={6}>
                        <div className="bg-success bg-opacity-10 p-3 rounded">
                          <p className="text-muted small mb-1"><strong>Precio:</strong></p>
                          <p className="text-success fw-bold fs-5 mb-0">€{parseFloat(selectedCard.prices.eur).toFixed(2)}</p>
                        </div>
                      </Col>
                    )}
                    {selectedCard.power && selectedCard.toughness && (
                      <Col xs={6}>
                        <div className="bg-danger bg-opacity-10 p-3 rounded">
                          <p className="text-muted small mb-1"><strong>P/T:</strong></p>
                          <p className="text-dark fw-bold fs-5 mb-0">{selectedCard.power}/{selectedCard.toughness}</p>
                        </div>
                      </Col>
                    )}
                  </Row>

                  <Button
                    className="btn-mtg-secondary w-100"
                    onClick={() => setSelectedCard(null)}
                  >
                    Cerrar
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
