export const supportedNetworks = {
  1: {
    name: 'Mainnet',
    tokens: [
      // List of mainnet token contract addresses
      { address: '0x123...', symbol: 'DAI', decimals: 18, id: 'dai' },
      // Add more tokens here
    ],
  },
  11155111: {
    name: 'Sepolia Testnet',
    tokens: [
      // List of Sepolia token contract addresses
      { address: '0x456...', symbol: 'TEST', decimals: 18, id: 'test-token' },
      // Add more tokens here
    ],
  },
};
