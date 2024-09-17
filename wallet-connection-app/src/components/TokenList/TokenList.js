import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './TokenList.css';
import { CoinContext } from '../../context/CoinContext';

const TokenList = () => {
  const { coinsList } = useContext(CoinContext);
  const navigate = useNavigate();

  const handleTokenClick = (token) => {
    navigate(`/token/${token.symbol}`, { state: { token } });
  };

  return (
    <div className="token-list">
      <h2>Your Tokens</h2>
      <table>
        <thead>
          <tr>
            <th>Token</th>
            <th>Portfolio %</th>
            <th>Price (24hr)</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {coinsList.tokens.length > 0 ? (
            coinsList.tokens.map((token) => (
              <tr key={token.symbol}>
                <td>
                  <span
                    onClick={() => handleTokenClick(token)}
                    className="token-name"
                  >
                    {token.name} ({token.symbol})
                  </span>
                </td>
                <td>{token.portfolio}</td>
                <td>{token.price}</td>
                <td>{token.balance}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No tokens available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TokenList;