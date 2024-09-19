
import React from 'react';
import './Header.css';
import WalletConnector from '../WalletConnector/WalletConnector';
import SearchBar from '../SearchBar/SearchBar'

const Header = () => {
  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (query) {
      // Implement search functionality, e.g., navigate to a search results page
      console.log('Search Query:', query);
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="app-title">Dashboard</h1>
      </div>
        <SearchBar/>
      {/* <div className="header-right"> */}
        <WalletConnector />
      {/* </div> */}
    </header>
  );
};

export default Header;
