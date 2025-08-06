import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import debounce from "lodash/debounce";
import { searchSymbols, fetchStockBySymbol } from "../services/api";

const BrowseStocks = ({ searchQuery, setSearchQuery, setSelectedStock }) => {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [stockDetails, setStockDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(new Set());
  const [errorDetails, setErrorDetails] = useState(new Set());
  const scrollContainerRef = useRef(null);
  const observerRef = useRef(null);
  const stockRefs = useRef({});
  const detailsQueue = useRef([]);
  const processingQueue = useRef(false);

  // Function to handle retrying a failed stock details fetch
  const retryStockDetails = useCallback((symbol) => {
    setErrorDetails((prev) => {
      const next = new Set(prev);
      next.delete(symbol);
      return next;
    });
    if (!detailsQueue.current.includes(symbol)) {
      detailsQueue.current.push(symbol);
      processDetailsQueue();
    }
  }, []);

  const processDetailsQueue = useCallback(async () => {
    if (processingQueue.current || detailsQueue.current.length === 0) return;

    processingQueue.current = true;
    const BATCH_SIZE = 2; // Process 2 stocks at a time

    while (detailsQueue.current.length > 0) {
      const batch = detailsQueue.current.splice(0, BATCH_SIZE);
      setLoadingDetails((prev) => new Set([...prev, ...batch]));

      const batchResults = await Promise.all(
        batch.map(async (symbol) => {
          try {
            const details = await fetchStockBySymbol(symbol);
            return [
              symbol,
              {
                ...details,
                color: `from-${getRandomColor()}-500 to-${getRandomColor()}-400`,
              },
            ];
          } catch (error) {
            console.error(`Error fetching details for ${symbol}:`, error);
            setErrorDetails((prev) => new Set(prev).add(symbol));
            return [symbol, null];
          }
        })
      );

      setStockDetails((prev) => ({
        ...prev,
        ...Object.fromEntries(batchResults.filter(([, details]) => details)),
      }));

      setLoadingDetails((prev) => {
        const next = new Set(prev);
        batch.forEach((symbol) => next.delete(symbol));
        return next;
      });

      // Add a small delay between batches to prevent overwhelming the server
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    processingQueue.current = false;
  }, []);

  // Debounced search function
  const debouncedSearch = useRef(
    debounce(async (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        setStockDetails({});
        detailsQueue.current = [];
        return;
      }

      setLoading(true);
      try {
        const results = await searchSymbols(query);
        setSearchResults(results);
        // Clear existing details and queue when new search results arrive
        setStockDetails({});
        detailsQueue.current = [];
        setLoadingDetails(new Set());
      } catch (error) {
        console.error("Error searching stocks:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 300)
  ).current;

  // Set up the search effect
  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery, debouncedSearch]);

  // Set up intersection observers for lazy loading stock details
  useEffect(() => {
    const observers = {};

    searchResults.forEach((result) => {
      const element = stockRefs.current[result.symbol];
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (
                entry.isIntersecting &&
                !stockDetails[result.symbol] &&
                !loadingDetails.has(result.symbol) &&
                !errorDetails.has(result.symbol)
              ) {
                if (!detailsQueue.current.includes(result.symbol)) {
                  detailsQueue.current.push(result.symbol);
                  processDetailsQueue();
                }
              }
            });
          },
          { rootMargin: "50px" }
        );

        observer.observe(element);
        observers[result.symbol] = observer;
      }
    });

    return () => {
      Object.values(observers).forEach((observer) => observer.disconnect());
    };
  }, [searchResults, stockDetails, loadingDetails, errorDetails, processDetailsQueue]);

  const getRandomColor = () => {
    const colors = ["blue", "green", "purple", "indigo", "cyan", "teal"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const formatMarketCap = (value) => {
    if (!value) return "N/A";
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
    if (!value) return "N/A";
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
                <h2 className="text-white text-3xl font-bold tracking-tight drop-shadow-lg">
                  Browse Stocks
                </h2>
                <p className="text-white/90 text-lg font-medium">
                  Discover and analyze market opportunities
                </p>
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

      {/* Stock Grid with Enhanced Glassmorphism */}
      <div className="glass-data-grid">
        <div className="glass-data-grid-header">
          <h3 className="text-xl font-bold text-gray-900 flex items-center justify-between">
            <span className="drop-shadow-sm">Market Overview</span>
            <span className="text-sm text-purple-700 font-bold bg-purple-100/50 px-4 py-2 rounded-full backdrop-blur-sm border border-purple-200/50">
              {searchResults.length} stocks found
            </span>
          </h3>
        </div>

        <div className="glass-data-grid-content" ref={scrollContainerRef}>
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-600">
              <div className="glass-loading rounded-full p-8 mb-6">
                <Loader2 className="h-16 w-16 opacity-60 animate-spin" />
              </div>
              <p className="text-xl font-bold mb-2">Searching stocks...</p>
              <p className="text-base opacity-80">Please wait a moment</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-600">
              <div className="glass-loading rounded-full p-8 mb-6">
                <Search className="h-16 w-16 opacity-60" />
              </div>
              <p className="text-xl font-bold mb-2">Start searching</p>
              <p className="text-base opacity-80">
                Enter a company name or symbol
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((result) => {
                  const details = stockDetails[result.symbol] || {};
                  const isLoadingDetails = loadingDetails.has(result.symbol);

                  return (
                    <div
                      key={result.symbol}
                      ref={(el) => {
                        stockRefs.current[result.symbol] = el;
                      }}
                      onClick={() =>
                        setSelectedStock({ ...result, ...details })
                      }
                      className="glass-stock-card hover:scale-102 transition-transform cursor-pointer"
                    >
                      <div className="glass-overlay"></div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div
                              className={`glass-stock-icon w-16 h-16 bg-gradient-to-r ${
                                details.color || "from-blue-500 to-purple-500"
                              }`}
                            >
                              {result.symbol[0]}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 text-lg">
                                {result.symbol}
                              </div>
                              <div className="text-sm text-gray-700 truncate max-w-36 font-medium">
                                {result.name}
                              </div>
                            </div>
                          </div>

                          {isLoadingDetails ? (
                            <div className="text-right">
                              <Loader2 className="h-5 w-5 animate-spin text-gray-400 ml-auto" />
                            </div>
                          ) : errorDetails.has(result.symbol) ? (
                            <div className="text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  retryStockDetails(result.symbol);
                                }}
                                className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                              >
                                Retry
                              </button>
                            </div>
                          ) : (
                            details.price && (
                              <div className="text-right">
                                <div className="font-bold text-gray-900 text-xl drop-shadow-sm">
                                  ${details.price.toFixed(2)}
                                </div>
                                {details.change && (
                                  <div
                                    className={`text-sm font-bold flex items-center justify-end ${
                                      details.change >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {details.change >= 0 ? (
                                      <TrendingUp className="h-4 w-4 mr-1" />
                                    ) : (
                                      <TrendingDown className="h-4 w-4 mr-1" />
                                    )}
                                    {details.change >= 0 ? "+" : ""}
                                    {(
                                      (details.change / details.price) *
                                      100
                                    ).toFixed(2)}
                                    %
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>

                        <div className="glass-stock-content space-y-3 text-sm text-gray-700 p-4">
                          {isLoadingDetails ? (
                            <div className="flex items-center justify-center py-2">
                              <span className="text-gray-500 text-sm">
                                Loading details...
                              </span>
                            </div>
                          ) : errorDetails.has(result.symbol) ? (
                            <div className="flex flex-col items-center justify-center py-2 text-center">
                              <span className="text-red-600 text-sm font-medium mb-2">
                                Error loading stock details
                              </span>
                              <span className="text-gray-500 text-xs mb-2">
                                Unable to fetch the latest information
                              </span>
                            </div>
                          ) : (
                            details && (
                              <>
                                {details.marketCap && (
                                  <div className="flex justify-between">
                                    <span className="font-medium">
                                      Market Cap:
                                    </span>
                                    <span className="font-bold">
                                      {formatMarketCap(details.marketCap)}
                                    </span>
                                  </div>
                                )}
                                {details.volume && (
                                  <div className="flex justify-between">
                                    <span className="font-medium">Volume:</span>
                                    <span className="font-bold">
                                      {formatVolume(details.volume)}
                                    </span>
                                  </div>
                                )}
                                {details.sector && (
                                  <div className="flex justify-between">
                                    <span className="font-medium">Sector:</span>
                                    <span className="font-bold truncate max-w-28">
                                      {details.sector}
                                    </span>
                                  </div>
                                )}
                              </>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Search Results Info with Glassmorphism */}
              <div className="mt-6 text-center">
                <div className="glass-loading inline-block px-6 py-4">
                  <span className="text-gray-700 font-bold">
                    Found {searchResults.length} stocks matching "{searchQuery}"
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseStocks;
