export const fetchTransactionHistory = async (walletAddress, chainId, setTransactions, setError, setLoading) => {
    const apiKey = process.env.REACT_APP_ETHERSCAN_API_KEY;
    let etherscanApiUrl = '';
  
    if (chainId === 1) {
      etherscanApiUrl = `https://api.etherscan.io/api`;
    } else if (chainId === 11155111) {
      etherscanApiUrl = `https://api-sepolia.etherscan.io/api`;
    } else {
      setError('Unsupported network');
      return;
    }
  
    const url = `${etherscanApiUrl}?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`;
  
    setLoading(true);
    setError('');
  
    try {
      const response = await fetch(url);
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
  