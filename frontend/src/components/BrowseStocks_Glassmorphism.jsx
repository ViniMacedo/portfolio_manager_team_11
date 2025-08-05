import React, { useEffect, useRef } from 'react';
import { Search, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';

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
    <div className="flex flex-col gap-6 h-full">
      {/* Search Header with Enhanced Glassmorphism */}
      <div className="bg-gradient-to-br from-indigo-900/80 via-purple-900/70 to-pink-800/80 rounded-3xl p-8 relative overflow-hidden backdrop-blur-xl border border-white/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 backdrop-blur-3xl"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-white/5 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-400/90 to-blue-500/90 rounded-3xl flex items-center justify-center shadow-2xl backdrop-blur-md border border-white/30 hover:scale-105 transition-all duration-300">
                <Search className="h-10 w-10 text-white drop-shadow-lg" />
              </div>
              <div>
                <h2 className="text-white text-3xl font-bold tracking-tight drop-shadow-lg">Browse Stocks</h2>
                <p className="text-white/90 text-lg font-medium">Discover and analyze market opportunities</p>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-lg transition-all duration-300"></div>
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70 z-10" />
              <input
                type="text"
                placeholder="Search stocks by symbol, name, or sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="relative z-10 pl-12 pr-6 py-4 w-96 bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-white/50 focus:bg-white/15 transition-all duration-300 font-medium shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stock Categories with Glassmorphism */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {['Technology', 'Financial Services', 'Healthcare', 'Consumer Discretionary'].map((sector) => (
          <button
            key={sector}
            onClick={() => setSearchQuery(sector)}
            className="relative group bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 active:scale-95 text-center hover:bg-white/25 hover:border-white/40"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="font-bold text-gray-900 mb-2 text-lg group-hover:text-gray-800 transition-colors">{sector}</div>
              <div className="text-sm text-gray-700 font-medium">
                {filteredStocks.filter(s => s.sector === sector).length} stocks
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Stock Grid with Enhanced Glassmorphism */}
      <div className="flex-1 bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl overflow-hidden min-h-0 hover:shadow-3xl transition-shadow duration-300">
        <div className="p-6 border-b border-white/20 bg-gradient-to-r from-purple-50/80 to-indigo-50/80 backdrop-blur-xl">
          <h3 className="text-xl font-bold text-gray-900 flex items-center justify-between">
            <span className="drop-shadow-sm">Market Overview</span>
            <span className="text-sm text-purple-700 font-bold bg-purple-100/50 px-4 py-2 rounded-full backdrop-blur-sm border border-purple-200/50">
              {filteredStocks.length} stocks found
            </span>
          </h3>
        </div>
        
        <div className="h-96 overflow-y-auto p-6" ref={scrollContainerRef}>
          {filteredStocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-600">
              <div className="bg-white/20 backdrop-blur-xl rounded-full p-8 border border-white/30 shadow-xl mb-6">
                <Search className="h-16 w-16 opacity-60" />
              </div>
              <p className="text-xl font-bold mb-2">No stocks found</p>
              <p className="text-base opacity-80">Try adjusting your search criteria</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStocks.map((stock) => (
                  <div 
                    key={stock.symbol || stock.id} 
                    onClick={() => setSelectedStock(stock)}
                    className="relative group bg-white/30 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer hover:bg-white/40 hover:border-white/50"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-16 h-16 bg-gradient-to-r ${stock.color || 'from-blue-500 to-purple-500'} rounded-2xl flex items-center justify-center text-white font-bold shadow-xl group-hover:shadow-2xl transition-all duration-300 border border-white/20 backdrop-blur-sm`}>
                            {(stock.symbol || 'N/A')[0]}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 text-lg">{stock.symbol || 'N/A'}</div>
                            <div className="text-sm text-gray-700 truncate max-w-36 font-medium">{stock.name || 'Unknown'}</div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-bold text-gray-900 text-xl drop-shadow-sm">${(stock.price || 0).toFixed(2)}</div>
                          <div className={`text-sm font-bold flex items-center justify-end ${(stock.changePercent || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {(stock.changePercent || 0) >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                            {(stock.changePercent || 0) >= 0 ? '+' : ''}{(stock.changePercent || 0).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 text-sm text-gray-700 bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                        <div className="flex justify-between">
                          <span className="font-medium">Market Cap:</span>
                          <span className="font-bold">{formatMarketCap(stock.marketCap || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Volume:</span>
                          <span className="font-bold">{formatVolume(stock.volume || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Sector:</span>
                          <span className="font-bold truncate max-w-28">{stock.sector || 'Unknown'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Loading and Load More Section with Glassmorphism */}
              {searchQuery.trim() === '' && (
                <div className="mt-8 flex flex-col items-center space-y-6">
                  {loading && (
                    <div className="flex items-center space-x-3 text-purple-700 bg-white/20 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/30 shadow-xl">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="text-base font-bold">Loading more stocks...</span>
                    </div>
                  )}
                  
                  {!loading && hasMoreStocks && (
                    <button
                      onClick={loadMoreStocks}
                      className="bg-gradient-to-r from-purple-500/90 to-indigo-500/90 hover:from-purple-600/90 hover:to-indigo-600/90 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl hover:shadow-3xl backdrop-blur-xl border border-white/20"
                    >
                      Load More Stocks
                    </button>
                  )}
                  
                  {!hasMoreStocks && filteredStocks.length > 0 && (
                    <div className="text-gray-600 text-base font-bold bg-white/20 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/30 shadow-xl">
                      You've reached the end! All stocks loaded.
                    </div>
                  )}
                </div>
              )}
              
              {/* Search Results Info with Glassmorphism */}
              {searchQuery.trim() !== '' && (
                <div className="mt-6 text-center">
                  <div className="inline-block bg-white/20 backdrop-blur-xl rounded-2xl px-6 py-4 border border-white/30 shadow-xl">
                    {filteredStocks.length > 0 ? (
                      <span className="text-gray-700 font-bold">Found {filteredStocks.length} stocks matching "{searchQuery}"</span>
                    ) : (
                      <span className="text-gray-600 font-bold">No stocks found matching "{searchQuery}". Try a different search term.</span>
                    )}
                  </div>
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
