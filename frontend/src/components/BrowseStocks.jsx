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

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Search Header with Enhanced Glassmorphism */}
      <div className="glass-search-header">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 backdrop-blur-3xl"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-white/5 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="glass-search-icon-container">
                <Search className="h-10 w-10 text-white drop-shadow-lg" />
              </div>
              <div>
                <h2 className="text-white text-3xl font-bold tracking-tight drop-shadow-lg">Browse Stocks</h2>
                <p className="text-white/90 text-lg font-medium">Discover and analyze market opportunities</p>
              </div>
            </div>
            
            <div className="glass-search-wrapper">
              <div className="glass-search-glow"></div>
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70 z-10" />
              <input
                type="text"
                placeholder="Search stocks by symbol, name, or sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-search-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stock Categories with Glassmorphism */}
      <div className="glass-category-container">
        {['Technology', 'Financial Services', 'Healthcare', 'Consumer Discretionary'].map((sector) => (
          <button
            key={sector}
            onClick={() => setSearchQuery(sector)}
            className="glass-category-button"
          >
            <div className="glass-overlay"></div>
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
      <div className="glass-data-grid">
        <div className="glass-data-grid-header">
          <h3 className="text-xl font-bold text-gray-900 flex items-center justify-between">
            <span className="drop-shadow-sm">Market Overview</span>
            <span className="text-sm text-purple-700 font-bold bg-purple-100/50 px-4 py-2 rounded-full backdrop-blur-sm border border-purple-200/50">
              {filteredStocks.length} stocks found
            </span>
          </h3>
        </div>
        
        <div className="glass-data-grid-content" ref={scrollContainerRef}>
          {filteredStocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-600">
              <div className="glass-loading rounded-full p-8 mb-6">
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
                    className="glass-stock-card"
                  >
                    <div className="glass-overlay"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className={`glass-stock-icon w-16 h-16 bg-gradient-to-r ${stock.color || 'from-blue-500 to-purple-500'}`}>
                            {(stock.symbol || 'N/A')[0]}
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 text-lg">{stock.symbol || 'N/A'}</div>
                            <div className="text-sm text-gray-700 truncate max-w-36 font-medium">{stock.name || 'Unknown'}</div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-bold text-gray-900 text-xl drop-shadow-sm">${(stock.price || 0).toFixed(2)}</div>
                          <div className={`text-sm font-bold flex items-center justify-end ${((stock.change / stock.price * 100) || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {((stock.change / stock.price * 100) || 0) >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                            {((stock.change / stock.price * 100) || 0) >= 0 ? '+' : ''}{((stock.change / stock.price * 100) || 0).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="glass-stock-content space-y-3 text-sm text-gray-700 p-4">
                        <div className="flex justify-between">
                          <span className="font-medium">Market Cap:</span>
                          <span className="font-bold">{stock.marketCap || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Volume:</span>
                          <span className="font-bold">{stock.volume || 0}</span>
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
                    <div className="glass-spinner">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="text-base font-bold">Loading more stocks...</span>
                    </div>
                  )}
                  
                  {!loading && hasMoreStocks && (
                    <button
                      onClick={loadMoreStocks}
                      className="glass-load-more"
                    >
                      Load More Stocks
                    </button>
                  )}
                  
                  {!hasMoreStocks && filteredStocks.length > 0 && (
                    <div className="glass-end-message">
                      You've reached the end! All stocks loaded.
                    </div>
                  )}
                </div>
              )}
              
              {/* Search Results Info with Glassmorphism */}
              {searchQuery.trim() !== '' && (
                <div className="mt-6 text-center">
                  <div className="glass-loading inline-block px-6 py-4">
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