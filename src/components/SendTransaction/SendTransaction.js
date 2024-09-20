import React, { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { QRCodeCanvas } from 'qrcode.react';
import './SendTransaction.css';
import NoDataPlaceholder from '../NoDataPlaceholder/NoDataPlaceholder'; 
import { CoinContext } from '../../context/CoinContext';

const SendTransaction = () => {
  const { connectedAddress, connectWallet } = useContext(CoinContext); 
  const [activeTab, setActiveTab] = useState('send'); 
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const sendTransaction = async () => {
    try {
      if (!window.ethereum) {
        setError('MetaMask is not installed. Please install it to send transactions.');
        return;
      }

      setLoading(true);
      setError('');
      setTransactionHash('');

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      if (!ethers.isAddress(recipient)) {
        throw new Error('Invalid recipient address.');
      }

      if (isNaN(amount) || parseFloat(amount) <= 0) {
        throw new Error('Invalid amount. Please enter a valid number greater than 0.');
      }

      const feeData = await provider.getFeeData();
      const tx = {
        to: recipient,
        value: ethers.parseEther(amount),
        gasLimit: 21000,
        gasPrice: feeData.gasPrice,
      };

      const transactionResponse = await signer.sendTransaction(tx);
      await transactionResponse.wait();
      setTransactionHash(transactionResponse.hash);
    } catch (err) {
      if (err.code === 4001) {
        setError('Transaction rejected by the user.');
      } else {
        setError('Transaction failed: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(connectedAddress);
  };

  if (!connectedAddress) {
    return (
      <NoDataPlaceholder
        message="Connect to Wallet"
        description="Connect your wallet to send and receive ETH."
        // No button provided
      />
    );
  }

  return (
    <div className="send-transaction-container">
      <div className="tab-navigation">
        <button
          className={`tab ${activeTab === 'send' ? 'active' : ''}`}
          onClick={() => setActiveTab('send')}
        >
          Send
        </button>
        <button
          className={`tab ${activeTab === 'receive' ? 'active' : ''}`}
          onClick={() => setActiveTab('receive')}
        >
          Receive
        </button>
      </div>

      {activeTab === 'send' && (
        <div className="send-transaction-form">
          <label className="send-transaction-label">Send from</label>
          <p className="wallet-address-display">
            {connectedAddress}
          </p>

          <label className="send-transaction-label">Send to</label>
          <input
            className="send-transaction-input"
            type="text"
            placeholder="Enter public address (0x) or ENS name"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />

          <label className="send-transaction-label">Asset</label>
          <select className="send-transaction-input">
            <option>Select Asset</option>
            <option>ETH</option>
            <option>DAI</option>
          </select>

          <label className="send-transaction-label">Amount</label>
          <input
            className="send-transaction-input"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button
            className="send-transaction-button"
            onClick={sendTransaction}
            disabled={loading || !connectedAddress}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>

          {transactionHash && (
            <p className="send-transaction-success">
              Transaction sent! Hash:{' '}
              <a href={`https://sepolia.etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
                {transactionHash.slice(0, 10)}...
              </a>
            </p>
          )}
          {error && <p className="send-transaction-error">{error}</p>}
        </div>
      )}

      {activeTab === 'receive' && (
        <div className="receive-transaction-form">
          <label className="receive-transaction-label">Receive to</label>
          <div className="qr-code-container">
            <QRCodeCanvas value={connectedAddress} size={256} includeMargin={true} />
            <p className="wallet-address-display">{connectedAddress}</p>
            <button className="copy-address-button" onClick={handleCopyAddress}>
              Copy address
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendTransaction;