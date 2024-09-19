import React from 'react';
import './AddTokensModal.css';

const AddTokensModal = ({ show, onClose, children }) => {
  if (!show) return null; 

  return (
    <div className="add-tokens-modal-overlay" onClick={onClose}>
      <div className="add-tokens-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="add-tokens-modal-close-button" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default AddTokensModal;
