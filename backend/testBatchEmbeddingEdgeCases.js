const {
  generateEmbeddingsForChunks,
} = require("./services/documentProcessing/embeddingService");

const expectError = async (name, testFunction) => {
  try {
    await testFunction();

    console.log(`❌ ${name}`);
    console.log("Expected an error, but no error was thrown.");
  } catch (error) {
    console.log(`✅ ${name}`);
    console.log("Error:", error.message);
  }
};


const test = async () => {
  console.log("=== Batch Embedding Edge Case Tests ===");

  // Test 1: Empty array
  try {
    const result = await generateEmbeddingsForChunks([]);

    if (Array.isArray(result) && result.length === 0) {
      console.log("\n✅ Empty chunks array");
      console.log(result);
    } else {
      console.log("\n❌ Empty chunks array");
      console.log("Expected []");
    }
  } catch (error) {
    console.log("\n❌ Empty chunks array");
    console.log("Unexpected error:", error.message);
  }

  // Test 2: Invalid input
  await expectError(
    "Invalid chunks input",
    async () => {
      await generateEmbeddingsForChunks(null);
    }
  );

  // Test 3: Invalid chunk
  await expectError(
    "Invalid chunk text",
    async () => {
      await generateEmbeddingsForChunks([
        {
          chunkIndex: 0,
          text: "",
        },
      ]);
    }
  );

  // Test 4: Missing text
  await expectError(
    "Missing chunk text",
    async () => {
      await generateEmbeddingsForChunks([
        {
          chunkIndex: 0,
        },
      ]);
    }
  );
};

test();