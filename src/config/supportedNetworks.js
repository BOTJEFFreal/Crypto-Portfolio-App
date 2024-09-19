// src/config/supportedNetworks.js

export const supportedNetworks = {
  1: { // Ethereum Mainnet
    name: 'Mainnet',
    tokens: [
      {
        id: 'dai', // CoinGecko ID
        name: 'Dai Stablecoin',
        symbol: 'dai',
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI contract address
        decimals: 18,
        image: 'https://assets.coingecko.com/coins/images/9956/large/4943.png', // DAI image URL
      },
      {
        id: 'uniswap', // CoinGecko ID
        name: 'Uniswap',
        symbol: 'uni',
        address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // Uniswap contract address
        decimals: 18,
        image: 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png', // Uniswap image URL
      },
      // Add more ERC20 tokens as needed
    ],
  },
  11155111: { // Sepolia Testnet
    name: 'Sepolia',
    tokens: [
      // Define testnet tokens here with CoinGecko IDs or mock data
      {
        id: 'ethereum', // CoinGecko ID for ETH
        name: 'Sepolia Ether',
        symbol: 'sepoliaeth',
        address: '0x0000000000000000000000000000000000000000', // Replace with actual testnet token address if available
        decimals: 18,
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', // Using Ethereum image as placeholder
      },
      // Add more testnet tokens as needed
    ],
  },
  // Add more networks as needed
};
