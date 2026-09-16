require("dotenv").config();

const mongoose = require("mongoose");

const {
  searchProjectChunks,
} = require("./services/rag/vectorSearchService");


const test = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected.");

    // Replace this with the projectId
    // that contains your uploaded document.
    const projectId = "6aa6d1432534329048110bdc";

    const query =
      "What is the faculty name and academic year??";

    console.log("\nSearching project knowledge...");
    console.log("Query:", query);

    const results = await searchProjectChunks({
      projectId,
      query,
      limit: 5,
    });

    console.log("\nSearch successful.");
    console.log("Results found:", results.length);

    results.forEach((result, index) => {
      console.log(`\n--- Result ${index + 1} ---`);

      console.log(
        "Document ID:",
        result.documentId
      );

      console.log(
        "Project ID:",
        result.projectId
      );

      console.log(
        "Chunk index:",
        result.chunkIndex
      );

      console.log(
        "Score:",
        result.score
      );

      console.log(
        "Text:",
        result.text
      );
    });

  } catch (error) {
    console.error(
      "\nVector search test failed:",
      error.message
    );
  } finally {
    await mongoose.disconnect();

    console.log("\nMongoDB disconnected.");
  }
};


test();