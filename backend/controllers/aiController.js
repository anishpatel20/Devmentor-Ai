const { askAI, debugAI, explainAI } = require("../services/ai/aiService");
const { debugRequestSchema,explainRequestSchema } = require("../validators/aiValidator");

const MAX_PROMPT_LENGTH = 4000;

const askAIController = async (req, res, next) => {
    try {
        const { prompt, context = {} } = req.body;

        console.log("context", context); //testing

        if (!context) {
            console.log("context is null or undefined");
        }

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




        // Validate Shared Context
        if (typeof context !== "object" || context === null || Array.isArray(context)) {
            return res.status(400).json({
                message: "Context must be an object",
            });
        }

        const MAX_CONTEXT_FIELD_LENGTH = 4000;
        const MAX_CONTEXT_TOTAL_LENGTH = 12000;

        const allowedContextFields = [
            "code",
            "language",
            "error",
            "problem",
            "rootCause",
            "solution",
            "fixedCode",
        ];

        const validatedContext = {};

        for (const field of allowedContextFields) {
            const value = context[field];

            // Ignore fields that were not provided
            if (value === undefined || value === null || value === "") {
                continue;
            }

            // Every context field must be a string
            if (typeof value !== "string") {
                return res.status(400).json({
                    message: `Context field "${field}" must be a string`,
                });
            }

            // Prevent excessively large individual fields
            if (value.length > MAX_CONTEXT_FIELD_LENGTH) {
                return res.status(400).json({
                    message: `Context field "${field}" is too long`,
                });
            }

            validatedContext[field] = value.trim();
        }

        // Prevent the complete context from becoming too large
        const totalContextLength = Object.values(validatedContext)
            .reduce((total, value) => total + value.length, 0);

        if (totalContextLength > MAX_CONTEXT_TOTAL_LENGTH) {
            return res.status(400).json({
                message: "Shared context is too large",
            });
        }

        const response = await askAI(
            trimmedPrompt,
            validatedContext
        );

        return res.status(200).json({
            success: true,
            response,
        });
    } catch (error) {
        next(error);
    }
};

const debug = async (req, res, next) => {
    try {
        const { error: validationError, value } =
            debugRequestSchema.validate(req.body, {
                abortEarly: false,
            });

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: "Invalid debug request",
                errors: validationError.details.map((detail) => detail.message),
            });
        }

        const result = await debugAI(value);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const explain = async (req, res, next) => {
    try {
        const { error: validationError, value } = explainRequestSchema.validate(req.body, { abortEarly: false,});

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: "Invalid explain request",
                errors: validationError.details.map(
                    (detail) => detail.message
                ),
            });
        }

        const response = await explainAI(value);

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
    debug,
    explain,
};
