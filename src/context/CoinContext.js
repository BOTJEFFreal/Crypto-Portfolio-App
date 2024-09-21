import React, { createContext, useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { supportedNetworks } from '../config/supportedNetworks';

export const CoinContext = createContext();

export const CoinProvider = ({ children }) => {
  const [connectedAddress, setConnectedAddress] = useState('');
  const [chainId, setChainId] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); 
  const [coinsList, setCoinsList] = useState({ tokens: [] });

  useEffect(() => {
    const storedCoins = JSON.parse(localStorage.getItem('favorites')) || [];
    setCoinsList({ tokens: storedCoins });
  }, []);


  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];
        setConnectedAddress(address);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        setChainId(network.chainId);

        
        if (network.chainId === 1) {
          setConnectionStatus('mainnet');
        } else if (network.chainId === 11155111) {
          setConnectionStatus('sepolia');
        }

      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else {
      alert('No Ethereum wallet detected. Please install MetaMask or another wallet extension.');
    }
  };

  const disconnectWallet = () => {
    setConnectedAddress('');
    setChainId(null);
    setConnectionStatus('disconnected');
  };

  const switchToMainnet = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
      });
      setChainId(1);
      setConnectionStatus('mainnet');
    } catch (error) {
      console.error('Failed to switch to Mainnet:', error);
    }
  };

  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], 
      });
      setChainId(11155111);
      setConnectionStatus('sepolia');
    } catch (error) {
      console.error('Failed to switch to Sepolia:', error);
    }
  };

  return (
    <CoinContext.Provider
      value={{
        connectedAddress,
        connectWallet,
        disconnectWallet,
        chainId,
        switchToMainnet,
        switchToSepolia,
        connectionStatus,
         coinsList, 
         setCoinsList 
      }}
    >
      {children}
    </CoinContext.Provider>
  );
};
