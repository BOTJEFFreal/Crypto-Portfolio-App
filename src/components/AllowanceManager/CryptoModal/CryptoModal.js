import React from 'react';
import './CryptoModal.css';

const CryptoModal = ({ open, onClose, title, children }) => {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose} aria-modal="true" role="dialog">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close-button" onClick={onClose} aria-label="Close Modal">&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          <button className="modal-action-button" onClick={onClose} aria-label="Close Modal">Close</button>
        </div>
      </div>
    </div>
  );
};

export default CryptoModal;
