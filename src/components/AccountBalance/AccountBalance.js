import React, { useContext } from 'react';
import './AccountBalance.css';
import { CoinContext } from '../../context/CoinContext';

const AccountBalance = () => {
  const { connectedAddress, network, ethBalance, tokens } = useContext(CoinContext);

  return (
    <div className="account-balance">
      <h3>Account Balance</h3>
      <div className="balance-details">
        <p><strong>Connected Address:</strong> {connectedAddress || 'NA'}</p>
        <p><strong>Network:</strong> {network || 'NA'}</p>
        <p><strong>ETH Balance:</strong> {ethBalance ? `${ethBalance} ETH` : 'NA'}</p>
        <div className="tokens-container">
          <strong>ERC-20 Tokens:</strong>
          {tokens.length > 0 ? (
            <ul className="token-list">
              {tokens.map((token, index) => (
                <li key={index} className="token-item">
                  {token.symbol}: {token.balance}
                </li>
              ))}
            </ul>
          ) : (
            <p>No ERC-20 tokens found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountBalance;
