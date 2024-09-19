// src/pages/HomePage/HomePage.jsx

import React, { useState } from 'react';
import './HomePage.css'; 
import Watchlist from '../../components/WatchList/WatchList'; 
import SearchBar from '../../components/SearchBar/SearchBar'; 
import Header from '../../components/Header/Header';
import AccountBalance from '../../components/AccountBalance/AccountBalance'; // Ensure correct import path
import WalletTokens from '../../components/WalletTokens/WalletTokens'; // Import WalletTokens

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('tokens'); 

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="homepage-container">
      <Header isHomePage={true}/>

      <AccountBalance />

      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'tokens' ? 'active' : ''}`}
          onClick={() => handleTabChange('tokens')}
        >
          Tokens
        </button>
        <button
          className={`tab-button ${activeTab === 'watchlist' ? 'active' : ''}`}
          onClick={() => handleTabChange('watchlist')}
        >
          Watchlist
        </button>
        <button
          className={`tab-button ${activeTab === 'swaps' ? 'active' : ''}`}
          onClick={() => handleTabChange('swaps')}
        >
          Swaps
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'tokens' && (
          <WalletTokens />
        )}

        {activeTab === 'watchlist' && (
          <div className="watchlist-content">
            <Watchlist /> 
          </div>
        )}

        {activeTab === 'swaps' && (
          <div className="empty-state">
            <p>No Swaps Available</p>
            <button className="start-swap-button">Start a Swap</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
