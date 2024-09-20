import { ethers } from 'ethers';
import { supportedNetworks } from '../config/supportedNetworks';
import ERC20_ABI from '../config/ERC20_ABI';

export const fetchEthBalance = async (provider, address, setEthBalance) => {
  try {
    const balance = await provider.getBalance(address);
    const eth = ethers.formatEther(balance);
    setEthBalance(Number(eth));
  } catch (error) {
    console.error('Error fetching ETH balance:', error);
    setEthBalance(0);
  }
};

export const fetchEthPrice = async (setEthPrice) => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await response.json();
    setEthPrice(data.ethereum?.usd || 0);
  } catch (error) {
    console.error('Error fetching ETH price:', error);
    setEthPrice(0);
  }
};

export const fetchTokenBalances = async (provider, address, chainId, setTokens) => {
  try {
    const tokenBalances = [];
    const signer = await provider.getSigner();
    const currentNetwork = supportedNetworks[chainId];

    if (!currentNetwork) {
      console.error(`Unsupported network: ${chainId}`);
      return;
    }

    for (const token of currentNetwork.tokens) {
      try {
        const contract = new ethers.Contract(token.address, ERC20_ABI, signer);
        const balanceRaw = await contract.balanceOf(address);
        const formattedBalance = ethers.formatUnits(balanceRaw, token.decimals);

        if (Number(formattedBalance) > 0) {
          tokenBalances.push({
            id: token.id,
            name: token.name,
            symbol: token.symbol,
            quantity: Number(formattedBalance),
          });
        }
      } catch (tokenError) {
        console.error(`Error fetching balance for ${token.symbol}:`, tokenError);
      }
    }

    setTokens(tokenBalances);
  } catch (error) {
    console.error('Error fetching token balances:', error);
    setTokens([]);
  }
};
