import React from 'react';
import Chart from 'react-apexcharts';

const ChartRenderer = ({
  isCandlestick,
  lineChartOptions,
  lineChartSeries,
  candleChartOptions,
  candleChartSeries,
}) => {
  return (
    <div>
      {isCandlestick ? (
        <Chart
          options={candleChartOptions}
          series={candleChartSeries}
          type="candlestick"
          height={350}
        />
      ) : (
        <Chart
          options={lineChartOptions}
          series={lineChartSeries}
          type="line" // Ensure this matches the updated chart type
          height={350}
        />
      )}
    </div>
  );
};

export default ChartRenderer;