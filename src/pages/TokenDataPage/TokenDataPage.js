import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BackButton from '../../components/BackButton/BackButton';
import TokenHeader from '../../components/TokenHeader/TokenHeader';
import TokenInfo from '../../components/TokenInfo/TokenInfo';
import TokenChart from '../../components/TokenChart/TokenChart';
import { getTokenData } from '../../apis/getTokenData';
import './TokenDataPage.css';

const TokenDataPage = () => {
  const { id } = useParams();
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const data = await getTokenData(id);
        setTokenData(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();
  }, [id]);

  if (error) {
    return <p>Error: Unable to fetch token data.</p>;
  }

  if (loading || !tokenData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="token-data-page">
      <div className="header-container">
        <BackButton />
        <TokenHeader 
          image={tokenData.image} 
          name={tokenData.name} 
          symbol={tokenData.symbol} 
        />
      </div>
      <div className="token-content">
        <div className="right-section">
          {/* Pass the current price to TokenChart */}
          <TokenChart 
            id={id}
            currentPrice={tokenData.current_price}
            priceChange={tokenData.price_change_percentage_24h} 
          />
          <TokenInfo
            marketCap={tokenData.market_cap}
            totalVolume24h={tokenData.total_volume}
            circulatingSupply={tokenData.circulating_supply}
            allTimeLow={tokenData.atl}
            allTimeHigh={tokenData.ath}
            dayRangeLow={tokenData.low_24h}
            dayRangeHigh={tokenData.high_24h}
          />
        </div>
      </div>
    </div>
  );
};

export default TokenDataPage;
