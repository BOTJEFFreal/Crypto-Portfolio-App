import axiosInstance from '../utils/axiosInstance';

const getTopGainers = async () => {
  const response = await axiosInstance.get('/coins/markets', {
    params: {
      vs_currency: 'usd',
      order: 'percent_change_24h_desc',
      per_page: 20,
      page: 1,
      sparkline: true,
    },
  });
  return response.data;
};

export default getTopGainers;
