const { buildAskPrompt } = require("./promptService");
const { generateResponse } = require("./geminiService");

const askAI = async (userPrompt) => {
    const finalPrompt = buildAskPrompt(userPrompt);

    const response = await generateResponse(finalPrompt);

    return response;
};

module.exports = {
    askAI,
};