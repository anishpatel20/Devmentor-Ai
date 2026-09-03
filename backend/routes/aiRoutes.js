const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const { askAIController , debug} = require("../controllers/aiController");
const aiRateLimit = require("../middleware/aiRateLimit");

const router = express.Router();

router.post("/ask", authMiddleware, aiRateLimit, askAIController);
router.post("/debug", authMiddleware, aiRateLimit, debug);

module.exports = router;
