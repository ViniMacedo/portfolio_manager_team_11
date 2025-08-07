import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
  useMemo,
} from "react";
import { Search, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import debounce from "lodash/debounce";
import { FixedSizeGrid as Grid } from "react-window";
import { searchSymbols, fetchStockBySymbol, fetchAllStocks } from "../services/api";

const COLUMN_COUNT = 3;
const ROW_HEIGHT = 280;
const COLUMN_WIDTH = 300;

const colors = ["blue", "green", "purple", "indigo", "cyan", "teal"];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const formatMarketCap = (value) => {
  if (!value) return "N/A";
  if (value >= 1_000_000_000_000)
    return `${(value / 1_000_000_000_000).toFixed(2)}T`;
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  return `${value.toLocaleString()}`;
};

const formatVolume = (value) => {
  if (!value) return "N/A";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
};

const StockCard = memo(
  ({
    style,
    data,
    index,
    onSelect,
    isLoading,
    isQueued,
    isError,
    retry,
    details,
  }) => {
    const result = data[index];
    if (!result) return null;

    const detailsAvailable = !!details;
    const isLoadingDetails = isLoading || isQueued;
    const colorClass = details?.color || "from-blue-500 to-purple-500";

    const handleClick = () => {
      if (detailsAvailable) {
        onSelect({ ...result, ...details });
      } else {
        onSelect(result);
      }
    };

    return (
      <div
        className="glass-stock-card hover:scale-102 transition-transform cursor-pointer relative overflow-hidden"
        style={{
          ...style,
          left: style.left + 8,
          top: style.top + 8,
          width: style.width - 16,
          height: style.height - 16,
        }}
        onClick={handleClick}
      >
        <div className="glass-overlay"></div>
        <div className="relative z-10 p-4 h-full flex flex-col justify-between overflow-hidden">
          <div className="flex items-start justify-between mb-4 w-full">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div
                className={`glass-stock-icon w-12 h-12 bg-gradient-to-r ${colorClass} flex-shrink-0`}
              >
                {result.symbol[0]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-gray-900 text-lg truncate">
                  {result.symbol}
                </div>
                <div className="text-sm text-gray-700 truncate font-medium">
                  {result.name}
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 ml-2">
              {isLoadingDetails ? (
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              ) : isError ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    retry(result.symbol);
                  }}
                  className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                >
                  Retry
                </button>
              ) : detailsAvailable && details.price ? (
                <div className="text-right">
                  <div className="font-bold text-gray-900 text-lg drop-shadow-sm">
                    ${details.price.toFixed(2)}
                  </div>
                  {details.change != null && (
                    <div
                      className={`text-sm font-bold flex items-center justify-end ${
                        details.change >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {details.change >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {details.change >= 0 ? "+" : ""}
                      {((details.change / details.price) * 100).toFixed(2)}%
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <div className="glass-stock-content space-y-2 text-sm text-gray-700 p-2 bg-white/5 backdrop-blur-sm rounded border border-white/10">
            {isLoadingDetails ? (
              <div className="flex items-center justify-center py-1">
                <span className="text-gray-500 text-sm">
                  {isLoading ? "Loading details..." : "Queued for loading..."}
                </span>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center py-1 text-center">
                <span className="text-red-600 text-sm font-medium mb-1">
                  Error loading stock details
                </span>
                <span className="text-gray-500 text-xs">
                  Unable to fetch the latest information
                </span>
              </div>
            ) : detailsAvailable ? (
              <>
                {details.marketCap != null && (
                  <div className="flex justify-between items-center py-1 px-2 bg-white/5 rounded">
                    <span className="font-medium text-gray-600">Market Cap:</span>
                    <span className="font-bold text-gray-800">
                      {formatMarketCap(details.marketCap)}
                    </span>
                  </div>
                )}
                {details.volume != null && (
                  <div className="flex justify-between items-center py-1 px-2 bg-white/5 rounded">
                    <span className="font-medium text-gray-600">Volume:</span>
                    <span className="font-bold text-gray-800">
                      {formatVolume(details.volume)}
                    </span>
                  </div>
                )}
                {details.sector && (
                  <div className="flex justify-between items-center py-1 px-2 bg-white/5 rounded">
                    <span className="font-medium text-gray-600">Sector:</span>
                    <span className="font-bold text-gray-800 truncate max-w-28">
                      {details.sector}
                    </span>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);

const BrowseStocks = ({ searchQuery, setSearchQuery, setSelectedStock }) => {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  // State as Maps for better granularity & performance
  const [loadingDetailsMap, setLoadingDetailsMap] = useState(new Map());
  const [errorDetailsMap, setErrorDetailsMap] = useState(new Map());

  // Stock details cache ref (outside state)
  const stockDetailsCache = useRef(new Map());

  // Force render to update component when cache changes
  const [, forceUpdate] = useState(0);

  // Queue for symbols to fetch details for
  const detailsQueue = useRef([]);

  // Processing queue flag
  const processingQueue = useRef(false);

  // Load initial stocks when component mounts
  useEffect(() => {
    const loadInitialStocks = async () => {
      if (searchQuery.trim()) {
        // If there's already a search query, don't load initial stocks
        setInitialLoading(false);
        return;
      }

      try {
        setInitialLoading(true);
        console.log('Loading initial stocks from backend...');
        const allStocks = await fetchAllStocks();
        console.log('Received initial stocks:', allStocks);
        
        // Take first 10 stocks for initial display
        const initialStocks = allStocks.slice(0, 10);
        setSearchResults(initialStocks);
        
        // Clear any previous state
        stockDetailsCache.current.clear();
        detailsQueue.current = [];
        setLoadingDetailsMap(new Map());
        setErrorDetailsMap(new Map());
        forceUpdate((n) => n + 1);
        
      } catch (error) {
        console.error('Failed to load initial stocks:', error);
        // Don't show any stocks if API fails - keep it empty
        setSearchResults([]);
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitialStocks();
  }, []); // Only run on mount

  // Process the details fetch queue (batched)
  const processDetailsQueue = useCallback(async () => {
    if (processingQueue.current || detailsQueue.current.length === 0) return;
    processingQueue.current = true;
    const BATCH_SIZE = 3;

    while (detailsQueue.current.length > 0) {
      const batch = detailsQueue.current.splice(0, BATCH_SIZE);

      // Mark these as loading
      setLoadingDetailsMap((prev) => {
        const next = new Map(prev);
        batch.forEach((s) => next.set(s, true));
        return next;
      });

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
            setErrorDetailsMap((prev) => {
              const next = new Map(prev);
              next.set(symbol, true);
              return next;
            });
            return [symbol, null];
          }
        })
      );

      // Cache successful results
      batchResults.forEach(([symbol, details]) => {
        if (details) stockDetailsCache.current.set(symbol, details);
      });

      // Remove loading flags
      setLoadingDetailsMap((prev) => {
        const next = new Map(prev);
        batch.forEach((symbol) => next.delete(symbol));
        return next;
      });

      // Force update to re-render with new details
      forceUpdate((n) => n + 1);

      // Small delay between batches
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    processingQueue.current = false;
  }, []);

  // Retry fetch details for a symbol
  const retryStockDetails = useCallback(
    (symbol) => {
      setErrorDetailsMap((prev) => {
        const next = new Map(prev);
        next.delete(symbol);
        return next;
      });
      if (!detailsQueue.current.includes(symbol)) {
        detailsQueue.current.push(symbol);
        processDetailsQueue();
      }
    },
    [processDetailsQueue]
  );

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce(async (query) => {
        if (!query.trim()) {
          // When search is cleared, reload initial stocks
          try {
            setLoading(true);
            console.log('Search cleared, reloading initial stocks...');
            const allStocks = await fetchAllStocks();
            const initialStocks = allStocks.slice(0, 10);
            setSearchResults(initialStocks);
          } catch (error) {
            console.error('Failed to reload initial stocks:', error);
            setSearchResults([]);
          } finally {
            setLoading(false);
          }
          
          stockDetailsCache.current.clear();
          detailsQueue.current = [];
          setLoadingDetailsMap(new Map());
          setErrorDetailsMap(new Map());
          forceUpdate((n) => n + 1);
          return;
        }

        setLoading(true);
        try {
          const results = await searchSymbols(query);
          setSearchResults(results);

          // Clear caches and queues on new search
          stockDetailsCache.current.clear();
          detailsQueue.current = [];
          setLoadingDetailsMap(new Map());
          setErrorDetailsMap(new Map());
          forceUpdate((n) => n + 1);
        } catch (error) {
          console.error("Error searching stocks:", error);
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      }, 300),
    []
  );

  // Search effect
  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery, debouncedSearch]);

  // Scroll pause debounce to reduce rapid fetches on fast scroll
  const scrollPauseTimeout = useRef(null);
  const onItemsRendered = useCallback(
    ({ visibleRowStartIndex, visibleRowStopIndex }) => {
      if (scrollPauseTimeout.current) clearTimeout(scrollPauseTimeout.current);

      scrollPauseTimeout.current = setTimeout(() => {
        // Calculate visible symbols indices
        const startIndex = visibleRowStartIndex * COLUMN_COUNT;
        const endIndex =
          (visibleRowStopIndex + 1) * COLUMN_COUNT - 1 >= searchResults.length
            ? searchResults.length - 1
            : (visibleRowStopIndex + 1) * COLUMN_COUNT - 1;

        const visibleSymbols = new Set();

        for (let i = startIndex; i <= endIndex; i++) {
          if (searchResults[i]) visibleSymbols.add(searchResults[i].symbol);
        }

        // Queue symbols for fetching details if not loaded/queued/error
        visibleSymbols.forEach((symbol) => {
          if (
            !stockDetailsCache.current.has(symbol) &&
            !loadingDetailsMap.get(symbol) &&
            !errorDetailsMap.get(symbol) &&
            !detailsQueue.current.includes(symbol)
          ) {
            detailsQueue.current.push(symbol);
          }
        });

        if (detailsQueue.current.length > 0) processDetailsQueue();
      }, 200);
    },
    [searchResults, loadingDetailsMap, errorDetailsMap, processDetailsQueue]
  );

  // Memoized data array for react-window
  const itemData = useMemo(() => searchResults, [searchResults]);

  const rowCount = Math.ceil(searchResults.length / COLUMN_COUNT);

  // Calculate grid height so it never grows too tall
  const gridHeight = Math.min(800, rowCount * ROW_HEIGHT);

  return (
    <div className="flex flex-col gap-6 flex-grow min-h-0 overflow-hidden">
      {/* Search Header with Enhanced Glassmorphism */}
      <div className="glass-search-header flex-shrink-0">
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
                spellCheck={false}
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stock Grid with Enhanced Glassmorphism */}
      <div className="glass-data-grid flex flex-col flex-grow min-h-0 overflow-hidden">
        <div className="glass-data-grid-header flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-900 flex items-center justify-between">
            <span className="drop-shadow-sm">Market Overview</span>
            <span className="text-sm text-purple-700 font-bold bg-purple-100/50 px-4 py-2 rounded-full backdrop-blur-sm border border-purple-200/50">
              {searchResults.length} stocks {searchQuery.trim() ? 'found' : 'available'}
            </span>
          </h3>
        </div>

        <div
          className="glass-data-grid-content flex-grow min-h-0 flex flex-col w-full custom-scrollbar"
        >
          {(loading || initialLoading) ? (
            <div className="flex flex-col items-center justify-center flex-grow min-h-0 text-gray-600">
              <div className="glass-loading rounded-full p-8 mb-6">
                <Loader2 className="h-16 w-16 opacity-60 animate-spin" />
              </div>
              <p className="text-xl font-bold mb-2">
                {initialLoading ? "Loading market data..." : "Searching stocks..."}
              </p>
              <p className="text-base opacity-80">Please wait a moment</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-grow min-h-0 text-gray-600">
              <div className="glass-loading rounded-full p-8 mb-6">
                <Search className="h-16 w-16 opacity-60" />
              </div>
              <p className="text-xl font-bold mb-2">No stocks found</p>
              <p className="text-base opacity-80">
                Try a different search term or check your connection
              </p>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div
                style={{ height: gridHeight, width: COLUMN_COUNT * COLUMN_WIDTH }}
              >
                <Grid
                columnCount={COLUMN_COUNT}
                rowCount={rowCount}
                height={gridHeight}
                width={COLUMN_COUNT * COLUMN_WIDTH}
                columnWidth={COLUMN_WIDTH}
                rowHeight={ROW_HEIGHT}
                itemData={itemData}
                onItemsRendered={onItemsRendered}
                className="outline-none custom-scrollbar"
                style={{ overflow: 'hidden' }}
              >
                {({ columnIndex, rowIndex, style, data }) => {
                  const index = rowIndex * COLUMN_COUNT + columnIndex;
                  if (index >= data.length) return null;

                  const symbol = data[index].symbol;
                  const details = stockDetailsCache.current.get(symbol);
                  const isLoading = loadingDetailsMap.get(symbol) || false;
                  const isError = errorDetailsMap.get(symbol) || false;
                  const isQueued = detailsQueue.current.includes(symbol);

                  return (
                    <StockCard
                      key={symbol}
                      style={style}
                      data={data}
                      index={index}
                      onSelect={setSelectedStock}
                      isLoading={isLoading}
                      isError={isError}
                      isQueued={isQueued}
                      retry={retryStockDetails}
                      details={details}
                    />
                  );
                }}
              </Grid>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseStocks;
