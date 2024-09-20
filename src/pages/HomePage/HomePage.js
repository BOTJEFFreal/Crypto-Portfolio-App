import React, { useState } from 'react';
import './HomePage.css'; 
import Watchlist from '../../components/WatchList/WatchList'; 
import Header from '../../components/Header/Header';
import AccountBalance from '../../components/AccountBalance/AccountBalance';
import TransactionHistory from '../../components/TransactionHistory/TransactionHistory';
import SendTransaction from '../../components/SendTransaction/SendTransaction';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('tokens'); 

  return (
    <div className="homepage-container">
      <Header isHomePage={true} />

      <AccountBalance />

      <div className="tab-navigation">
        {/* <button
          className={`tab-button ${activeTab === 'tokens' ? 'active' : ''}`}
          onClick={() => setActiveTab('tokens')}
        >
          Tokens
        </button> */}
        <button
          className={`tab-button ${activeTab === 'watchlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('watchlist')}
        >
          Watchlist
        </button>
        <button
          className={`tab-button ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
        <button
          className={`tab-button ${activeTab === 'send' ? 'active' : ''}`}
          onClick={() => setActiveTab('send')}
        >
          Send ETH
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'watchlist' && <Watchlist />}
        {activeTab === 'transactions' && (
          <div className="transactions-page">
            <TransactionHistory />
          </div>
        )}
        {activeTab === 'send' && (
          <div className="send-eth-page">
            <SendTransaction />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
