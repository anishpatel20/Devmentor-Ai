const { buildAskPrompt, buildDebugPrompt, buildExplainPrompt } = require("./promptService");
const { generateResponse } = require("./geminiService");
const { debugResponseSchema } = require("../../validators/aiValidator");

const askAI = async (userPrompt, context = {}) => {
    const finalPrompt = buildAskPrompt(
        userPrompt,
        context
    );
    const response = await generateResponse(finalPrompt);
    return response;
};

const debugAI = async ({
    code,
    error,
    language = "Not specified",
    context = "",
}) => {
    const prompt = buildDebugPrompt({
        code,
        error,
        language,
        context,
    });

    const response = await generateResponse(prompt);

    let parsedResponse;

    try {
        parsedResponse = JSON.parse(response);
    } catch (error) {
        throw new Error("AI returned an invalid debugging response");
    }

    const { error: validationError, value } =
        debugResponseSchema.validate(parsedResponse, {
            abortEarly: false,
        });

    if (validationError) {
        throw new Error("AI returned an invalid debugging response");
    }

    return value;
};


const explainAI = async ({
    code,
    language = "Not specified",
    question = "",
    context = {},
}) => {
    const prompt = buildExplainPrompt({
        code,
        language,
        question,
        context,
    });

    const response = await generateResponse(prompt);

    return response;
};


module.exports = {
    askAI,
    debugAI,
    explainAI,
};
