const {
    generateEmbeddingsForChunks,
} = require("./services/documentProcessing/embeddingService");

const test = async () => {
    try {
        const chunks = [
            {
                chunkIndex: 0,
                text: "DevMentor AI is an AI-powered developer assistant.",
            },
            {
                chunkIndex: 1,
                text: "DevMentor AI provides debugging and code explanation.",
            },
            {
                chunkIndex: 2,
                text: "Project Knowledge allows AI to use project documentation.",
            },
        ];

        console.log("Generating embeddings for chunks...");

        const embeddedChunks =
            await generateEmbeddingsForChunks(chunks);

        console.log("\nEmbedding generation successful.");

        console.log(
            "Total chunks:",
            embeddedChunks.length
        );

        embeddedChunks.forEach((chunk) => {
            console.log("\nChunk index:", chunk.chunkIndex);
            console.log("Text:", chunk.text);
            console.log(
                "Embedding dimension:",
                chunk.embedding.length
            );
            console.log(
                "First 3 values:",
                chunk.embedding.slice(0, 3)
            );
        });
    }
    catch (error) {
        console.error(
            "Batch embedding failed:",
            error.message
        );
    }
};

test();