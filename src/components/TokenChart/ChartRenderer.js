// src/components/ChartRenderer.jsx

import React from 'react';
import Chart from 'react-apexcharts'; // Assuming you're using react-apexcharts

const ChartRenderer = ({
  isCandlestick,
  lineChartOptions,
  lineChartSeries,
  candleChartOptions,
  candleChartSeries,
}) => {
  if (isCandlestick) {
    return (
      <Chart
        options={candleChartOptions}
        series={candleChartSeries}
        type="candlestick"
        height={300}
      />
    );
  } else {
    return (
      <Chart
        options={lineChartOptions}
        series={lineChartSeries}
        type="line"
        height={300}
      />
    );
  }
};

export default ChartRenderer;
