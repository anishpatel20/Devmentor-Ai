const express = require("express");

const router = express.Router();

const {
    projectAI,
} = require("../controllers/projectAIController");

const authMiddleware = require("../middleware/authMiddleware");


router.post("/:projectId/ai",authMiddleware,projectAI);


module.exports = router;