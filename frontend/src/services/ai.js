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


export const killCriticAI = async (input, context = {}) => {
    if (!input || typeof input !== "string" || !input.trim()) {
        throw new Error("Input is required.");
    }

    const response = await api.post("/api/ai/killcritic", {
        input: input.trim(),
        context,
    });


    // console.log("KillCritic AI response:", response); // Log the response for debugging

    return response.data;
};



export const reviewAI = async ({
    code,
    language,
    requirements,
    mode,
    context,
}) => {
    const response = await api.post("/api/ai/review", {
        code,
        language,
        requirements,
        mode,
        context,
    });


    // console.log("Review AI response:", response); // Log the response for debugging

    return response.data;
};