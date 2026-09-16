const CHUNK_SIZE = 1000; //size of the chunk in characters
const CHUNK_OVERLAP = 150; //overlap between chunks in characters means in the next chunk, the first 150 characters will be the last 150 characters of the previous chunk

const cleanText = (text) => {
  if (typeof text !== "string") {
    throw new Error("Text must be a string");
  }

  return text
    .replace(/\r\n/g, "\n")
    .replace(/--\s*\d+\s+of\s+\d+\s*--/gi, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const chunkText = (
    text,
    chunkSize = CHUNK_SIZE,
    overlap = CHUNK_OVERLAP
) => {
    const cleanedText = cleanText(text);

    if (!cleanedText) {
        return [];
    }

    if (overlap >= chunkSize) {
        throw new Error(
            "Chunk overlap must be smaller than chunk size"
        );
    }

    const chunks = [];

    let start = 0;
    let chunkIndex = 0;

    while (start < cleanedText.length) {
        const end = Math.min(
            start + chunkSize,
            cleanedText.length
        );

        const chunk = cleanedText
            .slice(start, end)
            .trim();

        if (chunk) {
            chunks.push({
                chunkIndex,
                text: chunk,
            });

            chunkIndex++;
        }

        if (end >= cleanedText.length) {
            break;
        }

        start = end - overlap;
    }

    return chunks;
};

module.exports = {
    cleanText,
    chunkText,
};