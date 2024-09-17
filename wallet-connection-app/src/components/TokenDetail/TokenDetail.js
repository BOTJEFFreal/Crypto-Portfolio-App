// src/components/TokenDetail/TokenDetail.js

import React, { useContext } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { CoinContext } from '../../context/CoinContext';
import './TokenDetail.css';

const TokenDetail = () => {
  const { symbol } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { coinsList } = useContext(CoinContext);

  const token =
  location.state?.token ||
  coinsList.tokens.find((t) => t.symbol.toLowerCase() === symbol.toLowerCase());

  if (!token) {
    return <p>Error: Token data not found.</p>;
  }

  return (
    <div className="token-detail">
      <button onClick={() => navigate(-1)} className="back-button">
        Back
      </button>
      <h2>
        {token.name} ({token.symbol})
      </h2>
      <p>Portfolio Percentage: {token.portfolio}</p>
      <p>Price (24hr): {token.price}</p>
      <p>Balance: {token.balance}</p>
    </div>
  );
};

export default TokenDetail;
