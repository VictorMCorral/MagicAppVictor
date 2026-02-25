import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const FlashMessage = ({ show, message, variant = 'success', onClose, delay = 2800 }) => {
  return (
    <ToastContainer position="top-end" className="p-3 flash-message-container">
      <Toast
        bg={variant}
        show={show}
        autohide
        delay={delay}
        onClose={onClose}
      >
        <Toast.Header closeButton>
          <strong className="me-auto">MTG Nexus</strong>
        </Toast.Header>
        <Toast.Body className={variant === 'light' ? '' : 'text-white'}>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default FlashMessage;
