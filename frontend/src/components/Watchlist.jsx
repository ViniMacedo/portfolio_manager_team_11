import React from 'react';
import { Eye, Plus, TrendingUp, TrendingDown, Star } from 'lucide-react';

const Watchlist = ({ watchlist, setSelectedStock }) => {
  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header with glass style */}
      <div className="glass-search-header">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-pink-400/10 backdrop-blur-3xl"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-white/5 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white text-3xl font-bold tracking-tight drop-shadow-lg flex items-center">
                <Eye className="h-8 w-8 mr-3" />
                Watchlist
              </h2>
              <p className="text-white/90 text-lg font-medium">Stocks you're tracking</p>
            </div>
            <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg border border-white/30">
              <Plus className="h-5 w-5 inline mr-2" />
              Add Stock
            </button>
          </div>
        </div>
      </div>

      {/* Watchlist Grid */}
      <div className="glass-data-grid flex-1">
        <div className="h-full overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {watchlist.map((stock) => {
              // Create stock object for flyout
              const stockForFlyout = {
                symbol: stock.symbol,
                name: stock.name,
                price: stock.price,
                change: stock.change,
                changePercent: stock.changePercent,
                volume: 1000000, // Default volume
                marketCap: 50000000000, // Default market cap
                sector: 'Technology', // Default sector
                color: stock.color
              };

              return (
                <div 
                  key={stock.symbol} 
                  className="glass-watchlist-item p-4"
                  onClick={() => setSelectedStock(stockForFlyout)}
                >
                  <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${stock.color} rounded-xl flex items-center justify-center text-white font-bold shadow-lg`}>
                      {stock.symbol[0]}
                    </div>
                    <div>
                      <div className="font-bold text-white">{stock.symbol}</div>
                      <div className="text-white/70 text-sm">{stock.name}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="font-bold text-white text-lg">${stock.price}</div>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        stock.change >= 0 
                          ? 'bg-green-400/20 text-green-300 border border-green-400/30' 
                          : 'bg-red-400/20 text-red-300 border border-red-400/30'
                      }`}>
                        {stock.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                      </div>
                    </div>
                    <button className="text-yellow-400 hover:text-yellow-300 transition-all duration-200 hover:scale-125 active:scale-95">
                      <Star className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
            
            {/* Additional demo watchlist items */}
            {[...Array(8)].map((_, index) => (
              <div key={`watch-demo-${index}`} className="glass-watchlist-item p-4 opacity-60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                      {String.fromCharCode(68 + index)}
                    </div>
                    <div>
                      <div className="font-bold text-white/60">DEMO{index + 1}</div>
                      <div className="text-white/40 text-sm">Demo Corp {index + 1}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="font-bold text-white/60 text-lg">${(50 + index * 25).toFixed(2)}</div>
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-400/20 text-gray-300 border border-gray-400/30">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +{(0.5 + index * 0.3).toFixed(1)}%
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-300 transition-all duration-200 hover:scale-125 active:scale-95">
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
};

export default Watchlist;