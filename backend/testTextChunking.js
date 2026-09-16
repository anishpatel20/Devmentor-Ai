console.log("TEST FILE STARTED");

const fs = require("fs");

console.log("FS loaded");

const {
  extractText,
} = require("./services/documentProcessing/textExtractor");

console.log("textExtractor loaded");

const {
  cleanText,
  chunkText,
} = require("./services/documentProcessing/textChunker");

console.log("textChunker loaded");

const test = async () => {
  console.log("TEST FUNCTION STARTED");

  try {
    const buffer = fs.readFileSync("./test-files/test.md");

    console.log("File read successfully");
    console.log("File size:", buffer.length);

    const extractedText = await extractText(
      buffer,
      "text/markdown"
    );

    console.log("Extracted text:");
    console.log(extractedText);

    const cleanedText = cleanText(extractedText);

    console.log("\nCleaned text:");
    console.log(cleanedText);

    const chunks = chunkText(
      cleanedText,
      100,
      20
    );

    console.log("\nChunks:");
    console.log(chunks);

    console.log("\nTotal chunks:", chunks.length);
  } catch (error) {
    console.error("ERROR:", error);
  }
};

test();