
import React from 'react';
import PropTypes from 'prop-types';
import './CoinList.css'; 

const CoinList = ({ coins, selectedCoin, setSelectedCoin, handleFavoriteClick, coinsList }) => {
  return (
    <div className="coin-list-container">
      <ul className="coin-list">
        {coins.map((coin) => (
          <li
            key={coin.id || (coin.item && coin.item.id)}
            className={`coin-item ${
              selectedCoin?.id === coin.id || selectedCoin?.id === (coin.item && coin.item.id) ? 'selected' : ''
            }`}
            onClick={() => setSelectedCoin(coin)}
          >
            <img
              src={coin.image || (coin.item && coin.item.small)}
              alt={coin.name || (coin.item && coin.item.name)}
              className="coin-logo"
            />
            <span className="coin-name">
              {coin.name || (coin.item && coin.item.name)}{' '}
            </span>
            <span
              className="favorite-icon"
              onClick={(event) => {
                handleFavoriteClick(coin, event);
                setSelectedCoin(coin); 
              }}
              aria-label="Toggle Favorite"
            >
              {coinsList.tokens.some((favCoin) => favCoin.id === (coin.id || (coin.item && coin.item.id))) ? '★' : '☆'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

CoinList.propTypes = {
  coins: PropTypes.array.isRequired,
  selectedCoin: PropTypes.object,
  setSelectedCoin: PropTypes.func.isRequired,
  handleFavoriteClick: PropTypes.func.isRequired,
  coinsList: PropTypes.object.isRequired,
};

export default CoinList;
