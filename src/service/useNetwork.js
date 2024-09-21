import { ethers } from 'ethers';
import { fetchEthBalance, fetchEthPrice, fetchTokenBalances } from '../utils/api';
import { supportedNetworks } from '../config/supportedNetworks';

export const useNetwork = ({ providerRef, connectedAddress, setNetwork, setChainId, setTokens, setEthBalance, setEthPrice, setError }) => {
  const handleChainChanged = async (_chainIdHex) => {
    const decimalChainId = parseInt(_chainIdHex, 16);
    setChainId(decimalChainId);

    const currentNetwork = supportedNetworks[decimalChainId];
    if (currentNetwork) {
      setNetwork(currentNetwork.name);
      setTokens([]); 
      if (providerRef.current && connectedAddress) {
        await fetchEthBalance(providerRef.current, connectedAddress, setEthBalance);
        await fetchEthPrice(setEthPrice);
        await fetchTokenBalances(providerRef.current, connectedAddress, decimalChainId, setTokens);
      }
    } else {
      setNetwork('Unsupported Network');
      setTokens([]);
      setError('Unsupported network. Please switch to a supported network.');
    }
  };

  const switchToMainnet = async () => {
    try {
      await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x1' }] });
      handleChainChanged('0x1');
    } catch (error) {
      setError('Failed to switch to Ethereum Mainnet.');
    }
  };

  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0xaa36a7' }] });
      handleChainChanged('0xaa36a7');
    } catch (error) {
      setError('Failed to switch to Sepolia Test Network.');
    }
  };

  return { handleChainChanged, switchToMainnet, switchToSepolia };
};
