import React, { useState, useEffect, useRef, useMemo, useCallback, useDeferredValue } from "react";
import { Search } from "lucide-react";
import debounce from "lodash/debounce";
import { FixedSizeGrid as Grid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { 
  searchSymbolsPaged, 
  discoverSymbolsPaged,
  fetchQuotesBatch, 
  fetchStockBySymbol 
} from "../services/api";

const IDEAL_CARD_W = 280;
const CARD_H = 240;
const GAP = 24;
const GRID_MAX_HEIGHT = 600;

const BrowseStocks = ({ searchQuery, setSearchQuery, setSelectedStock }) => {
  // Double-buffer approach to prevent flicker
  const [symbols, setSymbols] = useState([]);           // source of truth for paging
  const [viewSymbols, setViewSymbols] = useState([]);   // what the Grid renders
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchVersionRef = useRef(0);

  // Quotes cache + status
  const detailsCache = useRef(new Map());
  const [loadingDetailsMap, setLoadingDetailsMap] = useState(new Map());
  const [errorDetailsMap, setErrorDetailsMap] = useState(new Map());

  // Fetch queue for visible symbols (batched)
  const detailsQueue = useRef([]);
  const processingQueue = useRef(false);

  // Use deferred value to prevent typing spikes
  const deferredQuery = useDeferredValue(searchQuery);

  // --- Helpers ---
  const resetCache = useCallback(() => {
    detailsCache.current.clear();
    setLoadingDetailsMap(new Map());
    setErrorDetailsMap(new Map());
  }, []);

  // Double-buffer search with version guard
  const debouncedSearch = useMemo(() =>
    debounce(async (q) => {
      const query = (q || "").trim();
      const version = ++searchVersionRef.current;
      setIsSearching(true);

      try {
        resetCache(); // Clear quote cache for new search
        
        if (!query) {
          // Load default feed
          const { items, nextCursor } = await discoverSymbolsPaged({ cursor: null, limit: 100 });
          if (searchVersionRef.current !== version) return; // stale
          setSymbols(items);
          setViewSymbols(items);  // swap when ready (no flash)
          setCursor(nextCursor);
          setHasMore(!!nextCursor);
        } else {
          // Search for symbols
          const { items, nextCursor } = await searchSymbolsPaged({ q: query, cursor: null, limit: 500 });
          if (searchVersionRef.current !== version) return; // stale
          
          // Keep empty results as empty - don't fall back to discovery
          setSymbols(items); // Could be empty array
          setViewSymbols(items); // Could be empty array
          setCursor(nextCursor);
          setHasMore(!!nextCursor);
        }
      } catch (error) {
        console.error('Search error:', error);
        // On error, show empty results for search queries
        if (query) {
          setSymbols([]);
          setViewSymbols([]);
          setCursor(null);
          setHasMore(false);
        }
      } finally {
        if (searchVersionRef.current === version) setIsSearching(false);
      }
    }, 250),
  [resetCache]);

  // Load more symbols for pagination
  const loadMoreSymbols = useCallback(async () => {
    if (isSearching || !hasMore) return;
    
    try {
      const query = (deferredQuery || "").trim();
      let result;
      
      if (!query) {
        result = await discoverSymbolsPaged({ cursor, limit: 100 });
      } else {
        // For search queries, only load more if we already have results
        if (symbols.length === 0) return; // Don't load more if no initial results
        result = await searchSymbolsPaged({ q: query, cursor, limit: 500 });
      }
      
      const newSymbols = [...symbols, ...result.items];
      setSymbols(newSymbols);
      setViewSymbols(newSymbols);
      setCursor(result.nextCursor);
      setHasMore(!!result.nextCursor);
    } catch (error) {
      console.error('Load more error:', error);
    }
  }, [isSearching, hasMore, cursor, symbols, deferredQuery]);

  // Initial load - only when truly empty (no search query)
  useEffect(() => {
    const hasQuery = (deferredQuery || "").trim().length > 0;
    if (viewSymbols.length === 0 && !isSearching && !hasQuery) {
      debouncedSearch("");
    }
  }, [viewSymbols.length, isSearching, deferredQuery, debouncedSearch]);

  useEffect(() => {
    debouncedSearch(deferredQuery);
    return () => debouncedSearch.cancel();
  }, [deferredQuery, debouncedSearch]);

  // Batch-process visible queue
  const processDetailsQueue = useCallback(async () => {
    if (processingQueue.current || detailsQueue.current.length === 0) return;
    processingQueue.current = true;
    const BATCH_SIZE = 10;

    while (detailsQueue.current.length > 0) {
      const batch = detailsQueue.current.splice(0, BATCH_SIZE);
      
      setLoadingDetailsMap(prev => {
        const next = new Map(prev);
        batch.forEach(s => next.set(s, true));
        return next;
      });

      try {
        const quotes = await fetchQuotesBatch(batch);
        
        // cache successes
        Object.entries(quotes).forEach(([sym, det]) => {
          if (det) {
            detailsCache.current.set(sym, det);
          }
        });
        
        // mark missing as error
        const missing = batch.filter(s => !quotes[s]);
        if (missing.length) {
          setErrorDetailsMap(prev => {
            const next = new Map(prev);
            missing.forEach(s => next.set(s, true));
            return next;
          });
        }
      } catch (error) {
        console.error('Batch quote error:', error);
        // whole-batch error
        setErrorDetailsMap(prev => {
          const next = new Map(prev);
          batch.forEach(s => next.set(s, true));
          return next;
        });
      } finally {
        setLoadingDetailsMap(prev => {
          const next = new Map(prev);
          batch.forEach(s => next.delete(s));
          return next;
        });
      }

      await new Promise(r => setTimeout(r, 500));
    }

    processingQueue.current = false;
  }, []);

  // Click a card: ensure details, fallback to single fetch
  const handleCardClick = useCallback(async (item) => {
    const sym = item.symbol;
    let details = detailsCache.current.get(sym);
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

  const onItemsRendered = useCallback(({ visibleRowStartIndex, visibleRowStopIndex, columnCount }) => {
    const startIndex = visibleRowStartIndex * columnCount;
    const endIndex = Math.min(viewSymbols.length - 1, (visibleRowStopIndex + 1) * columnCount - 1);

    // queue quotes for visible symbols
    for (let i = startIndex; i <= endIndex; i++) {
      const sym = viewSymbols[i]?.symbol;
      if (!sym) continue;
      if (
        !detailsCache.current.has(sym) &&
        !loadingDetailsMap.get(sym) &&
        !errorDetailsMap.get(sym) &&
        !detailsQueue.current.includes(sym)
      ) {
        detailsQueue.current.push(sym);
      }
    }
    if (detailsQueue.current.length) processDetailsQueue();

    // page more symbols when near the end
    const rowCount = Math.ceil(viewSymbols.length / columnCount);
    const BUFFER_ROWS = 2;
    const thresholdIndex = (rowCount - BUFFER_ROWS) * columnCount;
    if (hasMore && endIndex >= thresholdIndex && !isSearching) {
      loadMoreSymbols();
    }
  }, [
    viewSymbols, loadingDetailsMap, errorDetailsMap, processDetailsQueue,
    hasMore, isSearching, loadMoreSymbols
  ]);

  return (
    <div className="dashboard-grid-2025">
      {/* Search Header */}
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
                placeholder="Search symbols (e.g. AAPL, TSLA, MSFT)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  outline: 'none', 
                  flex: 1, 
                  color: '#ffffff', 
                  fontSize: '16px' 
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Virtualized Grid */}
      <div className="card-2025" style={{ gridColumn: 'span 12' }}>
        <div className="movers-grid-2025" style={{ 
          maxHeight: `${GRID_MAX_HEIGHT}px`, 
          overflowY: 'auto',
          position: 'relative'
        }}>
          <div style={{ height: GRID_MAX_HEIGHT }}>
            <AutoSizer>
              {({ width, height }) => {
                const columnCount = Math.max(1, Math.floor((width + GAP) / (IDEAL_CARD_W + GAP)));
                const columnWidth = Math.floor((width - (columnCount - 1) * GAP) / columnCount);
                const rowCount = Math.max(1, Math.ceil((viewSymbols.length || 1) / columnCount));
                const actualHeight = Math.min(height, GRID_MAX_HEIGHT);

                return (
                  <>
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
                        const item = viewSymbols[index];
                        
                        // Show loading/empty state in first cell only
                        if (index === 0 && viewSymbols.length === 0) {
                          const hasSearchQuery = (deferredQuery || "").trim().length > 0;
                          return (
                            <div className="vw-cell-outer" style={style}>
                              <div className="vw-cell-pad">
                                <div className="mover-card-2025" style={{ textAlign: 'center', opacity: 0.7 }}>
                                  <div className="mover-header-2025">
                                    <span className="mover-symbol-2025">
                                      {isSearching ? '...' : (hasSearchQuery ? '❌' : '---')}
                                    </span>
                                  </div>
                                  <div className="mover-price-2025">
                                    {isSearching ? 'Searching...' : 
                                     hasSearchQuery ? 'No matches found' : 'Start searching'}
                                  </div>
                                  <div className="mover-name-2025">
                                    {isSearching ? 'Please wait' : 
                                     hasSearchQuery ? 'Try a different symbol' : 'Enter a symbol (e.g. AAPL)'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        
                        // Empty placeholder cells
                        if (!item) {
                          return (
                            <div className="vw-cell-outer" style={style}>
                              <div className="vw-cell-pad">
                                <div className="mover-card-2025" style={{ opacity: 0.1 }} />
                              </div>
                            </div>
                          );
                        }

                        const sym = item.symbol;
                        const details = detailsCache.current.get(sym);
                        const isLoading = !!loadingDetailsMap.get(sym);
                        const isError = !!errorDetailsMap.get(sym);

                        return (
                          <div className="vw-cell-outer" style={style}>
                            <div className="vw-cell-pad">
                              <div 
                                className="mover-card-2025" 
                                onClick={() => handleCardClick(item)}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleCardClick(item);
                                  }
                                }}
                                style={{ 
                                  opacity: isSearching ? 0.8 : 1,
                                  transition: 'opacity 0.2s ease'
                                }}
                              >
                                <div className="mover-header-2025">
                                  <span className="mover-symbol-2025">{sym}</span>
                                  {details ? (
                                    <span className={`mover-change-2025 ${details.change >= 0 ? 'positive-2025' : 'negative-2025'}`}>
                                      {details.changePercent ? 
                                        `${details.changePercent >= 0 ? '+' : ''}${details.changePercent.toFixed(2)}%` :
                                        details.price > 0 ? `${details.change >= 0 ? '+' : ''}${((details.change / details.price) * 100).toFixed(2)}%` : '--'
                                      }
                                    </span>
                                  ) : isError ? (
                                    <span className="mover-change-2025" style={{ 
                                      backgroundColor: 'rgba(255,255,255,0.1)', 
                                      color: 'var(--text-dim)',
                                      fontSize: '10px',
                                      padding: '2px 6px',
                                      borderRadius: '8px'
                                    }}>ERR</span>
                                  ) : (
                                    <div className="mover-loading-skeleton" style={{ width: '40px', height: '16px' }}></div>
                                  )}
                                </div>
                                <div className="mover-price-2025">
                                  {details ? 
                                    `$${details.price?.toFixed(2) || '0.00'}` : 
                                    isLoading ? 
                                      <div className="mover-loading-skeleton" style={{ width: '80px', height: '26px' }}></div> : 
                                      '—'
                                  }
                                </div>
                                <div className="mover-name-2025">
                                  {isLoading && !details ? 
                                    <div className="mover-loading-skeleton" style={{ width: '100%', height: '13px', marginBottom: '4px' }}></div> :
                                    item.name
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    </Grid>
                    
                    {/* Non-blocking search overlay */}
                    {isSearching && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.3)',
                        backdropFilter: 'blur(2px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '16px',
                        zIndex: 10
                      }}>
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(20px)',
                          padding: '16px 24px',
                          borderRadius: '100px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          color: 'white'
                        }}>
                          <div style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid rgba(255, 255, 255, 0.3)',
                            borderTop: '2px solid white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }} />
                          <span>Searching...</span>
                        </div>
                      </div>
                    )}
                  </>
                );
              }}
            </AutoSizer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseStocks;
