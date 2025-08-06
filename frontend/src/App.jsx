import React, { useState, useEffect } from 'react';
import { fetchPortfolioById, fetchAllStocks, tradeStock, fetchUserById } from './services/api';
import StockTicker from './components/StockTicker';
import Header from './components/Header';
import Overview from './components/Overview';
import Holdings from './components/Holdings';
import Performance from './components/Performance';
import Watchlist from './components/Watchlist';
import BrowseStocks from './components/BrowseStocks';
import StockFlyout from './components/StockFlyout';
import AIAssistant from './components/AIAssistant';

const App = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStock, setSelectedStock] = useState(null);
  const [portfolio, setPortfolio] = useState({ holdings: [] });
  const [userInfo, setUserInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [browsableStocks, setBrowsableStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [allStocks, setAllStocks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMoreStocks, setHasMoreStocks] = useState(true);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const STOCKS_PER_PAGE = 12;


  useEffect(() => {
    fetchPortfolioById(1).then(data => {
      console.log('Portfolio data received:', data);
      setPortfolio(data);
    }).catch(console.error);
    fetchUserById(1).then(data => {
      console.log('User data received:', data);
      setUserInfo(data);
    }).catch(console.error);
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
        stockSymbol, 
        action, 
        quantity, 
        price, 
        portfolio.id
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

  // Calculate real portfolio data from actual holdings
  const calculatePortfolioData = (portfolio, userInfo) => {
    console.log('Calculating portfolio data:', { portfolio, userInfo });
    
    if (!portfolio?.holdings || portfolio.holdings.length === 0) {
      console.log('No holdings found, using fallback data');
      // Return fallback data when no real data is available
      return {
        totalValue: 125430.50,
        dayChange: 2845.30,
        dayChangePercent: 2.32,
        totalGain: 18745.50,
        totalGainPercent: 17.5
      };
    }

    let totalValue = 0;
    let totalCost = 0;
    let dayChange = 0;

    console.log('Processing holdings:', portfolio.holdings);

    portfolio.holdings.forEach((holding, index) => {
      console.log(`Processing holding ${index}:`, holding);
      
      const quantity = holding.quantity || holding.shares || 0;
      const price = holding.price || 0;
      const averageCost = holding.average_cost || holding.cost_basis || price;
      
      const currentValue = quantity * price;
      const costBasis = quantity * averageCost;
      
      console.log(`Holding ${holding.symbol}: quantity=${quantity}, price=${price}, currentValue=${currentValue}, costBasis=${costBasis}`);
      
      totalValue += currentValue;
      totalCost += costBasis;
      
      // Simulate day change (in real app, you'd have previous day's price)
      const estimatedDayChange = currentValue * (Math.random() * 0.04 - 0.02); // Random ±2%
      dayChange += estimatedDayChange;
    });

    const totalGain = totalValue - totalCost;
    const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
    const dayChangePercent = totalValue > 0 ? (dayChange / totalValue) * 100 : 0;

    const result = {
      totalValue,
      dayChange,
      dayChangePercent,
      totalGain,
      totalGainPercent
    };
    
    console.log('Calculated portfolio data:', result);
    return result;
  };

  // Calculate real portfolio data
  const realPortfolioData = calculatePortfolioData(portfolio, userInfo);

  // Create mock holdings for AI when no real data is available
  const getEffectiveHoldings = () => {
    if (portfolio?.holdings && portfolio.holdings.length > 0) {
      // Check if we have valid price data
      const hasValidPrices = portfolio.holdings.some(holding => 
        holding.price && !isNaN(holding.price) && holding.price > 0
      );
      
      if (hasValidPrices) {
        return portfolio.holdings;
      }
    }
    
    // Return mock holdings for demonstration when no valid data
    return [
      { symbol: 'AAPL', name: 'Apple Inc', quantity: 50, shares: 50, price: 175.50, average_cost: 150.00 },
      { symbol: 'GOOGL', name: 'Alphabet Inc', quantity: 25, shares: 25, price: 135.20, average_cost: 120.00 },
      { symbol: 'MSFT', name: 'Microsoft Corp', quantity: 75, shares: 75, price: 420.10, average_cost: 380.00 },
      { symbol: 'TSLA', name: 'Tesla Inc', quantity: 30, shares: 30, price: 185.75, average_cost: 200.00 },
      { symbol: 'NVDA', name: 'NVIDIA Corp', quantity: 20, shares: 20, price: 498.32, average_cost: 450.00 }
    ];
  };

  // Get effective portfolio data for AI (fallback when real data is invalid)
  const getEffectivePortfolioData = () => {
    // If real data has valid total value, use it
    if (realPortfolioData.totalValue > 0) {
      return realPortfolioData;
    }
    
    // Otherwise use fallback data
    return {
      totalValue: 125430.50,
      dayChange: 2845.30,
      dayChangePercent: 2.32,
      totalGain: 18245.75,
      totalGainPercent: 17.01
    };
  };

  // Sample data (keeping existing data structure for fallback)
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

  // Comprehensive stock database - much larger dataset
  const createComprehensiveStockDatabase = () => {
    const sectors = ['Technology', 'Financial Services', 'Healthcare', 'Consumer Discretionary', 'Energy', 'Materials', 'Industrials', 'Utilities', 'Real Estate', 'Consumer Staples'];
    const colors = [
      'from-blue-500 to-cyan-400', 'from-emerald-500 to-teal-400', 'from-purple-500 to-pink-400',
      'from-orange-500 to-red-400', 'from-indigo-500 to-blue-400', 'from-green-500 to-emerald-400',
      'from-red-500 to-pink-400', 'from-slate-500 to-gray-400', 'from-teal-500 to-cyan-400',
      'from-violet-500 to-purple-400', 'from-cyan-500 to-blue-400', 'from-yellow-500 to-orange-400'
    ];

    const stockData = [
      { symbol: 'AAPL', name: 'Apple Inc', sector: 'Technology' },
      { symbol: 'GOOGL', name: 'Alphabet Inc', sector: 'Technology' },
      { symbol: 'MSFT', name: 'Microsoft Corp', sector: 'Technology' },
      { symbol: 'TSLA', name: 'Tesla Inc', sector: 'Consumer Discretionary' },
      { symbol: 'AMZN', name: 'Amazon.com Inc', sector: 'Consumer Discretionary' },
      { symbol: 'NVDA', name: 'NVIDIA Corp', sector: 'Technology' },
      { symbol: 'META', name: 'Meta Platforms', sector: 'Technology' },
      { symbol: 'NFLX', name: 'Netflix Inc', sector: 'Technology' },
      { symbol: 'JPM', name: 'JPMorgan Chase', sector: 'Financial Services' },
      { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
      { symbol: 'V', name: 'Visa Inc', sector: 'Financial Services' },
      { symbol: 'PG', name: 'Procter & Gamble', sector: 'Consumer Staples' },
      { symbol: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare' },
      { symbol: 'HD', name: 'Home Depot', sector: 'Consumer Discretionary' },
      { symbol: 'MA', name: 'Mastercard Inc', sector: 'Financial Services' },
      { symbol: 'BAC', name: 'Bank of America', sector: 'Financial Services' },
      { symbol: 'XOM', name: 'Exxon Mobil', sector: 'Energy' },
      { symbol: 'ABBV', name: 'AbbVie Inc', sector: 'Healthcare' },
      { symbol: 'PFE', name: 'Pfizer Inc', sector: 'Healthcare' },
      { symbol: 'KO', name: 'Coca-Cola', sector: 'Consumer Staples' },
      { symbol: 'AVGO', name: 'Broadcom Inc', sector: 'Technology' },
      { symbol: 'CVX', name: 'Chevron Corp', sector: 'Energy' },
      { symbol: 'LLY', name: 'Eli Lilly', sector: 'Healthcare' },
      { symbol: 'TMO', name: 'Thermo Fisher', sector: 'Healthcare' },
      { symbol: 'ACN', name: 'Accenture', sector: 'Technology' },
      { symbol: 'COST', name: 'Costco Wholesale', sector: 'Consumer Staples' },
      { symbol: 'ABT', name: 'Abbott Laboratories', sector: 'Healthcare' },
      { symbol: 'ADBE', name: 'Adobe Inc', sector: 'Technology' },
      { symbol: 'CRM', name: 'Salesforce', sector: 'Technology' },
      { symbol: 'NKE', name: 'Nike Inc', sector: 'Consumer Discretionary' },
      { symbol: 'TXN', name: 'Texas Instruments', sector: 'Technology' },
      { symbol: 'DHR', name: 'Danaher Corp', sector: 'Healthcare' },
      { symbol: 'WMT', name: 'Walmart Inc', sector: 'Consumer Staples' },
      { symbol: 'VZ', name: 'Verizon Communications', sector: 'Technology' },
      { symbol: 'ORCL', name: 'Oracle Corp', sector: 'Technology' },
      { symbol: 'CSCO', name: 'Cisco Systems', sector: 'Technology' },
      { symbol: 'PEP', name: 'PepsiCo Inc', sector: 'Consumer Staples' },
      { symbol: 'T', name: 'AT&T Inc', sector: 'Technology' },
      { symbol: 'MRK', name: 'Merck & Co', sector: 'Healthcare' },
      { symbol: 'INTC', name: 'Intel Corp', sector: 'Technology' },
      { symbol: 'WFC', name: 'Wells Fargo', sector: 'Financial Services' },
      { symbol: 'MCD', name: 'McDonald\'s Corp', sector: 'Consumer Discretionary' },
      { symbol: 'DIS', name: 'Walt Disney', sector: 'Consumer Discretionary' },
      { symbol: 'BMY', name: 'Bristol Myers Squibb', sector: 'Healthcare' },
      { symbol: 'PM', name: 'Philip Morris', sector: 'Consumer Staples' },
      { symbol: 'NEE', name: 'NextEra Energy', sector: 'Utilities' },
      { symbol: 'RTX', name: 'Raytheon Technologies', sector: 'Industrials' },
      { symbol: 'UPS', name: 'United Parcel Service', sector: 'Industrials' },
      { symbol: 'LOW', name: 'Lowe\'s Companies', sector: 'Consumer Discretionary' },
      { symbol: 'IBM', name: 'IBM Corp', sector: 'Technology' },
      { symbol: 'AMGN', name: 'Amgen Inc', sector: 'Healthcare' },
      { symbol: 'HON', name: 'Honeywell International', sector: 'Industrials' },
      { symbol: 'QCOM', name: 'Qualcomm Inc', sector: 'Technology' },
      { symbol: 'SPGI', name: 'S&P Global', sector: 'Financial Services' },
      { symbol: 'CAT', name: 'Caterpillar Inc', sector: 'Industrials' },
      { symbol: 'GS', name: 'Goldman Sachs', sector: 'Financial Services' },
      { symbol: 'AMT', name: 'American Tower', sector: 'Real Estate' },
      { symbol: 'BLK', name: 'BlackRock Inc', sector: 'Financial Services' },
      { symbol: 'AXP', name: 'American Express', sector: 'Financial Services' },
      { symbol: 'ISRG', name: 'Intuitive Surgical', sector: 'Healthcare' },
      { symbol: 'TGT', name: 'Target Corp', sector: 'Consumer Discretionary' },
      { symbol: 'MMM', name: '3M Company', sector: 'Industrials' },
      { symbol: 'DE', name: 'Deere & Company', sector: 'Industrials' },
      { symbol: 'GILD', name: 'Gilead Sciences', sector: 'Healthcare' },
      { symbol: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology' },
      { symbol: 'SBUX', name: 'Starbucks Corp', sector: 'Consumer Discretionary' },
      { symbol: 'MDLZ', name: 'Mondelez International', sector: 'Consumer Staples' },
      { symbol: 'INTU', name: 'Intuit Inc', sector: 'Technology' },
      { symbol: 'NOW', name: 'ServiceNow Inc', sector: 'Technology' },
      { symbol: 'GE', name: 'General Electric', sector: 'Industrials' },
      { symbol: 'ADP', name: 'Automatic Data Processing', sector: 'Technology' },
      { symbol: 'CCI', name: 'Crown Castle', sector: 'Real Estate' },
      { symbol: 'TJX', name: 'TJX Companies', sector: 'Consumer Discretionary' },
      { symbol: 'USB', name: 'U.S. Bancorp', sector: 'Financial Services' },
      { symbol: 'CVS', name: 'CVS Health', sector: 'Healthcare' },
      { symbol: 'SO', name: 'Southern Company', sector: 'Utilities' },
      { symbol: 'MO', name: 'Altria Group', sector: 'Consumer Staples' },
      { symbol: 'PLD', name: 'Prologis Inc', sector: 'Real Estate' },
      { symbol: 'CI', name: 'Cigna Corp', sector: 'Healthcare' },
      { symbol: 'DUK', name: 'Duke Energy', sector: 'Utilities' },
      { symbol: 'ZTS', name: 'Zoetis Inc', sector: 'Healthcare' },
      { symbol: 'CL', name: 'Colgate-Palmolive', sector: 'Consumer Staples' },
      { symbol: 'NSC', name: 'Norfolk Southern', sector: 'Industrials' },
      { symbol: 'AON', name: 'Aon PLC', sector: 'Financial Services' },
      { symbol: 'TFC', name: 'Truist Financial', sector: 'Financial Services' },
      { symbol: 'FIS', name: 'Fidelity National Info', sector: 'Technology' },
      { symbol: 'BSX', name: 'Boston Scientific', sector: 'Healthcare' },
      { symbol: 'EMR', name: 'Emerson Electric', sector: 'Industrials' },
      { symbol: 'ITW', name: 'Illinois Tool Works', sector: 'Industrials' },
      { symbol: 'SHW', name: 'Sherwin-Williams', sector: 'Materials' },
      { symbol: 'PNC', name: 'PNC Financial Services', sector: 'Financial Services' },
      { symbol: 'ICE', name: 'Intercontinental Exchange', sector: 'Financial Services' },
      { symbol: 'GM', name: 'General Motors', sector: 'Consumer Discretionary' },
      { symbol: 'F', name: 'Ford Motor', sector: 'Consumer Discretionary' },
      { symbol: 'FDX', name: 'FedEx Corp', sector: 'Industrials' },
      { symbol: 'ECL', name: 'Ecolab Inc', sector: 'Materials' },
      { symbol: 'APD', name: 'Air Products', sector: 'Materials' },
      { symbol: 'SYK', name: 'Stryker Corp', sector: 'Healthcare' },
      { symbol: 'COF', name: 'Capital One Financial', sector: 'Financial Services' },
      { symbol: 'FISV', name: 'Fiserv Inc', sector: 'Technology' },
      { symbol: 'EOG', name: 'EOG Resources', sector: 'Energy' },
      { symbol: 'EL', name: 'Estee Lauder', sector: 'Consumer Discretionary' },
      { symbol: 'MCO', name: 'Moody\'s Corp', sector: 'Financial Services' },
      { symbol: 'D', name: 'Dominion Energy', sector: 'Utilities' },
      { symbol: 'CME', name: 'CME Group', sector: 'Financial Services' },
      { symbol: 'WM', name: 'Waste Management', sector: 'Industrials' },
      { symbol: 'NOC', name: 'Northrop Grumman', sector: 'Industrials' },
      { symbol: 'PSA', name: 'Public Storage', sector: 'Real Estate' },
      { symbol: 'COP', name: 'ConocoPhillips', sector: 'Energy' }
    ];

    return stockData.map((stock, index) => ({
      ...stock,
      price: Math.random() * 400 + 50, // Random price between $50-$450
      change: (Math.random() - 0.5) * 20, // Random change between -$10 to +$10
      changePercent: (Math.random() - 0.5) * 8, // Random change between -4% to +4%
      marketCap: Math.random() * 2000000000000 + 100000000000, // Random market cap
      volume: Math.random() * 80000000 + 5000000, // Random volume
      color: colors[index % colors.length]
    }));
  };

  // Fetch stock data - using comprehensive stock database
  useEffect(() => {
    console.log('Setting up comprehensive stock database...');
    const allStocksData = createComprehensiveStockDatabase();
    setAllStocks(allStocksData);
    
    // Load initial page
    const initialStocks = allStocksData.slice(0, STOCKS_PER_PAGE);
    setBrowsableStocks(initialStocks);
    setFilteredStocks(initialStocks);
  }, []);

  // Load more stocks function
  const loadMoreStocks = async () => {
    if (loading || !hasMoreStocks) return;
    
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * STOCKS_PER_PAGE;
    const endIndex = startIndex + STOCKS_PER_PAGE;
    const newStocks = allStocks.slice(startIndex, endIndex);
    
    if (newStocks.length === 0) {
      setHasMoreStocks(false);
    } else {
      setBrowsableStocks(prev => [...prev, ...newStocks]);
      setCurrentPage(nextPage);
    }
    
    setLoading(false);
  };

  // Enhanced search function that searches all stocks
  const searchAllStocks = (query) => {
    if (query.trim() === '') {
      setFilteredStocks(browsableStocks);
      return;
    }

    const q = query.toLowerCase();
    const searchResults = allStocks.filter(s =>
      s.symbol.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.sector.toLowerCase().includes(q)
    );

    // If we found results not in browsableStocks, add them
    const uniqueResults = [];
    const browsableSymbols = new Set(browsableStocks.map(s => s.symbol));
    
    searchResults.forEach(stock => {
      if (!browsableSymbols.has(stock.symbol)) {
        uniqueResults.push(stock);
      }
    });

    if (uniqueResults.length > 0) {
      setBrowsableStocks(prev => [...prev, ...uniqueResults]);
    }
    
    setFilteredStocks(searchResults);
  };

  // Filter stocks based on search query
  useEffect(() => {
    searchAllStocks(searchQuery);
  }, [searchQuery, browsableStocks, allStocks]);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview portfolioData={portfolioData} portfolio={portfolio} watchlist={watchlist} performanceData={performanceData} handleTradeStock={handleTradeStock} setActiveTab={setActiveTab} />;
      case "holdings":
        return <Holdings portfolio={portfolio} setSelectedStock={setSelectedStock} />;
      case "performance":
        return <Performance portfolio={portfolio} setSelectedStock={setSelectedStock} />;
      case "watchlist":
        return <Watchlist watchlist={watchlist} setSelectedStock={setSelectedStock} />;
      case "browse":
        return <BrowseStocks 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredStocks={filteredStocks}
          setSelectedStock={setSelectedStock}
          loadMoreStocks={loadMoreStocks}
          loading={loading}
          hasMoreStocks={hasMoreStocks}
        />;
      default:
        return <Overview portfolioData={portfolioData} portfolio={portfolio} watchlist={watchlist} performanceData={performanceData} handleTradeStock={handleTradeStock} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Header with integrated navigation tabs */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} onOpenAI={() => setIsAIAssistantOpen(true)} />
      <StockTicker />

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
          onTradeStock={handleTradeStock}
          holdings={portfolio?.holdings || []}
          userBalance={userInfo?.balance || 0}
        />
      )}

      {/* AI Assistant Modal */}
      <AIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        portfolioData={getEffectivePortfolioData()}
        performanceData={performanceData}
        holdings={getEffectiveHoldings()}
      />
    </div>
  );
};

export default App;