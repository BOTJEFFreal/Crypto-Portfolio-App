import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparklines, SparklinesLine } from "react-sparklines";
import "./WatchList.css";
import { CoinContext } from "../../context/CoinContext";
import AddTokensModal from "../AddTokensModal/AddTokensModal";
import NoDataPlaceholder from "../NoDataPlaceholder/NoDataPlaceholder";

const Watchlist = () => {
  const { coinsList, setCoinsList } = useContext(CoinContext);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const tokens = coinsList && coinsList.tokens ? coinsList.tokens : [];

  const handleDelete = (coinId, event) => {
    event.stopPropagation();
    const updatedTokens = tokens.filter((coin) => coin.id !== coinId);
    setCoinsList({ tokens: updatedTokens });
    localStorage.setItem("favorites", JSON.stringify(updatedTokens));
  };

  const getChangeColor = (value) => {
    if (value > 0) return "#2E8B57";
    if (value < 0) return "#BF4024";
    return "black";
  };

  const getSparklineColor = (coin) => {
    if (coin.sparkline_in_7d && coin.sparkline_in_7d.price.length > 1) {
      const firstPrice = coin.sparkline_in_7d.price[0];
      const lastPrice =
        coin.sparkline_in_7d.price[coin.sparkline_in_7d.price.length - 1];
      return lastPrice > firstPrice ? "green" : "red";
    }
    return "blue";
  };

  const handleViewData = (id) => {
    navigate(`/token-data/${id}`);
  };

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (tokens.length === 0) {
    return (
      <div className="watchlist-container">
        <NoDataPlaceholder
          message="No Coins in Your Watchlist"
          description="Add coins to your watchlist to keep track of their prices and receive alerts."
          buttonText="Add Coins"
          onButtonClick={openModal}
        />
        {isModalOpen && <AddTokensModal closeModal={closeModal} />}
      </div>
    );
  }

  return (
    <div className="watchlist-container">
      <table className="watchlist-table">
        <thead>
          <tr>
            <th>Coin</th>
            <th>Price</th>
            <th>1h</th>
            <th>24h</th>
            <th>7d</th>
            <th>24h Volume</th>
            <th>Last 7 Days</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((coin) => {
            const change1h = coin.price_change_percentage_1h_in_currency;
            const change24h = coin.price_change_percentage_24h_in_currency;
            const change7d = coin.price_change_percentage_7d_in_currency;

            return (
              <tr key={coin.id} onClick={() => handleViewData(coin.id)}>
                <td>
                  <div className="coin-info">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="coin-icon"
                    />
                    <div className="coin-section">
                      <span className="coin-name">{coin.name}</span>
                      <span className="coin-symbol">
                        ({coin.symbol.toUpperCase()})
                      </span>
                    </div>
                  </div>
                </td>
                <td>${coin.current_price?.toLocaleString() || "N/A"}</td>
                <td style={{ color: getChangeColor(change1h) }}>
                  {change1h !== undefined
                    ? `${change1h.toFixed(2)}%`
                    : "N/A"}
                </td>
                <td style={{ color: getChangeColor(change24h) }}>
                  {change24h !== undefined
                    ? `${change24h.toFixed(2)}%`
                    : "N/A"}
                </td>
                <td style={{ color: getChangeColor(change7d) }}>
                  {change7d !== undefined
                    ? `${change7d.toFixed(2)}%`
                    : "N/A"}
                </td>
                <td>${coin.total_volume?.toLocaleString() || "N/A"}</td>
                <td>
                  {coin.sparkline_in_7d ? (
                    <Sparklines
                      data={coin.sparkline_in_7d.price}
                      width={100}
                      height={30}
                    >
                      <SparklinesLine color={getSparklineColor(coin)} />
                    </Sparklines>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>
                  <button
                    onClick={(event) => handleDelete(coin.id, event)}
                    className="delete-button"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {isModalOpen && <AddTokensModal closeModal={closeModal} />}
    </div>
  );
};

export default Watchlist;