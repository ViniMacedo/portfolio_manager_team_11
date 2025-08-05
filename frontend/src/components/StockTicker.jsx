import React, { useEffect, useState } from 'react';

export default function StockTicker() {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    // Mock stock data for the ticker, this is just for fun, can improve later
    const mockStockData = [
      { symbol: 'AAPL', price: 189.95, changePercent: 2.35 },
      { symbol: 'GOOGL', price: 2847.12, changePercent: -1.22 },
      { symbol: 'MSFT', price: 378.85, changePercent: 0.89 },
      { symbol: 'TSLA', price: 248.42, changePercent: 4.67 },
      { symbol: 'NVDA', price: 875.32, changePercent: 3.21 },
      { symbol: 'AMZN', price: 3205.67, changePercent: -0.55 },
      { symbol: 'META', price: 498.73, changePercent: 1.88 },
      { symbol: 'NFLX', price: 445.29, changePercent: -2.14 },
      { symbol: 'CRM', price: 267.85, changePercent: 1.45 },
      { symbol: 'UBER', price: 62.41, changePercent: 2.87 },
      { symbol: 'COIN', price: 234.56, changePercent: -3.42 },
      { symbol: 'PYPL', price: 58.92, changePercent: 0.73 },
      { symbol: 'SPOT', price: 267.89, changePercent: 1.92 },
      { symbol: 'AMD', price: 152.43, changePercent: -0.87 },
      { symbol: 'INTC', price: 42.15, changePercent: 3.44 }
    ];
    
    setStocks(mockStockData);
  }, []);

  return (
    <div className="bg-white/5 backdrop-blur-xl border-t border-white/10 border-b border-white/20 overflow-hidden relative">
      {/* Glassmorphism gradient overlay that matches header */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5"></div>
      <div className="absolute top-0 left-0 w-64 h-full bg-gradient-to-r from-white/3 to-transparent"></div>
      <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-white/3 to-transparent"></div>
      
      <div className="relative z-10 py-2">
        <div className="animate-scroll whitespace-nowrap">
          <div className="inline-flex space-x-6 px-4">
            {/* Duplicate the stocks for seamless loop */}
            {[...stocks, ...stocks].map((s, index) => (
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
