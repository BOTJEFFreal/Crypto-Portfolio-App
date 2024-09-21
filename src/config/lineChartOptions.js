// src/config/lineChartOptions.js

const getLineChartOptions = (isProfit, lineData, timeframe) => {
  if (!lineData || lineData.length === 0) {
    return {};
  }

  const prices = lineData.map(item => item.y);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const yAxisMin = minPrice < 0 ? minPrice * 1.1 : minPrice * 0.9;
  const yAxisMax = maxPrice * 1.1;

  let tickAmount = 12;
  let labelFormatter = (val) => val;
  let labelStep = 1;

  if (timeframe === '1') { 
    tickAmount = 24; 
    labelFormatter = (val) => {
      const date = new Date(val);
      return `${date.getHours()}:00`;
    };
    labelStep = 2; 
  } else if (timeframe === '7' || timeframe === '30') { 
    tickAmount = 14; 
    labelFormatter = (val) => {
      const date = new Date(val);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    };
    labelStep = 1; 
  } else if (timeframe === 'custom') { 
    tickAmount = Math.min(lineData.length, 20); // Increased for more ticks
    labelFormatter = (val) => {
      const date = new Date(val);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    };
    labelStep = 1;
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
      background: '#1E1E1E', 
    },
    stroke: {
      curve: 'smooth', 
      width: 2,
      colors: [isProfit ? '#4CAF50' : '#FF0000'],
    },
    xaxis: {
      type: 'datetime',
      labels: {
        rotate: -45,
        style: {
          fontSize: '12px',
          colors: '#FFFFFF', 
        },
        formatter: labelFormatter,
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMM \'yy',
          day: 'dd MMM',
          hour: 'HH:mm',
        },
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
          colors: '#FFFFFF', 
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
      theme: 'dark', 
      x: {
        format: 'dd MMM yyyy HH:mm', // Adjusted format
      },
      y: {
        formatter: (value) => `$${value.toLocaleString()}`, 
      },
    },
    dataLabels: {
      enabled: false, 
    },
    markers: {
      size: 0, 
      hover: {
        size: 4, 
      },
    },
    
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
