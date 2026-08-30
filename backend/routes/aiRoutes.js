const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const { askAIController } = require("../controllers/aiController");
const aiRateLimit = require("../middleware/aiRateLimit");

const router = express.Router();

router.post("/ask", authMiddleware, aiRateLimit, askAIController);

module.exports = router;
