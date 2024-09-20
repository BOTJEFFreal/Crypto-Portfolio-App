// src/config/lineChartOptions.js

const getLineChartOptions = (isProfit, lineData, timeframe) => {
  if (!lineData || lineData.length === 0) {
    return {};
  }

  const prices = lineData.map(item => item.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const yAxisMin = minPrice < 0 ? minPrice * 1.1 : minPrice * 0.9;
  const yAxisMax = maxPrice * 1.1;

  let tickAmount = 12;
  let labelFormatter = (val) => val;
  let labelStep = 1;

  if (timeframe === '1') { // 1 Day
    tickAmount = 24; // Increase tickAmount for hourly readings
    labelFormatter = (val) => {
      const date = new Date(val);
      return `${date.getHours()}:00`;
    };
    labelStep = 2; // Show label every 2 hours
  } else if (timeframe === '7') { // 7 Days
    tickAmount = 14; // Increase tickAmount for bi-daily readings
    labelFormatter = (val) => {
      const date = new Date(val);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    };
    labelStep = 1; // Show label every day
  } else if (timeframe === '30') { // 30 Days
    tickAmount = 30; // Increase tickAmount for daily readings
    labelFormatter = (val) => {
      const date = new Date(val);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    };
    labelStep = 1; // Show label every day
  }

  const yLabelFormatter = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`; 
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`; 
    } else {
      return `$${value.toFixed(2)}`;
    }
  };

  return {
    chart: {
      id: 'line-chart',
      type: 'line',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: true,
      },
      animations: {
        enabled: false,
      },
      background: '#1E1E1E', // Optional: Set chart background for better contrast
    },
    stroke: {
      curve: 'smooth', 
      width: 2,
      colors: [isProfit ? '#4CAF50' : '#FF0000'],
    },
    xaxis: {
      type: 'datetime',
      categories: lineData.map((item) => item.date),
      labels: {
        rotate: -45,
        style: {
          fontSize: '12px',
          colors: '#FFFFFF', // Set label text color to white
        },
        formatter: labelFormatter,
        step: labelStep,
      },
      tickAmount: tickAmount,
      tickPlacement: 'on',
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      min: yAxisMin,
      max: yAxisMax,
      labels: {
        formatter: yLabelFormatter,
        style: {
          fontSize: '12px',
          colors: '#FFFFFF', // Set label text color to white
        },
      },
    },
    grid: {
      show: true,
      borderColor: '#e0e0e0',
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      theme: 'dark', // Change tooltip theme to dark for better visibility
      y: {
        formatter: (value) => `$${value.toLocaleString()}`, 
      },
      x: {
        formatter: (val) => {
          const date = new Date(val);
          return timeframe === '1' 
            ? `${date.getHours()}:00` 
            : `${date.getMonth() + 1}/${date.getDate()}`;
        },
      },
      style: {
        fontSize: '12px',
        color: '#FFFFFF', // Set tooltip text color to white
      },
    },
    tooltip: {
      theme: 'dark', // Ensures tooltip background is dark
      x: {
        formatter: (val) => {
          const date = new Date(val);
          return timeframe === '1' 
            ? `${date.getHours()}:00` 
            : `${date.getMonth() + 1}/${date.getDate()}`;
        },
      },
      y: {
        formatter: (value) => `$${value.toLocaleString()}`,
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels to reduce clutter
    },
    markers: {
      size: 0, // Remove markers for a cleaner line
      hover: {
        size: 4, // Show markers on hover
      },
    },
    // Enable data points beyond tickAmount
    plotOptions: {
      line: {
        dataLabels: {
          enabled: false,
        },
        curve: 'smooth',
      },
    },
  };
};

export default getLineChartOptions;
