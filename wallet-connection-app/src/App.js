import React from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import AccountBalance from './components/AccountBalance/AccountBalance';
import TokenList from './components/TokenList/TokenList';
import './App.css';
import { CoinContext } from './context/CoinContext';
import HomePage from './pages/HomePage';
import SearchBar from './components/SearchBar/SearchBar';

const App = () => {
  return (
    // <div className="app">
    //   <Header />
    //   <div className="app-body">
    //     <Sidebar />
    //     <main className="content">
    //       <AccountBalance />          
    //         <TokenList />
          
    //     </main>
    //   </div>
    // </div>
    <SearchBar/>
    
  );
};

export default App;
