import React, { useContext } from 'react';
import { CoinContext } from '../../context/CoinContext';
import './WalletConnector.css'; 
const WalletConnector = () => {
  const {
    connectedAddress,
    connectWallet,
    disconnectWallet,
    network,
    chainId,
    switchToMainnet,
    switchToSepolia,
    error,
  } = useContext(CoinContext);

  return (
    <div>
       {!connectedAddress ? (
        <button onClick={connectWallet} className="connect-button">
          <div className="hover-message">Connect your wallet</div>
        </button>
      ) : (
        <button onClick={disconnectWallet} className="disconnect-button">
          <div className="hover-message">Disconnect your wallet</div>
        </button>
      )}

      {error && <p className="error-message">{error}</p>}

      {connectedAddress && (
        <div className="network-buttons">
          {chainId !== 1 && (
            <button onClick={switchToMainnet} className="switch-button">
              Switch to Mainnet
            </button>
          )}
          {chainId !== 11155111 && (
            <button onClick={switchToSepolia} className="switch-button">
              Switch to Sepolia Testnet
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnector;
