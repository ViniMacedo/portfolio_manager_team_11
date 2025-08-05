import React from 'react';
import { Eye, Plus, TrendingUp, TrendingDown, Star } from 'lucide-react';

const Watchlist = ({ watchlist }) => {
  return (
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
};

export default Watchlist;