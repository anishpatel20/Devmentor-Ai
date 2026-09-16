const mongoose = require("mongoose");

const chunkSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      index: true,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    chunkIndex: {
      type: Number,
      required: true,
      min: 0,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    embedding: {
      type: [Number],
      default: undefined,
    },

    metadata: {
      heading: {
        type: String,
        trim: true,
        default: null,
      },

      page: {
        type: Number,
        min: 1,
        default: null,
      },

      source: {
        type: String,
        trim: true,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

chunkSchema.index(
  { documentId: 1, chunkIndex: 1 },
  { unique: true }
);


module.exports = mongoose.model("Chunk", chunkSchema);