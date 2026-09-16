const Project = require("../models/Project");


// Create project
const createProject = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Project name is required",
            });
        }

        // console.log(req.user.userId, "Creating project for user");

        const project = await Project.create({
            userId: req.user.userId,
            name: name.trim(),
            description: description?.trim() || "",
        });

        return res.status(201).json({
            success: true,
            project,
        });
    } catch (error) {
        console.error("Create project error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create project",
        });
    }
};

// Get all projects for authenticated user
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            userId: req.user.userId,
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            projects,
        });
    } catch (error) {
        console.error("Get projects error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch projects",
        });
    }
};

// Get single project
const getProject = async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            userId: req.user.userId,
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        return res.status(200).json({
            success: true,
            project,
        });
    } catch (error) {
        console.error("Get project error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch project",
        });
    }
};


// Update project
const updateProject = async (req, res) => {

    try {
        const { name, description } = req.body;

        if (name !== undefined && !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Project name cannot be empty",
            });
        }

        const updateData = {};

        if (name !== undefined) {
            updateData.name = name.trim();
        }

        if (description !== undefined) {
            updateData.description = description.trim();
        }

        const project = await Project.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.userId,
            },
            updateData,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        return res.status(200).json({
            success: true,
            project,
        });
    } catch (error) {
        console.error("Update project error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update project",
        });
    }
};

// Delete project
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.userId,
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });
    } catch (error) {
        console.error("Delete project error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete project",
        });
    }
};

module.exports = {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
};