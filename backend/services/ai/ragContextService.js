const buildRAGContext = (chunks) => {
    if (!Array.isArray(chunks)) {
        throw new Error("Chunks must be an array");
    }

    if (chunks.length === 0) {
        return "";
    }

    return chunks
        .map((chunk, index) => {
            return `[Source ${index + 1}]
${chunk.text}`;
        })
        .join("\n\n");
};

module.exports = {
    buildRAGContext,
};