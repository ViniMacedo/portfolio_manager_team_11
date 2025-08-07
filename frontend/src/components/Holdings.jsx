import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const Holdings = ({ portfolio, setSelectedStock }) => {
  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header with Browse Banner Style */}
      <div className="glass-search-header">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 backdrop-blur-3xl"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-white/5 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white text-3xl font-bold tracking-tight drop-shadow-lg">Holdings</h2>
              <p className="text-white/90 text-lg font-medium">{portfolio.holdings.length} positions in your portfolio</p>
            </div>
            <div className="text-right">
              <div className="text-white text-2xl font-bold drop-shadow-lg">
                ${portfolio.holdings.reduce((total, stock) => {
                  const shares = stock.shares || stock.quantity || 0;
                  const currentPrice = stock.current_price || stock.price || 0;
                  return total + (shares * currentPrice);
                }, 0).toFixed(2)}
              </div>
              <p className="text-white/80 text-sm font-medium">Total Value</p>
            </div>
          </div>
        </div>
      </div>

      {/* Holdings Grid - Scrollable with 4 columns */}
      <div className="glass-data-grid flex-1">
        <div className="h-full overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {portfolio.holdings.map((stock) => {
              // Handle different property naming conventions
              const shares = stock.shares || stock.quantity || 0;
              const currentPrice = stock.current_price || stock.price || 0;
              const avgPrice = stock.avg_price || stock.average_cost || currentPrice;
              
              const value = shares * currentPrice;
              const change = currentPrice - avgPrice;
              const changePercent = avgPrice > 0 ? ((change) / avgPrice * 100).toFixed(2) : '0.00';
              const colorClass = change >= 0 ? 'from-indigo-500 to-indigo-700' : 'from-red-500 to-red-700';

              return (
                <div 
                  key={stock.symbol} 
                  className="glass-holding-card cursor-pointer p-4"
                  onClick={() => setSelectedStock(stock)}
                >
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 bg-gradient-to-r ${colorClass} rounded-xl flex items-center justify-center text-white font-bold shadow-lg`}>
                        {stock.symbol[0]}
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 text-sm">${value.toLocaleString()}</div>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                          change >= 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          {changePercent >= 0 ? '+' : ''}{changePercent}%
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{stock.symbol}</div>
                      <div className="text-gray-600 text-xs">{stock.name || stock.product_type || 'Stock'}</div>
                      <div className="text-xs text-gray-500">{shares} shares @ ${avgPrice.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Holdings;