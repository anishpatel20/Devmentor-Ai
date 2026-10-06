const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
  },
  {
    timestamps: true,
  }
);

// Used when listing a user's chats by most recently updated.
conversationSchema.index({ userId: 1, updatedAt: -1 });

// Used for project-specific conversation queries.
conversationSchema.index({ userId: 1, projectId: 1 });

module.exports = mongoose.model("Conversation", conversationSchema);

