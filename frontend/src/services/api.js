import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

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
    console.error('Error fetching user:', error);
    throw error;
  }
}

export async function tradeStock(userId, portfolioId, productSymbol, qty, price, action) {
  try {
    const resp = await api.post('/transaction', {
      user_id: userId,
      portfolio_id: portfolioId,
      product_symbol: productSymbol,
      qty: qty,
      price: price,
      action: action
    });
    console.log('Trade executed:', resp.data);
    return resp.data;
  } catch (error) {
    console.error('Error trading stock:', error);
    throw error;
  }
}


export default api;
