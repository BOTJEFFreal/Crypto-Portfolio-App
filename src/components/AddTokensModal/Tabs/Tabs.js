
import React from 'react';
import PropTypes from 'prop-types';
import './Tabs.css';

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { label: 'Trending', value: 'trending' },
    { label: 'Top Gainers', value: 'gainers' },
    { label: 'Top Losers', value: 'losers' },
    ];

  return (
    <div className="tabs-container">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={`tab-button ${activeTab === tab.value ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

Tabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default Tabs;
