import { getMarketChartData, getOHLCData, getMarketChartRangeData } from '../apis/getchartData';

export const getLineChartData = async (id, days, cache) => {
  if (cache.current[`line-${days}`]) {
    return cache.current[`line-${days}`];
  }
  const data = await getMarketChartData(id, days);
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedLineData = data.prices
    .map(([timestamp, price]) => ({
      date: formatter.format(new Date(timestamp)),
      price: parseFloat(price),
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  cache.current[`line-${days}`] = formattedLineData;
  return formattedLineData;
};
// Get Candlestick Chart Data
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

// Get custom chart data using a date range
export const getCustomChartData = async (id, fromDate, toDate, cache) => {
  const from = Math.floor(fromDate.getTime() / 1000);
  const to = Math.floor(toDate.getTime() / 1000);
  const cacheKey = `custom-${from}-${to}`;

  if (cache.current[cacheKey]) {
    return cache.current[cacheKey];
  }

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

  cache.current[cacheKey] = {
    lineData: formattedLineData,
    candleData: [], 
  };

  return cache.current[cacheKey];
};
