import React from 'react';
import './TimeframeButtons.css';

const TimeframeButtons = ({ selectedTimeframe, onTimeframeChange }) => {
  const timeframes = [
    { label: '1D', value: '1' },
    { label: '7D', value: '7' },
    { label: '30D', value: '30' },
  ];

  return (
    <div className="timeframe-buttons">
      {timeframes.map((tf) => (
        <button
          key={tf.value}
          onClick={() => onTimeframeChange(tf.value)}
          className={selectedTimeframe === tf.value ? 'active' : ''}
        >
          {tf.label}
        </button>
      ))}
    </div>
  );
};

export default TimeframeButtons;