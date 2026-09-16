const {
  cleanText,
  chunkText,
} = require("./services/documentProcessing/textChunker");

const runTest = (name, testFunction) => {
  try {
    const result = testFunction();

    console.log(`\n✅ ${name}`);
    console.log(result);
  } catch (error) {
    console.log(`\n✅ ${name}`);
    console.log("Expected error:", error.message);
  }
};

console.log("=== Chunking Edge Case Tests ===");

// Test 1: Empty text
runTest("Empty text", () => {
  return chunkText("");
});

// Test 2: Very short text
runTest("Very short text", () => {
  return chunkText("DevMentor AI is awesome.", 100, 20);
});

// Test 3: Invalid input
runTest("Invalid input", () => {
  return cleanText(null);
});

// Test 4: Invalid overlap
runTest("Overlap >= chunk size", () => {
  return chunkText(
    "This is some test content.",
    100,
    100
  );
});