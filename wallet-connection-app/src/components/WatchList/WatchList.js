import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Sparklines, SparklinesLine } from 'react-sparklines';
import './Watchlist.css';
import { CoinContext } from '../../context/CoinContext';

const Watchlist = () => {
  const { coinsList, setCoinsList } = useContext(CoinContext);
  const navigate = useNavigate(); // Initialize useNavigate

  const tokens = coinsList && coinsList.tokens ? coinsList.tokens : [];

  const handleDelete = (coinId) => {
    const updatedTokens = tokens.filter((coin) => coin.id !== coinId);
    setCoinsList({ tokens: updatedTokens });
    localStorage.setItem('favorites', JSON.stringify(updatedTokens));
  };

  const getChangeColor = (value) => {
    if (value > 0) return 'green';
    if (value < 0) return 'red';
    return 'black';
  };

  // Modify the handler to navigate to TokenDetail page
  const handleTokenClick = (coin) => {
    navigate(`/token/${coin.symbol}`, { state: { token: coin } });
  };

  return (
    <div className="watchlist-container">
      <h2>Your Watchlist</h2>
      {tokens.length > 0 ? (
        <table className="watchlist-table">
          <thead>
            <tr>
              <th>Coin</th>
              <th>Price</th>
              <th>1h</th>
              <th>24h</th>
              <th>7d</th>
              <th>24h Volume</th>
              <th>Market Cap</th>
              <th>Last 7 Days</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((coin) => {
              const change1h = coin.price_change_percentage_1h_in_currency;
              const change24h = coin.price_change_percentage_24h_in_currency;
              const change7d = coin.price_change_percentage_7d_in_currency;

              return (
                <tr key={coin.id}>
                  <td>
                    <div
                      className="coin-info"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleTokenClick(coin)}
                    >
                      <img src={coin.image} alt={coin.name} className="coin-icon" />
                      <span>
                        {coin.name} ({coin.symbol.toUpperCase()})
                      </span>
                    </div>
                  </td>
                  <td>${coin.current_price?.toLocaleString() || 'N/A'}</td>
                  <td style={{ color: getChangeColor(change1h) }}>
                    {change1h !== undefined ? `${change1h.toFixed(2)}%` : 'N/A'}
                  </td>
                  <td style={{ color: getChangeColor(change24h) }}>
                    {change24h !== undefined ? `${change24h.toFixed(2)}%` : 'N/A'}
                  </td>
                  <td style={{ color: getChangeColor(change7d) }}>
                    {change7d !== undefined ? `${change7d.toFixed(2)}%` : 'N/A'}
                  </td>
                  <td>${coin.total_volume?.toLocaleString() || 'N/A'}</td>
                  <td>${coin.market_cap?.toLocaleString() || 'N/A'}</td>
                  <td>
                    {coin.sparkline_in_7d ? (
                      <Sparklines data={coin.sparkline_in_7d.price} width={100} height={30}>
                        <SparklinesLine color="blue" />
                      </Sparklines>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleDelete(coin.id)} className="delete-button">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No coins in your watchlist.</p>
      )}
    </div>
  );
};

export default Watchlist;