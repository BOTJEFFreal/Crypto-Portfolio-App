import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaChartLine, FaCalendarAlt } from 'react-icons/fa'; 
import { GiCandlestickPhone } from 'react-icons/gi'; 
import DateRangePicker from '../DateRangePicker/DateRangePicker';
import './ChartControls.css';  

const ChartControlsCustom = ({ 
  isCandlestick, 
  onToggle, 
  selectedTimeframe, 
  onTimeframeChange, 
  onCustomRangeClick, 
  currentPrice, 
  priceChange 
}) => {
  const [showDateRangePicker, setShowDateRangePicker] = useState(false); // New state to show/hide DateRangePicker

  const timeframes = [
    { label: '1D', value: '1' },
    { label: '7D', value: '7' },
    { label: '30D', value: '30' },
  ];

  const formattedPriceChange = priceChange.toFixed(2);
  const priceChangeColor = priceChange >= 0 ? 'green' : 'red';

  const handleCustomRangeClick = () => {
    setShowDateRangePicker(!showDateRangePicker); // Toggle the DateRangePicker visibility
    onCustomRangeClick(); // Call the custom range click handler
  };

  const handleDateRangeSelected = (startDate, endDate) => {
    // You can pass the selected date range to parent component or handle it here
    setShowDateRangePicker(false); // Close DateRangePicker after selection
  };

  return (
    <div className="chart-controls-custom">
      <div className="price-info-custom">
        <h2 className="price-value-chart-custom">${currentPrice.toFixed(2)}</h2>
        <p style={{ color: priceChangeColor }}>
          {priceChange >= 0 ? '+' : ''}{formattedPriceChange}% 
        </p>
      </div>

      <div className="timeframe-buttons-custom">
        {timeframes.map((tf) => (
          <button
            key={tf.value}
            onClick={() => onTimeframeChange(tf.value)}
            className={selectedTimeframe === tf.value ? 'active-custom' : ''}
          >
            {tf.label}
          </button>
        ))}
        <button
          onClick={handleCustomRangeClick}
          className={selectedTimeframe === 'custom' ? 'active-custom' : ''}
        >
          <FaCalendarAlt /> Custom
        </button>
      </div>

      <div className="chart-toggle-custom">
        <button onClick={() => onToggle(false)} className={!isCandlestick ? 'active-custom' : ''}>
          <FaChartLine />
          <span className="tooltip-custom">Line Chart</span>
        </button>
        <button onClick={() => onToggle(true)} className={isCandlestick ? 'active-custom' : ''}>
          <GiCandlestickPhone />
          <span className="tooltip-custom">Candlestick Chart</span>
        </button>
      </div>

      {/* Conditionally render DateRangePicker */}
      {showDateRangePicker && (
        <DateRangePicker
          onSelect={handleDateRangeSelected} // Handle the date range selection
          onCancel={() => setShowDateRangePicker(false)} // Hide DateRangePicker on cancel
        />
      )}
    </div>
  );
};

ChartControlsCustom.propTypes = {
  isCandlestick: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  selectedTimeframe: PropTypes.string.isRequired,
  onTimeframeChange: PropTypes.func.isRequired,
  onCustomRangeClick: PropTypes.func.isRequired,
  currentPrice: PropTypes.number.isRequired,
  priceChange: PropTypes.number.isRequired,
};

export default ChartControlsCustom;
