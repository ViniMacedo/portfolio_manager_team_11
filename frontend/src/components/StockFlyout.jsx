import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, LineChart, BarChart3, Plus, Minus, Star } from 'lucide-react';

const StockFlyout = ({ stock, onClose, onTradeStock, holdings = [], userBalance = 0 }) => {
  const [quantity, setQuantity] = useState(1);
  
  // Find current holdings for this stock
  const currentHolding = holdings.find(h => h.symbol === stock.symbol);
  const currentShares = currentHolding?.shares || 0;
  
  // Calculate total price
  const totalPrice = (stock.price || 0) * quantity;
  
  const handleBuyStock = () => {
    if (onTradeStock && quantity > 0) {
      onTradeStock(stock.symbol, 'BUY', quantity, stock.price);
    }
  };

  const handleSellStock = () => {
    if (onTradeStock && quantity > 0 && quantity <= currentShares) {
      onTradeStock(stock.symbol, 'SELL', quantity, stock.price);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, value));
  };
  // Generate sample chart data for selected stock
  const generateChartData = (stock) => {
    const basePrice = stock.price;
    const data = [];
    for (let i = 30; i >= 0; i--) {
      const variance = (Math.random() - 0.5) * 0.1;
      const price = basePrice * (1 + variance - (i * 0.002));
      data.push({
        day: 30 - i,
        price: Math.max(price, basePrice * 0.8),
        volume: Math.floor(Math.random() * 50000000) + 10000000
      });
    }
    return data;
  };

  const formatMarketCap = (value) => {
    if (value >= 1000000000000) {
      return `$${(value / 1000000000000).toFixed(2)}T`;
    } else if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    return `$${value.toLocaleString()}`;
  };

  const formatVolume = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  const chartData = generateChartData(stock);
  const maxPrice = Math.max(...chartData.map(d => d.price));
  const minPrice = Math.min(...chartData.map(d => d.price));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${stock.color} p-6 text-white relative`}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-lg flex items-center justify-center transition-all duration-200"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">{stock.symbol}</h2>
              <p className="text-lg opacity-90">{stock.name}</p>
              <p className="text-sm opacity-75">{stock.sector || 'Unknown'}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">${(stock.price || 0).toFixed(2)}</div>
              <div className={`text-xl font-semibold flex items-center justify-end ${(stock.changePercent || 0) >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                {(stock.changePercent || 0) >= 0 ? <TrendingUp className="h-5 w-5 mr-1" /> : <TrendingDown className="h-5 w-5 mr-1" />}
                {(stock.changePercent || 0) >= 0 ? '+' : ''}{(stock.changePercent || 0).toFixed(2)}% (${(stock.change || 0) >= 0 ? '+' : ''}{(stock.change || 0).toFixed(2)})
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto">
          {/* Chart Section */}
          <div className="col-span-2 space-y-6">
            {/* Price Chart */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <LineChart className="h-5 w-5 mr-2 text-blue-600" />
                30-Day Price Trend
              </h3>
              <div className="h-48 flex items-end justify-between space-x-1">
                {chartData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center space-y-1 flex-1">
                    <div 
                      className="w-full bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600 cursor-pointer"
                      style={{ 
                        height: `${Math.max(((item.price - minPrice) / (maxPrice - minPrice)) * 160, 4)}px`,
                        minHeight: '4px'
                      }}
                      title={`Day ${item.day}: $${item.price.toFixed(2)}`}
                    ></div>
                    {index % 5 === 0 && (
                      <span className="text-xs text-gray-500">{item.day}</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                <span>${minPrice.toFixed(2)}</span>
                <span className="font-semibold">30 Days</span>
                <span>${maxPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Volume Chart */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                Volume Trend
              </h3>
              <div className="h-24 flex items-end justify-between space-x-1">
                {chartData.slice(-14).map((item, index) => (
                  <div key={index} className="flex flex-col items-center space-y-1 flex-1">
                    <div 
                      className="w-full bg-green-500 rounded-t-sm transition-all duration-300 hover:bg-green-600 cursor-pointer"
                      style={{ 
                        height: `${Math.max((item.volume / 100000000) * 80, 4)}px`,
                        minHeight: '4px'
                      }}
                      title={`Volume: ${formatVolume(item.volume)}`}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="text-center text-xs text-gray-500 mt-2">14-Day Volume</div>
            </div>
          </div>

          {/* Stock Details and Actions */}
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-bold mb-4">Key Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Market Cap</span>
                  <span className="font-semibold">{formatMarketCap(stock.marketCap)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Volume</span>
                  <span className="font-semibold">{formatVolume(stock.volume)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sector</span>
                  <span className="font-semibold text-sm">{stock.sector}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">P/E Ratio</span>
                  <span className="font-semibold">{(15 + Math.random() * 20).toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">52W Range</span>
                  <span className="font-semibold text-sm">${((stock.price || 0) * 0.7).toFixed(0)} - ${((stock.price || 0) * 1.3).toFixed(0)}</span>
                </div>
              </div>
            </div>

            {/* Current Holdings */}
            {currentShares > 0 && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h3 className="text-lg font-bold mb-2 text-blue-900">Your Holdings</h3>
                <div className="flex justify-between">
                  <span className="text-blue-700">Shares Owned:</span>
                  <span className="font-semibold text-blue-900">{currentShares}</span>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-bold mb-4">Trade Quantity</h3>
              <div className="flex items-center justify-center space-x-4 mb-4">
                <button
                  onClick={decrementQuantity}
                  className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  className="w-20 text-center text-xl font-bold border-2 border-gray-300 rounded-lg py-2"
                />
                <button
                  onClick={incrementQuantity}
                  className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="text-center space-y-2">
                <div className="text-lg font-bold">Total: ${totalPrice.toFixed(2)}</div>
                <div className="text-sm text-gray-600">
                  {quantity} × ${(stock.price || 0).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Trading Actions */}
            <div className="space-y-3">
              <button 
                onClick={handleBuyStock}
                disabled={totalPrice > userBalance}
                className={`w-full rounded-xl p-4 font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg ${
                  totalPrice > userBalance 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Buy {quantity} {stock.symbol}</span>
                </div>
                <div className="text-sm opacity-90 mt-1">
                  {totalPrice > userBalance ? 'Insufficient Balance' : `Total: $${totalPrice.toFixed(2)}`}
                </div>
              </button>

              <button 
                onClick={handleSellStock}
                disabled={quantity > currentShares || currentShares === 0}
                className={`w-full rounded-xl p-4 font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg ${
                  quantity > currentShares || currentShares === 0
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <TrendingDown className="h-5 w-5" />
                  <span>Sell {quantity} {stock.symbol}</span>
                </div>
                <div className="text-sm opacity-90 mt-1">
                  {currentShares === 0 
                    ? 'No shares owned' 
                    : quantity > currentShares 
                      ? `Max: ${currentShares} shares` 
                      : `Receive: $${totalPrice.toFixed(2)}`}
                </div>
              </button>

              <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl p-4 font-bold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg">
                <div className="flex items-center justify-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Add to Watchlist</span>
                </div>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
              <h4 className="font-bold text-purple-900 mb-3">Quick Analysis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${stock.changePercent >= 2 ? 'bg-green-500' : stock.changePercent >= 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                  <span className="text-gray-700">
                    {stock.changePercent >= 2 ? 'Strong Bullish' : stock.changePercent >= 0 ? 'Bullish' : 'Bearish'} Momentum
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${stock.volume > 30000000 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-gray-700">
                    {stock.volume > 30000000 ? 'High' : 'Moderate'} Volume
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-gray-700">Large Cap Stock</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockFlyout;