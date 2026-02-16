import React from 'react';
import { Container, Card } from 'react-bootstrap';

const DeckBuilderPage = () => {
  return (
    <Container className="py-4">
      <h1 className="display-5 fw-bold text-mtg-gold mb-2">⚙️ Constructor de Mazos</h1>
      <p className="text-mtg-secondary mb-4">Herramienta avanzada para construir y optimizar tus mazos</p>
      <Card className="card-mtg">
        <Card.Body className="text-center py-5">
          <p className="fs-5 text-mtg-secondary mb-2">🔨 Página en construcción...</p>
          <p className="text-mtg-terciary mb-0">
            Esta funcionalidad estará disponible en una próxima actualización.
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DeckBuilderPage;
