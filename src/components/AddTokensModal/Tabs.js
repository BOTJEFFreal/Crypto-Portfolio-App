import React from 'react';

const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="add-modal-tabs">
      <button
        className={`add-modal-tab ${activeTab === 'trending' ? 'active' : ''}`}
        onClick={() => setActiveTab('trending')}
      >
        Trending
      </button>
      <button
        className={`add-modal-tab ${activeTab === 'gainers' ? 'active' : ''}`}
        onClick={() => setActiveTab('gainers')}
      >
        Top Gainers
      </button>
      <button
        className={`add-modal-tab ${activeTab === 'losers' ? 'active' : ''}`}
        onClick={() => setActiveTab('losers')}
      >
        Top Losers
      </button>
      <button
        className={`add-modal-tab ${activeTab === 'recentlyAdded' ? 'active' : ''}`}
        onClick={() => setActiveTab('recentlyAdded')}
      >
        Recently Added
      </button>
    </div>
  );
};

export default Tabs;