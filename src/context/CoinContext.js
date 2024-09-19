// src/context/CoinContext.js
import React, { createContext, useState, useEffect } from 'react';

export const CoinContext = createContext();

export const CoinProvider = ({ children }) => {
  const [coinsList, setCoinsList] = useState({ tokens: [] });

  useEffect(() => {
    const loadTokens = () => {
      const storedTokens = localStorage.getItem('favorites');
      if (storedTokens) {
        try {
          const tokens = JSON.parse(storedTokens);
          console.log('Loaded tokens:', tokens); // Debugging
          setCoinsList({ tokens });
        } catch (error) {
          console.error('Error parsing tokens from localStorage:', error);
        }
      }
    };
  
    loadTokens();
  
    window.addEventListener('storage', loadTokens);
  
    return () => {
      window.removeEventListener('storage', loadTokens);
    };
  }, []);

  return (
    <CoinContext.Provider value={{ coinsList, setCoinsList }}>
      {children}
    </CoinContext.Provider>
  );
};
