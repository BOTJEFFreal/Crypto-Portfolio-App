import { useState, useEffect } from 'react';
import getCoinData from '../apis/getCoinData';

const useCoinData = (coinId, existingCoins) => {
  const [coinData, setCoinData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoinData = async () => {
      const existingCoin = existingCoins.find((c) => c.id === coinId);
      if (existingCoin && existingCoin.current_price) {
        setCoinData(existingCoin);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const fetchedData = await getCoinData(coinId);
        if (fetchedData) {
          setCoinData(fetchedData);
        } else {
          setError('Coin data not found.');
        }
      } catch (err) {
        setError('Failed to fetch coin data.');
      }
      setLoading(false);
    };

    if (coinId) {
      fetchCoinData();
    }
  }, [coinId, existingCoins]);

  return { coinData, loading, error };
};

export default useCoinData;
