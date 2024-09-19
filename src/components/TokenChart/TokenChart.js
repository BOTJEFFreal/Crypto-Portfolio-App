// src/components/TokenChart/TokenChart.js

import React, { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import Spinner from '../Spinner/Spinner';
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import ChartToggle from './ChartToggle';
import TimeframeButtons from './TimeframeButtons';
import ChartRenderer from './ChartRenderer';
import { getLineChartData, getCandleChartData, getCustomChartData } from '../../service/getchartData';
import getLineChartOptions from '../../config/lineChartOptions';
import './TokenChart.css';

const TokenChart = ({ id }) => {
  const [lineData, setLineData] = useState([]);
  const [candleData, setCandleData] = useState([]);
  const [timeframe, setTimeframe] = useState('7'); // Default to 7 days
  const [isCandlestick, setIsCandlestick] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [customRange, setCustomRange] = useState({ from: null, to: null });

  // Fetch all data without caching
  const fetchAllData = async (currentTimeframe) => {
    console.log(`Fetching data for ID: ${id}, Timeframe: ${currentTimeframe}`);
    setLoading(true);
    setError(null); // Reset error state before fetching
    try {
      if (currentTimeframe === 'custom') {
        if (customRange.from && customRange.to) {
          console.log(`Fetching custom range: from ${customRange.from}, to ${customRange.to}`);
          const data = await getCustomChartData(id, customRange.from, customRange.to);
          console.log('Custom data fetched:', data);
          setLineData(data.lineData);
          setCandleData(data.candleData);
        } else {
          throw new Error('Custom range dates are not set.');
        }
      } else {
        console.log(`Fetching timeframe data: ${currentTimeframe} days`);
        const fetchedLineData = await getLineChartData(id, currentTimeframe);
        console.log('Line data fetched:', fetchedLineData);
        const fetchedCandleData = await getCandleChartData(id, currentTimeframe);
        console.log('Candle data fetched:', fetchedCandleData);
        setLineData(fetchedLineData);
        setCandleData(fetchedCandleData);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching chart data:', err);
      setError(err.message || 'Failed to load historical data.');
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
    console.log(`Custom range submitted: from ${from}, to ${to}`);
    if (from > to) {
      setError('Invalid date range: "From" date must be earlier than "To" date.');
      return;
    }
    setCustomRange({ from, to });
    setTimeframe('custom');
    setIsDatePickerOpen(false);
  };

  useEffect(() => {
    if (id) { // Ensure id is available
      fetchAllData(timeframe);
    } else {
      setError('Invalid token ID.');
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframe, customRange, id]); // Depend on timeframe, customRange, and id

  const isProfit =
    lineData.length > 0 &&
    parseFloat(lineData[lineData.length - 1].price) > parseFloat(lineData[0].price);

  const lineChartOptions = getLineChartOptions(isProfit);
  const lineChartSeries = lineData; // Array of { date, price }
  const candleChartSeries = candleData; // Array of { x, y: [open, high, low, close] }

  return (
    <div className="token-chart">
      <ChartToggle isCandlestick={isCandlestick} onToggle={setIsCandlestick} />
      <TimeframeButtons
        timeframe={timeframe}
        onChangeTimeframe={handleTimeframeChange}
        onOpenDatePicker={() => setIsDatePickerOpen(true)}
      />
      <DateRangePicker
        isOpen={isDatePickerOpen}
        onRequestClose={() => setIsDatePickerOpen(false)}
        onSubmit={handleCustomRangeSubmit}
      />
      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="error-container">
          <p className="error">Failed to load historical data: {error}</p>
          {/* Optionally, add a retry button */}
          <button onClick={() => fetchAllData(timeframe)} className="retry-button">
            Retry
          </button>
        </div>
      ) : (
        <ChartRenderer
          isCandlestick={isCandlestick}
          lineChartOptions={lineChartOptions}
          lineChartSeries={lineChartSeries}
          candleChartOptions={null} // Not used in this example
          candleChartSeries={candleChartSeries} // Not used in this example
        />
      )}
    </div>
  );
};

export default TokenChart;
