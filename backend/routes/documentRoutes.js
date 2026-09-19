const express = require("express");

const {
  uploadDocument,
  getDocuments,
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

router.get(
  "/:projectId/documents",
  authMiddleware,
  getDocuments
);

module.exports = router;