import React from 'react';
import WalletConnector from '../components/WalletConnector/WalletConnector';
import ManualAddressInput from '../components/WalletConnector/ManualAddressInput';
import SearchBar from '../components/SearchBar/SearchBar';
import Watchlist from '../components/Watchlist/Watchlist';

function HomePage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Wallet Connection</h1>
      <WalletConnector />
      <ManualAddressInput />
      <SearchBar/>
      <Watchlist/>
    </div>
  );
}

export default HomePage;
