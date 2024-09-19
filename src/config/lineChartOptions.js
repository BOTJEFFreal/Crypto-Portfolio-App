// src/config/lineChartOptions.js

import zoomPlugin from 'chartjs-plugin-zoom';
import { Chart } from 'chart.js';

// Register the zoom plugin globally
Chart.register(zoomPlugin);

const getLineChartOptions = (isProfit) => ({
  responsive: true,
  plugins: {
    legend: {
      display: false, // Hide the legend if not needed
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function (context) {
          return `Price: $${context.parsed.y}`;
        },
      },
    },
    zoom: {
      pan: {
        enabled: true,
        mode: 'x',
        modifierKey: 'ctrl', // Require Ctrl key to pan
      },
      zoom: {
        enabled: true,
        drag: false,
        mode: 'x',
        speed: 0.1,
        // Optional: Limits to zoom level
        limits: {
          x: { min: 'original', max: 'original' },
          y: { min: 'original', max: 'original' },
        },
      },
    },
  },
  scales: {
    x: {
      type: 'category',
      labels: [], // To be set dynamically in ChartRenderer
      ticks: {
        maxTicksLimit: 12, // Limit the number of x-axis labels to 12
        autoSkip: true,
        maxRotation: 90, // Rotate labels by 90 degrees
        minRotation: 90,
        padding: 10, // Optional: Adds padding for better spacing
      },
      grid: {
        display: false, // Optional: Hide x-axis grid lines
      },
    },
    y: {
      beginAtZero: false, // Adjust based on your data
      grid: {
        color: '#f0f0f0', // Light gray grid lines
      },
      ticks: {
        callback: function (value) {
          return `$${value}`;
        },
      },
    },
  },
  elements: {
    line: {
      borderColor: isProfit ? 'green' : 'red', // Dynamic line color
      borderWidth: 2,
      tension: 0.4, // Smoothness of the line
      fill: false, // No fill under the line
    },
    point: {
      radius: 0, // Hide data points
    },
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
});

export default getLineChartOptions;
