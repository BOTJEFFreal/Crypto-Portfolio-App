import getCoinsMarkets from './getCoinsMarkets';

const getTopLosers = async () => {
  const coins = await getCoinsMarkets();
  const losers = coins
    .filter((coin) => coin.price_change_percentage_24h !== null)
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 20); 
  return losers;
};

export default getTopLosers;