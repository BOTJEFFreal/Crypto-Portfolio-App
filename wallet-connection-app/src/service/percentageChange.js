export const PercentageChangeLastHour = (prices) => {
    if (!prices || prices.length < 2) return null;

    const recentPrice = prices[prices.length - 1]; 
    const price1HourAgo = prices[prices.length - 2];

    const percentageChange = ((recentPrice - price1HourAgo) / price1HourAgo) * 100;
    return percentageChange.toFixed(2); 
  };

export const PercentageChangeLastDay = (prices) => {
    if (!prices || prices.length < 24) return null; 

    const recentPrice = prices[prices.length - 1]; 
    const price24HoursAgo = prices[prices.length - 24];

    const percentageChange = ((recentPrice - price24HoursAgo) / price24HoursAgo) * 100;
    return percentageChange.toFixed(2); 
  };

export const PercentageChangeLast7Days = (prices) => {
    if (!prices || prices.length < 1) return null; 

    const recentPrice = prices[prices.length - 1]; 
    const price7DaysAgo = prices[0]; 

    const percentageChange = ((recentPrice - price7DaysAgo) / price7DaysAgo) * 100;
    return percentageChange.toFixed(2); 
  };
