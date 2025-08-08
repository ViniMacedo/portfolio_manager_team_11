import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const searchSymbols = async (query) => {
  try {
    const response = await api.get(`/symbol-search`, {
      params: { q: query }
    });
    return response.data.matches; // existing server shape
  } catch (error) {
    console.error("Error searching symbols:", error);
    throw error;
  }
};

export const fetchPortfolioById = async (portfolioId) => {
  try {
    const response = await api.get(`/portfolio/${portfolioId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching portfolio with ID ${portfolioId}:`, error);
    throw error;
  }
};

export async function fetchStockBySymbol(stockSymbol) {
  try {
    const resp = await api.get(`/quote/${encodeURIComponent(stockSymbol)}`);
    return resp.data;
  } catch (error) {
    console.error(`Error fetching stock with symbol ${stockSymbol}:`, error);
    throw error;
  }
}

export async function fetchUserById(userId) {
  try {
    const resp = await api.get(`/user/${userId}`);
    return resp.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

export async function tradeStock(
  userId,
  portfolioId,
  productSymbol,
  qty,
  price,
  action
) {
  try {
    const resp = await api.post("/transaction", {
      user_id: userId,
      portfolio_id: portfolioId,
      product_symbol: productSymbol,
      qty,
      price,
      action,
    });
    return resp.data;
  } catch (error) {
    console.error("Error trading stock:", error);
    throw error;
  }
}

// -------- paged symbol search with graceful fallback -------------------

const _symbolSearchCache = new Map(); // q -> { results: [..] }
const _discoverCache = { results: null }; // discover feed cache
function _encodeCursor(offset) {
  return btoa(JSON.stringify({ o: offset }));
}
function _decodeCursor(cursor) {
  if (!cursor) return 0;
  try { return JSON.parse(atob(cursor)).o || 0; } catch { return 0; }
}

/**
 * Preferred server contract (if supported by your backend):
 *   GET /symbol-search?q=...&limit=500&cursor=...
 *   -> { items: [{symbol,name,sector}], nextCursor: "..." | null }
 *
 * Fallback (no server paging):
 *   Calls existing /symbol-search once, caches results client-side,
 *   then slices pages using cursor/limit on the client.
 */
export async function searchSymbolsPaged({ q, cursor = null, limit = 500 }) {
  const query = (q || "").trim();
  if (!query) return { items: [], nextCursor: null };

  // Try server-side paging if available
  try {
    const { data } = await api.get(`/symbol-search`, {
      params: { q: query, limit, cursor }
    });

    // If server already returns paged shape, use it:
    if (data && Array.isArray(data.items)) {
      return { items: data.items, nextCursor: data.nextCursor ?? null };
    }

    // Else, if server returns legacy shape (matches), fall back below
    if (Array.isArray(data?.matches)) {
      _symbolSearchCache.set(query, { results: data.matches });
    } else {
      // Unexpected shape, fall back to legacy helper
      const results = await searchSymbols(query);
      _symbolSearchCache.set(query, { results });
    }
  } catch (err) {
    // If server rejects limit/cursor, fall back to legacy helper
    const results = await searchSymbols(query);
    _symbolSearchCache.set(query, { results });
  }

  // Client-side paging fallback
  const cached = _symbolSearchCache.get(query);
  const offset = _decodeCursor(cursor);
  const all = cached?.results || [];
  const items = all.slice(offset, offset + limit);
  const nextOffset = offset + items.length;
  const nextCursor = nextOffset < all.length ? _encodeCursor(nextOffset) : null;
  return { items, nextCursor };
}

// -------- discover/preload symbols with graceful fallback -------------

/**
 * Preferred server contract:
 *   GET /discover?limit=500&cursor=...
 *   -> { items: [{symbol,name,sector}], nextCursor: "..." | null }
 *
 * Fallback:
 *   Builds a large feed by merging multiple real searches, then pages locally.
 */
export async function discoverSymbolsPaged({ cursor = null, limit = 500 }) {
  // Try server-side discover if available
  try {
    const { data } = await api.get(`/discover`, {
      params: { limit, cursor }
    });

    // If server already returns discover shape, use it:
    if (data && Array.isArray(data.items)) {
      return { items: data.items, nextCursor: data.nextCursor ?? null };
    }
  } catch (err) {
    // fall through to client fallback
  }

  // Fallback: build once by merging multiple real searches (no mocks)
  if (!_discoverCache.results) {
    const letters = ["a","e","i","o","u","s","t","n","r","l","m","c","b","p","d"];
    const seen = new Set();
    const merged = [];
    
    for (const ch of letters) {
      try {
        const results = await searchSymbols(ch); // your existing endpoint
        for (const m of results || []) {
          if (!m?.symbol) continue;
          const sym = m.symbol.toUpperCase();
          if (!seen.has(sym)) {
            seen.add(sym);
            merged.push({ 
              symbol: sym, 
              name: m.name || sym, 
              sector: m.sector || "" 
            });
          }
        }
      } catch {
        // ignore one letter failing
      }
      // Stop early if we already have a lot
      if (merged.length > 5000) break;
    }
    _discoverCache.results = merged;
  }

  // Client-side paging of the merged feed
  const offset = _decodeCursor(cursor);
  const all = _discoverCache.results || [];
  const items = all.slice(offset, offset + limit);
  const nextOffset = offset + items.length;
  const nextCursor = nextOffset < all.length ? _encodeCursor(nextOffset) : null;
  return { items, nextCursor };
}

// -------- batch quotes with graceful fallback -------------------------

/**
 * Preferred server contract:
 *   POST /quotes  body: { symbols: ["AAPL","MSFT",...] }
 *   -> { "AAPL": {price,change,changePercent,...}, "MSFT": {...}, ... }
 *
 * Fallback:
 *   Performs per-symbol GET /quote/{symbol} and assembles the map.
 */
export async function fetchQuotesBatch(symbols) {
  if (!Array.isArray(symbols) || symbols.length === 0) return {};
  try {
    const { data } = await api.post(`/quotes`, { symbols });
    if (data && typeof data === "object") return data;
    // If server returns unexpected shape fall back
  } catch (e) {
    // fall through
  }
  // Fallback to per symbol fetches
  const out = {};
  for (const s of symbols) {
    try {
      out[s] = await fetchStockBySymbol(s);
    } catch {
      // leave undefined, will be treated as error in UI
    }
  }
  return out;
}


export default api;
