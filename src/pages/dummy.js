import React, { useState } from 'react';
import { ethers } from 'ethers';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTransactionHistory = async () => {
    try {
      setLoading(true);
      setError('');
  
      // Initialize the provider (use your Infura/Alchemy or other RPC URL)
      const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/61f48b55e37a458695ed48d9fbf56bec');
      
      // Wallet address you want to query (replace with the actual wallet address)
      const walletAddress = '0x860D41D8CD3a5bd187369F2596Ca725A69Bbb3a7';
  
      // Fetch the latest block number
      const latestBlock = await provider.getBlockNumber();
  
      // Set the earliest block (example: fetching from the last 50,000 blocks)
      const earliestBlock = latestBlock - 50000;
  
      // Create a filter to fetch the transactions
      const history = await provider.getLogs({
        fromBlock: earliestBlock,
        toBlock: latestBlock,
        address: walletAddress,
      });
  
      // Display transaction history in the UI
      const parsedHistory = history.map(log => ({
        transactionHash: log.transactionHash,
        blockNumber: log.blockNumber,
        from: log.address,
        data: log.data,
      }));
  
      setTransactions(parsedHistory);
    } catch (err) {
      setError('Error fetching transaction history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <button onClick={fetchTransactionHistory}>Get Transaction History</button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && transactions.length === 0 && <p>No transactions found.</p>}
      {transactions.length > 0 && (
        <ul>
          {transactions.map((tx, index) => (
            <li key={index}>
              <p>Transaction Hash: {tx.transactionHash}</p>
              <p>Block Number: {tx.blockNumber}</p>
              <p>From: {tx.from}</p>
              <p>Data: {tx.data}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionHistory;
