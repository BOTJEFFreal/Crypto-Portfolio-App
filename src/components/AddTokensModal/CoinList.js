import React from 'react';

const CoinList = ({ coins, selectedCoin, setSelectedCoin, handleFavoriteClick, coinsList }) => {
  return (
    <div className="add-modal-coin-list">
      <ul>
        {coins.map((coin) => (
          <li
            key={coin.id || (coin.item && coin.item.id)}
            className={`add-modal-coin-item ${
              selectedCoin?.id === coin.id || selectedCoin?.id === (coin.item && coin.item.id) ? 'selected' : ''
            }`}
            onClick={() => setSelectedCoin(coin)}
          >
            <img
              src={coin.image || (coin.item && coin.item.small)}
              alt={coin.name || (coin.item && coin.item.name)}
              className="add-modal-coin-logo"
            />
            <span className="add-modal-coin-name">
              {coin.name || (coin.item && coin.item.name)}{' '}
              <span className="add-modal-coin-symbol">
                ({coin.symbol || (coin.item && coin.item.symbol.toUpperCase())})
              </span>
            </span>
            <span
              className="add-modal-favorite-star"
              onClick={(event) => handleFavoriteClick(coin, event)}
            >
              {coinsList.tokens.some((favCoin) => favCoin.id === (coin.id || (coin.item && coin.item.id))) ? '★' : '☆'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoinList;