const { GoogleGenAI } = require("@google/genai");

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const generateResponse = async (prompt) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
        });

        if (!response || !response.text) {
            throw new Error("Gemini returned an empty response");
        }

        return response.text;
    } catch (error) {
        console.error("Gemini API error:", {
            message: error.message,
            status: error.status,
        });

        throw new Error("AI provider request failed");
    }
};

module.exports = {
    generateResponse,
};