import axios from 'axios';

export const getTokenData = async (id) => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
    const data = response.data;

    return {
      id: data.id,
      name: data.name,
      symbol: data.symbol,
      image: data.image.large,
      current_price: data.market_data.current_price.usd,
      market_cap: data.market_data.market_cap.usd,
      fully_diluted_valuation: data.market_data.fully_diluted_valuation?.usd || null,
      total_volume: data.market_data.total_volume.usd,
      circulating_supply: data.market_data.circulating_supply,
      total_supply: data.market_data.total_supply,
      max_supply: data.market_data.max_supply,
    };
  } catch (err) {
    console.error('Error fetching token data:', err);
    throw err; 
  }
};
