const Project = require("../models/Project");
const Document = require("../models/Document");

const {
  extractText,
} = require("../services/documentProcessing/textExtractor");

const {
  cleanText,
  chunkText,
} = require("../services/documentProcessing/textChunker");

const {
  saveEmbeddedChunks,
} = require("../services/documentProcessing/chunkProcessor");

const {
  uploadFile,
  deleteFile,
} = require("../services/fileStorage/cloudinaryService");


const uploadDocument = async (req, res) => {
  let uploadedFile = null;

  try {
    const { projectId } = req.params;

    // 1. Validate file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    // 2. Verify project ownership
    const project = await Project.findOne({
      _id: projectId,
      userId: req.user.userId,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // 3. Upload file to Cloudinary
    uploadedFile = await uploadFile(
      req.file.buffer,
      req.file.originalname
    );

    // 4. Create document record
    const document = await Document.create({
      projectId: project._id,
      userId: req.user.userId,

      name: req.file.originalname,
      originalName: req.file.originalname,

      fileType: req.file.mimetype,
      fileSize: req.file.size,

      storageUrl: uploadedFile.url,
      storagePublicId: uploadedFile.publicId,

      processingStatus: "processing",
    });

    // 5. Extract text
    const extractedText = await extractText(
      req.file.buffer,
      req.file.mimetype
    );

    // 6. Clean text
    const cleanedText = cleanText(extractedText);

    // 7. Create chunks
    const chunks = chunkText(cleanedText);

    // 8. Generate embeddings and save chunks
    await saveEmbeddedChunks({
      documentId: document._id,
      projectId: project._id,
      chunks,
    });

    // 9. Mark document as completed
    document.processingStatus = "completed";

    await document.save();

    // 10. Return response
    return res.status(201).json({
      success: true,
      document,
    });

  } catch (error) {
    console.error("Upload document error:", error);

    // Remove Cloudinary file if processing/database operation fails
    if (uploadedFile?.publicId) {
      try {
        await deleteFile(uploadedFile.publicId);
      } catch (cleanupError) {
        console.error(
          "Cloudinary cleanup failed:",
          cleanupError
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to upload document",
    });
  }
};


const getDocuments = async (req, res) => {
  try {
    const { projectId } = req.params;

    // 1. Verify project ownership
    const project = await Project.findOne({
      _id: projectId,
      userId: req.user.userId,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // 2. Get documents belonging to this project
    const documents = await Document.find({
      projectId: project._id,
      userId: req.user.userId,
    })
      .select(
        "_id name originalName fileType fileSize processingStatus createdAt updatedAt"
      )
      .sort({ createdAt: -1 });

    // 3. Return documents
    return res.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error("Get documents error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load documents",
    });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
};