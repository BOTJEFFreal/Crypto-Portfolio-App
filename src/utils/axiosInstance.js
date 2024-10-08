import axios from 'axios';
import { getCachedData, setCachedData } from './cache';

const axiosInstance = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
});

axiosInstance.interceptors.request.use((config) => {
  const cachedData = getCachedData(config.url);
  if (cachedData) {
    return Promise.reject({ config, cachedData });
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    setCachedData(response.config.url, response.data);
    return response;
  },
  (error) => {
    if (error.cachedData) {
      return Promise.resolve({ data: error.cachedData });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
