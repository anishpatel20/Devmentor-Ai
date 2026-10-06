const express = require("express");

const {
  createConversation,
  getConversations,
  getConversation,
  deleteConversation,
  getConversationMessages
} = require("../controllers/conversationController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", createConversation);
router.get("/", getConversations);
router.get("/:conversationId", getConversation);
router.get("/:conversationId/messages",getConversationMessages);
router.delete("/:conversationId", deleteConversation);

module.exports = router;
