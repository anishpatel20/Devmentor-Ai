require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("./config/db");

const {
    projectAI,
} = require("./services/ai/aiService");

const PROJECT_ID = "6aa6d1432534329048110bdc";

const test = async () => {
    try {
        await connectDB();

        console.log("\nGenerating project-aware AI response...\n");

        const result = await projectAI({
            projectId: PROJECT_ID,
            query: "What is the capital of France?",
        });

        console.log("Answer:\n");
        console.log(result.answer);

        console.log("\nSources:\n");
        console.log(result.sources);

    } catch (error) {
        console.error("\nTest failed:");
        console.error(error);

    } finally {
        await mongoose.disconnect();
        console.log("\nMongoDB disconnected.");
     }
};

test();