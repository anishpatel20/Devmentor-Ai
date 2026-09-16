const Chunk = require("../../models/Chunk");

const {
  generateEmbeddingsForChunks,
} = require("./embeddingService");

const saveEmbeddedChunks = async ({
  documentId,
  projectId,
  chunks,
}) => {
  if (!documentId) {
    throw new Error("Document ID is required");
  }

  if (!projectId) {
    throw new Error("Project ID is required");
  }

  if (!Array.isArray(chunks)) {
    throw new Error("Chunks must be an array");
  }

  if (chunks.length === 0) {
    return [];
  }

  const embeddedChunks =
    await generateEmbeddingsForChunks(chunks);

  const chunkDocuments = embeddedChunks.map((chunk) => ({
    documentId,
    projectId,

    chunkIndex: chunk.chunkIndex,
    text: chunk.text,
    embedding: chunk.embedding,
  }));

  const savedChunks = await Chunk.insertMany(
    chunkDocuments
  );

  return savedChunks;
};

module.exports = {
  saveEmbeddedChunks,
};