import React from 'react';
import './NoDataPlaceholder.css';

const NoDataPlaceholder = ({ message, description, buttonText, onButtonClick }) => {
  return (
    <div className="no-data-container">
      <div className="no-data-content">
        <h2>{message}</h2>
        {description && <p>{description}</p>}
        {buttonText && onButtonClick && (
          <button onClick={onButtonClick} className="add-coin-button">
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default NoDataPlaceholder;