import React from 'react';
import './TokenInfo.css';

const formatNumber = (number) => {
  if (number === undefined || number === null) {
    return 'N/A'; 
  }

  if (number >= 1e12) {
    return (number / 1e12).toFixed(2) + 'T';
  } else if (number >= 1e9) {
    return (number / 1e9).toFixed(2) + 'B';
  } else if (number >= 1e6) {
    return (number / 1e6).toFixed(2) + 'M';
  } else if (number >= 1e3) {
    return (number / 1e3).toFixed(2) + 'K';
  }
  return number.toLocaleString();
};

const TokenInfo = ({
  marketCap,
  totalVolume24h,
  circulatingSupply,
  allTimeLow,
  allTimeHigh,
  dayRangeLow,
  dayRangeHigh,
}) => {
  return (
    <div className="tokeninfo-container">     
      <div className="tokeninfo-market-data-row">
        <div className="tokeninfo-item">
          <strong>Market Cap</strong>
          <span>${formatNumber(marketCap)}</span>
        </div>
        <div className="tokeninfo-item">
          <strong>Total Volume (24hr)</strong>
          <span>${formatNumber(totalVolume24h)}</span>
        </div>
        <div className="tokeninfo-item">
          <strong>Circulating Supply</strong>
          <span>{formatNumber(circulatingSupply)}</span>
        </div>
      </div>

      {/* <div className="tokeninfo-market-data-row">
        <div className="tokeninfo-item">
          <strong>All-Time High</strong>
          <span>${formatNumber(allTimeHigh)}</span>
        </div>
        <div className="tokeninfo-item">
          <strong>All-Time Low</strong>
          <span>${formatNumber(allTimeLow)}</span>
        </div>
        <div className="tokeninfo-item">
          <strong>Day Range (24h)</strong>
          <span>${dayRangeLow?.toFixed(2)} - ${dayRangeHigh?.toFixed(2)}</span>
        </div>
      </div> */}
    </div>
  );
};

export default TokenInfo;
