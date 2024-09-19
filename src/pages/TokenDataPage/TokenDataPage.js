import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BackButton from '../../components/BackButton/BackButton';
import TokenHeader from '../../components/TokenHeader/TokenHeader';
import TokenInfo from '../../components/TokenInfo/TokenInfo';
import TokenStats from '../../components/TokenStats/TokenStats'; 
import TokenChart from '../../components/TokenChart/TokenChart';

import { getTokenData } from '../../service/getTokenData';
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
      <BackButton />
      <TokenHeader image={tokenData.image} name={tokenData.name} symbol={tokenData.symbol} />
      <div className="token-content">
        <div className="left-section">
          <TokenInfo
            currentPrice={tokenData.current_price}
            marketCap={tokenData.market_cap}
            totalVolume={tokenData.total_volume}
          />
          <TokenStats
            marketCap={tokenData.market_cap}
            fullyDilutedValuation={tokenData.fully_diluted_valuation}
            tradingVolume24h={tokenData.total_volume}
            circulatingSupply={tokenData.circulating_supply}
            totalSupply={tokenData.total_supply}
            maxSupply={tokenData.max_supply}
          />
        </div>
        <div className="right-section">
          <TokenChart id={id} />
        </div>
      </div>
    </div>
  );
};

export default TokenDataPage;