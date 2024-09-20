import React, { useContext } from 'react';
import { CoinContext } from '../../context/CoinContext';
import './ConnectWalletModal.css';
import ManualAddressInput from './ManualAddressInput'; // Import the manual input component

const ConnectWalletModal = ({ closeModal }) => {
  const {
    connectedAddress,
    connectWallet,
    disconnectWallet,
    chainId,
    switchToMainnet,
    switchToSepolia,
    error,
  } = useContext(CoinContext);

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={closeModal}>&times;</span>

        <div className="modal-sections">
          {/* Left Section: Connect/Disconnect and Network Buttons */}
          <div className="modal-left-section">
            <div className="modal-header">
              <h2>{connectedAddress ? 'Disconnect Wallet' : 'Connect Wallet'}</h2>
            </div>

            {error && <p className="error-message">{error}</p>}

            {!connectedAddress ? (
              <button onClick={connectWallet} className="modal-wallet-button">
                Connect
              </button>
            ) : (
              <button onClick={disconnectWallet} className="modal-wallet-button">
                Disconnect
              </button>
            )}

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

          {/* Right Section: Manual Address Input */}
          <div className="modal-right-section">
            <ManualAddressInput />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectWalletModal;
