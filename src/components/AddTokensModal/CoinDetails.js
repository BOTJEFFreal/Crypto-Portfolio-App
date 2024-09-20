
import React from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';

const CoinDetails = ({ selectedCoin, activeTab }) => {
  const getChangeColor = (percentage) => {
    return percentage >= 0 ? '#28a745' : '#BF4024';
  };

  if (!selectedCoin) {
    return <div className="add-modal-select-message">Select a coin to view details</div>;
  }

  return (
    <div className="add-modal-coin-details">
      <div className="add-modal-coin-detail">
        <strong>Rank:</strong>
        <span className="add-modal-coin-detail-value">
          {selectedCoin.market_cap_rank || (selectedCoin.item && selectedCoin.item.market_cap_rank)}
        </span>
      </div>
      <div className="add-modal-coin-detail">
        <strong>Price:</strong>
        <span className="add-modal-coin-detail-value">
          ${selectedCoin.current_price?.toLocaleString() || (selectedCoin.item && selectedCoin.item.current_price?.toLocaleString()) || 'N/A'}
        </span>
      </div>
      <div className="add-modal-coin-detail">
        <strong>24h%:</strong>
        <span
          className="add-modal-coin-detail-value"
          style={{ color: getChangeColor(selectedCoin.price_change_percentage_24h || (selectedCoin.item && selectedCoin.item.price_change_percentage_24h)) }}
        >
          {(selectedCoin.price_change_percentage_24h || (selectedCoin.item && selectedCoin.item.price_change_percentage_24h))?.toFixed(2)}%
        </span>
      </div>
      <div className="add-modal-coin-detail">
        <strong>Market Cap:</strong>
        <span className="add-modal-coin-detail-value">
          ${selectedCoin.market_cap?.toLocaleString() || (selectedCoin.item && selectedCoin.item.market_cap?.toLocaleString()) || 'N/A'}
        </span>
      </div>
      <div className="add-modal-coin-detail">
        <strong>24h Trading Volume:</strong>
        <span className="add-modal-coin-detail-value">
          ${selectedCoin.total_volume?.toLocaleString() || (selectedCoin.item && selectedCoin.item.total_volume?.toLocaleString()) || 'N/A'}
        </span>
      </div>
      {activeTab !== 'trending' && (
  <>
    <div className="add-modal-coin-detail coin-modal-graph">
      <strong>Last 7 Days</strong>
    </div>
    <Sparklines
      data={selectedCoin.sparkline_in_7d?.price || (selectedCoin.item && selectedCoin.item.sparkline_in_7d?.price) || []}
      width={240}
      height={100}
    >
      <SparklinesLine color={getChangeColor(selectedCoin.price_change_percentage_24h || (selectedCoin.item && selectedCoin.item.price_change_percentage_24h))} />
    </Sparklines>
  </>
)}
    </div>
  );
};

export default CoinDetails;