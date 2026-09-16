const fs = require("fs");

const {
  extractText,
} = require("./services/documentProcessing/textExtractor");

const {
  cleanText,
  chunkText,
} = require("./services/documentProcessing/textChunker");

const test = async () => {
  try {
    const buffer = fs.readFileSync("./test-files/test.md");

    // Step 1: Extract text
    const extractedText = await extractText(
      buffer,
      "text/markdown"
    );

    console.log("Extracted text:");
    console.log(extractedText);

    // Step 2: Clean text
    const cleanedText = cleanText(extractedText);

    console.log("\nCleaned text:");
    console.log(cleanedText);

    // Step 3: Chunk text
    const chunks = chunkText(
      cleanedText,
      100,
      20
    );

    console.log("\nChunks:");
    console.log(chunks);

    console.log("\nTotal chunks:", chunks.length);
  } catch (error) {
    console.error(
      "Chunking failed:",
      error.message
    );
  }
};

test();