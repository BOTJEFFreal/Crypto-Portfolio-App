import React, { useState, useEffect, useRef, useContext } from 'react';
import './AddTokensModal.css';
import { CoinContext } from '../../context/CoinContext';
import getTrendingCoins from '../../apis/getTrendingCoins';
import getTopGainers from '../../apis/getTopGainers';
import getTopLosers from '../../apis/getTopLosers';
import getRecentlyAddedCoins from '../../apis/getRecentlyAddedCoins';

import SearchBar from './SearchBar';
import Tabs from './Tabs';
import CoinList from './CoinList';
import CoinDetails from './CoinDetails';

const AddTokensModal = ({ closeModal }) => {
  const { coinsList, setCoinsList } = useContext(CoinContext);
  const [activeTab, setActiveTab] = useState('trending');
  const [coins, setCoins] = useState([]); 
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(10);

  const suggestionsRef = useRef(null);

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
  }, [activeTab]); // Add activeTab as a dependency to refetch data when the tab changes

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const suggestions = coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchSuggestions(suggestions);
    setShowSuggestions(true);
    setItemsToShow(10);
  }, [searchQuery, coins]);

  // Load favorite tokens from localStorage on initial render
  useEffect(() => {
    const favoritesFromLocalStorage = localStorage.getItem('favorites');
    if (favoritesFromLocalStorage) {
      const favoriteTokens = JSON.parse(favoritesFromLocalStorage);
      setCoinsList({ tokens: favoriteTokens });
    }
  }, [setCoinsList]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setActiveSuggestionIndex((prev) => Math.min(prev + 1, searchSuggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      setActiveSuggestionIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (searchSuggestions.length > 0) {
        handleSuggestionClick(searchSuggestions[activeSuggestionIndex]);
      }
    }
  };

  const handleSuggestionClick = (coin) => {
    setSelectedCoin(coin);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  // Handle favorite click logic
  const tokens = coinsList && coinsList.tokens ? coinsList.tokens : [];
  
  // Check and store token in 'favorites' localStorage
  const handleFavoriteClick = (coin, event) => {
    event.stopPropagation();
    
    const storedCoinsList = JSON.parse(localStorage.getItem('coinList')) || [];
    const selectedToken = storedCoinsList.find((storedCoin) => storedCoin.id === coin.id);

    if (selectedToken) {
      let updatedTokens;
      const favoritesFromLocalStorage = JSON.parse(localStorage.getItem('favorites')) || [];
      if (favoritesFromLocalStorage.some((favCoin) => favCoin.id === selectedToken.id)) {
        updatedTokens = favoritesFromLocalStorage.filter((favCoin) => favCoin.id !== selectedToken.id);
      } else {
        updatedTokens = [...favoritesFromLocalStorage, selectedToken];
      }

      localStorage.setItem('favorites', JSON.stringify(updatedTokens));
      setCoinsList({ tokens: updatedTokens });
    }
  };

  const handleScroll = () => {
    if (
      suggestionsRef.current &&
      suggestionsRef.current.scrollTop + suggestionsRef.current.clientHeight >= suggestionsRef.current.scrollHeight
    ) {
      setItemsToShow((prev) => Math.min(prev + 10, searchSuggestions.length));
    }
  };

  return (
    <div className="add-modal-overlay" onClick={closeModal}>
      <div className="add-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="add-modal-header">
          <h2>Add Coins</h2>
          <span className="add-modal-close-button" onClick={closeModal}>
            &times;
          </span>
        </div>
        <div className="add-modal-body">
          <SearchBar
            searchQuery={searchQuery}
            handleSearchInputChange={(e) => setSearchQuery(e.target.value)}
            handleKeyDown={handleKeyDown}
            filteredCoins={searchSuggestions}
            handleSuggestionClick={handleSuggestionClick}
            handleFavoriteClick={handleFavoriteClick}
            coinsList={coinsList}
            showSuggestions={showSuggestions}
            itemsToShow={itemsToShow}
            suggestionsRef={suggestionsRef}
            handleScroll={handleScroll}
            activeSuggestionIndex={activeSuggestionIndex}
          />
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="add-modal-main">
            <CoinList
              coins={coins.slice(0, itemsToShow)}
              selectedCoin={selectedCoin}
              setSelectedCoin={setSelectedCoin}
              handleFavoriteClick={handleFavoriteClick}
              coinsList={coinsList}
            />
            <CoinDetails selectedCoin={selectedCoin} activeTab={activeTab} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTokensModal;
