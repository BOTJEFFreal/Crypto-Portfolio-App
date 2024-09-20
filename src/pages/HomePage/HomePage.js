import React, { useState } from 'react';
import './HomePage.css';
import Watchlist from '../../components/WatchList/WatchList';
import Header from '../../components/Header/Header';
import AccountBalance from '../../components/AccountBalance/AccountBalance';
import TransactionHistory from '../../components/TransactionHistory/TransactionHistory';
import SendTransaction from '../../components/SendTransaction/SendTransaction';
import AllowanceManager from '../../components/AllowanceManager/AllowanceManager';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('watchlist');

  return (
    <div className="homepage-container">
      <Header isHomePage={true} />

      <AccountBalance />

      <div className="tab-navigation">
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
        <button
          className={`tab-button ${activeTab === 'allowance' ? 'active' : ''}`}
          onClick={() => setActiveTab('allowance')}
        >
          Allowance Manager
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
        {activeTab === 'allowance' && (
          <div className="allowance-page">
            <AllowanceManager />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
