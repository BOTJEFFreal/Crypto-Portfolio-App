import React, { useState } from 'react';
import './HomePage.css'; 
import Watchlist from '../../components/WatchList/WatchList'; 
import SearchBar from '../../components/SearchBar/SearchBar'; 
import { CoinContext } from '../../context/CoinContext';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('tokens'); 

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="homepage-container">
  
      <div className="header">
        <div className="wallet-info">
          <h2>0x860D...Bbb3a7</h2>
          <h1>$0.00</h1>
          <span className="price-change">$0.00 (0.00%)</span>
        </div>
      </div>


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

      {/* Content for Active Tab */}
      <div className="tab-content">
        {activeTab === 'tokens' && (
          <div className="empty-state">
            <p>No Tokens to Show</p>
            <button className="buy-tokens-button">Buy tokens</button>
          </div>
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
