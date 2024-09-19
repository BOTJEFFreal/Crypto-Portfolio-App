import React from 'react';
import './TokenInfo.css';


const TokenInfo = ({ currentPrice, marketCap, totalVolume }) => {
  return (
    <div className="token-info">
      <p><strong>Current Price:</strong> ${currentPrice?.toLocaleString() || 'N/A'}</p>
      <p><strong>Market Cap:</strong> ${marketCap?.toLocaleString() || 'N/A'}</p>
      <p><strong>24h Volume:</strong> ${totalVolume?.toLocaleString() || 'N/A'}</p>
    </div>
  );
};

export default TokenInfo;