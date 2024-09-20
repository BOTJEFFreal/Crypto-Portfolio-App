// src/utils/axiosInstance.js

import axios from 'axios';
import { getCachedData, setCachedData } from './cache';

const axiosInstance = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
});

// Request interceptor to check cache
axiosInstance.interceptors.request.use((config) => {
  const cachedData = getCachedData(config.url);
  if (cachedData) {
    return Promise.reject({ config, cachedData });
  }
  return config;
});

// Response interceptor to cache data
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
