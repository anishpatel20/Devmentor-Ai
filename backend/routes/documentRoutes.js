const express = require("express");

const {
  uploadDocument,
} = require("../controllers/documentController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/:projectId/documents",
  authMiddleware,
  upload.single("file"),
  uploadDocument
);

module.exports = router;