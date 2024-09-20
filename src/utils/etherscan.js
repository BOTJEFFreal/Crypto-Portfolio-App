import { supportedNetworks } from '../config/supportedNetworks';

export const getEtherscanApiUrl = (chainId) => {
  const network = supportedNetworks[chainId];
  return network ? network.etherscanApiUrl : null;
};