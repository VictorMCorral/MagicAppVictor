import React from 'react';
import { Container, Card } from 'react-bootstrap';

const DeckBuilderPage = () => {
  return (
    <Container className="py-4">
      <h1 className="display-5 fw-bold text-dark mb-4">Constructor de Mazos</h1>
      <Card className="card-mtg">
        <Card.Body>
          <p className="text-muted mb-2">Página en construcción...</p>
          <p className="small text-muted mb-0">
            Esta funcionalidad estará disponible en una próxima actualización.
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default DeckBuilderPage;
