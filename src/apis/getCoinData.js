import axiosInstance from '../utils/axiosInstance';
const getCoinData = async (coinId) => {
  try {
    const response = await axiosInstance.get(`/coins/${coinId}`, {
      params: {
        localization: false,
        tickers: false,       
        market_data: true,   
        community_data: false, 
        developer_data: false, 
        sparkline: false,     
      },
    });

    const coinData = {
      id: response.data.id,
      name: response.data.name,
      symbol: response.data.symbol,
      image: response.data.image.large,
      current_price: response.data.market_data.current_price.usd,
      price_change_percentage_24h: response.data.market_data.price_change_percentage_24h,
      market_cap: response.data.market_data.market_cap.usd,
      total_volume: response.data.market_data.total_volume.usd,
      sparkline_in_7d: { price: response.data.market_data.sparkline_7d.price },
      genesis_date: response.data.genesis_date,
    };

    return coinData;
  } catch (error) {
    console.error(`Error fetching data for coin ID "${coinId}":`, error);
    return null;
  }
};

export default getCoinData;
