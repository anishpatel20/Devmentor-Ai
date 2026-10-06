const mongoose = require("mongoose");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");


const createConversation = async (req, res) => {
    try {
        const { title, projectId = null } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Conversation title is required",
            });
        }

        if (projectId && !mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID",
            });
        }

        const conversation = await Conversation.create({
            userId: req.user.userId,
            projectId: projectId || null,
            title: title.trim(),
        });

        return res.status(201).json({
            success: true,
            conversation,
        });
    } catch (error) {
        console.error("Create conversation error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create conversation",
        });
    }
};


const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            userId: req.user.userId,
        })
            .sort({ updatedAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            conversations,
        });
    } catch (error) {
        console.error("Get conversations error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch conversations",
        });
    }
};


const getConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(conversationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid conversation ID",
            });
        }

        const conversation = await Conversation.findOne({
            _id: conversationId,
            userId: req.user.userId,
        }).lean();

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found",
            });
        }

        return res.status(200).json({
            success: true,
            conversation,
        });
    }
    catch (error) {
        console.error("Get conversation error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch conversation",
        });
    }
};


const deleteConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(conversationId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid conversation ID",
            });
        }

        const conversation = await Conversation.findOne({
            _id: conversationId,
            userId: req.user.userId,
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found",
            });
        }

        await Message.deleteMany({
            conversationId: conversation._id,
        });

        await conversation.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Conversation deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete conversation error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete conversation",
        });
    }
};




const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation ID",
      });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: req.user.userId,
    }).lean();

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    })
      .sort({ createdAt: 1 })
      .lean();

    // console.log("Fetched messages:", messages); // Debugging log

    return res.status(200).json({
      success: true,
      messages,
    });


  } catch (error) {
    console.error("Get conversation messages error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch conversation messages",
    });
  }
};




module.exports = {
    createConversation,
    getConversations,
    getConversation,
    deleteConversation,
    getConversationMessages
};

