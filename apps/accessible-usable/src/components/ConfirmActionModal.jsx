import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const ConfirmActionModal = ({
  show,
  onCancel,
  onConfirm,
  title = 'Confirmar acción',
  message = '¿Deseas continuar?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmVariant = 'danger'
}) => {
  return (
    <Modal show={show} onHide={onCancel} centered contentClassName="card-mtg-premium">
      <Modal.Header className="border-0" closeButton>
        <Modal.Title className="fw-bold" style={{ color: 'var(--mtg-gold-bright)' }}>
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-0 text-mtg-light">{message}</p>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="secondary" className="btn-mtg-secondary" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmActionModal;
