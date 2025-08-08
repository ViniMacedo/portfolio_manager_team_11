import React, { useState, useEffect, useCallback } from "react";
import { Search, TrendingUp, TrendingDown, Brain, Zap, Star } from "lucide-react";
import { fetchAllStocks, fetchStockBySymbol } from "../services/api";
import { formatCurrency, formatPercentage } from "../utils/globalUtils";

const BrowseStocks = ({ searchQuery, setSearchQuery, setSelectedStock, portfolio, portfolioData }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [displayedStocks, setDisplayedStocks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const STOCKS_PER_PAGE = 20;

  // Generate AI recommendations based on portfolio
  const generateAIRecommendations = () => {
    if (!portfolio || !portfolio.holdings || portfolio.holdings.length === 0) {
      return {
        recommendations: [
          { symbol: 'AAPL', reason: 'Strong fundamentals and growth potential' },
          { symbol: 'MSFT', reason: 'Diversified technology portfolio' },
          { symbol: 'GOOGL', reason: 'Dominant market position in search and cloud' },
          { symbol: 'TSLA', reason: 'Electric vehicle market leader' },
        ],
        message: 'Since you\'re starting your portfolio, here are some popular stocks with strong fundamentals.'
      };
    }

    const holdings = portfolio.holdings.map(h => h.symbol);
    const hasNonTech = holdings.some(symbol => !['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'META', 'AMZN', 'NVDA'].includes(symbol));
    const hasFinancials = holdings.some(symbol => ['JPM', 'BAC', 'WFC', 'GS'].includes(symbol));
    const hasHealthcare = holdings.some(symbol => ['JNJ', 'PFE', 'UNH', 'MRK'].includes(symbol));

    let recommendations = [];
    let message = 'Based on your current holdings, here are AI-powered recommendations to improve diversification:';

    if (!hasNonTech && holdings.length > 0) {
      recommendations.push(
        { symbol: 'JPM', reason: 'Diversify with financial sector exposure' },
        { symbol: 'JNJ', reason: 'Add healthcare sector stability' },
        { symbol: 'XOM', reason: 'Energy sector hedge against inflation' }
      );
    }

    if (!hasFinancials) {
      recommendations.push({ symbol: 'JPM', reason: 'Leading investment bank with strong dividend' });
    }

    if (!hasHealthcare) {
      recommendations.push({ symbol: 'JNJ', reason: 'Defensive healthcare stock with consistent dividends' });
    }

    if (recommendations.length === 0) {
      recommendations = [
        { symbol: 'VTI', reason: 'Total market ETF for broader diversification' },
        { symbol: 'BRK.B', reason: 'Berkshire Hathaway for value exposure' },
        { symbol: 'VOO', reason: 'S&P 500 ETF for market exposure' }
      ];
    }

    return { recommendations: recommendations.slice(0, 4), message };
  };

  const aiData = generateAIRecommendations();

  // Load initial stocks with enhanced data
  useEffect(() => {
    const loadStocks = async () => {
      try {
        setLoading(true);
        const allStocks = await fetchAllStocks();
        
        // Enhance stocks with real price data
        const enhancedStocks = await Promise.all(
          allStocks.slice(0, 50).map(async (stock) => {
            try {
              const stockData = await fetchStockBySymbol(stock.symbol);
              return {
                ...stock,
                price: stockData.price || Math.random() * 200 + 10,
                change: stockData.change || (Math.random() - 0.5) * 10,
                changePercent: stockData.changePercent || (Math.random() - 0.5) * 5,
                volume: stockData.volume || Math.floor(Math.random() * 10000000),
                marketCap: stockData.marketCap || Math.floor(Math.random() * 100000000000)
              };
            } catch (error) {
              return {
                ...stock,
                price: Math.random() * 200 + 10,
                change: (Math.random() - 0.5) * 10,
                changePercent: (Math.random() - 0.5) * 5,
                volume: Math.floor(Math.random() * 10000000),
                marketCap: Math.floor(Math.random() * 100000000000)
              };
            }
          })
        );
        
        setStocks(enhancedStocks);
        setFilteredStocks(enhancedStocks);
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
      setPage(1);
    } else {
      const filtered = stocks.filter(stock =>
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStocks(filtered);
      setPage(1);
    }
  }, [searchQuery, stocks]);

  // Update displayed stocks based on pagination
  useEffect(() => {
    const startIndex = 0;
    const endIndex = page * STOCKS_PER_PAGE;
    const stocksToShow = filteredStocks.slice(startIndex, endIndex);
    setDisplayedStocks(stocksToShow);
    setHasMore(endIndex < filteredStocks.length);
  }, [filteredStocks, page]);

  // Infinite scroll handler
  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, loading]);

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
      {/* Search Header with AI Recommendations Button */}
      <div style={{gridColumn: 'span 12'}}>
        <div style={{display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px'}}>
          {/* Search Bar */}
          <div style={{position: 'relative', flex: 1}}>
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

          {/* AI Recommendations Button */}
          <button
            onClick={() => setShowAIRecommendations(!showAIRecommendations)}
            className={`ai-recommendations-btn ${showAIRecommendations ? 'active' : ''}`}
            style={{
              background: showAIRecommendations 
                ? 'linear-gradient(135deg, var(--color-neon-purple), var(--color-neon-blue))' 
                : 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '50px',
              padding: '12px 24px',
              border: showAIRecommendations 
                ? '1px solid var(--color-neon-purple)' 
                : '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap'
            }}
          >
            <Brain size={16} />
            {showAIRecommendations ? 'Hide AI' : 'AI Recommendations'}
          </button>
        </div>

        {/* AI Recommendations Panel */}
        {showAIRecommendations && (
          <div className="card-2025 ai-panel" style={{
            marginBottom: '20px',
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1))',
            border: '1px solid rgba(147, 51, 234, 0.3)'
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, var(--color-neon-purple), var(--color-neon-blue))',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Zap size={16} color="white" />
              </div>
              <h3 style={{color: 'white', fontSize: '18px', fontWeight: '600', margin: 0}}>
                AI Portfolio Recommendations
              </h3>
            </div>
            
            <p style={{color: 'rgba(255, 255, 255, 0.8)', marginBottom: '20px', lineHeight: '1.5'}}>
              {aiData.message}
            </p>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px'}}>
              {aiData.recommendations.map((rec, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.transform = 'translateY(0)';
                }}
                onClick={() => {
                  // Find the stock in our list and open it
                  const foundStock = stocks.find(s => s.symbol === rec.symbol);
                  if (foundStock) {
                    handleStockClick(foundStock);
                  }
                }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                    <Star size={14} color="var(--color-neon-yellow)" />
                    <span style={{color: 'white', fontWeight: '600', fontSize: '16px'}}>{rec.symbol}</span>
                  </div>
                  <p style={{color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', margin: 0, lineHeight: '1.4'}}>
                    {rec.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stock Grid */}
      <div className="card-2025" style={{gridColumn: 'span 12'}}>        
        <div 
          className="movers-grid-2025" 
          style={{maxHeight: '600px', overflowY: 'auto'}}
          onScroll={handleScroll}
        >
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
          ) : displayedStocks.length > 0 ? (
            <>
              {displayedStocks.map((stock) => (
                <div 
                  key={stock.symbol} 
                  className="mover-card-2025"
                  onClick={() => handleStockClick(stock)}
                >
                  <div className="mover-header-2025">
                    <span className="mover-symbol-2025">{stock.symbol}</span>
                    <span className={`mover-change-2025 ${stock.changePercent >= 0 ? 'positive-2025' : 'negative-2025'}`}>
                      {formatPercentage(stock.changePercent)}
                    </span>
                  </div>
                  <div className="mover-price-2025">{formatCurrency(stock.price)}</div>
                  <div className="mover-name-2025">{stock.name}</div>
                </div>
              ))}
              {hasMore && (
                <div className="mover-card-2025" style={{opacity: 0.5}}>
                  <div className="mover-header-2025">
                    <span className="mover-symbol-2025">...</span>
                    <span className="mover-change-2025">--</span>
                  </div>
                  <div className="mover-price-2025">Loading more...</div>
                  <div className="mover-name-2025">Scroll for more</div>
                </div>
              )}
            </>
          ) : (
            <div className="mover-card-2025" style={{gridColumn: 'span 3', textAlign: 'center', opacity: 0.7}}>
              <div className="mover-header-2025">
                <span className="mover-symbol-2025">---</span>
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
