import { ethers } from 'ethers';
import { fetchEthBalance, fetchEthPrice, fetchTokenBalances } from '../utils/api';

export const useWallet = ({ setConnectedAddress, providerRef, setEthBalance, setEthPrice, setTokens, chainId, setError }) => {
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts[0];
        setConnectedAddress(address);

        const provider = new ethers.BrowserProvider(window.ethereum);
        providerRef.current = provider;

        const networkData = await provider.getNetwork();
        await fetchEthBalance(provider, address, setEthBalance);
        await fetchEthPrice(setEthPrice);
        await fetchTokenBalances(provider, address, chainId, setTokens);

        setError('');
      } catch (err) {
        setError('Failed to connect wallet. Please try again.');
      }
    } else {
      alert('No Ethereum wallet detected. Please install MetaMask or another wallet extension.');
    }
  };

  const disconnectWallet = () => {
    setConnectedAddress('');
    setEthBalance('');
    setEthPrice(0);
    setTokens([]);
    setError('');
  };

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setConnectedAddress(accounts[0]);
      if (providerRef.current) {
        await fetchEthBalance(providerRef.current, accounts[0], setEthBalance);
        await fetchEthPrice(setEthPrice);
        await fetchTokenBalances(providerRef.current, accounts[0], chainId, setTokens);
      }
    }
  };

  return { connectWallet, disconnectWallet, handleAccountsChanged };
};
