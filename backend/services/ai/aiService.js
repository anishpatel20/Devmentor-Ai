const { buildAskPrompt, buildDebugPrompt, buildExplainPrompt, buildReviewPrompt, buildKillCriticPrompt, buildKill_modeCriticPrompt } = require("./promptService");
const { generateResponse } = require("./geminiService");
const { debugResponseSchema, reviewResponseSchema, killCriticResponseSchema } = require("../../validators/aiValidator");

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




const reviewAI = async ({
    code,
    language,
    requirements,
    context,
}) => {
    const prompt = buildReviewPrompt({
        code,
        language,
        requirements,
        context,
    });

    const response = await generateResponse(prompt);

    let parsedResponse;

    try {
        let cleanedResponse = response;
        // console.log("Raw AI review response:", cleanedResponse);

        // If Gemini returned a string, clean possible Markdown code fences
        if (typeof response === "string") {
            cleanedResponse = response
                .trim()
                .replace(/^```json\s*/i, "")
                .replace(/^```\s*/i, "")
                .replace(/\s*```$/i, "")
                .trim();

            parsedResponse = JSON.parse(cleanedResponse);
        } else {
            parsedResponse = response;
        }
        // console.log("Parsed AI review response:", parsedResponse);
    } catch (error) {
        console.error("Raw AI review response:", response);

        throw new Error(
            "AI returned invalid JSON for code review"
        );
    }

    const { error, value } =
        reviewResponseSchema.validate(parsedResponse, {
            abortEarly: false,
        });

    if (error) {
        console.error(
            "Review validation error:",
            error.details
        );

        throw new Error(
            "AI returned an invalid code review response"
        );
    }

    return value;
};


const killCriticAI = async ({
    code,
    language,
    requirements,
    context,
}) => {
    const prompt = buildKillCriticPrompt({
        code,
        language,
        requirements,
        context,
    });

    const response = await generateResponse(prompt);

    let parsedResponse;

    try {
        let cleanedResponse = response;

        if (typeof response === "string") {
            cleanedResponse = response
                .trim()
                .replace(/^```json\s*/i, "")
                .replace(/^```\s*/i, "")
                .replace(/\s*```$/i, "")
                .trim();

            parsedResponse = JSON.parse(cleanedResponse);
        } else {
            parsedResponse = response;
        }
    } catch (error) {
        console.error(
            "Raw AI KillCritic response:",
            response
        );

        throw new Error(
            "AI returned invalid JSON for KillCritic"
        );
    }

    const { error, value } =
        killCriticResponseSchema.validate(
            parsedResponse,
            {
                abortEarly: false,
            }
        );

    if (error) {
        console.error(
            "KillCritic validation error:",
            error.details
        );

        throw new Error(
            "AI returned an invalid KillCritic response"
        );
    }

    return value;
};



const killCriticAI_mode = async ({ input, context = {} }) => {
    try {
        const prompt = buildKill_modeCriticPrompt({
            input,
            context,
        });

        const response = await generateResponse(prompt);

        return response;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    askAI,
    debugAI,
    explainAI,
    reviewAI,
    killCriticAI,
    killCriticAI_mode,
};
