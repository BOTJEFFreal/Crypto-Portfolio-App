export const getEtherscanApiUrl = (chainId) => {
    switch (chainId) {
      case 1: 
        return 'https://api.etherscan.io/api';
      case 11155111: 
        return 'https://api-sepolia.etherscan.io/api';
      default:
        return null;
    }
  };