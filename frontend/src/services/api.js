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
  try {
    // Use symbol search with "APP" to get popular stocks like Apple
    // This will give us more stable, well-known stocks
    const resp = await api.get("/symbol-search?q=APP");
    console.log("Fetched initial stocks:", resp.data);
    
    // Return the first 10 matches to limit the initial load
    const stocks = resp.data.matches || [];
    return stocks.slice(0, 10);
  } catch (error) {
    console.error("Error fetching initial stocks:", error);
    throw error;
  }
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
