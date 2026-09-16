const {
    generateEmbedding,
} = require("./services/documentProcessing/embeddingService");

const test = async () => {
    try {
        const text =
            "DevMentor AI is an AI-powered developer assistant.";

        console.log("Generating embedding...");

        const embedding = await generateEmbedding(text);

        console.log("Embedding generated successfully.");

        console.log("Vector type:", Array.isArray(embedding));
        console.log("Vector dimension:", embedding.length);

        console.log("First 5 values:");
        console.log(embedding.slice(0, 5));
    } catch (error) {
        console.error(
            "Embedding generation failed:",
            error.message
        );
    }
};

test();