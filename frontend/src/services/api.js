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

export default api;
