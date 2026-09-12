import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 65000,
});

export const getHealth = async () => {
  const response = await api.get("/api/health");

  return response.data;
};

export default api;