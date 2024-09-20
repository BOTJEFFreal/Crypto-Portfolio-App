import React, { useState } from 'react';
import './WalletConnector.css';
import ConnectWalletModal from '../ConnectWalletModal/ConnectWalletModal'; 
const WalletConnector = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div>
      <button onClick={toggleModal} className="connect-button">
      </button>

      {isModalOpen && <ConnectWalletModal closeModal={toggleModal} />}
    </div>
  );
};

export default WalletConnector;
