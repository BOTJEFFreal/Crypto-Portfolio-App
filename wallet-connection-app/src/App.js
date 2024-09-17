import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CoinProvider } from './context/CoinContext';
import Header from './components/Header/Header';
import AccountBalance from './components/AccountBalance/AccountBalance';
import SearchBar from './components/SearchBar/SearchBar';
import TokenList from './components/TokenList/TokenList';
import TokenDetail from './components/TokenDetail/TokenDetail';
import HomePage from './pages/HomePage';
import './App.css';

function App() {
  return (
    <CoinProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* <Route path="/tokens" element={<TokenList />} /> */}
            <Route path="/token/:symbol" element={<TokenDetail />} />
            {/* Ensure this route is present */}
          </Routes>
        </div>
      </Router>
    </CoinProvider>
  );
}

export default App;