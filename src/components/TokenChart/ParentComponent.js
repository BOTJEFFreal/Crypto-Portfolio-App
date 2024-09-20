import React, { useRef, useState } from 'react';
import ChartControlsCustom from './ChartControlsCustom'; // Assuming this is where your component is
import { getCustomChartData } from './getchartData'; // Import the function to get custom chart data

const ParentComponent = ({ id }) => {
  const cache = useRef({});
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCustomRangeClick = async (startDate, endDate) => {
    setLoading(true);
    try {
      const data = await getCustomChartData(id, startDate, endDate, cache);
      setChartData(data.lineData); // Assuming you want to display the line data
    } catch (error) {
      console.error('Error fetching custom range data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Render your custom chart controls */}
      <ChartControlsCustom
        isCandlestick={false}
        onToggle={(candlestick) => console.log('Toggle chart type', candlestick)}
        selectedTimeframe="1D"
        onTimeframeChange={(timeframe) => console.log('Change timeframe', timeframe)}
        onCustomRangeClick={handleCustomRangeClick} // Pass the function to handle custom range
        currentPrice={30000}
        priceChange={-2.5}
      />

      {/* Display chart data */}
      {loading ? <p>Loading...</p> : <pre>{JSON.stringify(chartData, null, 2)}</pre>}
    </div>
  );
};

export default ParentComponent;
