import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const InfoModal = ({ show, onHide, title = 'Información', message = '', buttonText = 'Entendido' }) => {
  return (
    <Modal show={show} onHide={onHide} centered contentClassName="card-mtg-premium">
      <Modal.Header className="border-0" closeButton>
        <Modal.Title className="fw-bold" style={{ color: 'var(--mtg-gold-bright)' }}>
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-0 text-mtg-light">{message}</p>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button className="btn-mtg-primary" onClick={onHide}>
          {buttonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InfoModal;
