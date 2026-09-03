import api from "./api";

export const askAI = async (prompt) => {
    const response = await api.post("/api/ai/ask", {
        prompt,
    });

    return response.data;
};

export const debugAI = async ({
    code,
    error,
    language,
    context,
}) => {
    const response = await api.post("/api/ai/debug", {
        code,
        error,
        language,
        context,
    });

    return response.data;
};