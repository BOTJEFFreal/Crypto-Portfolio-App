// src/components/TokenChart.jsx

import React, { useState, useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';
import Spinner from '../Spinner/Spinner';
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import ChartControlsCustom from './ChartControls'; 
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
  const [error, setError] = useState(null); // Updated to store error messages
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [customRange, setCustomRange] = useState({ from: null, to: null });
  const cache = useRef({});

  
  const fetchAllData = async (currentTimeframe) => {
    setLoading(true);
    setError(null); // Reset error before fetching
    try {
      if (currentTimeframe === 'custom') {
        if (customRange.from && customRange.to) {
          console.log(`Fetching custom range data from ${customRange.from} to ${customRange.to}`);
  
          const { lineData: fetchedLineData, candleData: fetchedCandleData } = await getCustomChartData(id, customRange.from, customRange.to, cache);
  
          console.log("Custom Range Data (Line):", fetchedLineData);
          console.log("Custom Range Data (Candle):", fetchedCandleData);
  
          setLineData(fetchedLineData);
          setCandleData(fetchedCandleData); // Correct: Set fetchedCandleData
        } else {
          throw new Error('Custom range dates are not set.');
        }
      } else {
        console.log(`Fetching data for timeframe: ${currentTimeframe} days`);
  
        const [fetchedLineData, fetchedCandleData] = await Promise.all([
          getLineChartData(id, currentTimeframe, cache),
          getCandleChartData(id, currentTimeframe, cache),
        ]);
  
        console.log("Fetched Line Data:", fetchedLineData);
        console.log("Fetched Candle Data:", fetchedCandleData);
  
        setLineData(fetchedLineData);
        setCandleData(fetchedCandleData);
      }
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error fetching chart data:', err);
  
      let errorMessage = 'Failed to load historical data.'; // Default message
  
      if (err.response) {
        // Server responded with a status other than 2xx
        errorMessage = `Error ${err.response.status}: ${err.response.data.message || err.response.statusText}`;
        console.error('API Response Error:', err.response.status, err.response.data);
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'No response received from the server. Please check your network connection.';
        console.error('No response received:', err.request);
      } else {
        // Something else caused the error
        errorMessage = `Error: ${err.message}`;
        console.error('Error Message:', err.message);
      }
  
      setError(errorMessage);
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
    if (!(from instanceof Date) || !(to instanceof Date)) {
      console.error('Invalid dates selected for custom range.');
      alert('Please select valid start and end dates.');
      return;
    }

    if (from > to) {
      console.error('Start date is after end date.');
      alert('Start date must be before end date.');
      return;
    }

    setCustomRange({ from, to });
    setTimeframe('custom');
    setIsDatePickerOpen(false);
  };

  useEffect(() => {
    fetchAllData(timeframe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframe, customRange]);

  
  const calculatePriceChange = () => {
    if (lineData.length < 2) return 0; 
    const firstPrice = parseFloat(lineData[0].y);
    const lastPrice = parseFloat(lineData[lineData.length - 1].y);

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
      data: lineData, // Pass { x, y } objects directly
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
      {/* Chart Controls */}
      <ChartControlsCustom
        isCandlestick={isCandlestick}
        onToggle={setIsCandlestick}
        selectedTimeframe={timeframe}
        onTimeframeChange={handleTimeframeChange}
        onCustomRangeClick={() => setIsDatePickerOpen(true)} 
        currentPrice={Number(currentPrice) || 0}
        priceChange={Number(priceChange) || 0}
      />

      {/* Date Range Picker */}
      <DateRangePicker
        isOpen={isDatePickerOpen}
        onRequestClose={() => setIsDatePickerOpen(false)} 
        onSubmit={handleCustomRangeSubmit} 
      />

      {/* Chart Rendering */}
      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          {/* Optional: Add a retry button */}
          <button className="retry-button" onClick={() => fetchAllData(timeframe)}>
            Retry
          </button>
        </div>
      ) : (
        <ChartRenderer
          isCandlestick={isCandlestick && timeframe !== 'custom'} 
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
