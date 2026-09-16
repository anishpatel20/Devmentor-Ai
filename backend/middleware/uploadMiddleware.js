const multer = require("multer");

const allowedMimeTypes = [
  "text/plain",
  "text/markdown",
  "application/pdf",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: MAX_FILE_SIZE,
  },

  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Only TXT, Markdown, and PDF files are supported"
        )
      );
    }

    cb(null, true);
  },
});

module.exports = upload;