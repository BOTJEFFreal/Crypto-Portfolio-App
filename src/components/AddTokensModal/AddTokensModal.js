import React, { useState, useEffect, useRef, useContext } from 'react';
import './AddTokensModal.css';
import { CoinContext } from '../../context/CoinContext';
import getTrendingCoins from '../../service/getTrendingCoins';
import getTopGainers from '../../service/getTopGainers';
import getTopLosers from '../../service/getTopLosers';
import getRecentlyAddedCoins from '../../service/getRecentlyAddedCoins';

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
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(10);

  const suggestionsRef = useRef(null);

  useEffect(() => {
    const fetchCoins = async () => {
      setLoading(true);
      let data = [];
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
      setCoins(data);
      setFilteredCoins(data);
      setLoading(false);
    };
    fetchCoins();
  }, [activeTab]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCoins(coins);
      setShowSuggestions(false);
      return;
    }
    const filtered = coins.filter(
      (coin) =>
        (coin.name && coin.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (coin.symbol && coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredCoins(filtered);
    setShowSuggestions(true);
    setItemsToShow(10);
  }, [searchQuery, coins]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.add-modal-search-section')) {
        setShowSuggestions(false);
        setActiveSuggestionIndex(0);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setActiveSuggestionIndex((prev) =>
        Math.min(prev + 1, filteredCoins.length - 1)
      );
    } else if (e.key === 'ArrowUp') {
      setActiveSuggestionIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (filteredCoins.length > 0) {
        handleSuggestionClick(filteredCoins[activeSuggestionIndex]);
      }
    }
  };

  const handleSuggestionClick = (coin) => {
    setSelectedCoin(coin);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleFavoriteClick = (coin, event) => {
    event.stopPropagation();
    
    const storedCoins = JSON.parse(localStorage.getItem('coinsList')) || [];
    const coinId = coin.id || (coin.item && coin.item.id);
    const fullCoinData = storedCoins.find((storedCoin) => storedCoin.id === coinId);
  
    if (!fullCoinData) {
      console.error('Coin not found in stored list.');
      return;
    }
  
    let updatedTokens;
  
    if (coinsList.tokens.some((favCoin) => favCoin.id === coinId)) {
      updatedTokens = coinsList.tokens.filter((favCoin) => favCoin.id !== coinId);
    } else {
      updatedTokens = [...coinsList.tokens, fullCoinData];
    }

    setCoinsList({ tokens: updatedTokens });
    localStorage.setItem('favorites', JSON.stringify(updatedTokens));
  };

  const handleScroll = () => {
    if (
      suggestionsRef.current &&
      suggestionsRef.current.scrollTop + suggestionsRef.current.clientHeight >=
        suggestionsRef.current.scrollHeight
    ) {
      setItemsToShow((prev) => Math.min(prev + 10, filteredCoins.length));
    }
  };

  return (
    <div className="add-modal-overlay" onClick={closeModal}>
      <div className="add-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="add-modal-header">
          <h2>Add Coins</h2>
          <span className="add-modal-close-button" onClick={closeModal}>&times;</span>
        </div>
        <div className="add-modal-body">
          <SearchBar
            searchQuery={searchQuery}
            handleSearchInputChange={(e) => setSearchQuery(e.target.value)}
            handleKeyDown={handleKeyDown}
            filteredCoins={filteredCoins}
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
              coins={filteredCoins.slice(0, itemsToShow)}
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
