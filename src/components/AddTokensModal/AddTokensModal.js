// components/AddTokensModal/AddTokensModal.jsx
import React, { useState, useEffect, useContext } from 'react';
import './AddTokensModal.css';
import { CoinContext } from '../../context/CoinContext';
import getTrendingCoins from '../../apis/getTrendingCoins';
import getTopGainers from '../../apis/getTopGainers';
import getTopLosers from '../../apis/getTopLosers';
import getRecentlyAddedCoins from '../../apis/getRecentlyAddedCoins';

import SearchBar from '../SearchBar/SearchBar'; // Import the reusable SearchBar
import Tabs from './Tabs/Tabs';
import CoinList from './CoinList/CoinList';
import CoinDetails from './CoinDetails/CoinDetails';

const AddTokensModal = ({ closeModal }) => {
  const { coinsList, setCoinsList } = useContext(CoinContext);
  const [activeTab, setActiveTab] = useState('trending');
  const [coins, setCoins] = useState([]); 
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(10);

  // Fetch coins based on the active tab
  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      let data = [];
      try {
        switch (activeTab) {
          case 'trending':
            data = await getTrendingCoins();
            break;
          case 'gainers':
            data = await getTopGainers();
            break;
          case 'losers':
            data = await getTopLosers();
            break;
          case 'recentlyAdded':
            data = await getRecentlyAddedCoins();
            break;
          default:
            data = [];
        }
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
      setCoins(data); // Update coins for the left-side coin list
      setLoading(false);
    };
    fetchCoins();
  }, [activeTab]);

  // Handle coin selection from SearchBar
  const handleSelectCoin = (coin) => {
    setSelectedCoin(coin);
    // Optionally, add the coin to favorites upon selection
    handleFavoriteClick(coin, { stopPropagation: () => {} });
  };

  const handleFavoriteClick = (coin, event) => {
    event.stopPropagation();

    const storedCoinsList = JSON.parse(localStorage.getItem('coinList')) || [];
    const selectedToken = storedCoinsList.find((storedCoin) => storedCoin.id === coin.id);
    const fallbackSelectedToken = coins.find(c => c.id === coin.id) || coin;

    const tokenToAdd = selectedToken || fallbackSelectedToken;

    if (tokenToAdd) {
      let updatedTokens;
      const favoritesFromLocalStorage = JSON.parse(localStorage.getItem('favorites')) || [];
      if (favoritesFromLocalStorage.some((favCoin) => favCoin.id === tokenToAdd.id)) {
        updatedTokens = favoritesFromLocalStorage.filter((favCoin) => favCoin.id !== tokenToAdd.id);
      } else {
        updatedTokens = [...favoritesFromLocalStorage, tokenToAdd];
      }

      localStorage.setItem('favorites', JSON.stringify(updatedTokens));
      setCoinsList({ tokens: updatedTokens });
    }
  };



  return (
    <div className="add-modal-overlay" onClick={closeModal}>
      <div className="add-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="add-modal-header">
          <h2>Add Coins</h2>
          <button
            className="add-modal-close-button"
            onClick={closeModal}
            aria-label="Close Modal"
          >
            &times;
          </button>
        </div>
        <div className="add-modal-body">
          <SearchBar
            placeholder="Search coins..."
            onSelectCoin={handleSelectCoin}
            containerClass="add-modal-search-section"
          />
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="add-modal-main">
            {loading ? (
              <div className="loading-spinner">Loading...</div>
            ) : (
              <>
                <CoinList
                  coins={coins.slice(0, itemsToShow)}
                  selectedCoin={selectedCoin}
                  setSelectedCoin={setSelectedCoin}
                  handleFavoriteClick={handleFavoriteClick}
                  coinsList={coinsList}
                />
                <CoinDetails selectedCoin={selectedCoin} activeTab={activeTab} />
              </>
            )}
            {coins.length === 0 && !loading && (
              <div className="no-coins-message">No coins found for this category.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTokensModal;
