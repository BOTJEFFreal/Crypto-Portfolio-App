// src/components/TokenChart/TokenChart.jsx

import React, { useState, useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';
import Spinner from '../Spinner/Spinner';
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import ChartControls from './ChartControls'; 
import ChartRenderer from './ChartRenderer';
import { getLineChartData, getCandleChartData, getCustomChartData } from '../../service/chartDataService';
import getLineChartOptions from '../../config/lineChartOptions';
import getCandleChartOptions from '../../config/candleChartOptions';
import './TokenChart.css';

const TokenChart = ({ id, currentPrice }) => {
  const [lineData, setLineData] = useState([]);
  const [candleData, setCandleData] = useState([]);
  const [timeframe, setTimeframe] = useState('7');
  const [isCandlestick, setIsCandlestick] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [customRange, setCustomRange] = useState({ from: null, to: null });
  const cache = useRef({});

  const fetchAllData = async (currentTimeframe) => {
    setLoading(true);
    try {
      if (currentTimeframe === 'custom') {
        if (customRange.from && customRange.to) {
          const { lineData, candleData } = await getCustomChartData(id, customRange.from, customRange.to, cache);
          setLineData(lineData);
          setCandleData(candleData);
        }
      } else {
        const [fetchedLineData, fetchedCandleData] = await Promise.all([
          getLineChartData(id, currentTimeframe, cache),
          getCandleChartData(id, currentTimeframe, cache),
        ]);
        setLineData(fetchedLineData);
        setCandleData(fetchedCandleData);
      }
      setError(false);
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSetTimeframe = debounce((tf) => {
    setTimeframe(tf);
  }, 300);

  const handleTimeframeChange = (tf) => {
    debouncedSetTimeframe(tf);
  };

  const handleCustomRangeSubmit = (from, to) => {
    setCustomRange({ from, to });
    setTimeframe('custom');
    setIsDatePickerOpen(false);
  };

  useEffect(() => {
    fetchAllData(timeframe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframe, customRange]);

  // Safely calculate priceChange
  const calculatePriceChange = () => {
    if (lineData.length < 2) return 0; // Not enough data to calculate change
    const firstPrice = parseFloat(lineData[0].price);
    const lastPrice = parseFloat(lineData[lineData.length - 1].price);

    if (isNaN(firstPrice) || isNaN(lastPrice) || firstPrice === 0) {
      return 0;
    }

    return ((lastPrice - firstPrice) / firstPrice) * 100;
  };

  const priceChange = calculatePriceChange();
  const isProfit = priceChange >= 0;

  const lineChartOptions = getLineChartOptions(isProfit, lineData, timeframe);
  const candleChartOptions = getCandleChartOptions(timeframe);

  const lineChartSeries = [
    {
      name: 'Price',
      data: lineData.map((item) => Number(item.price) || 0),
    },
  ];

  const candleChartSeries = [
    {
      data: candleData.map((item) => ({
        x: item.x || new Date(),
        y: item.y.map((value) => (isNaN(value) ? 0 : Number(value) || 0)),
      })),
    },
  ];

  return (
    <div className="token-chart">
      <ChartControls
        isCandlestick={isCandlestick}
        onToggle={setIsCandlestick}
        selectedTimeframe={timeframe}
        onTimeframeChange={handleTimeframeChange}
        currentPrice={Number(currentPrice) || 0}
        priceChange={Number(priceChange) || 0} 
      />

      <DateRangePicker
        isOpen={isDatePickerOpen}
        onRequestClose={() => setIsDatePickerOpen(false)}
        onSubmit={handleCustomRangeSubmit}
      />

      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="error">Failed to load historical data.</p>
      ) : (
        <ChartRenderer
          isCandlestick={isCandlestick}
          lineChartOptions={lineChartOptions}
          lineChartSeries={lineChartSeries}
          candleChartOptions={candleChartOptions}
          candleChartSeries={candleChartSeries}
        />
      )}
    </div>
  );
};

export default TokenChart;
