import React, { useContext, useState } from 'react';
import { CoinContext } from '../../context/CoinContext';
import './ConnectWalletModal.css';
import ManualAddressInput from './ManualAddressInput';
import { BrowserProvider, getNetwork } from 'ethers';  

const ConnectWalletModal = ({ closeModal }) => {
  const {
    connectedAddress,
    connectWallet,
    disconnectWallet,
    chainId,
    switchToMainnet,
    switchToSepolia,
    connectionStatus,
  } = useContext(CoinContext);

  const [manualAddress, setManualAddress] = useState('');
  const [isManualAddressValid, setIsManualAddressValid] = useState(false);

  const handleConnect = async () => {
    try {
      await connectWallet();

      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();

      if (network.chainId !== 1) {
        try {
          await switchToMainnet();
          console.log("Switched to Mainnet");
        } catch (switchError) {
          console.error("Failed to switch to Mainnet:", switchError);
          alert("Please switch to the Ethereum Mainnet in your wallet.");
        }
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('favorites');
    localStorage.removeItem('coinList');
    localStorage.removeItem('/coins/markets');
    localStorage.removeItem('/search/trending');
    localStorage.removeItem('coinListTimestamp');
    disconnectWallet();
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={closeModal} aria-label="Close Modal">&times;</button>

        <div className="modal-header">
          <h2>{connectedAddress ? 'Disconnect Wallet' : 'Connect Wallet'}</h2>
        </div>

        <p className={`status-message ${connectionStatus === 'connected' ? 'connected' : 'disconnected'}`}>
          {connectionStatus === 'disconnected'
            ? 'Wallet is disconnected.'
            : `Connected to ${connectionStatus}.`}
        </p>

        {!connectedAddress ? (
          <button onClick={handleConnect} className="modal-wallet-button" aria-label="Connect Wallet">
            Connect Wallet
          </button>
        ) : (
          <button onClick={handleDisconnect} className="modal-wallet-button disconnect" aria-label="Disconnect Wallet">
            Disconnect Wallet
          </button>
        )}

        {connectedAddress && (
          <div className="network-buttons">
            {chainId !== 1 && (
              <button onClick={switchToMainnet} className="switch-button" aria-label="Switch to Mainnet">
                Switch to Mainnet
              </button>
            )}
            {chainId !== 11155111 && (
              <button onClick={switchToSepolia} className="switch-button" aria-label="Switch to Sepolia Testnet">
                Switch to Sepolia Testnet
              </button>
            )}
          </div>
        )}

        <div className="divider"></div>

        <div className="modal-right-section">
          <ManualAddressInput
            manualAddress={manualAddress}
            setManualAddress={setManualAddress}
            setIsManualAddressValid={setIsManualAddressValid}
          />
        </div>
      </div>
    </div>
  );
};

export default ConnectWalletModal;
