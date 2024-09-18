import React from 'react';
import ApexCharts from 'react-apexcharts';
import PropTypes from 'prop-types';

const ChartRenderer = ({
  isCandlestick,
  lineChartOptions,
  lineChartSeries,
  candleChartOptions,
  candleChartSeries,
}) => {
  return (
    <>
      {isCandlestick ? (
        <ApexCharts
          options={candleChartOptions}
          series={candleChartSeries}
          type="candlestick"
          height={300}
        />
      ) : (
        <ApexCharts
          options={lineChartOptions}
          series={lineChartSeries}
          type="line"
          height={300}
        />
      )}
    </>
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
