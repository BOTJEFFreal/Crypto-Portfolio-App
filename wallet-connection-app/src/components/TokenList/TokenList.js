import React, { useContext } from 'react';
import './TokenList.css'; 
import { CoinContext } from '../../context/CoinContext'; 

const TokenList = () => {
  const coinsList = useContext(CoinContext); 

  return (
    <div className="token-list">
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
          {coinsList.tokens.map((token) => (
            <tr key={token.symbol}>
              <td>{token.name} ({token.symbol})</td>
              <td>{token.portfolio}</td>
              <td>{token.price}</td>
              <td>{token.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TokenList;
