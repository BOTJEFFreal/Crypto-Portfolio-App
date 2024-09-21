import axiosInstance from '../utils/axiosInstance';

const getRecentlyAddedCoins = async () => {
  try {
    const response = await axiosInstance.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc', 
        per_page: 250, 
        page: 1,
        sparkline: true,
        price_change_percentage: '24h',
      },
    });

    const coinsWithGenesisDate = response.data.filter((coin) => coin.genesis_date);

    const recentlyAdded = coinsWithGenesisDate
      .sort((a, b) => new Date(b.genesis_date) - new Date(a.genesis_date))
      .slice(0, 20); 

    return recentlyAdded;
  } catch (error) {
    console.error('Error fetching recently added coins:', error);
    return [];
  }
};

export default getRecentlyAddedCoins;
