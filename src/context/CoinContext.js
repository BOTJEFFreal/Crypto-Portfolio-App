import React, { createContext, useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';

import { supportedNetworks } from '../config/supportedNetworks';

export const CoinContext = createContext();


const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
];

export const CoinProvider = ({ children }) => {
  const [coinsList, setCoinsList] = useState({ tokens: [] });

  useEffect(() => {
    const loadTokens = () => {
      const storedTokens = localStorage.getItem('favorites');
      if (storedTokens) {
        try {
          const tokens = JSON.parse(storedTokens);
          console.log('Loaded tokens:', tokens);
          setCoinsList({ tokens });
        } catch (error) {
          console.error('Error parsing tokens from localStorage:', error);
        }
      }
    };

    loadTokens();

    window.addEventListener('storage', loadTokens);

    return () => {
      window.removeEventListener('storage', loadTokens);
    };
  }, []);

  const [connectedAddress, setConnectedAddress] = useState('');
  const [network, setNetwork] = useState('');
  const [chainId, setChainId] = useState(null);
  const [ethBalance, setEthBalance] = useState('');
  const [tokens, setTokens] = useState([]);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [error, setError] = useState('');

  const providerRef = useRef(null);
  const handleChainChanged = async (_chainIdHex) => {
    console.log('Chain changed to:', _chainIdHex);
    const decimalChainId = parseInt(_chainIdHex, 16); 
    setChainId(decimalChainId);

    const currentNetwork = supportedNetworks[decimalChainId];
    if (currentNetwork) {
      setNetwork(currentNetwork.name);
      if (providerRef.current && connectedAddress) {
        await fetchEthBalance(providerRef.current, connectedAddress);
        await fetchTokenBalances(providerRef.current, connectedAddress, decimalChainId);
      }
    } else {
      setNetwork('Unsupported Network');
      setTokens([]);
      setError('Unsupported network. Please switch to a supported network.');
    }
  };

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setConnectedAddress(accounts[0]);
      console.log('Account changed to:', accounts[0]);

      if (providerRef.current) {
        await fetchEthBalance(providerRef.current, accounts[0]);
        await fetchTokenBalances(providerRef.current, accounts[0], chainId);
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];
        setConnectedAddress(address);
        console.log('Connected Address:', address);

        const provider = new ethers.BrowserProvider(window.ethereum);
        providerRef.current = provider;

        const networkData = await provider.getNetwork();
        setNetwork(networkData.name);
        setChainId(networkData.chainId);
        console.log('Connected Network:', networkData.name, 'Chain ID:', networkData.chainId);

        await fetchEthBalance(provider, address);
        await fetchTokenBalances(provider, address, networkData.chainId);

        window.ethereum.on('chainChanged', handleChainChanged);
        window.ethereum.on('accountsChanged', handleAccountsChanged);
      } catch (err) {
        console.error('Error connecting to wallet:', err);
        setError('Failed to connect wallet. Please try again.');
      }
    } else {
      alert('No Ethereum wallet detected. Please install MetaMask or another wallet extension.');
    }
  };

  const disconnectWallet = () => {
    setConnectedAddress('');
    setNetwork('');
    setChainId(null);
    setEthBalance('');
    setTokens([]);
    setError('');
  };

  const switchToMainnet = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
      });
      setNetwork('Mainnet');
      setChainId(1);
      setError('');

      const provider = new ethers.BrowserProvider(window.ethereum);
      providerRef.current = provider;
      const address = connectedAddress || (await provider.getSigner().getAddress());

      await fetchEthBalance(provider, address);
      await fetchTokenBalances(provider, address, 1);
    } catch (switchError) {
      console.error('Failed to switch to Mainnet:', switchError);
      setError('Failed to switch to Ethereum Mainnet.');
    }
  };

  
  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], 
      });
      setNetwork('Sepolia');
      setChainId(11155111);
      setError('');

      // Re-initialize provider after network switch
      const provider = new ethers.BrowserProvider(window.ethereum);
      providerRef.current = provider;
      const address = connectedAddress || (await provider.getSigner().getAddress());

      // Fetch updated balances
      await fetchEthBalance(provider, address);
      await fetchTokenBalances(provider, address, 11155111);
    } catch (switchError) {
      if (switchError.code === 4902) { 
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia Test Network',
                rpcUrls: ['https://sepolia.infura.io/v3/61f48b55e37a458695ed48d9fbf56bec'],
                nativeCurrency: {
                  name: 'Sepolia Ether',
                  symbol: 'ETH',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
          setNetwork('Sepolia');
          setChainId(11155111);
          setError('');

          const provider = new ethers.BrowserProvider(window.ethereum);
          providerRef.current = provider;
          const address = connectedAddress || (await provider.getSigner().getAddress());

          await fetchEthBalance(provider, address);
          await fetchTokenBalances(provider, address, 11155111);
        } catch (addError) {
          console.error('Failed to add Sepolia network:', addError);
          setError('Failed to add Sepolia Test Network.');
        }
      } else {
        console.error('Failed to switch to Sepolia network:', switchError);
        setError('Failed to switch to Sepolia Test Network.');
      }
    }
  };

  // get ETH balance
  const fetchEthBalance = async (provider, address) => {
    try {
      const balance = await provider.getBalance(address);
      const eth = ethers.formatEther(balance); 
      setEthBalance(Number(eth).toFixed(4)); 
      console.log('ETH Balance:', eth);
    } catch (err) {
      console.error('Error fetching ETH balance:', err);
      setError('Failed to fetch ETH balance.');
    }
  };

  const fetchTokenBalances = async (provider, address, currentChainId) => {
    setLoadingTokens(true);
    setError('');
    try {
      const signer = await provider.getSigner();
      const tokenBalances = [];

      const currentNetwork = supportedNetworks[currentChainId];
      if (!currentNetwork) {
        setError('Unsupported network.');
        setLoadingTokens(false);
        return;
      }

      for (const token of currentNetwork.tokens) {
        try {
          const contract = new ethers.Contract(token.address, ERC20_ABI, signer);
          const balanceRaw = await contract.balanceOf(address);
          const formattedBalance = ethers.formatUnits(balanceRaw, token.decimals);

          if (Number(formattedBalance) > 0) {
            tokenBalances.push({
              symbol: token.symbol,
              balance: Number(formattedBalance).toFixed(4),
            });
          }
        } catch (tokenError) {
          console.error(`Error fetching balance for ${token.symbol}:`, tokenError);
        }
      }

      setTokens(tokenBalances);
      console.log('Token Balances:', tokenBalances);
    } catch (err) {
      console.error('Error fetching token balances:', err);
      setError('Failed to fetch token balances.');
    } finally {
      setLoadingTokens(false);
    }
  };

  useEffect(() => {
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
   
  }, []);

  return (
    <CoinContext.Provider
      value={{
        coinsList,
        setCoinsList,
        connectedAddress,
        setConnectedAddress,
        network,
        setNetwork,
        chainId,
        setChainId,
        ethBalance,
        setEthBalance,
        tokens,
        setTokens,
        loadingTokens,
        setLoadingTokens,
        error,
        setError,

        connectWallet,
        disconnectWallet,
        switchToMainnet,
        switchToSepolia,
      }}
    >
      {children}
    </CoinContext.Provider>
  );
};
