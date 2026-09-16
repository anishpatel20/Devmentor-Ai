require("dotenv").config();

const mongoose = require("mongoose");

const {
    generateProjectContext,
} = require("./services/ai/projectAIService");

const connectDB = require("./config/db");

const PROJECT_ID = "6aa6d1432534329048110bdc";

const test = async () => {
    try {
        await connectDB();

        const result = await generateProjectContext({
            projectId: PROJECT_ID,
            query: "What is the academic year?",
        });

        console.log("\nContext:\n");
        console.log(result.context);

        console.log("\nSources:\n");
        console.log(result.sources);

    } catch (error) {
        console.error("Test failed:", error);
    } finally {
        await mongoose.disconnect();
        console.log("\nMongoDB disconnected.");
    }
};

test();