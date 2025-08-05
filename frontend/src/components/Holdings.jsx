import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const Holdings = ({ portfolio, setSelectedStock }) => {
  return (
    <div className="grid grid-cols-4 grid-rows-3 gap-4 h-full">
      {/* Header Card - Much Smaller */}
      <div className="col-span-4 glass-card p-2 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold">Holdings</h2>
            <p className="text-white/70 text-xs">{portfolio.holdings.length} positions</p>
          </div>
        </div>
      </div>

      {/* Holdings Grid - Scrollable with 4 columns */}
      <div className="col-span-4 row-span-2 glass-data-grid">
        <div className="flex-1 overflow-y-auto p-4">
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