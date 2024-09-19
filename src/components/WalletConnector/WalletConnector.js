// WalletConnector.jsx

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

function WalletConnector() {
  const [connectedAddress, setConnectedAddress] = useState('');
  const [network, setNetwork] = useState('');
  const [chainId, setChainId] = useState(null);
  const [ethBalance, setEthBalance] = useState('');
  const [tokens, setTokens] = useState([]);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [error, setError] = useState('');

  // Define supported networks and their tokens
  const networks = {
    1: { // Ethereum Mainnet
      name: 'Mainnet',
      tokens: [
        {
          symbol: 'USDT',
          address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 6,
        },
        {
          symbol: 'USDC',
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 6,
        },
        {
          symbol: 'DAI',
          address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
        },
        {
          symbol: 'LINK',
          address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
          decimals: 18,
        },
        {
          symbol: 'UNI',
          address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
          decimals: 18,
        },
        // Add more Mainnet tokens as needed
      ],
    },
    11155111: { // Sepolia Testnet
      name: 'Sepolia',
      tokens: [
        {
          symbol: 'DAI',
          address: '0xad6d458402f60fd3bd25163575031acdce07538d', // Example Sepolia DAI address
          decimals: 18,
        },
        {
          symbol: 'USDC',
          address: '0x07865c6e87b9f70255377e024ace6630c1eaa37f', // Example Sepolia USDC address
          decimals: 6,
        },
        {
          symbol: 'LINK',
          address: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB', // Example Sepolia LINK address
          decimals: 18,
        },
        // Add more Sepolia tokens as needed
      ],
    },
  };

  // ERC-20 Token ABI (Minimal)
  const ERC20_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
  ];

  // Function to connect wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];
        setConnectedAddress(address);
        console.log('Connected Address:', address);

        // Initialize provider
        const provider = new ethers.BrowserProvider(window.ethereum);

        // Get network information
        const network = await provider.getNetwork();
        setNetwork(network.name);
        setChainId(network.chainId);
        console.log('Connected Network:', network.name, 'Chain ID:', network.chainId);

        // Fetch ETH and Token balances
        fetchEthBalance(provider, address);
        fetchTokenBalances(provider, address, network.chainId);

        // Listen for network and account changes
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

  // Function to disconnect wallet
  const disconnectWallet = () => {
    setConnectedAddress('');
    setNetwork('');
    setChainId(null);
    setEthBalance('');
    setTokens([]);
    setError('');
  };

  // Function to switch to Ethereum Mainnet
  const switchToMainnet = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }], // Hexadecimal Chain ID for Mainnet
      });
      setNetwork('Mainnet');
      setChainId(1);
      setError('');

      // Re-initialize provider after network switch
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = connectedAddress || (await signer.getAddress());

      // Fetch updated balances
      fetchEthBalance(provider, address);
      fetchTokenBalances(provider, address, 1);
    } catch (switchError) {
      console.error('Failed to switch to Mainnet:', switchError);
      setError('Failed to switch to Ethereum Mainnet.');
    }
  };

  // Function to switch to Sepolia Testnet
  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Hexadecimal Chain ID for Sepolia
      });
      setNetwork('Sepolia');
      setChainId(11155111);
      setError('');

      // Re-initialize provider after network switch
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = connectedAddress || (await signer.getAddress());

      // Fetch updated balances
      fetchEthBalance(provider, address);
      fetchTokenBalances(provider, address, 11155111);
    } catch (switchError) {
      if (switchError.code === 4902) { // Unrecognized chain ID
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia Test Network',
                rpcUrls: ['https://sepolia.infura.io/v3/123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz890'], // Replace with your Infura Project ID
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

          // Re-initialize provider after adding network
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const address = connectedAddress || (await signer.getAddress());

          // Fetch updated balances
          fetchEthBalance(provider, address);
          fetchTokenBalances(provider, address, 11155111);
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

  // Function to handle network changes
  const handleChainChanged = (_chainId) => {
    console.log('Chain changed to:', _chainId);
    window.location.reload();
  };

  // Function to handle account changes
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      disconnectWallet();
    } else {
      setConnectedAddress(accounts[0]);
      console.log('Account changed to:', accounts[0]);

      // Optionally, you can fetch balances again here
      const provider = new ethers.BrowserProvider(window.ethereum);
      fetchEthBalance(provider, accounts[0]);
      fetchTokenBalances(provider, accounts[0], chainId);
    }
  };

  // Function to fetch ETH balance
  const fetchEthBalance = async (provider, address) => {
    try {
      const balance = await provider.getBalance(address);
      // Convert Wei to Ether and format to 4 decimal places
      const eth = Number(ethers.formatEther(balance)).toFixed(4);
      setEthBalance(eth);
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

      const currentNetwork = networks[currentChainId];
      if (!currentNetwork) {
        setError('Unsupported network.');
        setLoadingTokens(false);
        return;
      }

      for (const token of currentNetwork.tokens) {
        try {
          const contract = new ethers.Contract(token.address, ERC20_ABI, signer);
          const balanceRaw = await contract.balanceOf(address);
          const formattedBalance = Number(ethers.formatUnits(balanceRaw, token.decimals)).toFixed(4);

          if (formattedBalance > 0) {
            tokenBalances.push({
              symbol: token.symbol,
              balance: formattedBalance,
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
  }, [chainId]);

  return (
    <div style={styles.container}>
      <h2>Connect to Your Wallet</h2>
      {!connectedAddress ? (
        <button onClick={connectWallet} style={styles.connectButton}>
          Connect Wallet
        </button>
      ) : (
        <button onClick={disconnectWallet} style={styles.disconnectButton}>
          Disconnect Wallet
        </button>
      )}

      {error && <p style={styles.error}>{error}</p>}

      {connectedAddress && (
        <div style={styles.infoContainer}>
          <p>
            <strong>Connected Address:</strong> {connectedAddress}
          </p>
          <p>
            <strong>Network:</strong> {network.charAt(0).toUpperCase() + network.slice(1)}
          </p>
          <p>
            <strong>ETH Balance:</strong> {ethBalance} ETH
          </p>
          <div style={styles.tokensContainer}>
            <strong>ERC-20 Tokens:</strong>
            {loadingTokens ? (
              <p>Loading tokens...</p>
            ) : tokens.length > 0 ? (
              <ul style={styles.tokenList}>
                {tokens.map((token, index) => (
                  <li key={index} style={styles.tokenItem}>
                    {token.symbol}: {token.balance}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No ERC-20 tokens found.</p>
            )}
          </div>
          <div style={styles.networkButtons}>
            {chainId !== 1 && (
              <button onClick={switchToMainnet} style={styles.switchButton}>
                Switch to Mainnet
              </button>
            )}
            {chainId !== 11155111 && (
              <button onClick={switchToSepolia} style={styles.switchButton}>
                Switch to Sepolia Testnet
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Inline styles for simplicity
const styles = {
  container: {
    maxWidth: '500px',
    margin: '50px auto',
    padding: '20px',
    border: '2px solid #ccc',
    borderRadius: '10px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
  },
  connectButton: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
  },
  disconnectButton: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
  },
  switchButton: {
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    backgroundColor: '#008CBA',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    marginTop: '10px',
    marginRight: '10px',
  },
  infoContainer: {
    marginTop: '20px',
    textAlign: 'left',
  },
  tokensContainer: {
    marginTop: '10px',
  },
  tokenList: {
    listStyleType: 'none',
    paddingLeft: '0',
  },
  tokenItem: {
    padding: '5px 0',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
  networkButtons: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
};

export default WalletConnector;
