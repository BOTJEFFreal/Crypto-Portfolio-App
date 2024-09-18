import React from 'react';
import './TokenHeader.css';

const TokenHeader = ({ image, name, symbol }) => {
  return (
    <div className="token-header">
      <img src={image} alt={name} className="token-icon" />
      <h2>
        {name} ({symbol.toUpperCase()})
      </h2>
    </div>
  );
};

export default TokenHeader;