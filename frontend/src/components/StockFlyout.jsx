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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="glass-container max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${stock.color} p-6 text-white relative rounded-t-3xl`}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 glass-button text-white hover:bg-white/30 rounded-xl flex items-center justify-center transition-all duration-200 z-10"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center justify-between pr-16">
            <div>
              <h2 className="text-3xl font-bold">{stock.symbol}</h2>
              <p className="text-lg opacity-90">{stock.name}</p>
              <p className="text-sm opacity-75">{stock.sector || 'Unknown'}</p>
              {/* Holdings info in header - browse banner style */}
              {currentShares > 0 && (
                <div className="mt-3 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-2xl rounded-2xl px-4 py-2 shadow-lg border border-white/30 inline-block">
                  <div className="text-sm font-medium">
                    You own {currentShares} shares • Value: ${(currentShares * (stock.price || 0)).toFixed(2)}
                  </div>
                </div>
              )}
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

        <div className="p-6 grid grid-cols-4 gap-6 max-h-[70vh] overflow-y-auto">
          {/* Left Column - Charts */}
          <div className="col-span-2 space-y-6 flex flex-col h-full">
            {/* Price Chart */}
            <div className="glass-chart-container flex-1">
              <h3 className="text-lg font-bold mb-4 flex items-center text-slate-800">
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
            <div className="glass-chart-container flex-1">
              <h3 className="text-lg font-bold mb-4 flex items-center text-slate-800">
                <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                Volume Trend
              </h3>
              <div className="h-32 flex items-end justify-between space-x-1">
                {chartData.slice(-14).map((item, index) => (
                  <div key={index} className="flex flex-col items-center space-y-1 flex-1">
                    <div 
                      className="w-full bg-green-500 rounded-t-sm transition-all duration-300 hover:bg-green-600 cursor-pointer"
                      style={{ 
                        height: `${Math.max((item.volume / 100000000) * 100, 4)}px`,
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

          {/* Middle Column - Key Metrics & Holdings */}
          <div className="space-y-6 flex flex-col h-full">
            {/* Key Metrics */}
            <div className="glass-panel p-6 flex-1">
              <h3 className="text-lg font-bold mb-6 text-slate-800">Key Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Market Cap</span>
                  <span className="font-semibold text-slate-800">{formatMarketCap(stock.marketCap)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Volume</span>
                  <span className="font-semibold text-slate-800">{formatVolume(stock.volume)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Sector</span>
                  <span className="font-semibold text-sm text-slate-800">{stock.sector}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">P/E Ratio</span>
                  <span className="font-semibold text-slate-800">{(15 + Math.random() * 20).toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">52W Range</span>
                  <span className="font-semibold text-sm text-slate-800">${((stock.price || 0) * 0.7).toFixed(0)} - ${((stock.price || 0) * 1.3).toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Avg Volume</span>
                  <span className="font-semibold text-slate-800">{formatVolume(stock.volume * 0.8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Dividend</span>
                  <span className="font-semibold text-slate-800">{(Math.random() * 3).toFixed(2)}%</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="glass-panel bg-gradient-to-br from-purple-50/90 to-indigo-50/90 border-purple-200/50 p-6">
              <h4 className="font-bold text-purple-900 mb-4">Quick Analysis</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${stock.changePercent >= 2 ? 'bg-green-500' : stock.changePercent >= 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                  <span className="text-slate-700">
                    {stock.changePercent >= 2 ? 'Strong Bullish' : stock.changePercent >= 0 ? 'Bullish' : 'Bearish'} Momentum
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${stock.volume > 30000000 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-slate-700">
                    {stock.volume > 30000000 ? 'High' : 'Moderate'} Volume
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-slate-700">Large Cap Stock</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-slate-700">
                    {(stock.changePercent || 0) >= 0 ? 'Recommended Buy' : 'Hold Position'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Trading Actions */}
          <div className="space-y-6 flex flex-col h-full">
            {/* Quantity Selector */}
            <div className="glass-panel p-6 flex-1">
              <h3 className="text-lg font-bold mb-6 text-slate-800">Trade Quantity</h3>
              <div className="flex items-center justify-center space-x-4 mb-6">
                <button
                  onClick={decrementQuantity}
                  className="w-10 h-10 glass-button text-slate-700 hover:text-slate-900 rounded-full flex items-center justify-center transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  className="w-20 text-center text-xl font-bold glass-input text-slate-800 placeholder-slate-500 bg-white/50 border-slate-300"
                />
                <button
                  onClick={incrementQuantity}
                  className="w-10 h-10 glass-button text-slate-700 hover:text-slate-900 rounded-full flex items-center justify-center transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="text-center space-y-2 mb-6">
                <div className="text-lg font-bold text-slate-800">Total: ${totalPrice.toFixed(2)}</div>
                <div className="text-sm text-slate-600">
                  {quantity} × ${(stock.price || 0).toFixed(2)}
                </div>
              </div>
              
              {/* Quick quantity buttons */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <button 
                  onClick={() => setQuantity(10)}
                  className="glass-button text-xs py-2 text-slate-700 hover:text-slate-900"
                >
                  10
                </button>
                <button 
                  onClick={() => setQuantity(50)}
                  className="glass-button text-xs py-2 text-slate-700 hover:text-slate-900"
                >
                  50
                </button>
                <button 
                  onClick={() => setQuantity(100)}
                  className="glass-button text-xs py-2 text-slate-700 hover:text-slate-900"
                >
                  100
                </button>
              </div>
            </div>

            {/* Trading Actions */}
            <div className="space-y-3 flex-1 flex flex-col justify-end">
              <button 
                onClick={handleBuyStock}
                disabled={totalPrice > userBalance}
                className={`w-full glass-button-primary ${
                  totalPrice > userBalance 
                    ? 'opacity-50 cursor-not-allowed bg-slate-400/80 hover:bg-slate-400/80 hover:scale-100' 
                    : 'bg-gradient-to-r from-green-500/90 to-emerald-600/90 hover:from-green-600 hover:to-emerald-700'
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
                className={`w-full glass-button-primary ${
                  quantity > currentShares || currentShares === 0
                    ? 'opacity-50 cursor-not-allowed bg-slate-400/80 hover:bg-slate-400/80 hover:scale-100' 
                    : 'bg-gradient-to-r from-red-500/90 to-pink-600/90 hover:from-red-600 hover:to-pink-700'
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

              <button className="w-full glass-button-primary bg-gradient-to-r from-blue-500/90 to-indigo-600/90 hover:from-blue-600 hover:to-indigo-700">
                <div className="flex items-center justify-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Add to Watchlist</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockFlyout;