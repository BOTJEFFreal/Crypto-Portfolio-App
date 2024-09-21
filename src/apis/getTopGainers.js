// apis/getTopGainers.js
import axiosInstance from '../utils/axiosInstance';

const getTopGainers = async () => {
  try {
    const response = await axiosInstance.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'percent_change_24h_desc',
        per_page: 20,
        page: 1,
        sparkline: true,
      },
    });

    const coins = response.data.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      image: coin.image,
      rank: coin.market_cap_rank,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      market_cap: coin.market_cap,
      total_volume: coin.total_volume,
      sparkline_in_7d: { price: coin.sparkline_in_7d?.price || [] },
    }));

    return coins;
  } catch (error) {
    console.error('Error fetching top gainers:', error);
    return [];
  }
};

export default getTopGainers;
