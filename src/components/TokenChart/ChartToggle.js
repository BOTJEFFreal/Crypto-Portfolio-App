import React from 'react';
import PropTypes from 'prop-types';

const ChartToggle = ({ isCandlestick, onToggle }) => (
  <div className="chart-toggle">
    <button onClick={() => onToggle(false)} className={!isCandlestick ? 'active' : ''}>
      Line Chart
    </button>
    <button onClick={() => onToggle(true)} className={isCandlestick ? 'active' : ''}>
      Candlestick Chart
    </button>
  </div>
);

ChartToggle.propTypes = {
  isCandlestick: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default ChartToggle;