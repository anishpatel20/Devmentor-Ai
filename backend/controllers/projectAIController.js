const Project = require("../models/Project");

const {
    generateProjectAIResponse,
} = require("../services/ai/projectAIService");

const {
    generateResponse,
} = require("../services/ai/geminiService");


const projectAI = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { query } = req.body;

        // 1. Validate query
        if (typeof query !== "string" || !query.trim()) {
            return res.status(400).json({
                success: false,
                message: "Query is required",
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

        // 3. Generate project-aware AI response
        const result = await generateProjectAIResponse({
            projectId,
            query: query.trim(),
            generateAIResponse: generateResponse,
        });

        // 4. Return response
        return res.status(200).json({
            success: true,
            answer: result.answer,
            sources: result.sources,
        });

    } catch (error) {
        console.error("Project AI error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate project AI response",
        });
    }
};


module.exports = {
    projectAI,
};