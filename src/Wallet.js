import { useState, useEffect } from 'react';
import { BrowserProvider, formatEther } from 'ethers';

function Wallet() {
  const [walletAddress, setWalletAddress] = useState('');
  const [transactionHistory, setTransactionHistory] = useState([]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);  // Use BrowserProvider from ethers v6
        const accounts = await provider.send("eth_requestAccounts", []);
        setWalletAddress(accounts[0]);
        fetchTransactionHistory(accounts[0]);  // Fetch Sepolia transaction history
      } catch (error) {
        console.error("Error connecting to MetaMask: ", error);
      }
    } else {
      alert('MetaMask not detected');
    }
  };

  const fetchTransactionHistory = async (walletAddress) => {
    const apiKey = process.env.REACT_APP_ETHERSCAN_API_KEY; // Use the API key from .env
    const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === "1") {
        setTransactionHistory(data.result);  // Set transaction history data
      } else {
        console.error("Error fetching transaction history: ", data.message);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <div>
      <h2>Connected Wallet Address: {walletAddress}</h2>
      <h3>Transaction History (Sepolia Testnet)</h3>
      <ul>
        {transactionHistory.map((tx) => (
          <li key={tx.hash}>
            {tx.hash} - {formatEther(tx.value)} ETH {/* Format transaction value */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Wallet;
