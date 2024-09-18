import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CoinProvider } from './context/CoinContext';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage/HomePage';
import TokenDetail from './components/TokenDetail/TokenDetail';
import TokenDataPage from './pages/TokenDataPage/TokenDataPage';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';

function App() {
  return (
    <CoinProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Existing Routes */}
            <Route path="/token/:id" element={<TokenDetail />} />
            {/* Updated Route for TokenDataPage using id */}
            <Route path="/token-data/:id" element={<TokenDataPage />} />
          </Routes>
        </div>
      </Router>
    </CoinProvider>
  );
}

export default App;