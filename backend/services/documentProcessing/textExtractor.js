const { PDFParse } = require("pdf-parse");

const extractText = async (buffer, mimeType) => {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error("Invalid file buffer");
  }

  if (mimeType === "text/plain" || mimeType === "text/markdown") {
    return buffer.toString("utf-8").trim();
  }

  if (mimeType === "application/pdf") {
    const parser = new PDFParse({
      data: buffer,
    });

    try {
      const result = await parser.getText();

      return result.text.trim();
    } finally {
      await parser.destroy();
    }
  }

  throw new Error("Unsupported file type");
};

module.exports = {
  extractText,
};