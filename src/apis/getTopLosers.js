import axiosInstance from '../utils/axiosInstance';

const getTopLosers = async () => {
  const response = await axiosInstance.get('/coins/markets', {
    params: {
      vs_currency: 'usd',
      order: 'percent_change_24h_asc',
      per_page: 20,
      page: 1,
      sparkline: true,
    },
  });
  return response.data;
};

export default getTopLosers;