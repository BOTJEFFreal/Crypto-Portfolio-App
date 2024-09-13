import React, { useState } from 'react';
import { BrowserProvider, InfuraProvider, formatEther } from 'ethers';

function WalletConnector() {
  const [connectedAddress, setConnectedAddress] = useState('');
  const [balance, setBalance] = useState('');

  const connectWallet = async () => {// connect to MetaMask
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setConnectedAddress(address);

        getBalance(address);
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    } else {
      alert('No Ethereum wallet detected. Please install Metamask or another wallet extension.');
    }
  };

  // balance of an address
  const getBalance = async (address) => {
    try {
      const network = 'homestead';
      const provider = new InfuraProvider(
        network,
        process.env.REACT_APP_INFURA_PROJECT_ID
      );

      const balance = await provider.getBalance(address);
      const balanceInEth = formatEther(balance);
      setBalance(balanceInEth);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance('Error fetching balance');
    }
  };

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2>Connect to Your Wallet</h2>
      <button onClick={connectWallet} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Connect Wallet
      </button>
      {connectedAddress && (
        <div>
          <p>
            Connected Address: <strong>{connectedAddress}</strong>
          </p>
          <p>
            Balance: <strong>{balance} ETH</strong>
          </p>
        </div>
      )}
    </div>
  );
}

export default WalletConnector;
