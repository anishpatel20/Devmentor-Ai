const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const { askAIController , debug ,explain,review} = require("../controllers/aiController");
const aiRateLimit = require("../middleware/aiRateLimit");

const router = express.Router();

router.post("/ask", authMiddleware, aiRateLimit, askAIController);
router.post("/debug", authMiddleware, aiRateLimit, debug);
router.post("/explain", authMiddleware, aiRateLimit, explain);
router.post("/review", authMiddleware, aiRateLimit, review);

module.exports = router;
