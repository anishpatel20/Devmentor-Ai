import api from "./api";

export const askAI = async (prompt, context) => {
    const response = await api.post("/api/ai/ask", {
        prompt,
        context, // Shared Context contains relevant information from the current development task, allowing different AI modes to understand what the developer is already working on.
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


export const explainAI = async ({
    code,
    language,
    question,
    context,
}) => {
    const response = await api.post("/api/ai/explain", {
        code,
        language,
        question,
        context,
    });

    return response.data;
};