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

const IDEAL_CARD_W = 320;
const CARD_H = 280;
const GAP = 24;
const GRID_MAX_HEIGHT = 600;

const BrowseStocks = ({ searchQuery, setSearchQuery, setSelectedStock }) => {
  // MODE: 'feed' (no search) vs 'search'
  const [mode, setMode] = useState("feed");

  // Paged symbols (shared by both modes)
  const [symbols, setSymbols] = useState([]);        // [{symbol,name,sector}]
  const [cursor, setCursor] = useState(null);        // server/client cursor
  const [hasMore, setHasMore] = useState(false);
  const [loadingSymbols, setLoadingSymbols] = useState(false);

  // Quotes cache + status
  const detailsCache = useRef(new Map());            // symbol -> details
  const [loadingDetailsMap, setLoadingDetailsMap] = useState(new Map());
  const [errorDetailsMap, setErrorDetailsMap] = useState(new Map());

  // Fetch queue for visible symbols (batched)
  const detailsQueue = useRef([]);
  const processingQueue = useRef(false);

  // --- Helpers ---
  const resetLists = useCallback(() => {
    setSymbols([]);
    setCursor(null);
    setHasMore(false);
    setLoadingSymbols(false);
    detailsCache.current.clear();
    setLoadingDetailsMap(new Map());
    setErrorDetailsMap(new Map());
  }, []);

  const loadMoreFeed = useCallback(async (cur = null) => {
    if (loadingSymbols) return;
    setLoadingSymbols(true);
    try {
      console.log('Loading feed with cursor:', cur);
      const { items, nextCursor } = await discoverSymbolsPaged({ cursor: cur, limit: 100 }); // Reduced to 100 for faster loading
      console.log('Feed loaded:', items.length, 'items');
      setSymbols(prev => [...prev, ...items]);
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
    setLoadingSymbols(true);
    try {
      const { items, nextCursor } = await searchSymbolsPaged({ q, cursor: cur, limit: 500 });
      setSymbols(prev => [...prev, ...items]);
      setCursor(nextCursor);
      setHasMore(!!nextCursor);
    } finally {
      setLoadingSymbols(false);
    }
  }, [loadingSymbols]);

  // Switch mode on query changes
  const debouncedSearchSwitch = useMemo(() =>
    debounce(async (q) => {
      const qtrim = (q || "").trim();
      const newMode = qtrim ? "search" : "feed";
      
      // Only reset if mode actually changes
      if (mode !== newMode) {
        setMode(newMode);
        
        // Don't clear symbols immediately to prevent flicker
        setLoadingSymbols(true);
        
        if (newMode === "feed") {
          resetLists();
          await loadMoreFeed(null);          // PRELOAD first page
        } else {
          resetLists();
          await loadMoreSearch(qtrim, null); // PRELOAD first search page
        }
      } else if (newMode === "search") {
        // Same search mode but different query - show loading but keep old results briefly
        setLoadingSymbols(true);
        resetLists();
        await loadMoreSearch(qtrim, null);
      }
    }, 300),
  [resetLists, loadMoreFeed, loadMoreSearch, mode]);

  // Load initial feed on component mount
  useEffect(() => {
    if (symbols.length === 0 && !loadingSymbols && mode === "feed" && !searchQuery) {
      loadMoreFeed(null);
    }
  }, [symbols.length, loadingSymbols, mode, searchQuery, loadMoreFeed]);

  useEffect(() => {
    debouncedSearchSwitch(searchQuery);
    return () => debouncedSearchSwitch.cancel();
  }, [searchQuery, debouncedSearchSwitch]);

  // Batch-process visible queue
  const processDetailsQueue = useCallback(async () => {
    if (processingQueue.current || detailsQueue.current.length === 0) return;
    processingQueue.current = true;
    const BATCH_SIZE = 10; // Reduced batch size for better performance

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
        
        // cache successes
        Object.entries(quotes).forEach(([sym, det]) => {
          if (det) {
            console.log('Caching quote for', sym, det);
            detailsCache.current.set(sym, det);
          }
        });
        
        // mark missing as error
        const missing = batch.filter(s => !quotes[s]);
        if (missing.length) {
          console.log('Missing quotes for:', missing);
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

      await new Promise(r => setTimeout(r, 500)); // Increased delay to reduce API pressure
    }

    processingQueue.current = false;
  }, []);

  // react-window helpers - removed rowCount and gridHeight as they'll be computed in render

  // Queue visible symbols + page more when near bottom
  const onItemsRendered = useCallback(({ visibleRowStartIndex, visibleRowStopIndex, columnCount }) => {
    const startIndex = visibleRowStartIndex * columnCount;
    const endIndex = Math.min(symbols.length - 1, (visibleRowStopIndex + 1) * columnCount - 1);

    // queue quotes for visible symbols
    for (let i = startIndex; i <= endIndex; i++) {
      const sym = symbols[i]?.symbol;
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
    const rowCount = Math.ceil(symbols.length / columnCount);
    const BUFFER_ROWS = 2;
    const thresholdIndex = (rowCount - BUFFER_ROWS) * columnCount;
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
              <div className="mover-header-2025"><span className="mover-symbol-2025">---</span></div>
              <div className="mover-price-2025">Start searching</div>
              <div className="mover-name-2025">Enter a company name or symbol</div>
            </div>
          ) : (symbols.length === 0 && loadingSymbols) ? (
            <div className="mover-card-2025" style={{ gridColumn: 'span 3', textAlign: 'center', opacity: 0.7 }}>
              <div className="mover-header-2025"><span className="mover-symbol-2025">...</span></div>
              <div className="mover-price-2025">Loading...</div>
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
                        const details = detailsCache.current.get(sym);
                        const isLoading = !!loadingDetailsMap.get(sym);
                        const isError = !!errorDetailsMap.get(sym);

                        return (
                          <div className="vw-cell-outer" style={style}>
                            <div className="vw-cell-pad">
                              <div 
                                className="mover-card-2025" 
                                onClick={() => handleCardClick(item)}
                                style={{ 
                                  opacity: loadingSymbols ? 0.6 : 1,
                                  transition: 'opacity 0.2s ease'
                                }}
                              >
                                <div className="mover-header-2025">
                                  <span className="mover-symbol-2025">{sym}</span>
                                  {details ? (
                                    <span className={`mover-change-2025 ${details.change >= 0 ? 'positive-2025' : 'negative-2025'}`}>
                                      {details.changePercent ? 
                                        `${details.changePercent.toFixed(2)}%` :
                                        details.price > 0 ? `${((details.change / details.price) * 100).toFixed(2)}%` : '--'
                                      }
                                    </span>
                                  ) : isError ? (
                                    <span className="mover-change-2025">ERR</span>
                                  ) : (
                                    <span className="mover-change-2025">--</span>
                                  )}
                                </div>
                                <div className="mover-price-2025">
                                  {details ? `$${details.price?.toFixed(2) || '0.00'}` : (isLoading ? 'Loading…' : '—')}
                                </div>
                                <div className="mover-name-2025">{item.name}</div>
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
