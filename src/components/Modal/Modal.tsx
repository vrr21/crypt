import React from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cryptoName: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, cryptoName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Confirm Action</h3>
        <p>Do you want to add {cryptoName} to your portfolio?</p>
        <div className="modal-buttons">
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
