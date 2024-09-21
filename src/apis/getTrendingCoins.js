import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';

const API_URL = 'https://api.coingecko.com/api/v3';

const getTrendingCoins = async () => {
  try {
    const trendingResponse = await axiosInstance.get('/search/trending');
    const trendingCoins = trendingResponse.data.coins.map((coin) => ({
      id: coin.item.id,
      name: coin.item.name,
      symbol: coin.item.symbol,
      image: coin.item.small,
      sparkline_in_7d: { price: [] },
    }));

    const coinIds = trendingCoins.map((coin) => coin.id).join(',');

    const marketResponse = await axios.get(`${API_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        ids: coinIds,
        order: 'market_cap_desc',
        per_page: 250, 
        page: 1,
        sparkline: true,
        price_change_percentage: '24h',
      },
    });

    const detailedTrendingCoins = trendingCoins.map((coin) => {
      const detailedData = marketResponse.data.find((item) => item.id === coin.id);
      return {
        ...coin,
        rank: detailedData ? detailedData.market_cap_rank : 'N/A',
        current_price: detailedData ? detailedData.current_price : 'N/A',
        price_change_percentage_24h: detailedData ? detailedData.price_change_percentage_24h : 'N/A',
        market_cap: detailedData ? detailedData.market_cap : 'N/A',
        total_volume: detailedData ? detailedData.total_volume : 'N/A',
        sparkline_in_7d: detailedData ? detailedData.sparkline_in_7d : { price: [] },
      };
    });

    return detailedTrendingCoins;
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    return [];
  }
};

export default getTrendingCoins;
