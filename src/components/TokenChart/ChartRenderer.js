// src/components/ChartRenderer.jsx

import React from 'react';
import ReactApexChart from 'react-apexcharts';
import PropTypes from 'prop-types';

const ChartRenderer = ({
  isCandlestick,
  lineChartOptions,
  lineChartSeries,
  candleChartOptions,
  candleChartSeries,
}) => {
  return (
    <div className="chart-renderer">
      {!isCandlestick && lineChartSeries.length > 0 && (
        <ReactApexChart
          options={lineChartOptions}
          series={lineChartSeries}
          type="line"
          height={350}
        />
      )}
      {isCandlestick && candleChartSeries.length > 0 && (
        <ReactApexChart
          options={candleChartOptions}
          series={candleChartSeries}
          type="candlestick"
          height={350}
        />
      )}
      {!isCandlestick && lineChartSeries.length === 0 && (
        <p>No line chart data available.</p>
      )}
      {isCandlestick && candleChartSeries.length === 0 && (
        <p>No candlestick data available for the selected timeframe.</p>
      )}
    </div>
  );
};

ChartRenderer.propTypes = {
  isCandlestick: PropTypes.bool.isRequired,
  lineChartOptions: PropTypes.object.isRequired,
  lineChartSeries: PropTypes.array.isRequired,
  candleChartOptions: PropTypes.object.isRequired,
  candleChartSeries: PropTypes.array.isRequired,
};

export default ChartRenderer;
