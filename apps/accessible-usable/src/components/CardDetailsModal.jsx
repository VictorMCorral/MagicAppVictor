import React from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';

const getField = (card, keys, fallback = null) => {
  for (const key of keys) {
    const value = card?.[key];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }
  return fallback;
};

const getImageUrl = (card) =>
  card?.image_uris?.normal ||
  card?.imageUrl ||
  `${process.env.PUBLIC_URL}/logo.jpg`;

const CardDetailsModal = ({ card, show, onHide }) => {
  if (!card) return null;

  const name = getField(card, ['name'], 'Carta sin nombre');
  const typeLine = getField(card, ['type_line', 'type'], 'Tipo no disponible');
  const manaCost = getField(card, ['mana_cost', 'manaCost'], 'Sin coste');
  const oracleText = getField(card, ['oracle_text', 'oracleText'], 'Sin descripción disponible');
  const setName = getField(card, ['set_name', 'setName'], 'Set no disponible');
  const rarity = getField(card, ['rarity'], 'No disponible');
  const power = getField(card, ['power']);
  const toughness = getField(card, ['toughness']);
  const eurPrice = card?.prices?.eur ?? card?.priceEur;
  const imageUrl = getImageUrl(card);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered contentClassName="card-mtg-premium">
      <Modal.Header className="border-0">
        <Modal.Title className="fw-bold" style={{ color: 'var(--mtg-gold-bright)' }}>
          {name}
        </Modal.Title>
        <Button variant="link" className="p-0 text-decoration-none" onClick={onHide} style={{ color: 'var(--mtg-text-light)' }}>
          ✕
        </Button>
      </Modal.Header>
      <Modal.Body>
        <Row className="g-4 card-detail-layout">
          <Col lg={5} className="mb-4 mb-lg-0 d-flex justify-content-center">
            <div className="card-detail-image-shell">
              <img
                src={imageUrl}
                alt={name}
                className="card-detail-image"
                onError={(event) => {
                  event.target.onerror = null;
                  event.target.src = `${process.env.PUBLIC_URL}/mtg-nexus-logo.svg`;
                }}
              />
            </div>
          </Col>
          <Col lg={7}>
            <div className="mb-4">
              <h5 className="mb-2" style={{ color: 'var(--mtg-text-light)' }}>{typeLine}</h5>
              <p className="fs-5 mb-0" style={{ color: 'var(--mtg-gold-dark)', fontFamily: 'serif' }}>{manaCost}</p>
            </div>

            <div className="p-3 rounded mb-4" style={{ background: 'rgba(255, 255, 255, 0.05)', borderLeft: '4px solid var(--mtg-gold-bright)', color: 'var(--mtg-text-light)' }}>
              <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{oracleText}</p>
            </div>

            <Row className="g-3 mb-4">
              <Col xs={6}>
                <div className="p-2 rounded" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <small className="d-block text-uppercase" style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Set</small>
                  <span style={{ color: 'var(--mtg-text-light)' }}>{setName}</span>
                </div>
              </Col>
              <Col xs={6}>
                <div className="p-2 rounded" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <small className="d-block text-uppercase" style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Rareza</small>
                  <span className="text-capitalize" style={{ color: 'var(--mtg-gold-bright)' }}>{rarity}</span>
                </div>
              </Col>
              {eurPrice && (
                <Col xs={6}>
                  <div className="p-2 rounded" style={{ background: 'rgba(74, 222, 128, 0.1)' }}>
                    <small className="d-block text-uppercase" style={{ fontSize: '0.7rem', color: '#4ade80' }}>Precio Est.</small>
                    <span className="fw-bold fs-5" style={{ color: '#4ade80' }}>€{Number(eurPrice).toFixed(2)}</span>
                  </div>
                </Col>
              )}
              {power && toughness && (
                <Col xs={6}>
                  <div className="p-2 rounded" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                    <small className="d-block text-uppercase" style={{ fontSize: '0.7rem', color: '#f87171' }}>P/T</small>
                    <span className="fw-bold fs-5" style={{ color: '#f87171' }}>{power}/{toughness}</span>
                  </div>
                </Col>
              )}
            </Row>

            <Button className="btn-mtg-secondary w-100" onClick={onHide}>
              Cerrar Detalle
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default CardDetailsModal;
