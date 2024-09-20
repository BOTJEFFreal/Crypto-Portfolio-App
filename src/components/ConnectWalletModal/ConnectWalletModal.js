import React, { useContext, useState } from 'react';
import { CoinContext } from '../../context/CoinContext';
import './ConnectWalletModal.css';
import ManualAddressInput from './ManualAddressInput';

const ConnectWalletModal = ({ closeModal }) => {
  const {
    connectedAddress,
    connectWallet,
    disconnectWallet,
    chainId,
    switchToMainnet,
    switchToSepolia,
    connectionStatus, // Access connection status
  } = useContext(CoinContext);

  const [manualAddress, setManualAddress] = useState('');
  const [isManualAddressValid, setIsManualAddressValid] = useState(false);

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={closeModal}>&times;</span>

        <div className="modal-sections">
          <div className="modal-left-section">
            <div className="modal-header">
              <h2>{connectedAddress ? 'Disconnect Wallet' : 'Connect Wallet'}</h2>
            </div>

            {/* Display connection status */}
            <p className="status-message">
              {connectionStatus === 'disconnected'
                ? 'Wallet is disconnected.'
                : `Connected to ${connectionStatus}.`}
            </p>

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

          <div className="modal-right-section">
            <ManualAddressInput
              manualAddress={manualAddress}
              setManualAddress={setManualAddress}
              setIsManualAddressValid={setIsManualAddressValid}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectWalletModal;
