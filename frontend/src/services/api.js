import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const searchSymbols = async (query) => {
  try {
    const response = await api.get(
      `/symbol-search?q=${encodeURIComponent(query)}`
    );
    console.log("Symbol search results:", response.data);
    return response.data.matches;
  } catch (error) {
    console.error("Error searching symbols:", error);
    throw error;
  }
};

export const fetchPortfolioById = async (portfolioId) => {
  try {
    const response = await api.get(`/portfolio/${portfolioId}`);
    console.log(`Fetched portfolio with ID ${portfolioId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching portfolio with ID ${portfolioId}:`, error);
    throw error;
  }
};

export async function fetchStockBySymbol(stockSymbol) {
  try {
    const resp = await api.get(`/quote/${stockSymbol}`);
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

export async function fetchAllStocks() {
  // Return a curated list of popular stocks without API calls
  // This is more efficient than trying to search for "all stocks"
  const popularStocks = [
    { symbol: 'AAPL', name: 'Apple Inc' },
    { symbol: 'GOOGL', name: 'Alphabet Inc' },
    { symbol: 'MSFT', name: 'Microsoft Corp' },
    { symbol: 'AMZN', name: 'Amazon.com Inc' },
    { symbol: 'TSLA', name: 'Tesla Inc' },
    { symbol: 'META', name: 'Meta Platforms Inc' },
    { symbol: 'NVDA', name: 'NVIDIA Corp' },
    { symbol: 'NFLX', name: 'Netflix Inc' },
    { symbol: 'UBER', name: 'Uber Technologies Inc' },
    { symbol: 'CRM', name: 'Salesforce Inc' },
    { symbol: 'COIN', name: 'Coinbase Global Inc' },
    { symbol: 'PYPL', name: 'PayPal Holdings Inc' },
    { symbol: 'SPOT', name: 'Spotify Technology SA' },
    { symbol: 'AMD', name: 'Advanced Micro Devices Inc' },
    { symbol: 'INTC', name: 'Intel Corp' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co' },
    { symbol: 'BAC', name: 'Bank of America Corp' },
    { symbol: 'JNJ', name: 'Johnson & Johnson' },
    { symbol: 'V', name: 'Visa Inc' },
    { symbol: 'WMT', name: 'Walmart Inc' }
  ];
  
  console.log("Returning popular stocks for browsing:", popularStocks);
  return popularStocks;
}

export async function tradeStock(
  userId,
  stockSymbol,
  action,
  quantity,
  price,
  portfolioId
) {
  try {
    const resp = await api.post("/transaction", {
      user_id: userId,
      portfolio_id: portfolioId,
      product_symbol: stockSymbol,
      qty: quantity,
      price: price,
      action: action,
    });
    console.log("Trade executed:", resp.data);
    return resp.data;
  } catch (error) {
    console.error("Error trading stock:", error);
    throw error;
  }
}

export default api;
