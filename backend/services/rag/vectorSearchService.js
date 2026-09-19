const mongoose = require("mongoose");

const Chunk = require("../../models/Chunk");

const {
    generateEmbedding,
} = require("../documentProcessing/embeddingService");


const searchProjectChunks = async ({
    projectId,
    query,
    limit = 10,
    minScore = 0.7, //The minimum similarity score a retrieved chunk must have to be considered relevant enough to pass to the next RAG stage.
}) => {
    if (!projectId) {
        throw new Error("Project ID is required");
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid project ID");
    }

    if (typeof query !== "string" || !query.trim()) {
        throw new Error("Query is required");
    }

    if (
        !Number.isInteger(limit) ||
        limit < 1 ||
        limit > 20
    ) {
        throw new Error(
            "Limit must be an integer between 1 and 20"
        );
    }

    // 1. Generate embedding for the user's question
    const queryEmbedding =
        await generateEmbedding(query);

    // 2. Search MongoDB Atlas Vector Search
    const results = await Chunk.aggregate([
        {
            $vectorSearch: {
                index: "vector_index",
                path: "embedding",
                queryVector: queryEmbedding,
                numCandidates: Math.max(limit * 10, 50),
                limit: Math.min(limit * 2, 20),
                filter: {
                    projectId: new mongoose.Types.ObjectId(
                        projectId
                    ),
                },
            },
        },

        {
            $project: {
                _id: 1,
                documentId: 1,
                projectId: 1,
                chunkIndex: 1,
                text: 1,
                metadata: 1,

                score: {
                    $meta: "vectorSearchScore",
                },
            },
        },

        {
            $match: {
                score: {
                    $gte: minScore,
                },
            },
        },
        {
            $limit: limit,
        },
    ]);
    return results;
};


module.exports = {
    searchProjectChunks,
};