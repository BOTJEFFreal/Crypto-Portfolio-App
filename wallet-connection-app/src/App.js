import React from 'react';
import TransferToken from './pages/TransferToken';
function App() {
  const tokenAddress = '0x111111111111111111111111';

  return (
    <div>
      <h1>Token Transfer App</h1>
      <TransferToken tokenAddress={tokenAddress} />
    </div>
  );
}

export default App;
