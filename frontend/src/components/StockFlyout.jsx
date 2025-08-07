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

  const formatMarketCap = (value) => {
    if (!value || isNaN(value) || value <= 0) {
      return 'N/A';
    }
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
    if (!value || isNaN(value) || value <= 0) {
      return 'N/A';
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

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
              <div className={`text-xl font-semibold flex items-center justify-end ${Number(stock.changePercent || 0) >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                {Number(stock.changePercent || 0) >= 0 ? <TrendingUp className="h-5 w-5 mr-1" /> : <TrendingDown className="h-5 w-5 mr-1" />}
                {Number(stock.changePercent || 0) >= 0 ? '+' : ''}{Number(stock.changePercent || 0).toFixed(2)}% (${Number(stock.change || 0) >= 0 ? '+' : ''}{Number(stock.change || 0).toFixed(2)})
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-4 gap-6 max-h-[70vh] overflow-y-auto">
          {/* Left Column - Charts */}
          <div className="col-span-2 space-y-6 flex flex-col h-full">
            {/* Chart Placeholder - No Mock Data */}
            <div className="glass-chart-container flex-1">
              <h3 className="text-lg font-bold mb-4 flex items-center text-slate-800">
                <LineChart className="h-5 w-5 mr-2 text-blue-600" />
                Price Chart
              </h3>
              <div className="h-48 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                <div className="text-center text-slate-500">
                  <LineChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">Chart data unavailable</p>
                  <p className="text-xs">Real-time charts coming soon</p>
                </div>
              </div>
            </div>

            {/* Volume Placeholder */}
            <div className="glass-chart-container flex-1">
              <h3 className="text-lg font-bold mb-4 flex items-center text-slate-800">
                <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                Volume Chart
              </h3>
              <div className="h-32 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                <div className="text-center text-slate-500">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Volume data unavailable</p>
                </div>
              </div>
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
                  <span className="font-semibold text-slate-800">N/A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">52W Range</span>
                  <span className="font-semibold text-sm text-slate-800">N/A</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Avg Volume</span>
                  <span className="font-semibold text-slate-800">{formatVolume(stock.volume)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Dividend</span>
                  <span className="font-semibold text-slate-800">N/A</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="glass-panel bg-gradient-to-br from-purple-50/90 to-indigo-50/90 border-purple-200/50 p-6">
              <h4 className="font-bold text-purple-900 mb-4">Quick Analysis</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${Number(stock.changePercent || 0) >= 2 ? 'bg-green-500' : Number(stock.changePercent || 0) >= 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                  <span className="text-slate-700">
                    {Number(stock.changePercent || 0) >= 2 ? 'Strong Bullish' : Number(stock.changePercent || 0) >= 0 ? 'Bullish' : 'Bearish'} Momentum
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${Number(stock.volume || 0) > 30000000 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-slate-700">
                    {Number(stock.volume || 0) > 30000000 ? 'High' : 'Moderate'} Volume
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-slate-700">Large Cap Stock</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-slate-700">
                    {Number(stock.changePercent || 0) >= 0 ? 'Recommended Buy' : 'Hold Position'}
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