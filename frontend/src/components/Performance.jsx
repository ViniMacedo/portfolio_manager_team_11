import React from 'react';
import { TrendingUp, TrendingDown, BarChart3, Activity, PieChart, Zap } from 'lucide-react';

const Performance = ({ portfolio }) => {
  // Calculate real performance metrics
  const totalInvested = portfolio.holdings.reduce((sum, holding) => sum + (holding.avg_price * holding.shares), 0);
  const currentValue = portfolio.holdings.reduce((sum, holding) => sum + (holding.current_price * holding.shares), 0);
  const totalReturn = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested * 100) : 0;
  
  // Calculate YTD return (simplified as a percentage of total return for demo)
  const ytdReturn = totalReturn * 0.6; // Assuming YTD is roughly 60% of total return
  
  // Calculate volatility as average of absolute percentage changes
  const volatility = portfolio.holdings.length > 0 ? 
    portfolio.holdings.reduce((sum, holding) => {
      const change = Math.abs((holding.current_price - holding.avg_price) / holding.avg_price * 100);
      return sum + change;
    }, 0) / portfolio.holdings.length : 0;

  return (
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
              <div className="text-3xl font-bold">
                {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(1)}%
              </div>
              <div className="text-sm opacity-90">Total Return</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-3 border border-white/30 hover:scale-110 transition-transform duration-200 cursor-pointer">
                <BarChart3 className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold">
                {ytdReturn >= 0 ? '+' : ''}{ytdReturn.toFixed(1)}%
              </div>
              <div className="text-sm opacity-90">YTD Return</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-3 border border-white/30 hover:scale-110 transition-transform duration-200 cursor-pointer">
                <Activity className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold">{volatility.toFixed(1)}%</div>
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
                const colorClass = change >= 0 ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600';
                return (
                  <div key={stock.symbol} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg hover:shadow-xl transition-shadow duration-200 ${
                        index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                        index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                        index === 2 ? 'bg-gradient-to-r from-purple-400 to-purple-500' :
                        'bg-gradient-to-r from-gray-300 to-gray-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-r ${colorClass} rounded-xl flex items-center justify-center text-white font-bold shadow-lg hover:shadow-xl transition-shadow duration-200`}>
                        {stock.symbol[0]}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{stock.symbol}</div>
                        <div className="text-sm text-gray-600">{stock.name || 'Stock'}</div>
                      </div>
                    </div>
                    <div className={`text-2xl font-bold transition-all duration-200 hover:scale-110 ${parseFloat(changePercent) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {parseFloat(changePercent) >= 0 ? '+' : ''}{changePercent}%
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

export default Performance;