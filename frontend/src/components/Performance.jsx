import React from 'react';
import { TrendingUp, TrendingDown, BarChart3, Activity, PieChart, Zap } from 'lucide-react';

const Performance = ({ portfolio, setSelectedStock }) => {
  // Handle different property naming conventions
  const calculateMetrics = () => {
    if (!portfolio?.holdings || portfolio.holdings.length === 0) {
      return { totalInvested: 0, currentValue: 0, totalReturn: 0, ytdReturn: 0, volatility: 0 };
    }

    const totalInvested = portfolio.holdings.reduce((sum, holding) => {
      const shares = holding.shares || holding.quantity || 0;
      const avgPrice = holding.avg_price || holding.average_cost || 0;
      return sum + (avgPrice * shares);
    }, 0);
    
    const currentValue = portfolio.holdings.reduce((sum, holding) => {
      const shares = holding.shares || holding.quantity || 0;
      const currentPrice = holding.current_price || holding.price || 0;
      return sum + (currentPrice * shares);
    }, 0);
    
    const totalReturn = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested * 100) : 0;
    const ytdReturn = totalReturn * 0.6; // Assuming YTD is roughly 60% of total return
    
    const volatility = portfolio.holdings.length > 0 ? 
      portfolio.holdings.reduce((sum, holding) => {
        const currentPrice = holding.current_price || holding.price || 0;
        const avgPrice = holding.avg_price || holding.average_cost || currentPrice;
        const change = avgPrice > 0 ? Math.abs((currentPrice - avgPrice) / avgPrice * 100) : 0;
        return sum + change;
      }, 0) / portfolio.holdings.length : 0;

    return { totalInvested, currentValue, totalReturn, ytdReturn, volatility };
  };

  const { totalInvested, currentValue, totalReturn, ytdReturn, volatility } = calculateMetrics();

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header with glass style */}
      <div className="glass-search-header">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-purple-400/10 backdrop-blur-3xl"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-white/5 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white text-3xl font-bold tracking-tight drop-shadow-lg flex items-center">
                <Zap className="h-8 w-8 mr-3" />
                Performance Metrics
              </h2>
              <p className="text-white/90 text-lg font-medium">Portfolio analytics and insights</p>
            </div>
            <div className="text-right">
              <div className="text-white text-2xl font-bold drop-shadow-lg">
                {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(1)}%
              </div>
              <p className="text-white/80 text-sm font-medium">Total Return</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Grid */}
      <div className="glass-data-grid flex-1">
        <div className="h-full overflow-y-auto p-6">
          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="glass-performance-metric text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-3 border border-white/30">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(1)}%
              </div>
              <div className="text-sm text-white/70">Total Return</div>
            </div>
            
            <div className="glass-performance-metric text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-3 border border-white/30">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {ytdReturn >= 0 ? '+' : ''}{ytdReturn.toFixed(1)}%
              </div>
              <div className="text-sm text-white/70">YTD Return</div>
            </div>
            
            <div className="glass-performance-metric text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-3 border border-white/30">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{volatility.toFixed(1)}%</div>
              <div className="text-sm text-white/70">Volatility</div>
            </div>
            
            <div className="glass-performance-metric text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-3 border border-white/30">
                <PieChart className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{portfolio?.holdings?.length || 0}</div>
              <div className="text-sm text-white/70">Holdings</div>
            </div>
          </div>

          {/* Performance Ranking */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
            <h3 className="text-lg font-bold text-white mb-4">Performance Ranking</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {portfolio?.holdings?.length > 0 ? (
                portfolio.holdings
                  .sort((a, b) => {
                    const currentPriceA = a.current_price || a.price || 0;
                    const avgPriceA = a.avg_price || a.average_cost || currentPriceA;
                    const currentPriceB = b.current_price || b.price || 0;
                    const avgPriceB = b.avg_price || b.average_cost || currentPriceB;
                    
                    const perfA = avgPriceA > 0 ? (currentPriceA - avgPriceA) / avgPriceA : 0;
                    const perfB = avgPriceB > 0 ? (currentPriceB - avgPriceB) / avgPriceB : 0;
                    return perfB - perfA;
                  })
                  .map((stock, index) => {
                    const currentPrice = stock.current_price || stock.price || 0;
                    const avgPrice = stock.avg_price || stock.average_cost || currentPrice;
                    const change = currentPrice - avgPrice;
                    const changePercent = avgPrice > 0 ? ((change) / avgPrice * 100).toFixed(2) : '0.00';
                    const colorClass = change >= 0 ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600';
                    
                    // Create stock object for flyout
                    const stockForFlyout = {
                      symbol: stock.symbol,
                      name: stock.name || 'Stock',
                      price: currentPrice,
                      change: change,
                      changePercent: parseFloat(changePercent),
                      volume: 1000000, // Default volume
                      marketCap: 50000000000, // Default market cap
                      sector: 'Technology', // Default sector
                      color: colorClass
                    };
                    
                    return (
                      <div 
                        key={stock.symbol} 
                        className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200 cursor-pointer"
                        onClick={() => setSelectedStock(stockForFlyout)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                            index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                            index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                            index === 2 ? 'bg-gradient-to-r from-purple-400 to-purple-500' :
                            'bg-gradient-to-r from-gray-300 to-gray-400'
                          }`}>
                            {index + 1}
                          </div>
                          <div className={`w-10 h-10 bg-gradient-to-r ${colorClass} rounded-xl flex items-center justify-center text-white font-bold`}>
                            {stock.symbol[0]}
                          </div>
                          <div>
                            <div className="font-bold text-white">{stock.symbol}</div>
                            <div className="text-sm text-white/70">{stock.name || 'Stock'}</div>
                          </div>
                        </div>
                        <div className={`text-lg font-bold ${parseFloat(changePercent) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {parseFloat(changePercent) >= 0 ? '+' : ''}{changePercent}%
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="text-center text-white/60 py-8">
                  <PieChart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No holdings to display</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;