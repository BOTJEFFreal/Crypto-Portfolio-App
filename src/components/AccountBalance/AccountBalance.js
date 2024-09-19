import React from 'react';
import './AccountBalance.css'; // AccountBalance specific styles

const AccountBalance = () => {
  return (
    <div className="account-balance">
      <h3>Decentralized accounts</h3>
      <div className="balance-details">
        <h2>$47.66</h2>
        <button className="toggle-visibility">👁️</button>
        <p className="balance-change">+0.60 (+1.26%)</p>
      </div>
      <div className="tabs">
        <button className="tab">Tokens</button>
        <button className="tab">NFTs</button>
        <button className="tab">DeFi</button>
        <button className="tab">Transactions</button>
        <button className="tab">Spending Caps</button>
      </div>
    </div>
  );
};

export default AccountBalance;
