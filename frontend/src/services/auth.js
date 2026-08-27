import api from "./api";

export const getHealth = async () => {
  const response = await api.get("/api/health");

  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post("/api/auth/register", userData);

  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/api/auth/login", credentials);

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/api/auth/me");

  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/api/auth/logout");

  return response.data;
};
