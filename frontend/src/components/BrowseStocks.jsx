import React, { useState, useEffect } from "react";
import { Search, TrendingUp, TrendingDown } from "lucide-react";
import { fetchAllStocks, fetchStockBySymbol } from "../services/api";

const BrowseStocks = ({ searchQuery, setSearchQuery, setSelectedStock }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredStocks, setFilteredStocks] = useState([]);

  // Load initial stocks
  useEffect(() => {
    const loadStocks = async () => {
      try {
        setLoading(true);
        const allStocks = await fetchAllStocks();
        setStocks(allStocks);
        setFilteredStocks(allStocks);
      } catch (error) {
        console.error('Failed to load stocks:', error);
        setStocks([]);
        setFilteredStocks([]);
      } finally {
        setLoading(false);
      }
    };

    loadStocks();
  }, []);

  // Filter stocks based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStocks(stocks);
    } else {
      const filtered = stocks.filter(stock =>
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStocks(filtered);
    }
  }, [searchQuery, stocks]);

  const handleStockClick = async (stock) => {
    try {
      // Fetch real-time data for the stock
      const stockData = await fetchStockBySymbol(stock.symbol);
      setSelectedStock({
        symbol: stock.symbol,
        name: stock.name,
        price: stockData.price || 0,
        change: stockData.change || 0,
        changePercent: stockData.change || 0,
        volume: stockData.volume || 'N/A',
        marketCap: stockData.marketCap || 'N/A',
        sector: stockData.sector || 'Technology',
        peRatio: stockData.peRatio || 'N/A',
        fiftyTwoWeekLow: stockData.fiftyTwoWeekLow || 'N/A',
        fiftyTwoWeekHigh: stockData.fiftyTwoWeekHigh || 'N/A',
        dividend: stockData.dividend || 0,
        color: (stockData.change || 0) >= 0 ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600'
      });
    } catch (error) {
      console.error('Error fetching stock details:', error);
      // Still open with basic info
      setSelectedStock({
        symbol: stock.symbol,
        name: stock.name,
        price: 0,
        change: 0,
        changePercent: 0,
        volume: 'N/A',
        marketCap: 'N/A',
        sector: 'Technology',
        color: 'from-blue-400 to-blue-600'
      });
    }
  };

  return (
    <div className="dashboard-grid-2025">
      {/* Search Header */}
      <div className="card-2025" style={{gridColumn: 'span 12'}}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 style={{fontSize: '28px', fontWeight: '700', marginBottom: '8px'}}>
              🚀 Trading Bot
            </h2>
            <p style={{color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px'}}>
              Discover and analyze stocks with AI-powered insights
            </p>
          </div>
          <div className="live-indicator-2025">
            <div className="status-dot-2025"></div>
            <span>LIVE</span>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{position: 'relative', marginBottom: '20px'}}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '100px',
            padding: '12px 20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Search style={{width: '20px', height: '20px', color: 'rgba(255, 255, 255, 0.6)'}} />
            <input
              type="text"
              placeholder="Search stocks by symbol or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                flex: 1,
                color: '#ffffff',
                fontSize: '16px'
              }}
            />
          </div>
        </div>

        {/* Results Count */}
        <div style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '14px',
          marginBottom: '20px'
        }}>
          {loading ? 'Loading stocks...' : `${filteredStocks.length} stocks available`}
        </div>
      </div>

      {/* Stock Grid */}
      <div className="card-2025" style={{gridColumn: 'span 12'}}>
        <h3 style={{fontSize: '18px', marginBottom: '20px'}}>📊 Available Stocks</h3>
        
        <div className="movers-grid-2025">
          {loading ? (
            // Loading placeholders
            [...Array(6)].map((_, index) => (
              <div key={index} className="mover-card-2025" style={{opacity: 0.5}}>
                <div className="mover-header-2025">
                  <span className="mover-symbol-2025">...</span>
                  <span className="mover-change-2025">--</span>
                </div>
                <div className="mover-price-2025">Loading...</div>
                <div className="mover-name-2025">Please wait</div>
              </div>
            ))
          ) : filteredStocks.length > 0 ? (
            filteredStocks.map((stock) => (
              <div 
                key={stock.symbol} 
                className="mover-card-2025"
                onClick={() => handleStockClick(stock)}
              >
                <div className="mover-header-2025">
                  <span className="mover-symbol-2025">{stock.symbol}</span>
                  <span className="mover-change-2025 positive-2025">+?%</span>
                </div>
                <div className="mover-price-2025">$--</div>
                <div className="mover-name-2025">{stock.name}</div>
              </div>
            ))
          ) : (
            <div className="mover-card-2025" style={{gridColumn: 'span 3', textAlign: 'center', opacity: 0.7}}>
              <div className="mover-header-2025">
                <span className="mover-symbol-2025">🔍</span>
              </div>
              <div className="mover-price-2025">No Results</div>
              <div className="mover-name-2025">Try a different search term</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseStocks;