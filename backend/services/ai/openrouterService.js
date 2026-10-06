const OpenAI = require("openai");

const openrouter = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "DevMentor AI",
    },
});

const generateResponse = async (prompt) => {
    try {
        const response = await openrouter.chat.completions.create({
            model: "openrouter/free",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        return response.choices[0]?.message?.content || "";
    } catch (error) {
        console.error("OpenRouter API Error:", error);

        throw error;
    }
};

module.exports = {
    generateResponse,
};