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
                ${portfolio.holdings.reduce((total, stock) => total + (stock.shares * stock.current_price), 0).toFixed(2)}
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
              const value = stock.shares * stock.current_price;
              const change = stock.current_price - stock.avg_price;
              const changePercent = ((change) / stock.avg_price * 100).toFixed(2);
              const colorClass = change >= 0 ? 'from-indigo-500 to-indigo-700' : 'from-red-500 to-red-700';

              // Create stock object for flyout
              const stockForFlyout = {
                symbol: stock.symbol,
                name: stock.product_type || 'Stock',
                price: stock.current_price,
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
                  className="glass-holding-card cursor-pointer"
                  onClick={() => setSelectedStock(stockForFlyout)}
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
                      <div className="text-gray-600 text-xs">{stock.product_type || 'Stock'}</div>
                      <div className="text-xs text-gray-500">{stock.shares} shares @ ${stock.avg_price}</div>
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