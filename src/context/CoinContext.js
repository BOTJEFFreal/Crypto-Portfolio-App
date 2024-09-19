// src/context/CoinContext.jsx

import React, { createContext, useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';

import { supportedNetworks } from '../config/supportedNetworks';

export const CoinContext = createContext();

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function name() view returns (string)',
  // Add more ERC20 functions if needed
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

  // State Variables
  const [connectedAddress, setConnectedAddress] = useState('');
  const [network, setNetwork] = useState('');
  const [chainId, setChainId] = useState(null);
  const [ethBalance, setEthBalance] = useState('');
  const [ethPrice, setEthPrice] = useState(0); // ETH price in USD
  const [tokens, setTokens] = useState([]);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [error, setError] = useState('');

  const providerRef = useRef(null);

  // Handle network and account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [connectedAddress, chainId]);

  const handleChainChanged = async (_chainIdHex) => {
    console.log('Chain changed to:', _chainIdHex);
    const decimalChainId = parseInt(_chainIdHex, 16); 
    setChainId(decimalChainId);

    const currentNetwork = supportedNetworks[decimalChainId];
    if (currentNetwork) {
      setNetwork(currentNetwork.name);
      if (providerRef.current && connectedAddress) {
        await fetchEthBalance(providerRef.current, connectedAddress);
        await fetchEthPrice();
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
        await fetchEthPrice();
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
        await fetchEthPrice();
        await fetchTokenBalances(provider, address, networkData.chainId);

        setError('');
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
    setEthPrice(0);
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
      await fetchEthPrice();
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
      await fetchEthPrice();
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
          await fetchEthPrice();
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

  // Fetch ETH/Testnet ETH balance
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

  // Fetch ETH's current price in USD from CoinGecko
  const fetchEthPrice = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      );
      const data = await response.json();
      if (data.ethereum && data.ethereum.usd) {
        setEthPrice(data.ethereum.usd);
        console.log('ETH Price:', data.ethereum.usd);
      } else {
        setEthPrice(0);
        console.error('Invalid ETH price data:', data);
      }
    } catch (error) {
      console.error('Error fetching ETH price:', error);
      setEthPrice(0);
    }
  };

  // Fetch ERC20 token balances and their price data
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

          // Fetch token price and sparkline data from CoinGecko
          const priceData = await fetchTokenPriceData(token.id);
          if (Number(formattedBalance) > 0) {
            tokenBalances.push({
              id: token.id,
              name: token.name,
              symbol: token.symbol,
              image: token.image,
              quantity: Number(formattedBalance),
              current_price: priceData.current_price,
              price_change_percentage_24h_in_currency: priceData.price_change_percentage_24h,
              sparkline_in_7d: priceData.sparkline_in_7d,
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

  // Fetch token price data from CoinGecko
  const fetchTokenPriceData = async (tokenId) => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart?vs_currency=usd&days=7`
      );
      const data = await response.json();
      return {
        current_price: data.prices[data.prices.length - 1][1],
        price_change_percentage_24h_in_currency:
          ((data.prices[data.prices.length - 1][1] - data.prices[data.prices.length - 2][1]) /
            data.prices[data.prices.length - 2][1]) *
          100,
        sparkline_in_7d: { price: data.prices.map((p) => p[1]) },
      };
    } catch (error) {
      console.error(`Error fetching price data for ${tokenId}:`, error);
      return {
        current_price: 0,
        price_change_percentage_24h_in_currency: 0,
        sparkline_in_7d: { price: [] },
      };
    }
  };

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
        ethPrice,
        setEthPrice,
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
