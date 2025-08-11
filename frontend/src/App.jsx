import React, { useState, useEffect } from 'react';
import { fetchPortfolioById, tradeStock, fetchUserById, fetchStockBySymbol } from './services/api';
import StockTicker from './components/StockTicker';
import Header from './components/Header';
import Overview from './components/Overview';
import Portfolio from './components/Portfolio';
import Analytics from './components/Analytics';
import AIInsights from './components/AIInsights';
import BrowseStocks from './components/BrowseStocks';
import StockFlyout from './components/StockFlyout';
import AIAssistant from './components/AIAssistant';
import { calculatePortfolioMetrics, getEffectivePortfolioData, getEffectiveHoldings, formatCurrency, safeNumber } from './utils/globalUtils';

const App = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStock, setSelectedStock] = useState(null);
  const [portfolio, setPortfolio] = useState({ holdings: [] });
  const [userInfo, setUserInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);


  useEffect(() => {
    fetchPortfolioById(1).then(data => {
      console.log('Portfolio data received:', data);
      setPortfolio(data);
    }).catch(error => {
      console.error('Failed to fetch portfolio, using fallback:', error);
      setPortfolio({ 
        holdings: [], 
        id: 1, 
        name: 'My Portfolio',
        totalValue: 0 
      });
    });
    
    fetchUserById(1).then(data => {
      console.log('User data received:', data);
      setUserInfo(data);
    }).catch(error => {
      console.error('Failed to fetch user, using fallback:', error);
      setUserInfo({ 
        id: 1, 
        name: 'Demo User', 
        balance: 10000 
      });
    });
  }, []);

  // Handle trade stock
  const handleTradeStock = async (stockSymbol, action, quantity, price) => {
    if (!userInfo || !portfolio) {
      console.error('User information or portfolio is not available');
      return;
    }

    try {
      const result = await tradeStock(
        userInfo.id,
        portfolio.id,
        stockSymbol, 
        quantity, 
        price, 
        action
      );
      console.log('Trade successful:', result);
      
      // Refresh portfolio data after successful trade
      fetchPortfolioById(portfolio.id).then(setPortfolio).catch(console.error);
      fetchUserById(userInfo.id).then(setUserInfo).catch(console.error);
      
      return result;
    } catch (error) {
      console.error('Trade failed:', error);
      throw error;
    }
  }

  // Calculate real portfolio data using global utilities
  const userBalance = safeNumber(userInfo?.balance, 0);
  const realPortfolioData = getEffectivePortfolioData(portfolio, userBalance);
  const effectiveHoldings = getEffectiveHoldings(portfolio);

  const performanceData = [
    { date: 'Jan', value: 98000, change: 2.1 },
    { date: 'Feb', value: 102000, change: 4.1 },
    { date: 'Mar', value: 105500, change: 3.4 },
    { date: 'Apr', value: 108200, change: 2.6 },
    { date: 'May', value: 112800, change: 4.3 },
    { date: 'Jun', value: 118500, change: 5.1 },
    { date: 'Jul', value: 125430, change: 5.8 }
  ];

  // Create watchlist from real API data - fetch real prices
  const [watchlist, setWatchlist] = useState([]);
  
  useEffect(() => {
    const fetchWatchlistData = async () => {
      const watchlistSymbols = ['NVDA', 'META', 'NFLX'];
      const watchlistData = [];
      
      for (const symbol of watchlistSymbols) {
        try {
          const stockData = await fetchStockBySymbol(symbol);
          watchlistData.push({
            symbol: symbol,
            name: stockData.name || `${symbol} Inc`,
            price: stockData.price || 0,
            change: stockData.change || 0,
            changePercent: stockData.change ? ((stockData.change / stockData.price) * 100).toFixed(2) : 0,
            color: 'from-blue-500 to-indigo-400'
          });
        } catch (error) {
          console.error(`Failed to fetch watchlist data for ${symbol}:`, error);
        }
      }
      setWatchlist(watchlistData);
    };
    
    fetchWatchlistData();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview portfolioData={realPortfolioData} portfolio={portfolio} performanceData={performanceData} handleTradeStock={handleTradeStock} setActiveTab={setActiveTab} setSelectedStock={setSelectedStock} />;
      case "portfolio":
        return <Portfolio portfolio={portfolio} portfolioData={realPortfolioData} setSelectedStock={setSelectedStock} />;
      case "analytics":
        return <Analytics portfolio={portfolio} portfolioData={realPortfolioData} setSelectedStock={setSelectedStock} />;
      case "ai-insights":
        return <AIInsights portfolio={portfolio} portfolioData={realPortfolioData} watchlist={watchlist} setSelectedStock={setSelectedStock} setActiveTab={setActiveTab} />;
      case "browse":
        return <BrowseStocks 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setSelectedStock={setSelectedStock}
        />;
      default:
        return <Overview portfolioData={realPortfolioData} portfolio={portfolio} performanceData={performanceData} handleTradeStock={handleTradeStock} setActiveTab={setActiveTab} setSelectedStock={setSelectedStock} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Container - Properly Centered */}
      <div className="container-2025">
        {/* Header with integrated navigation tabs */}
        <Header activeTab={activeTab} setActiveTab={setActiveTab} onOpenAI={() => setIsAIAssistantOpen(true)} />
        <StockTicker setSelectedStock={setSelectedStock} />

        {/* Main Content */}
        <main className="flex-1 min-h-0">
          {renderContent()}
        </main>
      </div>

      {/* Stock Detail Flyout */}
      {selectedStock && (
        <StockFlyout 
          stock={selectedStock} 
          onClose={() => setSelectedStock(null)} 
          onTradeStock={handleTradeStock}
          holdings={portfolio?.holdings || []}
          userBalance={userInfo?.balance || 0}
        />
      )}

      {/* AI Assistant Modal */}
      <AIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        portfolioData={realPortfolioData}
        performanceData={performanceData}
        holdings={effectiveHoldings}
      />
    </div>
  );
};

export default App;