const { GoogleGenAI } = require("@google/genai");

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS || 60000);
const AI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";

const generateResponse = async (prompt) => {
    const startedAt = Date.now();

    try {
        const response = await Promise.race([
            ai.models.generateContent({
                model: AI_MODEL,
                contents: prompt,
            }),
            new Promise((_, reject) => {
                setTimeout(() => {
                    const timeoutError = new Error(
                        "AI service timed out. Please try again."
                    );
                    timeoutError.status = 504;
                    timeoutError.statusCode = 504;
                    reject(timeoutError);
                }, AI_TIMEOUT_MS);
            }),
        ]);

        if (!response || !response.text) {
            throw new Error("Gemini returned an empty response");
        }

        // console.log(`Gemini response completed in ${Date.now() - startedAt}ms`);
        return response.text;
        
    } catch (error) {
        console.error("Gemini API error:", {
            message: error.message,
            status: error.status,
            durationMs: Date.now() - startedAt,
        });

        if (error.status === 504) {
            const timeoutError = new Error(
                "AI service took too long to respond. Please try again."
            );
            timeoutError.status = 504;
            timeoutError.statusCode = 504;
            throw timeoutError;
        }

        if (error.status === 503) {
            const providerError = new Error(
                "AI service is temporarily unavailable. Please try again in a moment."
            );
            providerError.status = 503;
            providerError.statusCode = 503;
            throw providerError;
        }

        const providerError = new Error("AI provider request failed");
        providerError.status = error.status || 500;
        providerError.statusCode = providerError.status;
        throw providerError;
    }
};

module.exports = {
    generateResponse,
};