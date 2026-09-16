const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },

    originalName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },

    fileType: {
      type: String,
      required: true,
      trim: true,
    },

    fileSize: {
      type: Number,
      required: true,
      min: 1,
    },

    storageUrl: {
      type: String,
      required: true,
      trim: true,
    },

    storagePublicId: {
      type: String,
      required: true,
      trim: true,
    },

    processingStatus: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
      index: true,
    },

    contentHash: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

documentSchema.index({ projectId: 1, createdAt: -1 });

documentSchema.index(
  { projectId: 1, contentHash: 1 },
  {
    partialFilterExpression: {
      contentHash: { $type: "string" },
    },
  }
);

module.exports = mongoose.model("Document", documentSchema);