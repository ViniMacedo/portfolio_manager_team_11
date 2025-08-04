import React, { useState, useEffect  } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Activity, Eye, Star, Sparkles, Zap, ArrowUpRight, Plus, Bell, Settings, Search, Calendar, FileText, Download, Share, Target, Bookmark, X, LineChart } from 'lucide-react';
import { fetchPortfolioById, fetchAllStocks, tradeStock, fetchUserById  } from './services/api';
const App = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [portfolio, setPortfolio] = useState({ holdings: [] });
  const [searchQuery, setSearchQuery]       = useState('');
  const [browsableStocks, setBrowsableStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [selectedStock, setSelectedStock]     = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    fetchPortfolioById(1).then(setPortfolio);
    fetchUserById(1).then(setUserInfo);
  }, []);


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

  // sample data
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'holdings', label: 'Holdings', icon: BarChart3 },
    { id: 'performance', label: 'Performance', icon: Zap },
    { id: 'watchlist', label: 'Watchlist', icon: Eye },
    { id: 'browse', label: 'Browse Stocks', icon: Search }
  ];
  // fetch stock
  useEffect(() => {
    fetchAllStocks()
      .then(stocks => {
        setBrowsableStocks(stocks);
        setFilteredStocks(stocks);
      })
      .catch(console.error);
  }, []);


  // Initialize with all stocks and filter based on search
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

  // Generate sample chart data for selected stock
  const generateChartData = (stock) => {
    const basePrice = stock.price;
    const data = [];
    for (let i = 30; i >= 0; i--) {
      const variance = (Math.random() - 0.5) * 0.1;
      const price = basePrice * (1 + variance - (i * 0.002));
      data.push({
        day: 30 - i,
        price: Math.max(price, basePrice * 0.8),
        volume: Math.floor(Math.random() * 50000000) + 10000000
      });
    }
    return data;
  };

  const formatMarketCap = (value) => {
    if (value >= 1000000000000) {
      return `$${(value / 1000000000000).toFixed(2)}T`;
    } else if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    return `$${value.toLocaleString()}`;
  };

  const formatVolume = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  const StockFlyout = ({ stock, onClose }) => {
    const chartData = generateChartData(stock);
    const maxPrice = Math.max(...chartData.map(d => d.price));
    const minPrice = Math.min(...chartData.map(d => d.price));

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className={`bg-gradient-to-r ${stock.color} p-6 text-white relative`}>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-lg flex items-center justify-center transition-all duration-200"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">{stock.symbol}</h2>
                <p className="text-lg opacity-90">{stock.name}</p>
                <p className="text-sm opacity-75">{stock.sector}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">${stock.price.toFixed(2)}</div>
                <div className={`text-xl font-semibold flex items-center justify-end ${stock.changePercent >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                  {stock.changePercent >= 0 ? <TrendingUp className="h-5 w-5 mr-1" /> : <TrendingDown className="h-5 w-5 mr-1" />}
                  {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}% (${stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)})
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 grid grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto">
            {/* Chart Section */}
            <div className="col-span-2 space-y-6">
              {/* Price Chart */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <LineChart className="h-5 w-5 mr-2 text-blue-600" />
                  30-Day Price Trend
                </h3>
                <div className="h-48 flex items-end justify-between space-x-1">
                  {chartData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center space-y-1 flex-1">
                      <div 
                        className="w-full bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600 cursor-pointer"
                        style={{ 
                          height: `${Math.max(((item.price - minPrice) / (maxPrice - minPrice)) * 160, 4)}px`,
                          minHeight: '4px'
                        }}
                        title={`Day ${item.day}: $${item.price.toFixed(2)}`}
                      ></div>
                      {index % 5 === 0 && (
                        <span className="text-xs text-gray-500">{item.day}</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                  <span>${minPrice.toFixed(2)}</span>
                  <span className="font-semibold">30 Days</span>
                  <span>${maxPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Volume Chart */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                  Volume Trend
                </h3>
                <div className="h-24 flex items-end justify-between space-x-1">
                  {chartData.slice(-14).map((item, index) => (
                    <div key={index} className="flex flex-col items-center space-y-1 flex-1">
                      <div 
                        className="w-full bg-green-500 rounded-t-sm transition-all duration-300 hover:bg-green-600 cursor-pointer"
                        style={{ 
                          height: `${Math.max((item.volume / 100000000) * 80, 4)}px`,
                          minHeight: '4px'
                        }}
                        title={`Volume: ${formatVolume(item.volume)}`}
                      ></div>
                    </div>
                  ))}
                </div>
                <div className="text-center text-xs text-gray-500 mt-2">14-Day Volume</div>
              </div>
            </div>

            {/* Stock Details and Actions */}
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-bold mb-4">Key Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Market Cap</span>
                    <span className="font-semibold">{formatMarketCap(stock.marketCap)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Volume</span>
                    <span className="font-semibold">{formatVolume(stock.volume)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sector</span>
                    <span className="font-semibold text-sm">{stock.sector}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">P/E Ratio</span>
                    <span className="font-semibold">{(15 + Math.random() * 20).toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">52W Range</span>
                    <span className="font-semibold text-sm">${(stock.price * 0.7).toFixed(0)} - ${(stock.price * 1.3).toFixed(0)}</span>
                  </div>
                </div>
              </div>

              {/* Trading Actions */}
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl p-4 font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg">
                  <div className="flex items-center justify-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Buy ${stock.symbol}</span>
                  </div>
                  <div className="text-sm opacity-90 mt-1">Market Order</div>
                </button>

                <button className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl p-4 font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg">
                  <div className="flex items-center justify-center space-x-2">
                    <TrendingDown className="h-5 w-5" />
                    <span>Sell ${stock.symbol}</span>
                  </div>
                  <div className="text-sm opacity-90 mt-1">Market Order</div>
                </button>

                <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl p-4 font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg">
                  <div className="flex items-center justify-center space-x-2">
                    <Star className="h-5 w-5" />
                    <span>Add to Watchlist</span>
                  </div>
                </button>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
                <h4 className="font-bold text-purple-900 mb-3">Quick Analysis</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${stock.changePercent >= 2 ? 'bg-green-500' : stock.changePercent >= 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    <span className="text-gray-700">
                      {stock.changePercent >= 2 ? 'Strong Bullish' : stock.changePercent >= 0 ? 'Bullish' : 'Bearish'} Momentum
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${stock.volume > 30000000 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-gray-700">
                      {stock.volume > 30000000 ? 'High' : 'Moderate'} Volume
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-gray-700">Large Cap Stock</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBrowseStocks = () => (
    <div className="flex flex-col gap-4 h-full">
      {/* Search Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Search className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-white text-2xl font-bold">Browse Stocks</h2>
                <p className="text-white/80">Discover and analyze market opportunities</p>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search stocks by symbol, name, or sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-80 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stock Categories */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {['Technology', 'Financial Services', 'Healthcare', 'Consumer Discretionary'].map((sector) => (
          <button
            key={sector}
            onClick={() => setSearchQuery(sector)}
            className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 text-center"
          >
            <div className="font-bold text-gray-900 mb-1">{sector}</div>
            <div className="text-sm text-gray-600">
              {filteredStocks.filter(s => s.sector === sector).length} stocks
            </div>
          </button>
        ))}
      </div>

      {/* Stock Grid */}
      <div className="flex-1 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-purple-50 to-indigo-50">
          <h3 className="text-lg font-bold text-gray-900 flex items-center justify-between">
            <span>Market Overview</span>
            <span className="text-sm text-purple-600 font-semibold">
              {filteredStocks.length} stocks found
            </span>
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStocks.map((stock) => (
              <div 
                key={stock.symbol} 
                onClick={() => setSelectedStock(stock)}
                className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${stock.color} rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-shadow duration-200`}>
                      {stock.symbol[0]}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{stock.symbol}</div>
                      <div className="text-xs text-gray-600 truncate max-w-32">{stock.name}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-gray-900 text-lg">${stock.price.toFixed(2)}</div>
                    <div className={`text-sm font-semibold flex items-center justify-end ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.changePercent >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Market Cap:</span>
                    <span className="font-semibold">{formatMarketCap(stock.marketCap)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Volume:</span>
                    <span className="font-semibold">{formatVolume(stock.volume)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sector:</span>
                    <span className="font-semibold truncate max-w-24">{stock.sector}</span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200 flex space-x-2">
                  <button 
                    onClick={(e) => {e.stopPropagation(); /* Handle buy */}}
                    className="flex-1 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg py-2 px-3 text-xs font-semibold transition-all duration-200 flex items-center justify-center space-x-1"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Buy</span>
                  </button>
                  <button 
                    onClick={(e) => {e.stopPropagation(); /* Handle watchlist */}}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg py-2 px-3 text-xs font-semibold transition-all duration-200 flex items-center justify-center space-x-1"
                  >
                    <Eye className="h-3 w-3" />
                    <span>Watch</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Keep all existing render functions (renderOverview, renderHoldings, etc.) unchanged
  const renderOverview = () => (
    <div className="flex flex-col gap-4 h-full">
      {/* Portfolio Value - Full Width Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 rounded-2xl p-4 lg:p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
        <div className="absolute top-0 right-0 w-32 h-32 lg:w-48 lg:h-48 bg-gradient-to-bl from-cyan-400/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-tr from-pink-400/30 to-transparent rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4 lg:space-x-6">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center transform hover:scale-110 transition-transform duration-200 shadow-xl">
                <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 text-white" />
              </div>
              <div>
                <h2 className="text-white/80 text-sm lg:text-lg">Total Portfolio Value</h2>
                <p className="text-3xl lg:text-5xl font-bold text-white">${portfolioData.totalValue.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between lg:justify-end lg:space-x-8 space-x-4">
              <div className="text-center">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-1 lg:mb-2 border border-white/30 hover:scale-110 transition-transform duration-200">
                  <TrendingUp className="h-4 w-4 lg:h-6 lg:w-6 text-green-400" />
                </div>
                <div className="text-lg lg:text-2xl font-bold text-green-400">+{portfolioData.dayChangePercent}%</div>
                <div className="text-white/80 text-xs lg:text-sm">Today</div>
                <div className="text-white text-sm lg:text-lg font-bold">+${portfolioData.dayChange.toLocaleString()}</div>
              </div>
              
              <div className="text-center">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-1 lg:mb-2 border border-white/30 hover:scale-110 transition-transform duration-200">
                  <ArrowUpRight className="h-4 w-4 lg:h-6 lg:w-6 text-purple-400" />
                </div>
                <div className="text-lg lg:text-2xl font-bold text-purple-400">+{portfolioData.totalGainPercent}%</div>
                <div className="text-white/80 text-xs lg:text-sm">All Time</div>
                <div className="text-white text-sm lg:text-lg font-bold">+${portfolioData.totalGain.toLocaleString()}</div>
              </div>
              
              <div className="text-center">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-1 lg:mb-2 border border-white/30 hover:scale-110 transition-transform duration-200">
                  <BarChart3 className="h-4 w-4 lg:h-6 lg:w-6 text-cyan-400" />
                </div>
                <div className="text-lg lg:text-2xl font-bold text-cyan-400">{portfolio.holdings.length}</div>
                <div className="text-white/80 text-xs lg:text-sm">Positions</div>
                <div className="text-white text-sm lg:text-lg font-bold">Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-12 gap-4">
        {/* Holdings Preview - Financial Data Priority */}
        <div className="col-span-3 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl flex flex-col">
          <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-purple-50 to-indigo-50">
            <h3 className="text-lg font-bold text-gray-900 flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                <span>Holdings</span>
              </div>
              <div className="text-sm text-purple-600 font-semibold">${portfolio.holdings.reduce((sum, stock) => sum + (stock.shares * stock.current_price), 0).toLocaleString()}</div>
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {portfolio.holdings.map((stock) => {
              const value = stock.shares * stock.current_price;
              const change = stock.current_price - stock.avg_price;
              const changePercent = ((change) / stock.avg_price * 100).toFixed(2);
              const colorClass = change >= 0 ? 'bg-green-400 text-green-800' : 'bg-red-400 text-red-800';
              return (
                <div key={stock.symbol} className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${colorClass} rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                        {stock.symbol[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-gray-900 text-sm">{stock.symbol}</div>
                        <div className="text-gray-600 text-xs">{stock.shares} @ ${stock.avg_price}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 text-lg">${(value/1000).toFixed(1)}k</div>
                      <div className={`text-xs flex items-center justify-end font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        <span>{changePercent >= 0 ? '+' : ''}{changePercent}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Performance Section with Chart */}
        <div className="col-span-7 flex flex-col gap-4">
          {/* Performance Metrics & Chart */}
          <div className="bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden min-h-[300px]">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent backdrop-blur-3xl"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
            <div className="relative z-10 h-full flex flex-col">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Activity className="h-6 w-6 mr-3" />
                Performance Analytics
              </h3>
              
              {/* Metrics Row */}
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-2 border border-white/30 hover:scale-110 transition-transform duration-200 cursor-pointer">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold mb-1">+17.5%</div>
                  <div className="text-sm opacity-90">Total Return</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-2 border border-white/30 hover:scale-110 transition-transform duration-200 cursor-pointer">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold mb-1">+8.2%</div>
                  <div className="text-sm opacity-90">YTD Return</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-2 border border-white/30 hover:scale-110 transition-transform duration-200 cursor-pointer">
                    <PieChart className="h-6 w-6" />
                  </div>
                  <div className="text-2xl font-bold mb-1">12.4%</div>
                  <div className="text-sm opacity-90">Volatility</div>
                </div>
              </div>

              {/* Performance Chart - CSS Based */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 flex-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold">7-Month Trend</span>
                  <span className="text-xs opacity-75">Portfolio Growth</span>
                </div>
                <div className="h-24 flex items-end justify-between space-x-2 mb-3">
                  {performanceData.map((item, index) => (
                    <div key={item.date} className="flex flex-col items-center space-y-1 flex-1">
                      <div 
                        className="w-full bg-white/30 rounded-t-sm transition-all duration-500 hover:bg-white/50 cursor-pointer"
                        style={{ 
                          height: `${Math.max((item.value - 95000) / 1000, 8)}px`,
                          minHeight: '6px'
                        }}
                      ></div>
                      <span className="text-xs opacity-75">{item.date}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-xs opacity-75">
                  <span>$98k</span>
                  <span className="font-semibold text-green-300">+{portfolioData.totalGainPercent}% Growth</span>
                  <span>$125k</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-white/30 shadow-xl">
            <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-indigo-600" />
              Quick Actions
            </h4>
            <div className="grid grid-cols-6 gap-3">
              <button className="bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-xl p-3 text-center transition-all duration-200 hover:scale-105 active:scale-95 border border-indigo-200 group">
                <FileText className="h-5 w-5 mx-auto mb-2 text-indigo-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-xs font-semibold text-gray-700">Reports</div>
              </button>
              
              <button className="bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl p-3 text-center transition-all duration-200 hover:scale-105 active:scale-95 border border-green-200 group">
                <Download className="h-5 w-5 mx-auto mb-2 text-green-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-xs font-semibold text-gray-700">Export</div>
              </button>
              
              <button className="bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-xl p-3 text-center transition-all duration-200 hover:scale-105 active:scale-95 border border-blue-200 group">
                <Share className="h-5 w-5 mx-auto mb-2 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-xs font-semibold text-gray-700">Share</div>
              </button>
              
              <button className="bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 rounded-xl p-3 text-center transition-all duration-200 hover:scale-105 active:scale-95 border border-orange-200 group">
                <Target className="h-5 w-5 mx-auto mb-2 text-orange-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-xs font-semibold text-gray-700">Goals</div>
              </button>
              
              <button className="bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl p-3 text-center transition-all duration-200 hover:scale-105 active:scale-95 border border-purple-200 group">
                <Calendar className="h-5 w-5 mx-auto mb-2 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-xs font-semibold text-gray-700">Calendar</div>
              </button>
              
              <button className="bg-gradient-to-r from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100 rounded-xl p-3 text-center transition-all duration-200 hover:scale-105 active:scale-95 border border-yellow-200 group">
                <Bookmark className="h-5 w-5 mx-auto mb-2 text-yellow-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-xs font-semibold text-gray-700">Saved</div>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Watchlist & Actions - Premium UX */}
        <div className="col-span-2 flex flex-col gap-4">
          {/* Premium Watchlist - Prominent Design */}
          <div className="flex-1 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl p-1 shadow-2xl">
            <div className="bg-white/95 backdrop-blur-xl rounded-xl h-full flex flex-col border border-orange-200/50">
              <div className="p-4 border-b border-orange-200/50 bg-gradient-to-r from-orange-50 to-amber-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <Eye className="h-5 w-5 mr-2 text-orange-600" />
                    Watchlist
                  </h3>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-xs text-orange-700 font-medium">Market opportunities</p>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {watchlist.map((stock) => (
                  <div key={stock.symbol} className="bg-gradient-to-r from-white to-orange-50 rounded-xl p-3 shadow-sm border border-orange-100 hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className={`w-8 h-8 bg-gradient-to-r ${stock.color} rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-xl transition-shadow duration-200`}>
                          {stock.symbol[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-gray-900 text-sm">{stock.symbol}</div>
                          <div className="text-gray-600 text-xs truncate">{stock.name.split(' ')[0]}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 text-sm">${stock.price}</div>
                        <div className={`text-xs font-semibold flex items-center justify-end ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="w-full bg-gradient-to-r from-orange-100 to-amber-100 hover:from-orange-200 hover:to-amber-200 text-orange-800 rounded-xl p-3 text-center transition-all duration-200 hover:scale-105 active:scale-95 border border-orange-200 font-semibold text-sm">
                  <Plus className="h-4 w-4 inline mr-2" />
                  Add Symbol
                </button>
              </div>
            </div>
          </div>

          {/* Trading Actions */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-4 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <h3 className="text-sm font-bold mb-3 flex items-center">
                <Zap className="h-4 w-4 mr-2" />
                Trading
              </h3>
              <div className="space-y-2">
                <button className="w-full bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl p-3 text-center transition-all duration-200 border border-white/30 hover:scale-105 active:scale-95 group">
                  <div className="flex items-center justify-center space-x-2">
                    <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                    <span className="font-semibold text-xs">Buy Order</span>
                  </div>
                </button>
                
                <button className="w-full bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl p-3 text-center transition-all duration-200 border border-white/30 hover:scale-105 active:scale-95 group">
                  <div className="flex items-center justify-center space-x-2">
                    <Activity className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-semibold text-xs">Analysis</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHoldings = () => (
    <div className="grid grid-cols-4 grid-rows-3 gap-4 h-full">
      {/* Header Card */}
      <div className="col-span-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Your Holdings</h2>
            <p className="text-indigo-100 text-sm">Complete overview of your positions</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{portfolio.holdings.length}</div>
            <div className="text-sm opacity-90">Positions</div>
          </div>
        </div>
      </div>

      {/* Holdings Grid - Scrollable */}
      <div className="col-span-4 row-span-2 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {portfolio.holdings.map((stock) => {
              const value = stock.shares * stock.current_price;
              const change = stock.current_price - stock.avg_price;
              const changePercent = ((change) / stock.avg_price * 100).toFixed(2);

              return (
                <div key={stock.symbol} className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-shadow duration-200`}>
                        {stock.symbol[0]}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{stock.symbol}</div>
                        <div className="text-gray-600 text-sm">{stock.product_type}</div>
                        <div className="text-xs text-gray-500">{stock.shares} shares</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-gray-900 text-lg">${value.toLocaleString()}</div>
                      <div className="text-gray-600 text-sm mb-1">${stock.avg_price}</div>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105 ${
                        change >= 0 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}>
                        {change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {changePercent >= 0 ? '+' : ''}{changePercent}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Additional demo holdings for scrolling */}
            {[...Array(6)].map((_, index) => (
              <div key={`demo-${index}`} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer opacity-60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-600">STOCK{index + 1}</div>
                      <div className="text-gray-500 text-sm">Demo Company {index + 1}</div>
                      <div className="text-xs text-gray-400">{10 + index * 5} shares</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-gray-600 text-lg">${(2000 + index * 500).toLocaleString()}</div>
                    <div className="text-gray-500 text-sm mb-1">${100 + index * 10}</div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +{(1 + index * 0.5).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="grid grid-cols-5 grid-rows-3 gap-4 h-full">
      {/* Main Performance Header */}
      <div className="col-span-5 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent backdrop-blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Zap className="h-6 w-6 mr-3" />
            Performance Metrics
          </h2>
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-3 border border-white/30 hover:scale-110 transition-transform duration-200 cursor-pointer">
                <TrendingUp className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold">+17.5%</div>
              <div className="text-sm opacity-90">Total Return</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-3 border border-white/30 hover:scale-110 transition-transform duration-200 cursor-pointer">
                <BarChart3 className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold">+8.2%</div>
              <div className="text-sm opacity-90">YTD Return</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-3 border border-white/30 hover:scale-110 transition-transform duration-200 cursor-pointer">
                <Activity className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold">12.4%</div>
              <div className="text-sm opacity-90">Volatility</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-3 border border-white/30 hover:scale-110 transition-transform duration-200 cursor-pointer">
                <PieChart className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold">{portfolio.holdings.length}</div>
              <div className="text-sm opacity-90">Holdings</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Performance Ranking */}
      <div className="col-span-5 row-span-2 bg-white/70 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-white/30 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Ranking</h3>
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-3">
            {portfolio.holdings
              .sort((a, b) => {
                const perfA = (a.current_price - a.avg_price) / a.avg_price;
                const perfB = (b.current_price - b.avg_price) / b.avg_price;
                return perfB - perfA;
              })
              .map((stock, index) => {            
                const change = stock.current_price - stock.avg_price;
                const changePercent = ((change) / stock.avg_price * 100).toFixed(2);
                const colorClass = change >= 0 ? 'bg-green-400 text-green-800' : 'bg-red-400 text-red-800';
                return (
                  <div key={stock.symbol} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg hover:shadow-xl transition-shadow duration-200 ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                        index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                        index === 2 ? 'bg-gradient-to-r from-orange-400 to-red-500' :
                        'bg-gradient-to-r from-gray-300 to-gray-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-r ${colorClass} rounded-xl flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-shadow duration-200`}>
                        {stock.symbol[0]}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{stock.symbol}</div>
                        <div className="text-sm text-gray-600">{stock.name}</div>
                      </div>
                    </div>
                    <div className={`text-2xl font-bold transition-all duration-200 hover:scale-110 ${changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {changePercent >= 0 ? '+' : ''}{changePercent}%
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderWatchlist = () => (
    <div className="grid grid-cols-4 grid-rows-3 gap-4 h-full">
      {/* Header with Add Button */}
      <div className="col-span-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <Eye className="h-6 w-6 mr-3" />
              Watchlist
            </h2>
            <p className="text-purple-100 text-sm">Stocks you're tracking</p>
          </div>
          <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg border border-white/30">
            <Plus className="h-4 w-4 inline mr-2" />
            Add Stock
          </button>
        </div>
      </div>
      
      {/* Watchlist Grid - Scrollable */}
      <div className="col-span-4 row-span-2 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {watchlist.map((stock) => (
              <div key={stock.symbol} className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${stock.color} rounded-xl flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-shadow duration-200`}>
                      {stock.symbol[0]}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{stock.symbol}</div>
                      <div className="text-gray-600 text-sm">{stock.name}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="font-bold text-gray-900 text-lg">${stock.price}</div>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105 ${
                        stock.change >= 0 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}>
                        {stock.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                      </div>
                    </div>
                    <button className="text-yellow-500 hover:text-yellow-600 transition-all duration-200 hover:scale-125 active:scale-95">
                      <Star className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Additional demo watchlist items for scrolling */}
            {[...Array(8)].map((_, index) => (
              <div key={`watch-demo-${index}`} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer opacity-60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      {String.fromCharCode(68 + index)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-600">DEMO{index + 1}</div>
                      <div className="text-gray-500 text-sm">Demo Corp {index + 1}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="font-bold text-gray-600 text-lg">${(50 + index * 25).toFixed(2)}</div>
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-600">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +{(0.5 + index * 0.3).toFixed(1)}%
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-500 transition-all duration-200 hover:scale-125 active:scale-95">
                      <Star className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "holdings":
        return renderHoldings();
      case "performance":
        return renderPerformance();
      case "watchlist":
        return renderWatchlist();
      case "browse":
        return renderBrowseStocks();
      default:
        return renderOverview();
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
      <header className="relative z-20 bg-white/10 backdrop-blur-xl border-b border-white/20 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                <Sparkles className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg lg:text-2xl font-bold text-white">Portfolio Pro</h1>
                <p className="text-gray-300 text-xs lg:text-sm hidden sm:block">Next-gen investment dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 lg:space-x-3">
              <button className="w-8 h-8 lg:w-10 lg:h-10 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-all duration-200 border border-white/20">
                <Search className="h-3 w-3 lg:h-4 lg:w-4" />
              </button>
              <button className="w-8 h-8 lg:w-10 lg:h-10 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-all duration-200 border border-white/20">
                <Bell className="h-3 w-3 lg:h-4 lg:w-4" />
              </button>
              <button className="w-8 h-8 lg:w-10 lg:h-10 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-all duration-200 border border-white/20">
                <Settings className="h-3 w-3 lg:h-4 lg:w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="relative z-20 bg-white/5 backdrop-blur-xl border-b border-white/10 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-3 px-3 lg:px-4 rounded-t-xl font-semibold transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white/20 backdrop-blur-md text-white border-b-2 border-cyan-400 shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="text-xs lg:text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 lg:px-6 py-4 flex-1 overflow-hidden">
        <div className="h-full">
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