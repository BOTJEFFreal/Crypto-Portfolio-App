import React from 'react';
// import './TimeframeButtons.css';

const TimeframeButtons = ({ timeframe, onChangeTimeframe, onOpenDatePicker }) => {
  return (
    <div className="timeframe-buttons">
      <button
        className={timeframe === '1' ? 'active' : ''}
        onClick={() => onChangeTimeframe('1')}
      >
        1D
      </button>
      <button
        className={timeframe === '7' ? 'active' : ''}
        onClick={() => onChangeTimeframe('7')}
      >
        7D
      </button>
      <button onClick={onOpenDatePicker}>Custom</button>
    </div>
  );
};

export default TimeframeButtons;
