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
          const { lineData } = await getCustomChartData(id, customRange.from, customRange.to, cache);
          setLineData(lineData);
          setCandleData([]);
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
  }, [timeframe, customRange]);

  const priceChange = lineData.length > 0
  ? ((lineData[lineData.length - 1].price - lineData[0].price) / lineData[0].price) * 100
  : 0;

const isProfit = priceChange >= 0;

const lineChartOptions = getLineChartOptions(isProfit, lineData, timeframe);
const candleChartOptions = getCandleChartOptions(timeframe);

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
    <ChartControls
      isCandlestick={isCandlestick}
      onToggle={setIsCandlestick}
      selectedTimeframe={timeframe}
      onTimeframeChange={handleTimeframeChange}
      currentPrice={currentPrice}
      priceChange={priceChange} 
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