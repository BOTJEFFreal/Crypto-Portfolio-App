import React, { useState, useEffect, useContext } from 'react';
import { CoinContext } from '../../context/CoinContext';
import { formatEther } from 'ethers'; 
import './TransactionHistory.css';
import NoDataPlaceholder from '../NoDataPlaceholder/NoDataPlaceholder';
import { useNavigate } from 'react-router-dom';
import { fetchTransactionHistory } from '../../service/transactionHistoryService';

const TransactionHistory = () => {
  const { chainId, connectionStatus, connectedAddress } = useContext(CoinContext); 
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // UseEffect to handle changes in connectionStatus
  useEffect(() => {
    if (connectionStatus === 'mainnet' || connectionStatus === 'sepolia') {
      if (connectedAddress) {
        fetchTransactionHistory(connectedAddress, chainId, setTransactions, setError, setLoading); // Use the service here
      }
    } else if (connectionStatus === 'disconnected') { 
      setTransactions([]);
      setError('Wallet is disconnected. Please connect your wallet.');
    }
  }, [connectionStatus, connectedAddress, chainId]);

  // Update transaction explorer links based on network
  const getExplorerLink = (txHash, address, type) => {
    let explorerUrl = '#'; // Default unsupported link

    if (chainId === 1) {
      explorerUrl = type === 'tx' 
        ? `https://etherscan.io/tx/${txHash}` 
        : `https://etherscan.io/address/${address}`;
    } else if (chainId === 11155111) {
      explorerUrl = type === 'tx' 
        ? `https://sepolia.etherscan.io/tx/${txHash}` 
        : `https://sepolia.etherscan.io/address/${address}`;
    }

    return explorerUrl;
  };

  // Show NoDataPlaceholder when wallet is not connected
  if (connectionStatus === 'disconnected') {
    return (
      <NoDataPlaceholder
        message="Please connect your wallet"
        description="Connect your wallet to view transaction history and track your transactions on the blockchain."
      />
    );
  }

  // Show NoDataPlaceholder when the network is unsupported
  if (chainId !== 1 && chainId !== 11155111) {
    return (
      <NoDataPlaceholder
        message="Unsupported Network"
        description="The selected network is not supported. Please switch to Mainnet or Sepolia Testnet to view transaction history."
      />
    );
  }

  if (loading) {
    return <p>Loading transactions...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (transactions.length === 0) {
    return (
      <NoDataPlaceholder
        message="No Transactions Found"
        description="Send or receive tokens to see your transaction history here."
        buttonText="Send ETH"
        onButtonClick={() => navigate('/send')}
      />
    );
  }

  return (
    <div className="transaction-history-container">
      <h2>Transaction History {chainId === 1 ? "(Mainnet)" : "(Sepolia Testnet)"}</h2>
      <div className="table-responsive">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Txn Hash</th>
              <th>Block</th>
              <th>From</th>
              <th>To</th>
              <th>Value (ETH)</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.hash}>
                <td>
                  <a
                    href={getExplorerLink(tx.hash, '', 'tx')}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tx.hash.slice(0, 10)}...
                  </a>
                </td>
                <td>{tx.blockNumber}</td>
                <td>
                  <a
                    href={getExplorerLink('', tx.from, 'address')}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tx.from.slice(0, 6)}...
                  </a>
                </td>
                <td>
                  <a
                    href={getExplorerLink('', tx.to, 'address')}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tx.to ? tx.to.slice(0, 6) + '...' : 'Contract Creation'}
                  </a>
                </td>
                <td>{formatEther(tx.value)} ETH</td>
                <td>{new Date(tx.timeStamp * 1000).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
