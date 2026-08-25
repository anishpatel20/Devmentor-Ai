const API_URL = import.meta.env.VITE_API_URL;

export const getHealth = async () => {
  const response = await fetch(`${API_URL}/api/health`);

  if (!response.ok) {
    throw new Error("Backend request failed");
  }

  return response.json();
};