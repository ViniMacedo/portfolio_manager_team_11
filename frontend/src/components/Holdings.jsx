import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const Holdings = ({ portfolio }) => {
  return (
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
              const colorClass = change >= 0 ? 'from-indigo-500 to-indigo-700' : 'from-red-500 to-red-700';

              return (
                <div key={stock.symbol} className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${colorClass} rounded-xl flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-shadow duration-200`}>
                        {stock.symbol[0]}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{stock.symbol}</div>
                        <div className="text-gray-600 text-sm">{stock.product_type || 'Stock'}</div>
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
};

export default Holdings;