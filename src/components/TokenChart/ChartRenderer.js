// src/components/ChartRenderer.js

import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Automatically register Chart.js components

const ChartRenderer = ({ isCandlestick, lineChartOptions, lineChartSeries, candleChartOptions, candleChartSeries }) => {
  const chartRef = useRef(null); // Reference to the chart instance

  if (isCandlestick) {
    // Implement Candlestick chart if using a library that supports it
    return <div>Candlestick chart not implemented yet.</div>;
  }

  // Prepare the data object for Chart.js
  const data = {
    labels: lineChartSeries.map((item) => item.date), // Extract dates for x-axis labels
    datasets: [
      {
        label: 'Price (USD)',
        data: lineChartSeries.map((item) => item.price), // Extract prices for y-axis data
        borderColor: lineChartOptions.elements.line.borderColor, // Dynamic line color
        borderWidth: lineChartOptions.elements.line.borderWidth,
        tension: lineChartOptions.elements.line.tension,
        fill: lineChartOptions.elements.line.fill,
        pointRadius: lineChartOptions.elements.point.radius,
      },
    ],
  };

  // Merge dynamic labels into the options
  const options = {
    ...lineChartOptions,
    scales: {
      ...lineChartOptions.scales,
      x: {
        ...lineChartOptions.scales.x,
        labels: lineChartSeries.map((item) => item.date), // Set x-axis labels dynamically
      },
    },
  };

  const handleResetZoom = () => {
    if (chartRef && chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  return (
    <div>
      <Line ref={chartRef} data={data} options={options} />
      <button onClick={handleResetZoom} style={{ marginTop: '10px' }}>
        Reset Zoom
      </button>
    </div>
  );
};

export default ChartRenderer;
