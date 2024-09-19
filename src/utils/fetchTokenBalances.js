import { ethers } from 'ethers';

const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
];

const networks = {
  1: { // Ethereum Mainnet
    name: 'Mainnet',
    tokens: [
      {
        symbol: 'USDT',
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        decimals: 6,
      },
      {
        symbol: 'USDC',
        address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        decimals: 6,
      },
      {
        symbol: 'DAI',
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        decimals: 18,
      },
      {
        symbol: 'LINK',
        address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
        decimals: 18,
      },
      {
        symbol: 'UNI',
        address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
        decimals: 18,
      },
    ],
  },
  11155111: { 
    name: 'Sepolia',
    tokens: [
      {
        symbol: 'DAI',
        address: '0xad6d458402f60fd3bd25163575031acdce07538d',
        decimals: 18,
      },
      {
        symbol: 'USDC',
        address: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
        decimals: 6,
      },
      {
        symbol: 'LINK',
        address: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
        decimals: 18,
      },
    ],
  },
};

const fetchTokenBalances = async (provider, address, currentChainId) => {
  const tokenBalances = [];
  const currentNetwork = networks[currentChainId];
  
  if (!currentNetwork) {
    throw new Error('Unsupported network.');
  }

  const signer = await provider.getSigner();

  const balancePromises = currentNetwork.tokens.map(async (token) => {
    try {
      const contract = new ethers.Contract(token.address, ERC20_ABI, signer);
      const balanceRaw = await contract.balanceOf(address);
      const formattedBalance = Number(ethers.formatUnits(balanceRaw, token.decimals)).toFixed(4);
      
      if (formattedBalance > 0) {
        tokenBalances.push({
          symbol: token.symbol,
          balance: formattedBalance,
        });
      }
    } catch (error) {
      console.error(`Error fetching balance for ${token.symbol}:`, error);
    }
  });

  await Promise.all(balancePromises);
  return tokenBalances;
};

export default fetchTokenBalances;
