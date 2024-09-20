import React, { useState, useEffect, useContext } from 'react';
import { CoinContext } from '../../context/CoinContext';
import { getEtherscanApiUrl } from '../../utils/etherscan';
import './TransactionHistory.css';
import NoDataPlaceholder from '../NoDataPlaceholder/NoDataPlaceholder';
import { useNavigate } from 'react-router-dom';

const TransactionHistory = () => {
  const { connectedAddress, chainId } = useContext(CoinContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate(); // For navigation in case needed

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      if (!connectedAddress || !chainId) {
        setTransactions([]);
        return;
      }

      const etherscanApiUrl = getEtherscanApiUrl(chainId);
      if (!etherscanApiUrl) {
        setError('Unsupported network for fetching transactions.');
        setTransactions([]);
        return;
      }

      const apiKey = process.env.REACT_APP_ETHERSCAN_API_KEY;
      if (!apiKey) {
        setError('Etherscan API key is not set.');
        setTransactions([]);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await fetch(
          `${etherscanApiUrl}?module=account&action=txlist&address=${connectedAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`
        );

        const data = await response.json();

        if (data.status !== '1') {
          setError(data.message || 'Failed to fetch transactions.');
          setTransactions([]);
        } else {
          setTransactions(data.result);
        }
      } catch (err) {
        console.error('Error fetching transaction history:', err);
        setError('An error occurred while fetching transactions.');
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionHistory();
  }, [connectedAddress, chainId]);

  if (!connectedAddress) {
    return (
      <NoDataPlaceholder
        message="Please connect your wallet"
        description="Connect your wallet to view transaction history and track your transactions on the blockchain."
        // No button provided
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
        onButtonClick={() => navigate('/send')} // Navigate to Send ETH tab
      />
    );
  }

  return (
    <div className="transaction-history-container">
      <h2>Transaction History</h2>
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
                    href={
                      chainId === 1
                        ? `https://etherscan.io/tx/${tx.hash}`
                        : chainId === 11155111
                        ? `https://sepolia.etherscan.io/tx/${tx.hash}`
                        : '#'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tx.hash.slice(0, 10)}...
                  </a>
                </td>
                <td>{tx.blockNumber}</td>
                <td>
                  <a
                    href={
                      chainId === 1
                        ? `https://etherscan.io/address/${tx.from}`
                        : chainId === 11155111
                        ? `https://sepolia.etherscan.io/address/${tx.from}`
                        : '#'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tx.from.slice(0, 6)}...
                  </a>
                </td>
                <td>
                  <a
                    href={
                      chainId === 1
                        ? `https://etherscan.io/address/${tx.to}`
                        : chainId === 11155111
                        ? `https://sepolia.etherscan.io/address/${tx.to}`
                        : '#'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tx.to ? tx.to.slice(0, 6) + '...' : 'Contract Creation'}
                  </a>
                </td>
                <td>{(parseFloat(tx.value) / 1e18).toFixed(4)}</td>
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