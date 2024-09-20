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
  const [showDateRangePicker, setShowDateRangePicker] = useState(false); // Toggle DateRangePicker modal

  const timeframes = [
    { label: '1D', value: '1' },
    { label: '7D', value: '7' },
    { label: '30D', value: '30' },
  ];

  const formattedPriceChange = priceChange.toFixed(2);
  const priceChangeColor = priceChange >= 0 ? 'green' : 'red';

  const handleCustomRangeClick = () => {
    setShowDateRangePicker(true); // Show the DateRangePicker modal
  };

  const handleDateRangeSelected = (startDate, endDate) => {
    // Pass the selected date range to the parent component using the callback
    if (onCustomRangeClick && typeof onCustomRangeClick === 'function') {
      onCustomRangeClick(startDate, endDate); // Call the parent function with dates
    } else {
      console.error('onCustomRangeClick is not a function');
    }
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
        {/* <button
          onClick={handleCustomRangeClick}
          className={selectedTimeframe === 'custom' ? 'active-custom' : ''}
        >
          <FaCalendarAlt /> Custom
        </button> */}
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
          isOpen={showDateRangePicker}
          onRequestClose={() => setShowDateRangePicker(false)} // Hide DateRangePicker when closed
          onSubmit={handleDateRangeSelected} // Handle date range selection
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
  onCustomRangeClick: PropTypes.func, // Accept the function from parent
  currentPrice: PropTypes.number.isRequired,
  priceChange: PropTypes.number.isRequired,
};

export default ChartControlsCustom;
