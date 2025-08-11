import React, { useEffect, useState, useRef } from 'react';
import { searchSymbols, fetchStockBySymbol } from '../services/api';

export default function StockTicker({ setSelectedStock }) {
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
            name: data.name || symbol,
            price: data.price || 0,
            change: data.change || 0,
            changePercent: data.changePercent || (data.change ? ((data.change / data.price) * 100) : 0),
            volume: data.volume || 'N/A',
            marketCap: data.marketCap || 'N/A',
            sector: data.sector || 'Technology'
          };
        } catch (error) {
          console.error(`Error fetching ${symbol}:`, error);
          // Return fallback data for failed requests
          return {
            symbol: symbol,
            name: symbol,
            price: 0,
            change: 0,
            changePercent: 0,
            volume: 'N/A',
            marketCap: 'N/A',
            sector: 'Technology'
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

  const handleStockClick = (stock) => {
    if (setSelectedStock) {
      setSelectedStock({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        change: stock.change,
        changePercent: stock.changePercent,
        volume: stock.volume,
        marketCap: stock.marketCap,
        sector: stock.sector,
        peRatio: 'N/A',
        fiftyTwoWeekLow: 'N/A',
        fiftyTwoWeekHigh: 'N/A',
        dividend: 0,
        color: stock.change >= 0 ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600'
      });
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
    const placeholderStocks = popularStocks.slice(0, 8).map(symbol => ({
      symbol,
      price: 0,
      changePercent: 0
    }));

    return (
      <div className="stock-ticker-2025">
        <div className="ticker-scroll-2025">
          {[...placeholderStocks, ...placeholderStocks, ...placeholderStocks, ...placeholderStocks].map((stock, index) => (
            <div key={`${stock.symbol}-${index}`} className="ticker-item-2025" style={{opacity: 0.5}}>
              <span className="ticker-symbol-2025">{stock.symbol}</span>
              <span className="ticker-price-2025">Loading...</span>
              <span className="ticker-change-2025">--</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="stock-ticker-2025">
      <div className="ticker-scroll-2025">
        {/* Create enough copies for truly seamless infinite loop */}
        {[...stocks, ...stocks, ...stocks, ...stocks].map((stock, index) => (
          <div 
            key={`${stock.symbol}-${index}`} 
            className="ticker-item-2025"
            onClick={() => handleStockClick(stock)}
            style={{ cursor: 'pointer' }}
          >
            <span className="ticker-symbol-2025">{stock.symbol}</span>
            <span className="ticker-price-2025">${stock.price.toFixed(2)}</span>
            <span className={`ticker-change-2025 ${stock.changePercent >= 0 ? 'positive-2025' : 'negative-2025'}`}>
              {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
