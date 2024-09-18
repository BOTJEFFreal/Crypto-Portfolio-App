import React, { useState } from 'react';
import { BrowserProvider, InfuraProvider, formatEther } from 'ethers';

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

        // Check if connected to Sepolia
        if (network.chainId !== desiredNetwork.chainId) {
          alert(`Please switch your wallet to the ${desiredNetwork.name} test network.`);
          await switchToSepolia(); // Switch to Sepolia
          
          // Refresh network information after switching
          const updatedNetwork = await provider.getNetwork();
          setNetwork(updatedNetwork.name);

          if (updatedNetwork.chainId !== desiredNetwork.chainId) {
            alert('Failed to switch to Sepolia network.');
            return;
          }
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
                chainId: '0xaa36a7', // Sepolia Chain ID in Hexadecimal
                chainName: 'Sepolia Test Network',
                rpcUrls: ['https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID'], // Replace with your Infura Project ID
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

  // Function to fetch balance from the testnet
  const getBalance = async (address) => {
    try {
      const networkName = desiredNetwork.name; // 'sepolia'
      const provider = new InfuraProvider(
        networkName,
        process.env.REACT_APP_INFURA_PROJECT_ID // Ensure your Infura Project ID is set
      );

      const balance = await provider.getBalance(address);
      const balanceInEth = formatEther(balance); // Format balance from Wei to Ether
      setBalance(balanceInEth);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance('Error fetching balance');
    }
  };

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2>Connect to Your Wallet</h2>
      <button
        onClick={connectWallet}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        Connect Wallet
      </button>
      {connectedAddress && (
        <div style={{ marginTop: '20px' }}>
          <p>
            <strong>Connected Address:</strong> {connectedAddress}
          </p>
          <p>
            <strong>Network:</strong> {network.charAt(0).toUpperCase() + network.slice(1)}
          </p>
          <p>
            <strong>Balance:</strong> {balance !== '' ? `${balance} Sepolia ETH` : 'Loading...'}
          </p>
        </div>
      )}
    </div>
  );
}

export default WalletConnector;
