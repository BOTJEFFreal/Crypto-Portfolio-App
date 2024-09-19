import React from 'react';
import './TokenStats.css';

const TokenStats = ({
  marketCap,
  fullyDilutedValuation,
  tradingVolume24h,
  circulatingSupply,
  totalSupply,
  maxSupply,
}) => {
  return (
    <div className="token-stats">
      <h3>Token Statistics</h3>
      <ul>
        <li>
          <strong>Market Cap:</strong> ${marketCap?.toLocaleString() || 'N/A'}
        </li>
        <li>
          <strong>Fully Diluted Valuation:</strong> ${fullyDilutedValuation?.toLocaleString() || 'N/A'}
        </li>
        <li>
          <strong>24 Hour Trading Volume:</strong> ${tradingVolume24h?.toLocaleString() || 'N/A'}
        </li>
        <li>
          <strong>Circulating Supply:</strong> {circulatingSupply?.toLocaleString() || 'N/A'}
        </li>
        <li>
          <strong>Total Supply:</strong> {totalSupply?.toLocaleString() || 'N/A'}
        </li>
        <li>
          <strong>Max Supply:</strong> {maxSupply?.toLocaleString() || 'N/A'}
        </li>
      </ul>
    </div>
  );
};

export default TokenStats;