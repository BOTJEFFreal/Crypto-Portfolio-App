import React from 'react';
import PropTypes from 'prop-types';

const TimeframeButtons = ({ timeframe, onChangeTimeframe, onOpenDatePicker }) => (
  <div className="timeframe-buttons">
    <button onClick={() => onChangeTimeframe('1')} className={timeframe === '1' ? 'active' : ''}>
      1D
    </button>
    <button onClick={() => onChangeTimeframe('7')} className={timeframe === '7' ? 'active' : ''}>
      7D
    </button>
    <button onClick={() => onChangeTimeframe('30')} className={timeframe === '30' ? 'active' : ''}>
      30D
    </button>
    <button onClick={() => onChangeTimeframe('max')} className={timeframe === 'max' ? 'active' : ''}>
      Max Time
    </button>
    <button onClick={onOpenDatePicker} className={timeframe === 'custom' ? 'active' : ''}>
      Calendar
    </button>
  </div>
);

TimeframeButtons.propTypes = {
  timeframe: PropTypes.string.isRequired,
  onChangeTimeframe: PropTypes.func.isRequired,
  onOpenDatePicker: PropTypes.func.isRequired,
};

export default TimeframeButtons;
