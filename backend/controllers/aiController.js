const { askAI } = require("../services/ai/aiService");

const MAX_PROMPT_LENGTH = 4000;

const askAIController = async (req, res, next) => {
    try {
        const { prompt } = req.body;

        if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
            return res.status(400).json({
                message: "Prompt is required",
            });
        }

        const trimmedPrompt = prompt.trim();

        if (trimmedPrompt.length > MAX_PROMPT_LENGTH) {
            return res.status(400).json({
                message: `Prompt must be ${MAX_PROMPT_LENGTH} characters or less`,
            });
        }

        const response = await askAI(trimmedPrompt);

        return res.status(200).json({
            success: true,
            response,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    askAIController,
};