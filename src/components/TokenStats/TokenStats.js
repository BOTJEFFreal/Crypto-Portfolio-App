import React from 'react';
import './TokenStats.css';

const TokenStats = ({
  marketCap,
  fullyDilutedValuation,
  tradingVolume24h,
  circulatingSupply,
  totalSupply,
  allTimeLow,
  allTimeHigh,
  marketCapPercentage,
}) => {
  const marketCapToVolume = marketCap && tradingVolume24h ? (tradingVolume24h / marketCap).toFixed(2) : 'N/A';

  return (
    <div className="token-stats">
      <div className="stat-item">
        <strong>Market Cap:</strong>
        <span>${marketCap?.toLocaleString() || 'N/A'}</span>
      </div>

      <div className="stat-item">
        <strong>Total Valuation:</strong>
        <span>${fullyDilutedValuation?.toLocaleString() || 'N/A'}</span>
      </div>

      <div className="stat-item">
        <strong>24h Volume / Market Cap:</strong>
        <span>{marketCapToVolume}</span>
      </div>

      <div className="stat-item">
        <strong>Circulating Supply:</strong>
        <span>{circulatingSupply?.toLocaleString() || 'N/A'}</span>
      </div>

      <div className="stat-item">
        <strong>All-Time Low:</strong>
        <span>${allTimeLow?.toLocaleString() || 'N/A'}</span>
      </div>

      <div className="stat-item">
        <strong>All-Time High:</strong>
        <span>${allTimeHigh?.toLocaleString() || 'N/A'}</span>
      </div>
    </div>
  );
};

export default TokenStats;
