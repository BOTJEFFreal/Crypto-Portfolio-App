

import { getMarketChartData, getOHLCData, getMarketChartRangeData } from '../apis/getchartData';

export const getLineChartData = async (id, days, cache) => {
  if (cache.current[`line-${days}`]) {
    return cache.current[`line-${days}`];
  }
  const data = await getMarketChartData(id, days);
  
  const formattedLineData = data.prices
    .map(([timestamp, price]) => ({
      x: timestamp, // Use raw timestamp
      y: parseFloat(price),
    }))
    .sort((a, b) => a.x - b.x); // Sort by timestamp

  cache.current[`line-${days}`] = formattedLineData;
  return formattedLineData;
};

export const getCandleChartData = async (id, days, cache) => {
  if (cache.current[`candle-${days}`]) {
    return cache.current[`candle-${days}`];
  }
  const data = await getOHLCData(id, days);

  const formattedCandleData = data.map(([timestamp, open, high, low, close]) => ({
    x: new Date(timestamp),
    y: [open, high, low, close],
  }));

  cache.current[`candle-${days}`] = formattedCandleData;
  return formattedCandleData;
};


const toUnixTimestamp = (date) => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return Math.floor(d.getTime() / 1000);
};


const aggregateOHLCData = (prices) => {
  const ohlcData = [];
  let currentDay = null;
  let open = null, high = null, low = null, close = null;

  prices.forEach(([timestamp, price]) => {
    const date = new Date(timestamp);
    const day = date.toISOString().split('T')[0]; 

    if (currentDay === null || currentDay !== day) {
      
      if (currentDay !== null) {
        ohlcData.push([new Date(currentDay).getTime(), open, high, low, close]);
      }
      
      currentDay = day;
      open = price;
      high = price;
      low = price;
      close = price;
    } else {
      
      high = Math.max(high, price);
      low = Math.min(low, price);
      close = price;
    }
  });

  
  if (currentDay !== null) {
    ohlcData.push([new Date(currentDay).getTime(), open, high, low, close]);
  }

  return ohlcData;
};


export const getCustomChartData = async (id, fromDate, toDate, cache) => {
  const from = toUnixTimestamp(fromDate);
  const to = toUnixTimestamp(toDate);
  const cacheKey = `custom-${from}-${to}`;

  if (cache.current[cacheKey]) {
    return cache.current[cacheKey];
  }

  try {
    const marketData = await getMarketChartRangeData(id, from, to);

    const formattedLineData = marketData.prices
      .map(([timestamp, price]) => ({
        x: timestamp, // Use raw timestamp
        y: parseFloat(price),
      }))
      .sort((a, b) => a.x - b.x);

    const ohlcData = aggregateOHLCData(marketData.prices);

    cache.current[cacheKey] = {
      lineData: formattedLineData,
      candleData: ohlcData, 
    };

    return cache.current[cacheKey];
  } catch (error) {
    console.error('Failed to fetch custom chart data:', error.message);
    throw error;
  }
};
