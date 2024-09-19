// src/services/getchartData.js

import axios from 'axios';
import Bottleneck from 'bottleneck';

// Initialize Bottleneck limiter
const limiter = new Bottleneck({
  minTime: 1200, // 1.2 seconds between requests to stay under 50/min
  maxConcurrent: 1, // Ensure only one request is processed at a time
});

// Create an Axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_COINGECKO_BASE_URL || 'https://api.coingecko.com/api/v3',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Centralized error handling function
const handleAxiosError = (error) => {
  if (error.response) {
    if (error.response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    throw new Error(`CoinGecko API Error: ${error.response.status} ${error.response.statusText}`);
  } else if (error.request) {
    throw new Error('CoinGecko API Error: No response received from server.');
  } else {
    throw new Error(`CoinGecko API Error: ${error.message}`);
  }
};

// Original service functions
const fetchMarketChartData = async (id, days) => {
  try {
    const url = `/coins/${id}/market_chart?vs_currency=usd&days=${days}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error getting market chart data for ${id} over ${days} days:`, error);
    handleAxiosError(error);
  }
};

const fetchOHLCData = async (id, days) => {
  try {
    const url = `/coins/${id}/ohlc?vs_currency=usd&days=${days}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error getting OHLC data for ${id} over ${days} days:`, error);
    handleAxiosError(error);
  }
};

const fetchMarketChartRangeData = async (id, from, to) => {
  try {
    const url = `/coins/${id}/market_chart/range?vs_currency=usd&from=${from}&to=${to}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error(`Error getting market chart range data for ${id} from ${from} to ${to}:`, error);
    handleAxiosError(error);
  }
};

// Wrap the service functions with the limiter
export const getMarketChartData = limiter.wrap(fetchMarketChartData);
export const getOHLCData = limiter.wrap(fetchOHLCData);
export const getMarketChartRangeData = limiter.wrap(fetchMarketChartRangeData);

// Get Line Chart Data
export const getLineChartData = async (id, days) => {
  const data = await getMarketChartData(id, days);
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  const formattedLineData = data.prices
    .map(([timestamp, price]) => ({
      date: formatter.format(new Date(timestamp)),
      price: parseFloat(price.toFixed(2)),
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return formattedLineData;
};

// Get Candlestick Chart Data
export const getCandleChartData = async (id, days) => {
  const data = await getOHLCData(id, days);

  const formattedCandleData = data.map(([timestamp, open, high, low, close]) => ({
    x: new Date(timestamp),
    y: [open, high, low, close],
  }));

  return formattedCandleData;
};

// Get Custom Chart Data
export const getCustomChartData = async (id, fromDate, toDate) => {
  const from = Math.floor(fromDate.getTime() / 1000);
  const to = Math.floor(toDate.getTime() / 1000);

  const data = await getMarketChartRangeData(id, from, to);

  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  const formattedLineData = data.prices
    .map(([timestamp, price]) => ({
      date: formatter.format(new Date(timestamp)),
      price: parseFloat(price.toFixed(2)),
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const formattedCandleData = [];
  return {
    lineData: formattedLineData,
    candleData: formattedCandleData,
  };
};
