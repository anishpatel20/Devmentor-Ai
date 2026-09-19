import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModeNavigation from "../components/ModeNavigation";
import {
    getProjects,
    createProject,
    deleteProject,
} from "../services/projectService";

const Project = () => {
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
const [pendingDelete, setPendingDelete] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });
    const [error, setError] = useState("");

    useEffect(() => {
        loadProjects();
    }, []);

    const totalProjects = projects.length;
    const projectWithDescriptions = projects.filter(
        (project) => project.description && project.description.trim()
    ).length;

    const loadProjects = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getProjects();
            setProjects(data.projects || []);
        } catch (error) {
            console.error("Failed to load projects:", error);
            setError("Failed to load projects.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError("Project name is required.");
            return;
        }

        try {
            setError("");

            const data = await createProject({
                name: formData.name.trim(),
                description: formData.description.trim(),
            });

            setProjects((prev) => [data.project, ...prev]);
            setFormData({
                name: "",
                description: "",
            });
            setShowCreateForm(false);
        } catch (error) {
            console.error("Failed to create project:", error);
            setError("Failed to create project.");
        }
    };

    const handleDeleteProject = async () => {
        if (!pendingDelete) return;

        try {
            await deleteProject(pendingDelete.id);
            setProjects((prev) =>
                prev.filter((project) => project._id !== pendingDelete.id)
            );
            setPendingDelete(null);
        } catch (error) {
            console.error("Failed to delete project:", error);
            setError("Failed to delete project.");
            setPendingDelete(null);
        }
    };

    return (
        <>
            <ModeNavigation />
            <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_30%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] px-4 py-8 text-slate-50 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyan-300">
                            Workspace
                        </span>
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Your Projects
                        </h1>
                        <p className="mt-2 max-w-xl text-sm text-slate-300 sm:text-base">
                            Organize project context, reviews, and AI-powered insights in one place.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/10 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400/70"
                    >
                        + New project
                    </button>
                </header>

                <section className="mb-8 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_20px_40px_rgba(15,23,42,0.45)] backdrop-blur-sm">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                            Total
                        </p>
                        <p className="mt-4 text-3xl font-bold text-white">{totalProjects}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_20px_40px_rgba(15,23,42,0.45)] backdrop-blur-sm">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                            Ready
                        </p>
                        <p className="mt-4 text-3xl font-bold text-cyan-300">
                            {projectWithDescriptions}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-[0_20px_40px_rgba(15,23,42,0.45)] backdrop-blur-sm">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                            Status
                        </p>
                        <p className="mt-4 text-lg font-semibold text-emerald-300">
                            {totalProjects > 0 ? "Active" : "Waiting"}
                        </p>
                    </div>
                </section>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                        {error}
                    </div>
                )}

                {pendingDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
                        <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-[0_20px_40px_rgba(15,23,42,0.7)]">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-2xl text-red-400">
                                !
                            </div>

                            <h2 className="mt-5 text-center text-2xl font-semibold text-white">
                                Delete project?
                            </h2>

                            <p className="mt-3 text-center text-sm leading-6 text-slate-300">
                                Are you sure you want to delete <span className="font-semibold text-white">{pendingDelete.name}</span>? This action cannot be undone.
                            </p>

                            <div className="mt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleDeleteProject}
                                    className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400"
                                >
                                    Yes, delete
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setPendingDelete(null)}
                                    className="flex-1 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showCreateForm && (
                    <div className="mb-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-[0_20px_40px_rgba(15,23,42,0.45)] backdrop-blur-sm">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
                                    New workspace
                                </p>
                                <h2 className="mt-2 text-2xl font-semibold text-white">
                                    Create project
                                </h2>
                            </div>
                        </div>

                        <form onSubmit={handleCreateProject} className="mt-6 grid gap-4">
                            <label className="grid gap-2 text-sm text-slate-300">
                                <span>Project name</span>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="My project"
                                    className="rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
                                />
                            </label>

                            <label className="grid gap-2 text-sm text-slate-300">
                                <span>Description</span>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the project goals and context"
                                    rows="3"
                                    className="rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
                                />
                            </label>

                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                                >
                                    Create project
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateForm(false);
                                        setFormData({
                                            name: "",
                                            description: "",
                                        });
                                    }}
                                    className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 py-20 text-center text-slate-300 shadow-[0_20px_40px_rgba(15,23,42,0.45)]">
                        Loading projects...
                    </div>
                ) : projects.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 py-20 text-center shadow-[0_20px_40px_rgba(15,23,42,0.45)]">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-2xl text-cyan-300">
                            +
                        </div>
                        <h2 className="mt-5 text-2xl font-semibold text-white">
                            No projects yet
                        </h2>
                        <p className="mt-2 text-slate-400">
                            Create your first project to start organizing your work.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {projects.map((project) => (
                            <article
                                key={project._id}
                                className="group rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-[0_20px_40px_rgba(15,23,42,0.45)] transition duration-200 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_24px_50px_rgba(34,211,238,0.08)]"
                            >
                                <div className="mb-5 flex items-start justify-between gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-lg font-bold text-slate-950">
                                        {project.name?.charAt(0)?.toUpperCase() || "P"}
                                    </div>
                                    <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-emerald-300">
                                        {project.description ? "Ready" : "Draft"}
                                    </span>
                                </div>

                                <h2 className="text-xl font-semibold text-white">
                                    {project.name}
                                </h2>

                                <p className="mt-3 min-h-[4.5rem] text-sm leading-6 text-slate-400">
                                    {project.description || "No description provided yet."}
                                </p>

                                <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
                                    <button
                                        onClick={() => navigate(`/projects/${project._id}`)}
                                        className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                                    >
                                        Open
                                    </button>

                                    <button
                                        onClick={() =>
                                            setPendingDelete({
                                                id: project._id,
                                                name: project.name,
                                            })
                                        }
                                        className="rounded-lg px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
                </div>
            </div>
        </>
    );
};

export default Project;