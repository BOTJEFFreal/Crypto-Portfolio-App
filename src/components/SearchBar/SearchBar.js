// src/components/SearchBar/SearchBar.jsx

import React, { useEffect, useState, useRef, useContext } from "react";
import "./SearchBar.css";
import getCoinList from "../../service/getCoinList";
import { CoinContext } from "../../context/CoinContext";

function SearchBar({ containerClass = "" }) {
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

  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const filtered = coins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(query.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCoins(filtered);
      setShowSuggestions(true);
      setItemsToShow(5);
    } else {
      setFilteredCoins([]);
      setShowSuggestions(false);
    }
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
        setSearchQuery(filteredCoins[activeSuggestionIndex].name);
        setShowSuggestions(false);
        setActiveSuggestionIndex(0);
      }
    }
  };

  const tokens = coinsList && coinsList.tokens ? coinsList.tokens : [];

  const handleFavoriteClick = (coin, event) => {
    event.stopPropagation();
    let updatedTokens;

    if (tokens.some((favCoin) => favCoin.id === coin.id)) {
      updatedTokens = tokens.filter((favCoin) => favCoin.id !== coin.id);
    } else {
      updatedTokens = [...tokens, coin];
    }

    setCoinsList({ tokens: updatedTokens });
    localStorage.setItem("favorites", JSON.stringify(updatedTokens));
  };

  const handleScroll = () => {
    if (
      suggestionsRef.current &&
      suggestionsRef.current.scrollTop + suggestionsRef.current.clientHeight >=
        suggestionsRef.current.scrollHeight
    ) {
      setItemsToShow((prev) => Math.min(prev + 5, filteredCoins.length));
    }
  };

  return (
    <div ref={containerRef} className={`search-bar-container ${containerClass}`}>
      <input
        type="text"
        placeholder="Search for a coin..."
        value={searchQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="search-input"
      />
      {showSuggestions && filteredCoins.length > 0 && (
        <div>
          <ul
            ref={suggestionsRef}
            className="suggestions scrollable"
            onScroll={handleScroll}
          >
            {filteredCoins.slice(0, itemsToShow).map((coin, index) => (
              <li
                key={coin.id}
                className={index === activeSuggestionIndex ? "active" : ""}
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
                >
                  {tokens.some((favCoin) => favCoin.id === coin.id)
                    ? "★"
                    : "☆"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
