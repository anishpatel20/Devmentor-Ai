import api from "./api";

export const askAI = async (prompt) => {
    const response = await api.post("/api/ai/ask", {
        prompt,
    });

    return response.data;
};