import React, { useState, useEffect } from 'react';
import {
  BrowserProvider,
  Contract,
  formatUnits,
  parseUnits,
  isAddress,
} from 'ethers';

const tokenABI = [
    "function transfer(address to, uint amount) returns (bool)",
    "function balanceOf(address) view returns (uint)",
    "function decimals() view returns (uint8)"
  ];

  
const TransferToken = ({ tokenAddress }) => {
    const [account, setAccount] = useState('');
    const [tokenBalance, setTokenBalance] = useState('0');
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [decimals, setDecimals] = useState(18);
    const [txHash, setTxHash] = useState('');
    const [error, setError] = useState('');
  
    useEffect(() => {
      const fetchAccountAndBalance = async () => {
        try {
          if (!window.ethereum) throw new Error('MetaMask not detected');
  
          const provider = new BrowserProvider(window.ethereum);
  
          await provider.send('eth_requestAccounts', []);
  
          const signer = await provider.getSigner();
  
          const userAddress = await signer.getAddress();
          setAccount(userAddress);
  
          const tokenContract = new Contract(tokenAddress, tokenABI, provider);
  
          const tokenDecimals = await tokenContract.decimals();
          setDecimals(tokenDecimals);
  
          const balance = await tokenContract.balanceOf(userAddress);
          const formattedBalance = formatUnits(balance, tokenDecimals);
          setTokenBalance(formattedBalance);
  
          window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0] || '');
            fetchAccountAndBalance();
          });
  
        } catch (err) {
          setError(err.message);
        }
      };
  
      fetchAccountAndBalance();
  
      return () => {
        if (window.ethereum && window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', fetchAccountAndBalance);
        }
      };
    }, [tokenAddress]);
  
    const transferTokens = async () => {
      try {
        setError('');
        setTxHash('');
  
        if (!isAddress(recipient)) {
          throw new Error('Invalid recipient address');
        }
  
        if (parseFloat(amount) <= 0) {
          throw new Error('Amount must be greater than zero');
        }
  
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const tokenContract = new Contract(tokenAddress, tokenABI, signer);
        const parsedAmount = parseUnits(amount, decimals);  
        const txResponse = await tokenContract.transfer(recipient, parsedAmount);
  
        setTxHash(txResponse.hash);
  
        await txResponse.wait();
  
        const balance = await tokenContract.balanceOf(account);
        const formattedBalance = formatUnits(balance, decimals);
        setTokenBalance(formattedBalance);
  
      } catch (err) {
        setError(err.message);
      }
    };
  
    return (
      <div>
        <h2>Transfer Tokens</h2>
        <p>Your account: {account || 'Not connected'}</p>
        <p>Your token balance: {tokenBalance}</p>
        <input
          type="text"
          placeholder="Recipient address"
          value={recipient}
          onChange={e => setRecipient(e.target.value)}
        />
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <button onClick={transferTokens}>Transfer</button>
        {txHash && (
          <div>
            <p>Transaction Hash: {txHash}</p>
            <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
              View on Etherscan
            </a>
          </div>
        )}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      </div>
    );
  };
  
  export default TransferToken;
  