const getLineChartOptions = (isProfit, lineData) => {
  if (!lineData || lineData.length === 0) {
    return {};
  }

  const prices = lineData.map(item => item.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const yAxisMin = minPrice < 0 ? minPrice * 1.1 : minPrice * 0.9; 
  const yAxisMax = maxPrice * 1.1; 

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
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: [isProfit ? '#4CAF50' : '#FF0000'],
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100],
        colorStops: [
          {
            offset: 0,
            color: isProfit ? '#4CAF50' : '#FF0000',
            opacity: 0.4,
          },
          {
            offset: 100,
            color: isProfit ? '#4CAF50' : '#FF0000',
            opacity: 0.1,
          },
        ],
      },
    },
    xaxis: {
      type: 'category',
      categories: lineData.map((item) => item.date),
      labels: {
        rotate: -45,
        style: {
          fontSize: '12px',
        },
        formatter: function (val) {
          return val;
        },
      },
      tickAmount: 12,
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
        formatter: (value) =>
          typeof value === 'number' ? `$${(value / 1000).toFixed(1)}K` : value,
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
      y: {
        formatter: (value) => `$${value}`,
      },
      x: {
        formatter: (val) => val,
      },
    },
  };
};

export default getLineChartOptions;
