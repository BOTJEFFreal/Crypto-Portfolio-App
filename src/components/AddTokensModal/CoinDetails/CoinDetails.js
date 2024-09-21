import React from 'react';
import PropTypes from 'prop-types';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import './CoinDetails.css'; 

const CoinDetails = ({ selectedCoin, activeTab }) => {
  const getChangeColor = (percentage) => {
    return percentage >= 0 ? '#28a745' : '#BF4024';
  };

  if (!selectedCoin) {
    return <div className="select-message">Select a coin to view details</div>;
  }

  const priceChange24h = selectedCoin.price_change_percentage_24h || (selectedCoin.item && selectedCoin.item.price_change_percentage_24h);
  const sparklineData = selectedCoin.sparkline_in_7d?.price || (selectedCoin.item && selectedCoin.item.sparkline_in_7d?.price) || [];

  return (
    <div className="coin-details-container">
      <div className="coin-detail">
        <strong>Rank:</strong>
        <span className="detail-value">
          {selectedCoin.market_cap_rank || (selectedCoin.item && selectedCoin.item.market_cap_rank) || 'N/A'}
        </span>
      </div>
      <div className="coin-detail">
        <strong>Price:</strong>
        <span className="detail-value">
          ${selectedCoin.current_price?.toLocaleString() || (selectedCoin.item && selectedCoin.item.current_price?.toLocaleString()) || 'N/A'}
        </span>
      </div>
      <div className="coin-detail">
        <strong>24h%:</strong>
        <span
          className="detail-value"
          style={{ color: getChangeColor(priceChange24h) }}
        >
          {priceChange24h !== undefined ? `${priceChange24h.toFixed(2)}%` : 'N/A'}
        </span>
      </div>
      <div className="coin-detail">
        <strong>Market Cap:</strong>
        <span className="detail-value">
          ${selectedCoin.market_cap?.toLocaleString() || (selectedCoin.item && selectedCoin.item.market_cap?.toLocaleString()) || 'N/A'}
        </span>
      </div>
      <div className="coin-detail">
        <strong>24h Trading Volume:</strong>
        <span className="detail-value">
          ${selectedCoin.total_volume?.toLocaleString() || (selectedCoin.item && selectedCoin.item.total_volume?.toLocaleString()) || 'N/A'}
        </span>
      </div>
      {sparklineData.length > 0 && (
        <>
          <div className="coin-detail sparkline-label">
            <strong>Last 7 Days</strong>
          </div>
          <Sparklines data={sparklineData} width={240} height={100}>
            <SparklinesLine color={getChangeColor(priceChange24h)} />
          </Sparklines>
        </>
      )}
    </div>
  );
};

CoinDetails.propTypes = {
  selectedCoin: PropTypes.object,
  activeTab: PropTypes.string.isRequired,
};

export default CoinDetails;
