import axios from 'axios';

const getCoinList = async (setCoins) => {
  const storedCoins = localStorage.getItem('coinList');
  const storedTime = localStorage.getItem('coinListTimestamp');
  const now = Date.now();
  const cacheDuration = 24 * 60 * 60 * 1000; // 24 hours

  if (storedCoins && storedTime && now - storedTime < cacheDuration) {
    setCoins(JSON.parse(storedCoins)); 
  } else {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 250,
            page: 1,
            sparkline: true, 
            price_change_percentage: '1h,24h,7d', 
          },
        }
      );
      const data = response.data;
      setCoins(data);
      localStorage.setItem('coinList', JSON.stringify(data));
      localStorage.setItem('coinListTimestamp', now);
    } catch (error) {
      console.error('Error fetching coin list:', error);
    }
  }
};

export default getCoinList;