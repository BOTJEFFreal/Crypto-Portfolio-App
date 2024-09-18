const getCandleChartOptions = () => {
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
    },
    xaxis: {
      type: 'datetime',
      categories: [],
      labels: {
        rotate: -45,
        style: {
          fontSize: '12px',
        },
        formatter: function (val) {
          const date = new Date(val);
          return `${date.getMonth() + 1}/${date.getDate()}`;
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
      tooltip: {
        enabled: true,
      },
      labels: {
        formatter: (value) => `$${value}`,
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
          <div class="apexcharts-candlestick-tooltip">
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
