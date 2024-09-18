// src/services/getchartData.js

import axios from 'axios';

// Create an Axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_COINGECKO_BASE_URL || 'https://api.coingecko.com/api/v3',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getMarketChartData = async (id, days) => {
  try {
    const url = `/coins/${id}/market_chart?vs_currency=usd&days=${days}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error getting market chart data for ${id} over ${days} days:`, error);
    handleAxiosError(error);
  }
};

export const getOHLCData = async (id, days) => {
  try {
    const url = `/coins/${id}/ohlc?vs_currency=usd&days=${days}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error getting OHLC data for ${id} over ${days} days:`, error);
    handleAxiosError(error);
  }
};

export const getMarketChartRangeData = async (id, from, to) => {
  try {
    const url = `/coins/${id}/market_chart/range?vs_currency=usd&from=${from}&to=${to}`;
    const response = await axiosInstance.get(url);
    return response.data;

  } catch (error) {
    console.error(`Error getting market chart range data for ${id} from ${from} to ${to}:`, error);
    handleAxiosError(error);
  }
};

// Centralized error handling function
const handleAxiosError = (error) => {
  if (error.response) {
    throw new Error(`CoinGecko API Error: ${error.response.status} ${error.response.statusText}`);
  } else if (error.request) {
    throw new Error('CoinGecko API Error: No response received from server.');
  } else {
    throw new Error(`CoinGecko API Error: ${error.message}`);
  }
};
