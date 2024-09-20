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
  const [error, setError] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [customRange, setCustomRange] = useState({ from: null, to: null });
  const cache = useRef({});

  // Fetch data for line and candle charts
  const fetchAllData = async (currentTimeframe) => {
    setLoading(true);
    try {
      if (currentTimeframe === 'custom') {
        if (customRange.from && customRange.to) {
          const { lineData, candleData } = await getCustomChartData(id, customRange.from, customRange.to, cache);
  
          // Log the API response for debugging
          console.log("Custom Range Data (Line):", lineData);
          console.log("Custom Range Data (Candle):", candleData);
  
          setLineData(lineData);
          setCandleData(candleData);  // Ensure candle data is updated for custom range
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

  // Calculate the price change
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
      <ChartControlsCustom
        isCandlestick={isCandlestick}
        onToggle={setIsCandlestick}
        selectedTimeframe={timeframe}
        onTimeframeChange={handleTimeframeChange}
        onCustomRangeClick={() => setIsDatePickerOpen(true)}          
        currentPrice={Number(currentPrice) || 0}
        priceChange={Number(priceChange) || 0}
      />

<DateRangePicker
  isOpen={isDatePickerOpen}
  onRequestClose={() => setIsDatePickerOpen(false)} // Ensure the picker closes on submission
  onSubmit={handleCustomRangeSubmit} // Ensure the selected dates are passed to this function
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
