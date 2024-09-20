import axiosInstance from '../utils/axiosInstance';

const getRecentlyAddedCoins = async () => {
  const response = await axiosInstance.get('/coins/markets', {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 20,
      page: 1,
      sparkline: true,
    },
  });
  return response.data;
};

export default getRecentlyAddedCoins;