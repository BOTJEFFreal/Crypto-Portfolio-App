import { fetchTokenBalances } from '../utils/api';

export const useTokenBalances = ({ providerRef, connectedAddress, chainId, setTokens, setLoadingTokens, setError }) => {
  const loadTokenBalances = async () => {
    setLoadingTokens(true);
    try {
      await fetchTokenBalances(providerRef.current, connectedAddress, chainId, setTokens);
    } catch (error) {
      setError('Failed to load token balances.');
    } finally {
      setLoadingTokens(false);
    }
  };

  return { loadTokenBalances };
};
