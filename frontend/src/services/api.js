import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const testApi = {
  create: (content) => api.post('/test/create', { content }),
  list: () => api.get('/test/list'),
  clear: () => api.delete('/test/clear'),
};

export default api;
