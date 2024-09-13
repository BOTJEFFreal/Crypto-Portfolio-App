import React from 'react';
import WalletConnector from '../components/WalletConnector';
import ManualAddressInput from '../components/ManualAddressInput';

function HomePage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Wallet Connection</h1>
      <WalletConnector />
      <ManualAddressInput />
    </div>
  );
}

export default HomePage;
