import React, { useContext, useEffect, useState } from 'react';
import { CoinContext } from '../../context/CoinContext';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import './TokenList.css';

const TokenList = () => {
  const { coinsList, setCoinsList } = useContext(CoinContext);
  const navigate = useNavigate();
  const tokens = coinsList && coinsList.tokens ? coinsList.tokens : [];
  
  const [historicalData, setHistoricalData] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});
  const [selectedTimeframes, setSelectedTimeframes] = useState({});

  const fetchHistoricalData = async (tokenId, days = 7) => {
    setLoading((prev) => ({ ...prev, [tokenId]: true }));
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${tokenId}/market_chart?vs_currency=usd&days=${days}`
      );
      if (!response.ok) {
        throw new Error(`Error fetching data for ${tokenId}`);
      }
      const data = await response.json();
      const formattedData = data.prices.map(([timestamp, price]) => ({
        date: new Date(timestamp).toLocaleDateString(),
        price: price.toFixed(2),
      }));
      setHistoricalData((prevData) => ({
        ...prevData,
        [tokenId]: formattedData,
      }));
      setError((prev) => ({ ...prev, [tokenId]: null }));
    } catch (err) {
      console.error(err);
      setError((prev) => ({ ...prev, [tokenId]: 'Failed to load data.' }));
    } finally {
      setLoading((prev) => ({ ...prev, [tokenId]: false }));
    }
  };

  useEffect(() => {
    tokens.forEach((token) => {
      if (!historicalData[token.id]) {
        fetchHistoricalData(token.id);
        setSelectedTimeframes((prev) => ({ ...prev, [token.id]: '7d' }));
      }
    });
  }, [tokens]);

  const handleTimeframeChange = (tokenId, timeframe) => {
    setSelectedTimeframes((prev) => ({ ...prev, [tokenId]: timeframe }));
    let days;
    switch(timeframe) {
      case '1d':
        days = 1;
        break;
      case '7d':
        days = 7;
        break;
      case '30d':
        days = 30;
        break;
      default:
        days = 7;
    }
    fetchHistoricalData(tokenId, days);
  };

  const handleViewDetails = (tokenId) => {
    navigate(`/token-data/${tokenId}`);
  };

  const handleDelete = (tokenId) => {
    const updatedTokens = tokens.filter((token) => token.id !== tokenId);
    setCoinsList({ tokens: updatedTokens });
    localStorage.setItem('favorites', JSON.stringify(updatedTokens));
  };

  return (
    <div className="token-list-container">
      <h2>Your Tokens</h2>
      {tokens.length > 0 ? (
        <div className="token-list">
          {tokens.map((token) => {
                return (
              <div key={token.id} className="token-card">
                <div className="token-header">
                  <img src={token.image} alt={token.name} className="token-icon" />
                  <h3>
                    {token.name} ({token.symbol.toUpperCase()})
                  </h3>
                </div>
                <div className="token-actions">
                  <button
                    onClick={() => handleTimeframeChange(token.id, '1d')}
                    className={selectedTimeframes[token.id] === '1d' ? 'active' : ''}
                  >
                    1D
                  </button>
                  <button
                    onClick={() => handleTimeframeChange(token.id, '7d')}
                    className={selectedTimeframes[token.id] === '7d' ? 'active' : ''}
                  >
                    7D
                  </button>
                  <button
                    onClick={() => handleTimeframeChange(token.id, '30d')}
                    className={selectedTimeframes[token.id] === '30d' ? 'active' : ''}
                  >
                    30D
                  </button>
                </div>
                <div className="token-chart">
                  {loading[token.id] ? (
                    <p>Loading chart...</p>
                  ) : error[token.id] ? (
                    <p className="error">{error[token.id]}</p>
                  ) : historicalData[token.id] ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={historicalData[token.id]}>
                        <XAxis dataKey="date" hide />
                        <YAxis domain={['auto', 'auto']} hide />
                        <Tooltip />
                        <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p>No data available.</p>
                  )}
                </div>
                <div className="token-info">
                  <p>Current Price: ${token.current_price?.toLocaleString() || 'N/A'}</p>
                  <p>Market Cap: ${token.market_cap?.toLocaleString() || 'N/A'}</p>
                  <p>24h Volume: ${token.total_volume?.toLocaleString() || 'N/A'}</p>
                </div>
                <div className="token-footer">
                  <button
                    onClick={() => handleViewDetails(token.id)}
                    className="view-details-button"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleDelete(token.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No tokens in your list.</p>
      )}
    </div>
  );
};

export default TokenList;
