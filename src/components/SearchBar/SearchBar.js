
import React, { useEffect, useState, useRef, useContext } from "react";
import PropTypes from "prop-types";
import "./SearchBar.css";
import getCoinList from "../../apis/getCoinList";
import { CoinContext } from "../../context/CoinContext";

const SearchBar = ({
  placeholder = "Search for a coin...",
  onSelectCoin, 
  containerClass = "",
}) => {
  const [coins, setCoins] = useState(() => {
    const storedCoins = localStorage.getItem("coinList");
    return storedCoins ? JSON.parse(storedCoins) : [];
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(5);
  const { coinsList, setCoinsList } = useContext(CoinContext);

  const suggestionsRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (coins.length === 0) {
      console.log("Fetching coin list from API...");
      getCoinList(setCoins);
    }
  }, [coins]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
        setActiveSuggestionIndex(0);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCoins([]);
      setShowSuggestions(false);
      return;
    }
    const suggestions = coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCoins(suggestions);
    setShowSuggestions(true);
    setItemsToShow(5);
  }, [searchQuery, coins]);

  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      setActiveSuggestionIndex((prevIndex) =>
        Math.min(prevIndex + 1, filteredCoins.length - 1)
      );
    } else if (event.key === "ArrowUp") {
      setActiveSuggestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (event.key === "Enter") {
      if (filteredCoins.length > 0) {
        handleSuggestionClick(filteredCoins[activeSuggestionIndex]);
      }
    }
  };

  const handleSuggestionClick = (coin) => {
    setSearchQuery("");
    setShowSuggestions(false);
    setActiveSuggestionIndex(0);
    if (onSelectCoin) {
      onSelectCoin(coin);
    }
  };

  const handleFavoriteClick = (coin, event) => {
    event.stopPropagation();
    let updatedTokens;

    if (coinsList.tokens.some((favCoin) => favCoin.id === coin.id)) {
      updatedTokens = coinsList.tokens.filter((favCoin) => favCoin.id !== coin.id);
    } else {
      updatedTokens = [...coinsList.tokens, coin];
    }

    setCoinsList({ tokens: updatedTokens });
    localStorage.setItem("favorites", JSON.stringify(updatedTokens));
  };

  const handleScroll = () => {
    if (
      suggestionsRef.current &&
      suggestionsRef.current.scrollTop + suggestionsRef.current.clientHeight >= suggestionsRef.current.scrollHeight
    ) {
      setItemsToShow((prev) => Math.min(prev + 5, filteredCoins.length));
    }
  };

  const tokens = coinsList && coinsList.tokens ? coinsList.tokens : [];

  return (
    <div ref={containerRef} className={`search-bar-container ${containerClass}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="search-input"
        onFocus={() => {
          if (filteredCoins.length > 0) setShowSuggestions(true);
        }}
      />
      {showSuggestions && filteredCoins.length > 0 && (
        <ul
          ref={suggestionsRef}
          className="suggestions scrollable"
          onScroll={handleScroll}
        >
          {filteredCoins.slice(0, itemsToShow).map((coin, index) => (
            <li
              key={coin.id}
              className={`suggestion-item ${index === activeSuggestionIndex ? "active" : ""}`}
              onClick={() => handleSuggestionClick(coin)}
            >
              <img
                src={coin.image}
                alt={coin.name}
                className="coin-icon"
              />
              <span className="coin-name">
                {coin.name} ({coin.symbol.toUpperCase()})
              </span>
              <span
                className="favorite-icon"
                onClick={(event) => handleFavoriteClick(coin, event)}
                aria-label="Toggle Favorite"
              >
                {tokens.some((favCoin) => favCoin.id === coin.id) ? "★" : "☆"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string,
  onSelectCoin: PropTypes.func, 
  containerClass: PropTypes.string,
};

export default SearchBar;
