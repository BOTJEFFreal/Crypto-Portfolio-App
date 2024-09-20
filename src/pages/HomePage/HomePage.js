// src/pages/HomePage/HomePage.jsx

import React, { useState } from 'react';
import './HomePage.css'; 
import Watchlist from '../../components/WatchList/WatchList'; 
import SearchBar from '../../components/SearchBar/SearchBar'; 
import Header from '../../components/Header/Header';
import AccountBalance from '../../components/AccountBalance/AccountBalance'; // Ensure correct import path
import WalletTokens from '../../components/WalletTokens/WalletTokens'; // Import WalletTokens
import AddTokensModal from '../../components/AddTokensModal/AddTokensModal'; // Import AddTokensModal

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('tokens'); 
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const openModal = () => {
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
  }

  return (
    <div className="homepage-container">
      <Header isHomePage={true}/>

      <AccountBalance />

      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'tokens' ? 'active' : ''}`}
          onClick={() => setActiveTab('tokens')}
        >
          Tokens
        </button>
        <button
          className={`tab-button ${activeTab === 'watchlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('watchlist')}
        >
          Watchlist
        </button>
        <button
          className={`tab-button ${activeTab === 'swaps' ? 'active' : ''}`}
          onClick={() => setActiveTab('swaps')}
        >
          Transactions
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'tokens' && <WalletTokens />}
        {activeTab === 'watchlist' && <Watchlist openModal={openModal} />}
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
