import React from 'react';
import './TokenHeader.css';

const TokenHeader = ({ image, name, symbol }) => {
  return (
    <div className="token-header-icon">
      <img src={image} alt={name} className="token-header-icon" />
      <h2>
        {symbol.toUpperCase()}
      </h2>
    </div>
  );
};

export default TokenHeader;