require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const generateEmbedding = async (text) => {
    if (typeof text !== "string" || !text.trim()) {
        throw new Error("Text is required for embedding");
    }

    const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: text.trim(),
    });

    return response.embeddings[0].values;
};

const generateEmbeddingsForChunks = async (chunks) => {
  if (!Array.isArray(chunks)) {
    throw new Error("Chunks must be an array");
  }

  if (chunks.length === 0) {
    return [];
  }

  const embeddedChunks = [];

  for (const chunk of chunks) {
    if (
      !chunk ||
      typeof chunk.text !== "string" ||
      !chunk.text.trim()
    ) {
      throw new Error("Invalid chunk text");
    }

    const embedding = await generateEmbedding(
      chunk.text
    );

    embeddedChunks.push({
      ...chunk,
      embedding,
    });
  }

  return embeddedChunks;
};

module.exports = {
    generateEmbedding,
    generateEmbeddingsForChunks,
};