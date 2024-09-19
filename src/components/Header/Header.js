import React from 'react';
import './Header.css';
import WalletConnector from '../WalletConnector/WalletConnector';
import SearchBar from '../SearchBar/SearchBar';

const Header = ({ isHomePage }) => {

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="app-title">Dashboard</h1>
      </div>
      {isHomePage ? <SearchBar /> : null}
      <WalletConnector />
    </header>
  );
};

export default Header;
