import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, ArrowUpRight, Activity, Zap, Eye, Plus, FileText, Download, Share, Target, Calendar, Bookmark } from 'lucide-react';
import { exportPortfolioToCSV, sharePortfolioLink } from '../utils/exportUtils';


const Overview = ({ portfolioData, portfolio, watchlist, performanceData, handleTradeStock, setActiveTab }) => {
  // Calculate real portfolio value from holdings
  const realTotalValue = portfolio.holdings?.reduce((sum, stock) => sum + (stock.shares * stock.current_price), 0) || 0;
  const realTotalInvested = portfolio.holdings?.reduce((sum, stock) => sum + (stock.shares * stock.avg_price), 0) || 0;
  const realTotalGain = realTotalValue - realTotalInvested;
  const realTotalGainPercent = realTotalInvested > 0 ? ((realTotalGain / realTotalInvested) * 100).toFixed(1) : 0;

  return (
    <div className="flex flex-col gap-3 h-full overflow-hidden">
      {/* Portfolio Value - Compact Header */}
      <div className="glass-gradient-header rounded-xl p-3 lg:p-4 flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
        <div className="absolute top-0 right-0 w-16 h-16 lg:w-24 lg:h-24 bg-gradient-to-bl from-cyan-400/30 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-tr from-pink-400/30 to-transparent rounded-full blur-xl"></div>

        <div className="relative z-10">
          <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-5 min-w-0 flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-200 shadow-lg flex-shrink-0">
                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-white/80 text-sm sm:text-base lg:text-lg">Total Portfolio Value</h2>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">${realTotalValue.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between lg:justify-end lg:space-x-4 xl:space-x-6 space-x-3 sm:space-x-4 flex-shrink-0">
              <div className="text-center min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center mx-auto mb-1 border border-white/30 hover:scale-110 transition-transform duration-200">
                  <TrendingUp className="h-4 w-4 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-green-400" />
                </div>
                <div className="text-sm sm:text-base lg:text-lg font-bold text-green-400">+{portfolioData.dayChangePercent}%</div>
                <div className="text-white/80 text-xs sm:text-xs lg:text-sm">Today</div>
                <div className="text-white text-xs sm:text-sm lg:text-base font-bold">+${portfolioData.dayChange.toLocaleString()}</div>
              </div>
              
              <div className="text-center min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center mx-auto mb-1 border border-white/30 hover:scale-110 transition-transform duration-200">
                  <ArrowUpRight className="h-4 w-4 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-purple-400" />
                </div>
                <div className="text-sm sm:text-base lg:text-lg font-bold text-purple-400">+{realTotalGainPercent}%</div>
                <div className="text-white/80 text-xs sm:text-xs lg:text-sm">All Time</div>
                <div className="text-white text-xs sm:text-sm lg:text-base font-bold">+${realTotalGain.toLocaleString()}</div>
              </div>
              
              <div className="text-center min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center mx-auto mb-1 border border-white/30 hover:scale-110 transition-transform duration-200">
                  <BarChart3 className="h-4 w-4 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-cyan-400" />
                </div>
                <div className="text-sm sm:text-base lg:text-lg font-bold text-cyan-400">{portfolio.holdings?.length || 0}</div>
                <div className="text-white/80 text-xs sm:text-xs lg:text-sm">Positions</div>
                <div className="text-white text-xs sm:text-sm lg:text-base font-bold">Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0 overflow-hidden">
        {/* Holdings Preview - Financial Data Priority */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3 glass-container flex flex-col min-h-0 max-h-full">
          <div className="glass-gradient-section p-4 rounded-t-2xl flex-shrink-0">
            <h3 className="text-sm lg:text-lg font-bold text-gray-900 flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-purple-600" />
                <span>Holdings</span>
              </div>
              <div className="text-xs lg:text-sm text-purple-600 font-semibold">${realTotalValue.toLocaleString()}</div>
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {portfolio.holdings?.map((stock) => {
              const value = stock.shares * stock.current_price;
              const change = stock.current_price - stock.avg_price;
              const changePercent = ((change) / stock.avg_price * 100).toFixed(2);
              const colorClass = change >= 0 ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600';
              return (
                <div key={stock.symbol} className="glass-holding-card p-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${colorClass} rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0`}>
                      {stock.symbol[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 text-sm mb-1 truncate">{stock.symbol}</div>
                      <div className="text-gray-600 text-xs truncate">{stock.shares} shares @ ${stock.avg_price}</div>
                    </div>
                    <div className="text-right flex-shrink-0 min-w-[80px]">
                      <div className="font-bold text-gray-900 text-sm mb-1">${value.toLocaleString()}</div>
                      <div className={`text-xs font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {change >= 0 ? '+' : ''}{changePercent}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            }) || []}
          </div>
        </div>

        {/* Enhanced Performance Section with Chart */}
        <div className="col-span-12 md:col-span-8 lg:col-span-6 flex flex-col gap-3 min-h-0">
          {/* Performance Metrics & Chart */}
          <div className="bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-2xl p-3 lg:p-4 text-white shadow-xl relative overflow-hidden flex-1 min-h-0">
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent backdrop-blur-3xl"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
            <div className="relative z-10 h-full flex flex-col min-h-0">
              <h3 className="text-lg lg:text-xl font-bold mb-3 flex items-center flex-shrink-0">
                <Activity className="h-5 w-5 lg:h-6 lg:w-6 mr-2 lg:mr-3" />
                Performance Analytics
              </h3>
              
              {/* Metrics Row - Using Real Data */}
              <div className="flex justify-around gap-2 lg:gap-4 mb-3 lg:mb-4 flex-shrink-0">
                <div className="text-center flex-1 min-w-0">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white/20 backdrop-blur-md rounded-lg lg:rounded-xl flex items-center justify-center mx-auto mb-1 lg:mb-2 border border-white/30 hover:scale-110 transition-transform duration-200 cursor-pointer">
                    <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5" />
                  </div>
                  <div className="text-lg lg:text-xl font-bold mb-1">+{realTotalGainPercent}%</div>
                  <div className="text-xs lg:text-sm opacity-90">Total Return</div>
                </div>
                <div className="text-center flex-1 min-w-0">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white/20 backdrop-blur-md rounded-lg lg:rounded-xl flex items-center justify-center mx-auto mb-1 lg:mb-2 border border-white/30 hover:scale-110 transition-transform duration-200 cursor-pointer">
                    <Activity className="h-4 w-4 lg:h-5 lg:w-5" />
                  </div>
                  <div className="text-lg lg:text-xl font-bold mb-1">{portfolioData.dayChangePercent}%</div>
                  <div className="text-xs lg:text-sm opacity-90">Today's Return</div>
                </div>
                <div className="text-center flex-1 min-w-0">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white/20 backdrop-blur-md rounded-lg lg:rounded-xl flex items-center justify-center mx-auto mb-1 lg:mb-2 border border-white/30 hover:scale-110 transition-transform duration-200 cursor-pointer">
                    <BarChart3 className="h-4 w-4 lg:h-5 lg:w-5" />
                  </div>
                  <div className="text-lg lg:text-xl font-bold mb-1">${(realTotalValue / (portfolio.holdings?.length || 1)).toFixed(0)}</div>
                  <div className="text-xs lg:text-sm opacity-90">Avg Position</div>
                </div>
              </div>

              {/* Performance Chart - CSS Based */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 lg:p-4 border border-white/20 flex-1 min-h-0 flex flex-col">
                <div className="flex items-center justify-between mb-2 lg:mb-3 flex-shrink-0">
                  <span className="text-xs lg:text-sm font-semibold">7-Month Trend</span>
                  <span className="text-xs opacity-75">Portfolio Growth</span>
                </div>
                <div className="flex-1 flex items-end justify-between space-x-1 lg:space-x-2 mb-2 lg:mb-3 min-h-0">
                  {performanceData.map((item, index) => (
                    <div key={item.date} className="flex flex-col items-center space-y-1 flex-1 min-w-0">
                      <div 
                        className="w-full bg-white/30 rounded-t-sm transition-all duration-500 hover:bg-white/50 cursor-pointer"
                        style={{ 
                          height: `${Math.max((item.value - 95000) / 1000, 8)}px`,
                          minHeight: '6px',
                          maxHeight: '60px'
                        }}
                      ></div>
                      <span className="text-xs opacity-75 truncate">{item.date}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-xs opacity-75 flex-shrink-0">
                  <span className="truncate">${Math.min(...performanceData.map(d => d.value)).toLocaleString()}</span>
                  <span className="font-semibold text-green-300 px-2 truncate">+{portfolioData.totalGainPercent}% Growth</span>
                  <span className="truncate">${Math.max(...performanceData.map(d => d.value)).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-3 border border-white/30 shadow-xl flex-shrink-0">
            <h4 className="text-sm lg:text-lg font-bold text-gray-900 mb-2 flex items-center">
              <Zap className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-indigo-600" />
              Quick Actions
            </h4>
            <div className="grid grid-cols-6 gap-2">
                            <button className="bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-xl p-2 text-center transition-all duration-200 hover:scale-105 active:scale-95 border border-indigo-200 group">
                <FileText className="h-3 w-3 lg:h-4 lg:w-4 mx-auto mb-1 text-indigo-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-xs font-semibold text-gray-700">Reports</div>
              </button>
              
              <button 
                onClick={() => exportPortfolioToCSV(portfolio, portfolioData)}
                className="bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl p-2 text-center transition-all duration-200 hover:scale-105 active:scale-95 border border-green-200 group"
              >
                <Download className="h-3 w-3 lg:h-4 lg:w-4 mx-auto mb-1 text-green-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-xs font-semibold text-gray-700">Export</div>
              </button>
              
              <button 
                onClick={() => sharePortfolioLink(portfolio, portfolioData)}
                className="glass-button text-center group"
              >
                <Share className="h-3 w-3 lg:h-4 lg:w-4 mx-auto mb-1 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-xs font-semibold text-gray-700">Share</div>
              </button>
              
              <button className="glass-button text-center">
                <Target className="h-3 w-3 lg:h-4 lg:w-4 mx-auto mb-1 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-xs font-semibold text-gray-700">Goals</div>
              </button>
              
              <button className="glass-button text-center">
                <Calendar className="h-3 w-3 lg:h-4 lg:w-4 mx-auto mb-1 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-xs font-semibold text-gray-700">Calendar</div>
              </button>
              
              <button className="glass-button text-center">
                <Bookmark className="h-3 w-3 lg:h-4 lg:w-4 mx-auto mb-1 text-cyan-600 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-xs font-semibold text-gray-700">Saved</div>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Watchlist & Actions - Premium UX */}
        <div className="col-span-12 md:col-span-12 lg:col-span-3 flex flex-col gap-3 min-h-0 max-h-full">
          {/* Premium Watchlist - Glassmorphism Design */}
          <div className="flex-1 glass-container min-h-0 max-h-full">
            <div className="glass-panel h-full flex flex-col min-h-0">
              <div className="p-3 border-b border-white/20 glass-gradient-section rounded-t-xl flex-shrink-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm lg:text-lg font-bold text-gray-900 flex items-center">
                    <Eye className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-purple-600" />
                    Watchlist
                  </h3>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-xs text-purple-700 font-medium">Market opportunities</p>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-0">
                {watchlist.map((stock) => (
                  <div key={stock.symbol} className="glass-watchlist-item">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <div className={`w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r ${stock.color} rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg group-hover:shadow-xl transition-shadow duration-200`}>
                          {stock.symbol[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-gray-900 text-xs lg:text-sm">{stock.symbol}</div>
                          <div className="text-gray-600 text-xs truncate">{stock.name.split(' ')[0]}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 text-xs lg:text-sm">${stock.price}</div>
                        <div className={`text-xs font-semibold flex items-center justify-end ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.change >= 0 ? <TrendingUp className="h-2 w-2 lg:h-3 lg:w-3 mr-1" /> : <TrendingDown className="h-2 w-2 lg:h-3 lg:w-3 mr-1" />}
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="w-full glass-button-secondary text-xs lg:text-sm">
                  <Plus className="h-3 w-3 lg:h-4 lg:w-4 inline mr-2" />
                  Add Symbol
                </button>
              </div>
            </div>
          </div>

          {/* Trading Actions */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-3 text-white shadow-xl relative overflow-hidden flex-shrink-0">
            <div className="absolute top-0 right-0 w-12 h-12 bg-white/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <h3 className="text-xs lg:text-sm font-bold mb-2 flex items-center">
                <Zap className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                Trading
              </h3>
              <div className="space-y-2">
                <button 
                  onClick={() => {
                    setActiveTab('browse');
                  }}
                  className="w-full bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl p-2 text-center transition-all duration-200 border border-white/30 hover:scale-105 active:scale-95 group"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Plus className="h-3 w-3 lg:h-4 lg:w-4 group-hover:rotate-90 transition-transform duration-200" />
                    <span className="font-semibold text-xs">Buy Order</span>
                  </div>
                </button>
                
                <button 
                  onClick={() => {
                    setActiveTab('performance');
                  }}
                  className="w-full bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl p-2 text-center transition-all duration-200 border border-white/30 hover:scale-105 active:scale-95 group"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Activity className="h-3 w-3 lg:h-4 lg:w-4 group-hover:scale-110 transition-transform duration-200" />
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
};

export default Overview;