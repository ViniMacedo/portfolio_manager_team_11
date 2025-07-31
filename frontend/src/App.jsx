import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, Activity, Eye, Star, Sparkles, Zap, ArrowUpRight, Plus, Bell, Settings, Search } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // sample data
  const portfolioData = {
    totalValue: 125430.50,
    dayChange: 2845.30,
    dayChangePercent: 2.32,
    totalGain: 18745.50,
    totalGainPercent: 17.5
  };

  const stocks = [
    { symbol: 'AAPL', name: 'Apple Inc', shares: 50, price: 185.32, change: 2.45, changePercent: 1.34, value: 9266, color: 'from-blue-500 to-cyan-400' },
    { symbol: 'GOOGL', name: 'Alphabet Inc', shares: 25, price: 142.87, change: -1.23, changePercent: -0.85, value: 3571.75, color: 'from-emerald-500 to-teal-400' },
    { symbol: 'MSFT', name: 'Microsoft Corp', shares: 75, price: 378.45, change: 5.67, changePercent: 1.52, value: 28383.75, color: 'from-purple-500 to-pink-400' },
    { symbol: 'TSLA', name: 'Tesla Inc', shares: 30, price: 248.90, change: -8.45, changePercent: -3.28, value: 7467, color: 'from-orange-500 to-red-400' },
    { symbol: 'AMZN', name: 'Amazon.com Inc', shares: 40, price: 156.78, change: 3.21, changePercent: 2.09, value: 6271.20, color: 'from-indigo-500 to-blue-400' }
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
    { id: 'watchlist', label: 'Watchlist', icon: Eye }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Hero Stats */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 rounded-3xl p-8 md:p-12">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-400/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-pink-400/30 to-transparent rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-white/80 text-lg">Portfolio Value</h2>
              <p className="text-5xl md:text-6xl font-bold text-white">${portfolioData.totalValue.toLocaleString()}</p>
            </div>

          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="h-8 w-8 text-green-400" />
                <span className="text-green-400 text-2xl font-bold">+{portfolioData.dayChangePercent}%</span>
              </div>
              <p className="text-white/80 text-sm mb-2">Today's Gain</p>
              <p className="text-white text-2xl font-bold">+${portfolioData.dayChange.toLocaleString()}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <ArrowUpRight className="h-8 w-8 text-purple-400" />
                <span className="text-purple-400 text-2xl font-bold">+{portfolioData.totalGainPercent}%</span>
              </div>
              <p className="text-white/80 text-sm mb-2">Total Return</p>
              <p className="text-white text-2xl font-bold">+${portfolioData.totalGain.toLocaleString()}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="h-8 w-8 text-cyan-400" />
                <span className="text-cyan-400 text-2xl font-bold">{stocks.length}</span>
              </div>
              <p className="text-white/80 text-sm mb-2">Active Positions</p>
              <p className="text-white text-2xl font-bold">Holdings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Holdings*/}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Sparkles className="h-6 w-6 mr-3 text-purple-600" />
            Top Performers
          </h3>
          <div className="space-y-4">
            {stocks.slice(0, 3).map((stock, index) => (
              <div key={stock.symbol} className="group hover:scale-105 transition-all duration-300">
                <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-14 h-14 bg-gradient-to-r ${stock.color} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                        {stock.symbol[0]}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-lg">{stock.symbol}</div>
                        <div className="text-gray-600 text-sm">{stock.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900 text-xl">${stock.value.toLocaleString()}</div>
                      <div className={`text-sm flex items-center justify-end ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                        <span className="font-semibold">{stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <Zap className="h-6 w-6 mr-3" />
              Quick Actions
            </h3>
            <div className="space-y-4">
              <button className="w-full bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-2xl p-4 text-left transition-all duration-300 hover:scale-105 border border-white/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Buy More Stocks</div>
                    <div className="text-sm opacity-80">Add to your portfolio</div>
                  </div>
                  <Plus className="h-6 w-6" />
                </div>
              </button>
              
              <button className="w-full bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-2xl p-4 text-left transition-all duration-300 hover:scale-105 border border-white/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">View Analytics</div>
                    <div className="text-sm opacity-80">Detailed performance</div>
                  </div>
                  <Activity className="h-6 w-6" />
                </div>
              </button>
              
              <button className="w-full bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-2xl p-4 text-left transition-all duration-300 hover:scale-105 border border-white/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Set Alerts</div>
                    <div className="text-sm opacity-80">Price notifications</div>
                  </div>
                  <Bell className="h-6 w-6" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHoldings = () => (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/30">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Your Holdings</h2>
        <p className="text-indigo-100">Complete overview of your stock positions</p>
      </div>
      
      <div className="p-8">
        <div className="grid gap-6">
          {stocks.map((stock) => (
            <div key={stock.symbol} className="group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${stock.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                      {stock.symbol[0]}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-xl">{stock.symbol}</div>
                      <div className="text-gray-600 mb-2">{stock.name}</div>
                      <div className="text-sm text-gray-500">{stock.shares} shares</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-gray-900 text-2xl mb-1">${stock.value.toLocaleString()}</div>
                    <div className="text-gray-600 text-lg mb-2">${stock.price}</div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      stock.change >= 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {stock.change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent backdrop-blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <Zap className="h-8 w-8 mr-4" />
            Performance Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
                <TrendingUp className="h-10 w-10" />
              </div>
              <div className="text-4xl font-bold mb-2">+17.5%</div>
              <div className="text-lg opacity-90">Total Return</div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
                <BarChart3 className="h-10 w-10" />
              </div>
              <div className="text-4xl font-bold mb-2">+8.2%</div>
              <div className="text-lg opacity-90">YTD Return</div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
                <Activity className="h-10 w-10" />
              </div>
              <div className="text-4xl font-bold mb-2">12.4%</div>
              <div className="text-lg opacity-90">Volatility</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Performance Ranking</h3>
        <div className="space-y-4">
          {stocks.sort((a, b) => b.changePercent - a.changePercent).map((stock, index) => (
            <div key={stock.symbol} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                  index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                  index === 2 ? 'bg-gradient-to-r from-orange-400 to-red-500' :
                  'bg-gradient-to-r from-gray-300 to-gray-400'
                }`}>
                  {index + 1}
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stock.color} rounded-xl flex items-center justify-center text-white font-bold`}>
                  {stock.symbol[0]}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{stock.symbol}</div>
                  <div className="text-sm text-gray-600">{stock.name}</div>
                </div>
              </div>
              <div className={`text-2xl font-bold ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWatchlist = () => (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center">
          <Eye className="h-8 w-8 mr-4 text-purple-600" />
          Watchlist
        </h2>
        <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
          <Plus className="h-5 w-5 inline mr-2" />
          Add Stock
        </button>
      </div>
      
      <div className="space-y-6">
        {watchlist.map((stock) => (
          <div key={stock.symbol} className="group hover:scale-105 transition-all duration-300">
            <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${stock.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                    {stock.symbol[0]}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-xl">{stock.symbol}</div>
                    <div className="text-gray-600">{stock.name}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="font-bold text-gray-900 text-2xl">${stock.price}</div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      stock.change >= 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {stock.change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                    </div>
                  </div>
                  <button className="text-yellow-500 hover:text-yellow-600 transition-colors">
                    <Star className="h-6 w-6 hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
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
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-20 bg-white/10 backdrop-blur-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Portfolio Pro</h1>
                <p className="text-gray-300">Next-gen investment dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-2xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 border border-white/20">
                <Search className="h-5 w-5" />
              </button>
              <button className="w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-2xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 border border-white/20">
                <Bell className="h-5 w-5" />
              </button>
              <button className="w-12 h-12 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-2xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 border border-white/20">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="relative z-20 bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 py-4 px-6 rounded-t-2xl font-semibold transition-all duration-300 hover:scale-105 ${
                    activeTab === tab.id
                      ? 'bg-white/20 backdrop-blur-md text-white border-b-2 border-cyan-400 shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;