import React, { useState, useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';
import Spinner from '../Spinner/Spinner';
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import ChartToggle from './ChartToggle';
import TimeframeButtons from './TimeframeButtons';
import ChartRenderer from './ChartRenderer';
import { getLineChartData, getCandleChartData, getCustomChartData } from '../../service/chartDataService';
import getLineChartOptions from '../../config/lineChartOptions';
import getCandleChartOptions from '../../config/candleChartOptions';
import { getCachedData, setCachedData } from '../../service/cacheUtils'
import './TokenChart.css';

const TokenChart = ({ id }) => {
  const [lineData, setLineData] = useState([]);
  const [candleData, setCandleData] = useState([]);
  const [timeframe, setTimeframe] = useState('7');
  const [isCandlestick, setIsCandlestick] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [customRange, setCustomRange] = useState({ from: null, to: null });
  const cache = useRef({}); // Initialize cache

  // Fetch all data with caching for lineData
  const fetchAllData = async (currentTimeframe) => {
    setLoading(true);
    try {
      if (currentTimeframe === 'custom') {
        if (customRange.from && customRange.to) {
          const cacheKey = `line_${id}_custom_${customRange.from}_${customRange.to}`;
          const cachedLineData = getCachedData(cache, cacheKey);

          if (cachedLineData) {
            setLineData(cachedLineData);
            setCandleData([]); // No candle data for custom range
          } else {
            const { lineData } = await getCustomChartData(id, customRange.from, customRange.to);
            setLineData(lineData);
            setCandleData([]);
            setCachedData(cache, cacheKey, lineData);
          }
        }
      } else {
        const cacheKey = `line_${id}_${currentTimeframe}`;
        const cachedLineData = getCachedData(cache, cacheKey);

        let fetchedLineData;
        let fetchedCandleData;

        if (cachedLineData) {
          fetchedLineData = cachedLineData;
        } else {
          fetchedLineData = await getLineChartData(id, currentTimeframe);
          setCachedData(cache, cacheKey, fetchedLineData);
        }

        // For candleData, you can implement similar caching if desired
        fetchedCandleData = await getCandleChartData(id, currentTimeframe);
        // Optionally cache candleData as well
        // const candleCacheKey = `candle_${id}_${currentTimeframe}`;
        // setCachedData(cache, candleCacheKey, fetchedCandleData);

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
  }, [timeframe, customRange]); // Depend on timeframe and customRange

  const isProfit =
    lineData.length > 0 &&
    parseFloat(lineData[lineData.length - 1].price) > parseFloat(lineData[0].price);

  const lineChartOptions = getLineChartOptions(isProfit, lineData);
  const candleChartOptions = getCandleChartOptions();

  const lineChartSeries = [
    {
      name: 'Price',
      data: lineData.map((item) => item.price),
    },
  ];

  const candleChartSeries = [
    {
      data: candleData,
    },
  ];

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