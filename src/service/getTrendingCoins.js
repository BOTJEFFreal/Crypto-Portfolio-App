import axiosInstance from '../utils/axiosInstance';

const getTrendingCoins = async () => {
  const response = await axiosInstance.get('/search/trending');
  const coins = response.data.coins.map((coin) => ({
    id: coin.item.id,
    name: coin.item.name,
    symbol: coin.item.symbol,
    image: coin.item.small,
    sparkline_in_7d: { price: [] },
  }));
  return coins;
};

export default getTrendingCoins;