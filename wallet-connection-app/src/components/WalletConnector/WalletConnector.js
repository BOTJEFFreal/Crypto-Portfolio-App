// src/components/WalletConnector/WalletConnector.js

import React, { useState } from 'react';
import { BrowserProvider, InfuraProvider, formatEther } from 'ethers';
import './WalletConnector.css'; // Add your styles here

function WalletConnector() {
  const [connectedAddress, setConnectedAddress] = useState('');
  const [balance, setBalance] = useState('');
  const [network, setNetwork] = useState('');

  const desiredNetwork = {
    name: 'sepolia',
    chainId: 11155111, // Chain ID for Sepolia
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setConnectedAddress(address);

        // Get network information
        const network = await provider.getNetwork();
        setNetwork(network.name);

        if (network.chainId !== desiredNetwork.chainId) {
          alert(`Please switch your wallet to the ${desiredNetwork.name} test network.`);
          await switchToSepolia();
          const updatedNetwork = await provider.getNetwork();
          setNetwork(updatedNetwork.name);
        }

        // Fetch and set the balance
        getBalance(address);
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    } else {
      alert('No Ethereum wallet detected. Please install MetaMask or another wallet extension.');
    }
  };

  // Function to disconnect the wallet
  const disconnectWallet = () => {
    setConnectedAddress('');
    setBalance('');
    setNetwork('');
  };

  // Function to switch to Sepolia network
  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Hexadecimal Chain ID for Sepolia
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia Test Network',
                rpcUrls: ['https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID'],
                nativeCurrency: {
                  name: 'Sepolia Ether',
                  symbol: 'ETH',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
        } catch (addError) {
          console.error('Failed to add Sepolia network:', addError);
        }
      } else {
        console.error('Failed to switch to Sepolia network:', switchError);
      }
    }
  };

  const getBalance = async (address) => {
    try {
      const provider = new InfuraProvider('sepolia', process.env.REACT_APP_INFURA_PROJECT_ID);
      const balance = await provider.getBalance(address);
      const balanceInEth = formatEther(balance);
      setBalance(balanceInEth);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance('Error fetching balance');
    }
  };

  const shortenAddress = (address) => {
    return address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : '';
  };

  return (
    <div className="wallet-connector">
      {connectedAddress ? (
        <div className="wallet-connected">
          <button className="disconnect-button" onClick={disconnectWallet}>
            <div className="wallet-indicator"></div>
          </button>
        </div>
      ) : (
        <button className="connect-button" onClick={connectWallet}>
          Connect
        </button>
      )}
    </div>
  );
}

export default WalletConnector;
