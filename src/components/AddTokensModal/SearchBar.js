import React from 'react';

const SearchBar = ({
  searchQuery,
  handleSearchInputChange,
  handleKeyDown,
  filteredCoins,
  handleSuggestionClick,
  handleFavoriteClick,
  coinsList,
  showSuggestions,
  itemsToShow,
  suggestionsRef,
  handleScroll,
  activeSuggestionIndex,
}) => {
  return (
    <div className="add-modal-search-section">
      <input
        type="text"
        placeholder="Search coins..."
        value={searchQuery}
        onChange={handleSearchInputChange}
        className="add-modal-search-input"
        onKeyDown={handleKeyDown}
      />
      {showSuggestions && filteredCoins.length > 0 && (
        <ul
          ref={suggestionsRef}
          className="add-modal-suggestions-list scrollable"
          onScroll={handleScroll}
        >
          {filteredCoins.slice(0, itemsToShow).map((coin, index) => (
            <li
              key={coin.id || (coin.item && coin.item.id)}
              className={`add-modal-suggestion-item ${index === activeSuggestionIndex ? 'active' : ''}`}
              onClick={() => handleSuggestionClick(coin)}
            >
              <img
                src={coin.image || (coin.item && coin.item.small)}
                alt={coin.name || (coin.item && coin.item.name)}
                className="add-modal-coin-logo"
              />
              <span className="add-modal-coin-name">
                {coin.name || (coin.item && coin.item.name)}{' '}
                <span className="add-modal-coin-symbol">
                  ({coin.symbol || (coin.item && coin.item.symbol.toUpperCase())})
                </span>
              </span>
              <span
                className="add-modal-favorite-star"
                onClick={(event) => handleFavoriteClick(coin, event)}
              >
                {coinsList.tokens.some((favCoin) => favCoin.id === (coin.id || (coin.item && coin.item.id))) ? '★' : '☆'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;