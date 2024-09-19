// src/components/WalletTokens/WalletTokens.jsx

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import './WalletTokens.css';
import { CoinContext } from '../../context/CoinContext';

const WalletTokens = () => {
  const { tokens, setCoinsList, coinsList, network, ethBalance, ethPrice, loadingTokens } = useContext(CoinContext);
  const navigate = useNavigate();

  const handleViewData = (id) => {
    navigate(`/token-data/${id}`);
  };

  const handleDelete = (coinId, event) => {
    event.stopPropagation(); // Prevent row click when deleting
    const updatedWallet = tokens.filter((coin) => coin.id !== coinId);
    setCoinsList({ ...coinsList, tokens: updatedWallet });
    localStorage.setItem('favorites', JSON.stringify(updatedWallet));
  };

  const getChangeColor = (value) => {
    if (value > 0) return 'green';
    if (value < 0) return 'red';
    return 'black';
  };

  // Determine the color of the sparkline based on price trend
  const getSparklineColor = (coin) => {
    if (coin.sparkline_in_7d && coin.sparkline_in_7d.price.length > 1) {
      const firstPrice = coin.sparkline_in_7d.price[0];
      const lastPrice = coin.sparkline_in_7d.price[coin.sparkline_in_7d.price.length - 1];
      return lastPrice > firstPrice ? 'green' : 'red'; // Green for upward trend, red for downward
    }
    return 'blue'; // Default color if data is not available
  };

  // Calculate total portfolio value (ETH + Tokens)
  const totalPortfolioValue = (() => {
    const ethValue = ethBalance * ethPrice;
    const tokensValue = tokens.reduce((acc, token) => acc + token.quantity * token.current_price, 0);
    return ethValue + tokensValue;
  })();

  return (
    <div className="wallet-tokens-container">
      <h2>Your Wallet Tokens</h2>

      {/* Display native currency (ETH / Sepolia ETH) */}
      <div className="wallet-balance">
        <p>
          {network === 'Mainnet' ? 'Ethereum (ETH) Balance:' : `${network} Balance:`} {ethBalance} {network === 'Mainnet' ? 'ETH' : 'Sepolia ETH'}
        </p>
        {ethPrice > 0 && (
          <p>
            ETH Price: ${ethPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        )}
        <p>
          Total Portfolio Value: ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      {loadingTokens ? (
        <div className="loading-spinner">
          <p>Loading tokens...</p>
        </div>
      ) : tokens.length > 0 ? (
        <div className="table-responsive">
          <table className="wallet-tokens-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Value (%)</th>
                <th>Price (USD)</th>
                <th>Balance</th>
                <th>Change (24h)</th>
                <th>Last 7 Days</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((coin) => {
                const tokenValue = coin.quantity * coin.current_price;
                const valuePercentage = totalPortfolioValue > 0 ? ((tokenValue / totalPortfolioValue) * 100).toFixed(2) : '0.00';
                return (
                  <tr key={coin.id} onClick={() => handleViewData(coin.id)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div className="coin-info">
                        <img src={coin.image} alt={coin.name} className="coin-icon" />
                        <span>
                          {coin.name} ({coin.symbol.toUpperCase()})
                        </span>
                      </div>
                    </td>
                    <td>{valuePercentage}%</td>
                    <td>${coin.current_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 'N/A'}</td>
                    <td>{coin.quantity}</td>
                    <td style={{ color: getChangeColor(coin.price_change_percentage_24h_in_currency) }}>
                      {coin.price_change_percentage_24h_in_currency !== undefined
                        ? `${coin.price_change_percentage_24h_in_currency.toFixed(2)}%`
                        : 'N/A'}
                    </td>
                    <td>
                      {coin.sparkline_in_7d && coin.sparkline_in_7d.price.length > 0 ? (
                        <Sparklines data={coin.sparkline_in_7d.price} width={100} height={30}>
                          <SparklinesLine color={getSparklineColor(coin)} />
                        </Sparklines>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>
                      {/* Delete button with trash icon */}
                      <button
                        onClick={(event) => handleDelete(coin.id, event)}
                        className="delete-button"
                        title="Remove from Wallet"
                        aria-label={`Remove ${coin.name} from wallet`}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-wallet">
          <p>No tokens in your wallet.</p>
        </div>
      )}
    </div>
  );
};

export default WalletTokens;
