import React, { useEffect, useState, useRef, useContext } from "react";
import "./SearchBar.css";
import getCoinList from "../../service/getCoinList";
import { CoinContext } from "../../context/CoinContext";

function SearchBar() {
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

  // Fetch coin list from API or localStorage
  useEffect(() => {
    if (coins.length === 0) {
      console.log("Fetching coin list from API...");
      getCoinList(setCoins);
    }
  }, [coins]);

  // Add event listener to detect clicks outside the component
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

  // Handle search input change
  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter coins based on the search query
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

  // Handle keyboard navigation
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

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    setActiveSuggestionIndex(0);
  };

  // Get tokens array safely
  const tokens = coinsList && coinsList.tokens ? coinsList.tokens : [];

  // Handle adding/removing a coin to/from favorites
  const handleFavoriteClick = (coin, event) => {
    event.stopPropagation();
    let updatedTokens;
  
    if (tokens.some((favCoin) => favCoin.id === coin.id)) {
      // Remove from favorites
      updatedTokens = tokens.filter((favCoin) => favCoin.id !== coin.id);
    } else {
      // Add to favorites
      updatedTokens = [...tokens, coin];
    }
  
    setCoinsList({ tokens: updatedTokens });
    localStorage.setItem('favorites', JSON.stringify(updatedTokens));
  };

  // Infinite scroll handler
  const handleScroll = () => {
    if (
      suggestionsRef.current &&
      suggestionsRef.current.scrollTop + suggestionsRef.current.clientHeight >=
        suggestionsRef.current.scrollHeight
    ) {
      // Load more items when scrolled to bottom
      setItemsToShow((prev) => Math.min(prev + 5, filteredCoins.length));
    }
  };

  console.log('coinsList:', coinsList);
  console.log('tokens:', tokens);

  return (
    <div ref={containerRef} style={{ position: "relative", width: "300px" }}>
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
                onClick={() => handleSuggestionClick(coin)}
                className={index === activeSuggestionIndex ? "active" : ""}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "5px",
                  cursor: "pointer",
                }}
              >
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="coin-icon"
                  style={{ width: "24px", height: "24px", marginRight: "10px" }}
                />
                <span style={{ flexGrow: 1 }}>
                  {coin.name} ({coin.symbol.toUpperCase()})
                </span>
                <span
                  className="favorite-icon"
                  onClick={(event) => handleFavoriteClick(coin, event)}
                  style={{ cursor: "pointer" }}
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
