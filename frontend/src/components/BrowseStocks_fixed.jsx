import React, { useEffect, useRef } from 'react';
import { Search, TrendingUp, TrendingDown, Plus, Eye, Loader2 } from 'lucide-react';

const BrowseStocks = ({ searchQuery, setSearchQuery, filteredStocks, setSelectedStock, loadMoreStocks, loading, hasMoreStocks }) => {
  const scrollContainerRef = useRef(null);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current || loading || !hasMoreStocks || searchQuery.trim() !== '') return;
      
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const scrollPosition = scrollTop + clientHeight;
      const threshold = scrollHeight - 100; // Load more when 100px from bottom
      
      if (scrollPosition >= threshold) {
        loadMoreStocks();
      }
    };

    const scrollElement = scrollContainerRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [loading, hasMoreStocks, searchQuery, loadMoreStocks]);

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

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Search Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Search className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-white text-2xl font-bold">Browse Stocks</h2>
                <p className="text-white/80">Discover and analyze market opportunities</p>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search stocks by symbol, name, or sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 w-80 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stock Categories */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {['Technology', 'Financial Services', 'Healthcare', 'Consumer Discretionary'].map((sector) => (
          <button
            key={sector}
            onClick={() => setSearchQuery(sector)}
            className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 text-center"
          >
            <div className="font-bold text-gray-900 mb-1">{sector}</div>
            <div className="text-sm text-gray-600">
              {filteredStocks.filter(s => s.sector === sector).length} stocks
            </div>
          </button>
        ))}
      </div>

      {/* Stock Grid */}
      <div className="flex-1 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/30 shadow-xl overflow-hidden min-h-0">
        <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-purple-50 to-indigo-50">
          <h3 className="text-lg font-bold text-gray-900 flex items-center justify-between">
            <span>Market Overview</span>
            <span className="text-sm text-purple-600 font-semibold">
              {filteredStocks.length} stocks found
            </span>
          </h3>
        </div>
        
        <div className="h-96 overflow-y-auto p-4" ref={scrollContainerRef}>
          {filteredStocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Search className="h-12 w-12 mb-4 opacity-50" />
              <p className="text-lg font-medium">No stocks found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStocks.map((stock) => (
                  <div 
                    key={stock.symbol || stock.id} 
                    onClick={() => setSelectedStock(stock)}
                    className="bg-gradient-to-r from-white to-gray-50 rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-r ${stock.color || 'from-blue-500 to-purple-500'} rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-shadow duration-200`}>
                          {(stock.symbol || 'N/A')[0]}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{stock.symbol || 'N/A'}</div>
                          <div className="text-xs text-gray-600 truncate max-w-32">{stock.name || 'Unknown'}</div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold text-gray-900 text-lg">${(stock.price || 0).toFixed(2)}</div>
                        <div className={`text-sm font-semibold flex items-center justify-end ${(stock.changePercent || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {(stock.changePercent || 0) >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                          {(stock.changePercent || 0) >= 0 ? '+' : ''}{(stock.changePercent || 0).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>Market Cap:</span>
                        <span className="font-semibold">{formatMarketCap(stock.marketCap || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Volume:</span>
                        <span className="font-semibold">{formatVolume(stock.volume || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sector:</span>
                        <span className="font-semibold truncate max-w-24">{stock.sector || 'Unknown'}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200 flex space-x-2">
                      <button 
                        onClick={(e) => {e.stopPropagation(); /* Handle buy */}}
                        className="flex-1 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg py-2 px-3 text-xs font-semibold transition-all duration-200 flex items-center justify-center space-x-1"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Buy</span>
                      </button>
                      <button 
                        onClick={(e) => {e.stopPropagation(); /* Handle watchlist */}}
                        className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg py-2 px-3 text-xs font-semibold transition-all duration-200 flex items-center justify-center space-x-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Watch</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Loading and Load More Section */}
              {searchQuery.trim() === '' && (
                <div className="mt-6 flex flex-col items-center space-y-4">
                  {loading && (
                    <div className="flex items-center space-x-2 text-purple-600">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="text-sm font-medium">Loading more stocks...</span>
                    </div>
                  )}
                  
                  {!loading && hasMoreStocks && (
                    <button
                      onClick={loadMoreStocks}
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                    >
                      Load More Stocks
                    </button>
                  )}
                  
                  {!hasMoreStocks && filteredStocks.length > 0 && (
                    <div className="text-gray-500 text-sm font-medium">
                      You've reached the end! All stocks loaded.
                    </div>
                  )}
                </div>
              )}
              
              {/* Search Results Info */}
              {searchQuery.trim() !== '' && (
                <div className="mt-4 text-center text-gray-600 text-sm">
                  {filteredStocks.length > 0 ? (
                    <span>Found {filteredStocks.length} stocks matching "{searchQuery}"</span>
                  ) : (
                    <span>No stocks found matching "{searchQuery}". Try a different search term.</span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseStocks;
