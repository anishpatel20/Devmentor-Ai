import { useEffect, useState } from "react";
import {
    createProject,
    getProjects,
    deleteProject,
} from "../services/projectService";

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");

    const loadProjects = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getProjects();

            setProjects(data.projects || []);
            
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to load projects"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const handleCreateProject = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError("Project name is required");
            return;
        }

        try {
            setCreating(true);
            setError("");

            const data = await createProject({
                name: name.trim(),
                description: description.trim(),
            });

            setProjects((prev) => [data.project, ...prev]);

            setName("");
            setDescription("");
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to create project"
            );
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteProject = async (projectId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmed) return;

        try {
            await deleteProject(projectId);

            setProjects((prev) =>
                prev.filter((project) => project._id !== projectId)
            );
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to delete project"
            );
        }
    };

    if (loading) {
        return <div>Loading projects...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="mb-6 text-2xl font-bold">
                My Projects
            </h1>

            {error && (
                <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-red-700">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleCreateProject}
                className="mb-8 max-w-xl space-y-4"
            >
                <input
                    type="text"
                    placeholder="Project name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded border p-3"
                />

                <textarea
                    placeholder="Project description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded border p-3"
                    rows={4}
                />

                <button
                    type="submit"
                    disabled={creating}
                    className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
                >
                    {creating ? "Creating..." : "Create Project"}
                </button>
            </form>

            {projects.length === 0 ? (
                <p className="text-gray-500">
                    No projects yet. Create your first project.
                </p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <div
                            key={project._id}
                            className="rounded-lg border p-5"
                        >
                            <h2 className="mb-2 text-lg font-semibold">
                                {project.name}
                            </h2>

                            <p className="mb-4 text-sm text-gray-600">
                                {project.description || "No description"}
                            </p>

                            <button
                                onClick={() =>
                                    handleDeleteProject(project._id)
                                }
                                className="rounded bg-red-600 px-3 py-2 text-sm text-white"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Projects;