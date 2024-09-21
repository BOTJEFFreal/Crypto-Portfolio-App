import axiosInstance from '../utils/axiosInstance';

const getCoinsMarkets = async (perPage = 250, page = 1) => {
  try {
    const response = await axiosInstance.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc', 
        per_page: perPage,
        page: page,
        sparkline: true,
        price_change_percentage: '24h',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching coins markets:', error);
    return [];
  }
};

export default getCoinsMarkets;
