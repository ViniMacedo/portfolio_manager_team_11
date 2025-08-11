import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Search } from "lucide-react";
import debounce from "lodash/debounce";
import { FixedSizeGrid as Grid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { 
  searchSymbolsPaged, 
  discoverSymbolsPaged,  // NEW: for preload feed
  fetchQuotesBatch, 
  fetchStockBySymbol 
} from "../services/api";

const IDEAL_CARD_W = 240; // Reduced from 320
const CARD_H = 200; // Reduced from 280
const GAP = 16; // Reduced from 24
const GRID_MAX_HEIGHT = 600;

const BrowseStocks = ({ searchQuery, setSearchQuery, setSelectedStock }) => {
  // MODE: 'feed' (no search) vs 'search'
  const [mode, setMode] = useState("feed");

  // Paged symbols (shared by both modes)
  const [symbols, setSymbols] = useState([]);        // [{symbol,name,sector}]
  const [cursor, setCursor] = useState(null);        // server/client cursor
  const [hasMore, setHasMore] = useState(false);
  const [loadingSymbols, setLoadingSymbols] = useState(false);

  // Enhanced quotes cache with timestamp expiry
  const detailsCache = useRef(new Map());            // symbol -> { details, timestamp }
  const [loadingDetailsMap, setLoadingDetailsMap] = useState(new Map());
  const [errorDetailsMap, setErrorDetailsMap] = useState(new Map());

  // Enhanced symbol search cache with timestamp expiry
  const symbolSearchCache = useRef(new Map());      // query -> { items: [], nextCursor: null, timestamp }
  const feedCache = useRef({ items: [], nextCursor: null, loaded: false, timestamp: null }); // Feed cache with timestamp

  // Cache expiry settings
  const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

  // Cache utility functions
  const isCacheValid = (timestamp) => {
    return timestamp && (Date.now() - timestamp) < CACHE_EXPIRY;
  };

  const getCachedQuote = (symbol) => {
    const cached = detailsCache.current.get(symbol);
    if (cached && isCacheValid(cached.timestamp)) {
      return cached.details || cached; // Handle both old and new format
    }
    // Remove expired cache
    if (cached) detailsCache.current.delete(symbol);
    return null;
  };

  const setCachedQuote = (symbol, details) => {
    detailsCache.current.set(symbol, {
      details,
      timestamp: Date.now()
    });
  };

  const getCachedSearch = (query) => {
    const cached = symbolSearchCache.current.get(query);
    if (cached && isCacheValid(cached.timestamp)) {
      return cached;
    }
    // Remove expired cache
    if (cached) symbolSearchCache.current.delete(query);
    return null;
  };

  const setCachedSearch = (query, data) => {
    symbolSearchCache.current.set(query, {
      ...data,
      timestamp: Date.now()
    });
  };

  // Periodic cache cleanup to prevent memory leaks
  const cleanupExpiredCaches = useCallback(() => {
    const now = Date.now();
    
    // Clean up quote cache
    for (const [symbol, cached] of detailsCache.current.entries()) {
      if (!isCacheValid(cached.timestamp)) {
        detailsCache.current.delete(symbol);
      }
    }
    
    // Clean up search cache
    for (const [query, cached] of symbolSearchCache.current.entries()) {
      if (!isCacheValid(cached.timestamp)) {
        symbolSearchCache.current.delete(query);
      }
    }
    
    // Clean up feed cache
    if (feedCache.current.timestamp && !isCacheValid(feedCache.current.timestamp)) {
      feedCache.current = { items: [], nextCursor: null, loaded: false, timestamp: null };
    }
  }, []);

  // Fetch queue for visible symbols (batched)
  const detailsQueue = useRef([]);
  const processingQueue = useRef(false);

  // --- Helpers ---
  const resetLists = useCallback((clearCaches = true) => {
    setSymbols([]);
    setCursor(null);
    setHasMore(false);
    setLoadingSymbols(false);
    if (clearCaches) {
      detailsCache.current.clear();
      symbolSearchCache.current.clear();
      feedCache.current = { items: [], nextCursor: null, loaded: false, timestamp: null };
    }
    setLoadingDetailsMap(new Map());
    setErrorDetailsMap(new Map());
  }, []);

  const loadMoreFeed = useCallback(async (cur = null) => {
    if (loadingSymbols) return;
    
    // Check cache first for initial load with expiry validation
    if (!cur && feedCache.current.loaded && isCacheValid(feedCache.current.timestamp) && feedCache.current.items.length > 0) {
      console.log('Using cached feed data:', feedCache.current.items.length, 'items');
      setSymbols(feedCache.current.items);
      setCursor(feedCache.current.nextCursor);
      setHasMore(!!feedCache.current.nextCursor);
      return;
    }
    
    setLoadingSymbols(true);
    try {
      console.log('Loading feed with cursor:', cur);
      const { items, nextCursor } = await discoverSymbolsPaged({ cursor: cur, limit: 20 });
      console.log('Feed loaded:', items.length, 'items');
      
      if (!cur) {
        // Initial load - cache it
        feedCache.current = { items, nextCursor, loaded: true };
        setSymbols(items);
      } else {
        // Pagination - append to cache and state
        feedCache.current.items = [...feedCache.current.items, ...items];
        feedCache.current.nextCursor = nextCursor;
        setSymbols(prev => [...prev, ...items]);
      }
      
      setCursor(nextCursor);
      setHasMore(!!nextCursor);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setLoadingSymbols(false);
    }
  }, [loadingSymbols]);

  const loadMoreSearch = useCallback(async (q, cur = null) => {
    if (loadingSymbols) return;
    
    const cacheKey = q.toLowerCase().trim();
    
    // Check cache first for initial search with expiry validation
    if (!cur && getCachedSearch(cacheKey)) {
      const cached = getCachedSearch(cacheKey);
      console.log('Using cached search results for:', q, '(', cached.items.length, 'items)');
      setSymbols(cached.items);
      setCursor(cached.nextCursor);
      setHasMore(!!cached.nextCursor);
      return;
    }
    
    setLoadingSymbols(true);
    try {
      console.log('Searching for:', q, 'with cursor:', cur);
      const { items, nextCursor } = await searchSymbolsPaged({ q, cursor: cur, limit: 50 });
      console.log('Search results:', items.length, 'items for query:', q);
      
      if (!cur) {
        // Initial search - cache it with timestamp
        setCachedSearch(cacheKey, { items, nextCursor });
        setSymbols(items);
      } else {
        // Pagination - append to cache and state
        const cached = getCachedSearch(cacheKey);
        if (cached) {
          const updatedData = {
            items: [...cached.items, ...items],
            nextCursor
          };
          setCachedSearch(cacheKey, updatedData);
        }
        setSymbols(prev => [...prev, ...items]);
      }
      
      setCursor(nextCursor);
      setHasMore(!!nextCursor);
    } catch (error) {
      console.error('Search failed for query:', q, error);
    } finally {
      setLoadingSymbols(false);
    }
  }, [loadingSymbols]);

  // Switch mode on query changes
  const debouncedSearchSwitch = useMemo(() =>
    debounce(async (q) => {
      const qtrim = (q || "").trim();
      const newMode = qtrim ? "search" : "feed";
      
      console.log('Search switch:', { query: qtrim, currentMode: mode, newMode });
      
      // Only reset if mode actually changes
      if (mode !== newMode) {
        setMode(newMode);
        setLoadingSymbols(true);
        
        // Load new data first, then replace old data to prevent flicker
        try {
          let newData;
          if (newMode === "feed") {
            console.log('Loading feed data...');
            newData = await discoverSymbolsPaged({ cursor: null, limit: 20 });
          } else {
            console.log('Loading search data for:', qtrim);
            newData = await searchSymbolsPaged({ q: qtrim, cursor: null, limit: 50 });
            console.log('Search results:', newData.items?.length || 0, 'items');
          }
          
          // Replace all data at once to prevent flicker
          setSymbols(newData.items || []); // Ensure we handle empty results
          setCursor(newData.nextCursor);
          setHasMore(!!newData.nextCursor);
          
          // Clear caches after setting new data
          detailsCache.current.clear();
          setLoadingDetailsMap(new Map());
          setErrorDetailsMap(new Map());
        } catch (error) {
          console.error('Error switching modes:', error);
          // On error, set empty results but stay in search mode
          setSymbols([]);
          setCursor(null);
          setHasMore(false);
          detailsCache.current.clear();
          setLoadingDetailsMap(new Map());
          setErrorDetailsMap(new Map());
        } finally {
          setLoadingSymbols(false);
        }
      } else if (newMode === "search") {
        // Same search mode but different query - load new results smoothly
        setLoadingSymbols(true);
        try {
          console.log('Same mode search for:', qtrim);
          const newData = await searchSymbolsPaged({ q: qtrim, cursor: null, limit: 50 });
          console.log('Same mode search results:', newData.items?.length || 0, 'items');
          
          // Replace data smoothly - even if empty
          setSymbols(newData.items || []); // Handle empty results properly
          setCursor(newData.nextCursor);
          setHasMore(!!newData.nextCursor);
          
          // Clear caches
          detailsCache.current.clear();
          setLoadingDetailsMap(new Map());
          setErrorDetailsMap(new Map());
        } catch (error) {
          console.error('Error searching:', error);
          // On search error, show empty results but stay in search mode
          setSymbols([]);
          setCursor(null);
          setHasMore(false);
        } finally {
          setLoadingSymbols(false);
        }
      }
    }, 300),
  [resetLists, mode]);

  // Batch-process visible queue - MOVED BEFORE USE
  const processDetailsQueue = useCallback(async () => {
    if (processingQueue.current || detailsQueue.current.length === 0) return;
    processingQueue.current = true;
    const BATCH_SIZE = 5; // Even smaller batch size for faster response

    while (detailsQueue.current.length > 0) {
      const batch = detailsQueue.current.splice(0, BATCH_SIZE);
      console.log('Processing batch of', batch.length, 'symbols:', batch);
      
      setLoadingDetailsMap(prev => {
        const next = new Map(prev);
        batch.forEach(s => next.set(s, true));
        return next;
      });

      try {
        const quotes = await fetchQuotesBatch(batch); // {SYM: details}
        console.log('Received quotes for:', Object.keys(quotes));
        
        // cache successes with timestamp
        Object.entries(quotes).forEach(([sym, det]) => {
          if (det && det.price !== undefined) { // Ensure we have price data
            console.log('Caching quote for', sym, det);
            setCachedQuote(sym, det);
          }
        });
        
        // mark missing as error - PERMANENTLY
        const missing = batch.filter(s => !quotes[s] || quotes[s].price === undefined);
        if (missing.length) {
          console.log('Permanently marking as error (no retry):', missing);
          setErrorDetailsMap(prev => {
            const next = new Map(prev);
            missing.forEach(s => next.set(s, true)); // Permanent error state
            return next;
          });
        }
      } catch (error) {
        console.error('Batch quote error - permanently marking as error:', error);
        // whole-batch error - PERMANENT
        setErrorDetailsMap(prev => {
          const next = new Map(prev);
          batch.forEach(s => next.set(s, true)); // Permanent error state
          return next;
        });
      } finally {
        setLoadingDetailsMap(prev => {
          const next = new Map(prev);
          batch.forEach(s => next.delete(s));
          return next;
        });
      }

      await new Promise(r => setTimeout(r, 500)); // Increased delay to reduce API pressure and prevent flickering
    }

    processingQueue.current = false;
  }, []);

  // Load initial feed on component mount and immediately start loading quotes
  useEffect(() => {
    if (symbols.length === 0 && !loadingSymbols && mode === "feed" && !searchQuery) {
      loadMoreFeed(null);
    }
  }, [symbols.length, loadingSymbols, mode, searchQuery, loadMoreFeed]);

  // Periodic cache cleanup - run every 2 minutes
  useEffect(() => {
    const interval = setInterval(cleanupExpiredCaches, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [cleanupExpiredCaches]);

  // Auto-load quotes for first batch when symbols arrive
  useEffect(() => {
    if (symbols.length > 0 && detailsQueue.current.length === 0) {
      // Immediately queue the first 10 symbols for quote loading - ONLY IF NOT ERRORED
      const firstBatch = symbols.slice(0, 10);
      firstBatch.forEach(item => {
        const sym = item.symbol;
        if (sym && !getCachedQuote(sym) && !loadingDetailsMap.get(sym) && !errorDetailsMap.get(sym)) {
          detailsQueue.current.push(sym);
        }
      });
      if (detailsQueue.current.length > 0) {
        processDetailsQueue();
      }
    }
  }, [symbols, loadingDetailsMap, processDetailsQueue]);

  useEffect(() => {
    debouncedSearchSwitch(searchQuery);
    return () => debouncedSearchSwitch.cancel();
  }, [searchQuery, debouncedSearchSwitch]);

  // react-window helpers - removed rowCount and gridHeight as they'll be computed in render

  // Queue visible symbols + page more when near bottom
  const onItemsRendered = useCallback(({ visibleRowStartIndex, visibleRowStopIndex, columnCount }) => {
    const startIndex = visibleRowStartIndex * columnCount;
    const endIndex = Math.min(symbols.length - 1, (visibleRowStopIndex + 1) * columnCount - 1);

    // queue quotes for visible symbols - BUT ONLY IF NOT ALREADY PROCESSED
    for (let i = startIndex; i <= endIndex; i++) {
      const sym = symbols[i]?.symbol;
      if (!sym) continue;
      if (
        !getCachedQuote(sym) &&
        !loadingDetailsMap.get(sym) &&
        !errorDetailsMap.get(sym) && // Don't retry errors!
        !detailsQueue.current.includes(sym)
      ) {
        detailsQueue.current.push(sym);
      }
    }
    if (detailsQueue.current.length) processDetailsQueue();

    // page more symbols when near the end (more aggressive)
    const rowCount = Math.ceil(symbols.length / columnCount);
    const BUFFER_ROWS = 3; // Increased buffer for earlier loading
    const thresholdIndex = Math.max(0, (rowCount - BUFFER_ROWS) * columnCount);
    if (hasMore && endIndex >= thresholdIndex && !loadingSymbols) {
      if (mode === "feed") {
        loadMoreFeed(cursor);
      } else {
        loadMoreSearch((searchQuery || "").trim(), cursor);
      }
    }
  }, [
    symbols, loadingDetailsMap, errorDetailsMap, processDetailsQueue,
    hasMore, loadingSymbols, mode, loadMoreFeed, loadMoreSearch, searchQuery, cursor
  ]);

  // Click a card: ensure details, fallback to single fetch
  const handleCardClick = useCallback(async (item) => {
    const sym = item.symbol;
    let details = getCachedQuote(sym);
    if (!details) {
      try { details = await fetchStockBySymbol(sym); } catch { /* ignore */ }
    }
    const d = details || {};
    setSelectedStock({
      symbol: item.symbol,
      name: item.name,
      price: d.price ?? 0,
      change: d.change ?? 0,
      changePercent: d.changePercent ?? 0,
      volume: d.volume ?? 'N/A',
      marketCap: d.marketCap ?? 'N/A',
      sector: d.sector || item.sector || '—',
      peRatio: d.peRatio ?? 'N/A',
      fiftyTwoWeekLow: d.fiftyTwoWeekLow ?? 'N/A',
      fiftyTwoWeekHigh: d.fiftyTwoWeekHigh ?? 'N/A',
      dividend: d.dividend ?? 0,
      color: (d.change ?? 0) >= 0 ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600'
    });
  }, [setSelectedStock]);

  return (
    <div className="dashboard-grid-2025">
      {/* Search Header (unchanged) */}
      <div style={{ gridColumn: 'span 12' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '100px',
              padding: '12px 20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Search style={{ width: '20px', height: '20px', color: 'rgba(255, 255, 255, 0.6)' }} />
              <input
                type="text"
                placeholder="Search stocks by symbol or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: 'transparent', border: 'none', outline: 'none', flex: 1, color: '#ffffff', fontSize: '16px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid (UI classes unchanged) */}
      <div className="card-2025" style={{ gridColumn: 'span 12' }}>
        <div className="movers-grid-2025" style={{ maxHeight: `${GRID_MAX_HEIGHT}px`, overflowY: 'auto' }}>
          {symbols.length === 0 && !loadingSymbols ? (
            <div className="mover-card-2025" style={{ gridColumn: 'span 3', textAlign: 'center', opacity: 0.7 }}>
              {mode === "search" ? (
                // No search results found
                <>
                  <div className="mover-header-2025"><span className="mover-symbol-2025">❌</span></div>
                  <div className="mover-price-2025">No results found</div>
                  <div className="mover-name-2025">Try searching for "{searchQuery}" or different terms</div>
                </>
              ) : (
                // Default feed mode empty state
                <>
                  <div className="mover-header-2025"><span className="mover-symbol-2025">---</span></div>
                  <div className="mover-price-2025">Start searching</div>
                  <div className="mover-name-2025">Enter a company name or symbol</div>
                </>
              )}
            </div>
          ) : (symbols.length === 0 && loadingSymbols) ? (
            <div className="mover-card-2025" style={{ gridColumn: 'span 3', textAlign: 'center', opacity: 0.7 }}>
              <div className="mover-header-2025"><span className="mover-symbol-2025">...</span></div>
              <div className="mover-price-2025">{mode === "search" ? "Searching..." : "Loading..."}</div>
              <div className="mover-name-2025">Please wait</div>
            </div>
          ) : (
            <div style={{ height: GRID_MAX_HEIGHT }}>
              <AutoSizer>
                {({ width, height }) => {
                  const columnCount = Math.max(1, Math.floor((width + GAP) / (IDEAL_CARD_W + GAP)));
                  const columnWidth = Math.floor((width - (columnCount - 1) * GAP) / columnCount);
                  const rowCount = Math.ceil(symbols.length / columnCount);
                  const actualHeight = Math.min(height, GRID_MAX_HEIGHT);

                  return (
                    <Grid
                      columnCount={columnCount}
                      rowCount={rowCount}
                      height={actualHeight}
                      width={width}
                      columnWidth={columnWidth}
                      rowHeight={CARD_H}
                      onItemsRendered={(params) => onItemsRendered({ ...params, columnCount })}
                      className="outline-none"
                    >
                      {({ columnIndex, rowIndex, style }) => {
                        const index = rowIndex * columnCount + columnIndex;
                        const item = symbols[index];
                        
                        if (!item) {
                          return (
                            <div className="vw-cell-outer" style={style}>
                              <div className="vw-cell-pad">
                                <div className="mover-card-2025" style={{ opacity: 0.4 }} />
                              </div>
                            </div>
                          );
                        }

                        const sym = item.symbol;
                        const details = getCachedQuote(sym);
                        const isLoading = !!loadingDetailsMap.get(sym);
                        const isError = !!errorDetailsMap.get(sym);

                        return (
                          <div className="vw-cell-outer" style={style}>
                            <div className="vw-cell-pad">
                              <div 
                                className="mover-card-2025" 
                                onClick={() => handleCardClick(item)}
                                style={{ 
                                  cursor: 'pointer',
                                  transition: 'opacity 0.2s ease'
                                }}
                              >
                                <div className="mover-header-2025">
                                  <span className="mover-symbol-2025">{sym}</span>
                                  {details && details.price ? (
                                    <span className={`mover-change-2025 ${(details.change || 0) >= 0 ? 'positive-2025' : 'negative-2025'}`}>
                                      {details.changePercent ? 
                                        `${details.changePercent >= 0 ? '+' : ''}${details.changePercent.toFixed(2)}%` :
                                        details.change && details.price > 0 ? 
                                          `${details.change >= 0 ? '+' : ''}${((details.change / details.price) * 100).toFixed(2)}%` : 
                                          '0.00%'
                                      }
                                    </span>
                                  ) : isLoading ? (
                                    <span className="mover-change-2025" style={{ opacity: 0.6 }}>
                                      <div className="mini-spinner"></div>
                                    </span>
                                  ) : isError ? (
                                    <span className="mover-change-2025" style={{ color: '#ef4444', fontSize: '11px' }}>ERROR</span>
                                  ) : (
                                    <span className="mover-change-2025" style={{ opacity: 0.5 }}>--</span>
                                  )}
                                </div>
                                <div className="mover-price-2025" style={{ fontSize: '16px' }}>
                                  {details && details.price ? 
                                    `$${details.price.toFixed(2)}` : 
                                    isLoading ? 
                                      <span style={{ opacity: 0.6, fontSize: '14px' }}>Loading...</span> :
                                      isError ?
                                        <span style={{ color: '#ef4444', fontSize: '12px' }}>No Data</span> :
                                        <span style={{ opacity: 0.5 }}>--</span>
                                  }
                                </div>
                                <div className="mover-name-2025" style={{ 
                                  fontSize: '11px', // Smaller font
                                  lineHeight: '1.2', // Tighter line height
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  height: '28px' // Fixed height
                                }}>
                                  {item.name || `${sym} Inc`}
                                  {item.sector && (
                                    <div style={{ 
                                      fontSize: '10px', 
                                      opacity: 0.5, 
                                      marginTop: '1px',
                                      fontWeight: 'normal'
                                    }}>
                                      {item.sector}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    </Grid>
                  );
                }}
              </AutoSizer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseStocks;
