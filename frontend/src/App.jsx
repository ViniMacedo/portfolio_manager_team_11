import React, { useState, useEffect } from 'react';
import { fetchPortfolioById, fetchAllStocks, tradeStock, fetchUserById } from './services/api';

// Import components
import Header from './components/Header';
import NavTabs from './components/NavTabs';
import Overview from './components/Overview';
import Holdings from './components/Holdings';
import Performance from './components/Performance';
import Watchlist from './components/Watchlist';
import BrowseStocks from './components/BrowseStocks';
import StockFlyout from './components/StockFlyout';

const App = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStock, setSelectedStock] = useState(null);
  const [portfolio, setPortfolio] = useState({ holdings: [] });
  const [userInfo, setUserInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [browsableStocks, setBrowsableStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);

  useEffect(() => {
    fetchPortfolioById(1).then(setPortfolio).catch(console.error);
    fetchUserById(1).then(setUserInfo).catch(console.error);
  }, []);

  // Handle trade stock

  const handleTradeStock = async (stockSymbol, action, quantity, price) => {
    if (!userInfo) {
      console.error('User information is not available');
      return;
    }

    const userBalance = userInfo.balance;

    try {
      const result = await tradeStock(stockSymbol, action, quantity, price, portfolio.id, userBalance);
      console.log('Trade successful:', result);
    } catch (error) {
      console.error('Trade failed:', error);
    }
  }

  // Sample data (keeping existing data structure)
  const portfolioData = {
    totalValue: 125430.50,
    dayChange: 2845.30,
    dayChangePercent: 2.32,
    totalGain: 18745.50,
    totalGainPercent: 17.5
  };

  const performanceData = [
    { date: 'Jan', value: 98000, change: 2.1 },
    { date: 'Feb', value: 102000, change: 4.1 },
    { date: 'Mar', value: 105500, change: 3.4 },
    { date: 'Apr', value: 108200, change: 2.6 },
    { date: 'May', value: 112800, change: 4.3 },
    { date: 'Jun', value: 118500, change: 5.1 },
    { date: 'Jul', value: 125430, change: 5.8 }
  ];

  const watchlist = [
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 498.32, change: 12.45, changePercent: 2.56, color: 'from-green-500 to-emerald-400' },
    { symbol: 'META', name: 'Meta Platforms', price: 312.87, change: -5.43, changePercent: -1.71, color: 'from-blue-500 to-indigo-400' },
    { symbol: 'NFLX', name: 'Netflix Inc', price: 445.23, change: 8.90, changePercent: 2.04, color: 'from-red-500 to-pink-400' }
  ];

  // Fetch stock data - using predefined popular stocks since no /api/stocks endpoint exists
  useEffect(() => {
    console.log('Setting up predefined stock list...');
    const popularStocks = [
      { symbol: 'AAPL', name: 'Apple Inc', price: 185.32, change: 2.45, changePercent: 1.34, marketCap: 2800000000000, volume: 45000000, sector: 'Technology', color: 'from-blue-500 to-cyan-400' },
      { symbol: 'GOOGL', name: 'Alphabet Inc', price: 142.87, change: -1.23, changePercent: -0.85, marketCap: 1800000000000, volume: 32000000, sector: 'Technology', color: 'from-emerald-500 to-teal-400' },
      { symbol: 'MSFT', name: 'Microsoft Corp', price: 378.45, change: 5.67, changePercent: 1.52, marketCap: 2600000000000, volume: 28000000, sector: 'Technology', color: 'from-purple-500 to-pink-400' },
      { symbol: 'TSLA', name: 'Tesla Inc', price: 248.90, change: -8.45, changePercent: -3.28, marketCap: 800000000000, volume: 75000000, sector: 'Consumer Discretionary', color: 'from-orange-500 to-red-400' },
      { symbol: 'AMZN', name: 'Amazon.com Inc', price: 156.78, change: 3.21, changePercent: 2.09, marketCap: 1600000000000, volume: 38000000, sector: 'Consumer Discretionary', color: 'from-indigo-500 to-blue-400' },
      { symbol: 'NVDA', name: 'NVIDIA Corp', price: 498.32, change: 12.45, changePercent: 2.56, marketCap: 1200000000000, volume: 42000000, sector: 'Technology', color: 'from-green-500 to-emerald-400' },
      { symbol: 'META', name: 'Meta Platforms', price: 312.87, change: -5.43, changePercent: -1.71, marketCap: 800000000000, volume: 25000000, sector: 'Technology', color: 'from-blue-500 to-indigo-400' },
      { symbol: 'NFLX', name: 'Netflix Inc', price: 445.23, change: 8.90, changePercent: 2.04, marketCap: 200000000000, volume: 18000000, sector: 'Technology', color: 'from-red-500 to-pink-400' },
      { symbol: 'JPM', name: 'JPMorgan Chase', price: 198.45, change: 1.68, changePercent: 0.87, marketCap: 600000000000, volume: 15000000, sector: 'Financial Services', color: 'from-slate-500 to-gray-400' },
      { symbol: 'JNJ', name: 'Johnson & Johnson', price: 165.32, change: -0.75, changePercent: -0.45, marketCap: 450000000000, volume: 12000000, sector: 'Healthcare', color: 'from-teal-500 to-cyan-400' },
      { symbol: 'V', name: 'Visa Inc', price: 278.90, change: 3.39, changePercent: 1.23, marketCap: 550000000000, volume: 8000000, sector: 'Financial Services', color: 'from-violet-500 to-purple-400' },
      { symbol: 'PG', name: 'Procter & Gamble', price: 155.67, change: 0.53, changePercent: 0.34, marketCap: 370000000000, volume: 6000000, sector: 'Consumer Discretionary', color: 'from-cyan-500 to-blue-400' }
    ];
    
    setBrowsableStocks(popularStocks);
    setFilteredStocks(popularStocks);
  }, []);

  // Filter stocks based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStocks(browsableStocks);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredStocks(
        browsableStocks.filter(s =>
          s.symbol.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.sector.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, browsableStocks]);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview portfolioData={portfolioData} portfolio={portfolio} watchlist={watchlist} performanceData={performanceData} handleTradeStock={handleTradeStock} />;
      case "holdings":
        return <Holdings portfolio={portfolio} />;
      case "performance":
        return <Performance portfolio={portfolio} />;
      case "watchlist":
        return <Watchlist watchlist={watchlist} />;
      case "browse":
        return <BrowseStocks 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredStocks={filteredStocks}
          setSelectedStock={setSelectedStock} 
        />;
      default:
        return <Overview portfolioData={portfolioData} portfolio={portfolio} watchlist={watchlist} performanceData={performanceData} handleTradeStock={handleTradeStock} />;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header */}
      <Header />

      {/* Navigation Tabs */}
      <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 flex-1 overflow-hidden min-h-0">
        <div className="h-full overflow-hidden">
          {renderContent()}
        </div>
      </main>

      {/* Stock Detail Flyout */}
      {selectedStock && (
        <StockFlyout 
          stock={selectedStock} 
          onClose={() => setSelectedStock(null)} 
        />
      )}
    </div>
  );
};

export default App;