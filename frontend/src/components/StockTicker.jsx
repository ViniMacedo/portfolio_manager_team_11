import React, { useEffect, useState, useRef } from 'react';
import { searchSymbols, fetchStockBySymbol } from '../services/api';

export default function StockTicker() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const updateIntervalRef = useRef(null);

  // Popular stocks to track
  const popularStocks = [
    'AAPL', 'GOOGL', 'MSFT', 'TSLA', 'NVDA', 
    'AMZN', 'META', 'NFLX', 'CRM', 'UBER', 
    'COIN', 'PYPL', 'SPOT', 'AMD', 'INTC'
  ];

  const fetchStockData = async () => {
    try {
      console.log('Fetching stock ticker data...');
      const stockPromises = popularStocks.map(async (symbol) => {
        try {
          const data = await fetchStockBySymbol(symbol);
          return {
            symbol: symbol,
            price: data.price || 0,
            changePercent: data.change ? ((data.change / data.price) * 100) : 0
          };
        } catch (error) {
          console.error(`Error fetching ${symbol}:`, error);
          // Return fallback data for failed requests
          return {
            symbol: symbol,
            price: 0,
            changePercent: 0
          };
        }
      });

      const stockData = await Promise.all(stockPromises);
      // Filter out any stocks that failed to load (price = 0)
      const validStocks = stockData.filter(stock => stock.price > 0);
      
      console.log('Updated stock ticker with', validStocks.length, 'stocks');
      setStocks(validStocks);
      setLoading(false);
    } catch (error) {
      console.error('Error updating stock ticker:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    fetchStockData();

    // Set up interval to update every 30 seconds
    updateIntervalRef.current = setInterval(() => {
      fetchStockData();
    }, 30000);

    // Cleanup interval on unmount
    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, []);

  // Show loading state with placeholder data
  if (loading || stocks.length === 0) {
    const placeholderStocks = popularStocks.map(symbol => ({
      symbol,
      price: 0,
      changePercent: 0
    }));

    return (
      <div className="bg-white/5 backdrop-blur-xl border-t border-white/10 border-b border-white/20 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5"></div>
        <div className="absolute top-0 left-0 w-64 h-full bg-gradient-to-r from-white/3 to-transparent"></div>
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-white/3 to-transparent"></div>
        
        <div className="relative z-10 py-2">
          <div className="animate-scroll whitespace-nowrap">
            <div className="inline-flex space-x-6 px-4">
              {[...placeholderStocks, ...placeholderStocks].map((s, index) => (
                <div key={`${s.symbol}-${index}`} className="flex items-center space-x-2 px-2 py-1 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                  <span className="font-bold text-blue-300 text-sm">{s.symbol}</span>
                  <span className="text-white/50 font-medium text-sm">Loading...</span>
                  <span className="text-gray-400 font-semibold px-1.5 py-0.5 rounded-md text-xs bg-gray-500/20">
                    --
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border-t border-b border-white/20 overflow-hidden relative">
      {/* Glassmorphism gradient overlay that matches header */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5"></div>
      <div className="absolute top-0 left-0 w-64 h-full bg-gradient-to-r from-white/3 to-transparent"></div>
      <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-white/3 to-transparent"></div>
      
      <div className="relative z-10 py-2">
        <div className="animate-scroll whitespace-nowrap">
          <div className="inline-flex space-x-6 px-4">
            {/* Triple the stocks for seamless infinite loop */}
            {[...stocks, ...stocks, ...stocks].map((s, index) => (
              <div key={`${s.symbol}-${index}`} className="flex items-center space-x-2 px-2 py-1 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-200">
                <span className="font-bold text-blue-300 text-sm">{s.symbol}</span>
                <span className="text-white font-medium text-sm">${s.price.toFixed(2)}</span>
                <span className={`font-semibold px-1.5 py-0.5 rounded-md text-xs ${s.changePercent >= 0 ? 'text-green-300 bg-green-500/20' : 'text-red-300 bg-red-500/20'}`}>
                  {s.changePercent >= 0 ? '+' : ''}{s.changePercent.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
