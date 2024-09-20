const getCandleChartOptions = (timeframe) => {
  let tickAmount = 12;
  let labelFormatter = (val) => {
    const date = new Date(val);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };
  let labelStep = 1; 

  if (timeframe === '1') {
    tickAmount = 12;
    labelFormatter = (val) => {
      const date = new Date(val);
      return `${date.getHours()}:00`;
    };
    labelStep = 2;
  } else if (timeframe === '7') {
    tickAmount = 7;
    labelFormatter = (val) => {
      const date = new Date(val);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    };
    labelStep = 1; 
  }

  return {
    chart: {
      id: 'candlestick-chart',
      type: 'candlestick',
      height: 300,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: true,
      },
    },
    title: {
      text: 'Candlestick Chart',
      align: 'left',
      style: {
        color: '#FFFFFF', // Optional: Change title text color to white
      },
    },
    xaxis: {
      type: 'datetime',
      categories: [], // This should be populated with your data's datetime values
      labels: {
        rotate: -45,
        style: {
          fontSize: '12px',
          colors: '#FFFFFF', // Set x-axis label text color to white
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
      tooltip: {
        enabled: true,
      },
      labels: {
        formatter: (value) => `$${value}`,
        style: {
          colors: '#FFFFFF', // Set y-axis label text color to white
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
      enabled: true,
      shared: true,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const o = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
        const h = w.globals.seriesCandleH[seriesIndex][dataPointIndex];
        const l = w.globals.seriesCandleL[seriesIndex][dataPointIndex];
        const c = w.globals.seriesCandleC[seriesIndex][dataPointIndex];
        const date = new Date(w.globals.seriesX[seriesIndex][dataPointIndex]).toLocaleString();

        return `
          <div class="apexcharts-candlestick-tooltip" style="background: rgba(0, 0, 0, 0.75); color: #FFFFFF; padding: 10px; border-radius: 5px;">
            <span><strong>Date:</strong> ${date}</span><br/>
            <span><strong>Open:</strong> $${o}</span><br/>
            <span><strong>High:</strong> $${h}</span><br/>
            <span><strong>Low:</strong> $${l}</span><br/>
            <span><strong>Close:</strong> $${c}</span>
          </div>
        `;
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#4CAF50',
          downward: '#FF0000',
        },
        wick: {
          useFillColor: true,
        },
      },
    },
  };
};

export default getCandleChartOptions;
