import React from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import './TransferTokenPage.css'; // Create this CSS file

const TransferTokenPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Get the coin data passed from the Watchlist component
  const coin = location.state?.coin;

  if (!coin) {
    return <p>Error: Coin data not found.</p>;
  }

  const handleTransfer = (event) => {
    event.preventDefault();
    // Implement the transfer logic here
    alert(`Transfer ${coin.name} functionality is not yet implemented.`);
  };

  return (
    <div className="transfer-token-page">
      <button onClick={() => navigate(-1)} className="back-button">
        Back
      </button>
      <h2>Transfer {coin.name} ({coin.symbol.toUpperCase()})</h2>
      <form onSubmit={handleTransfer}>
        <div className="form-group">
          <label htmlFor="recipient">Recipient Address:</label>
          <input type="text" id="recipient" name="recipient" required />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount:</label>
          <input type="number" id="amount" name="amount" step="any" required />
        </div>
        <button type="submit" className="transfer-button">Transfer</button>
      </form>
    </div>
  );
};

export default TransferTokenPage;