import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import ModeNavigation from "../components/ModeNavigation";

import {
    getProject,
    getDocuments,
    projectAI,
    uploadDocument,
} from "../services/projectService";

const cleanAnswer = (value = "") => {
    const withoutSourceSection = value.split(
        /^\s*(?:#{1,6}\s*)?sources\s*:?\s*$/im
    )[0];

    return withoutSourceSection
        .replace(/\r/g, "")
        .replace(/\s*\[Source\s+\d+\]\s*/gi, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
};

const formatStructuredAnswer = (value = "") => {
    const lines = cleanAnswer(value)
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    const formatted = [];

    for (const rawLine of lines) {
        let line = rawLine;

        if (/^\*\s*\*\*(\d+\.?\s*[^*]+)\*\*\s*$/.test(line)) {
            const chapterTitle = line
                .replace(/^\*\s*\*\*/, "")
                .replace(/\*\*\s*$/, "")
                .trim();
            formatted.push(`## ${chapterTitle}`);
            continue;
        }

        if (/^\*\s*\*\*(.+?)\*\*\s*:\s*(.+)$/.test(line)) {
            const match = line.match(/^\*\s*\*\*(.+?)\*\*\s*:\s*(.+)$/);
            const label = match[1].trim();
            const content = match[2].trim();
            formatted.push(`**${label}:** ${content}`);
            continue;
        }

        if (/^\*\s*(.+)$/.test(line)) {
            const text = line.replace(/^\*\s*/, "").trim();
            if (/^(Topics|Weightage|Teaching Hours|Key Topics|Outcome|Objectives|Summary|Conclusion|Prerequisites|Methodology|Learning Outcomes)/i.test(text)) {
                formatted.push(`**${text}**`);
            } else {
                formatted.push(`- ${text}`);
            }
            continue;
        }

        if (/^\d+\.\s+/.test(line) && !/^\d+\.\s*\*\*/.test(line)) {
            const text = line.replace(/^\d+\.\s*/, "").trim();
            if (text.length > 0) {
                formatted.push(`1. ${text}`);
            }
            continue;
        }

        if (/^(?:Chapter|Section)\s+\d+/i.test(line)) {
            formatted.push(`## ${line}`);
            continue;
        }

        if (/^[-–—]\s+/.test(line)) {
            formatted.push(`- ${line.replace(/^[-–—]\s+/, "")}`);
            continue;
        }

        formatted.push(line);
    }

    return formatted.join("\n\n");
};

const ProjectDetails = () => {
    const { projectId } = useParams();

    // -----------------------------
    // Project state
    // -----------------------------
    const [project, setProject] = useState(null);
    const [projectLoading, setProjectLoading] = useState(true);
    const [projectError, setProjectError] = useState("");

    // -----------------------------
    // Documents state
    // -----------------------------
    const [documents, setDocuments] = useState([]);
    const [documentsLoading, setDocumentsLoading] = useState(true);
    const [documentsError, setDocumentsError] = useState("");

    // -----------------------------
    // Document upload state
    // -----------------------------
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState("");
    const [uploadError, setUploadError] = useState("");

    // -----------------------------
    // Project AI state
    // -----------------------------
    const [query, setQuery] = useState("");
    const [answer, setAnswer] = useState("");
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    
    // Load project
    useEffect(() => {
        const loadProject = async () => {
            try {
                setProjectLoading(true);
                setProjectError("");

                const data = await getProject(projectId);

                setProject(data.project);
            } catch (error) {
                console.error("Get project error:", error);

                setProjectError(
                    error.response?.data?.message ||
                    "Failed to load project"
                );
            } finally {
                setProjectLoading(false);
            }
        };

        loadProject();
    }, [projectId]);

    // -----------------------------
    // Load documents
    // -----------------------------
    useEffect(() => {
        const loadDocuments = async () => {
            try {
                setDocumentsLoading(true);
                setDocumentsError("");

                const data = await getDocuments(projectId);

                setDocuments(data.documents || []);
            } catch (error) {
                console.error("Get documents error:", error);

                setDocumentsError(
                    error.response?.data?.message ||
                    "Failed to load documents"
                );
            } finally {
                setDocumentsLoading(false);
            }
        };

        loadDocuments();
    }, [projectId]);

    // -----------------------------
    // File selection
    // -----------------------------
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];

        setUploadMessage("");
        setUploadError("");

        if (!file) {
            setSelectedFile(null);
            return;
        }

        const allowedTypes = [
            "text/plain",
            "text/markdown",
            "application/pdf",
        ];

        if (!allowedTypes.includes(file.type)) {
            setSelectedFile(null);
            setUploadError(
                "Only TXT, Markdown, and PDF files are supported."
            );
            return;
        }

        const maxSize = 10 * 1024 * 1024;

        if (file.size > maxSize) {
            setSelectedFile(null);
            setUploadError("File size must be 10 MB or less.");
            return;
        }

        setSelectedFile(file);
    };

    // -----------------------------
    // Upload document
    // -----------------------------
    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadError("Please select a file first.");
            return;
        }

        try {
            setUploading(true);
            setUploadMessage("");
            setUploadError("");

            const data = await uploadDocument(
                projectId,
                selectedFile
            );

            setUploadMessage(
                data.message || "Document uploaded successfully."
            );

            // Add newly uploaded document to the list
            if (data.document) {
                setDocuments((prev) => [
                    data.document,
                    ...prev,
                ]);
            } else {
                // Reload documents if backend response
                // does not contain the document
                const documentsData = await getDocuments(
                    projectId
                );

                setDocuments(
                    documentsData.documents || []
                );
            }

            setSelectedFile(null);

            // Reset file input
            const fileInput = document.getElementById(
                "project-document"
            );

            if (fileInput) {
                fileInput.value = "";
            }
        } catch (error) {
            console.error("Document upload error:", error);

            setUploadError(
                error.response?.data?.message ||
                "Failed to upload document"
            );
        } finally {
            setUploading(false);
        }
    };

    // -----------------------------
    // Ask Project AI
    // -----------------------------
    const handleAsk = async () => {
        if (!query.trim()) return;

        try {
            setLoading(true);
            setError("");
            setAnswer("");
            setSources([]);

            const result = await projectAI(
                projectId,
                query.trim()
            );

            setAnswer(formatStructuredAnswer(result.answer));
            setSources(result.sources || []);
        } catch (error) {
            console.error("Project AI error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to get AI response"
            );
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------
    // Loading state
    // -----------------------------
    if (projectLoading) {
        return (
            <div className="min-h-screen bg-slate-950 p-6 text-white">
                <div className="mx-auto max-w-5xl">
                    <p className="text-slate-400">
                        Loading project...
                    </p>
                </div>
            </div>
        );
    }

    // -----------------------------
    // Project error
    // -----------------------------
    if (projectError) {
        return (
            <div className="min-h-screen bg-slate-950 p-6 text-white">
                <div className="mx-auto max-w-5xl">
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
                        {projectError}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <ModeNavigation />
            <main className="min-h-screen bg-[#08090d] bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:40px_40px] px-5 py-8 text-white sm:px-8 lg:py-12">
                <div className="mx-auto max-w-7xl">

                {/* =============================
                    Project Header
                ============================== */}
                <header className="border-b border-white/10 pb-8">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-blue-300">
                        Project workspace
                    </p>

                    <div className="mt-4 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                                {project.name}
                            </h1>

                            <p className="mt-4 text-base leading-7 text-slate-500">
                                {project.description ||
                                    "A focused space for your project knowledge and AI assistance."}
                            </p>
                        </div>

                        <div className="border-l border-white/10 pl-4 lg:text-right">
                            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-600">
                                Knowledge files
                            </p>

                            <p className="mt-1 text-2xl font-semibold text-white">
                                {documents.length}
                            </p>
                        </div>
                    </div>
                </header>

                {/* =============================
                    Main Content
                ============================== */}
                <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(420px,1.2fr)]">

                    {/* =============================
                        Left Column
                    ============================== */}
                    <section className="space-y-6">

                        {/* Upload Section */}
                        <div className="rounded-xl border border-white/10 bg-[#0d0f13] p-6 sm:p-7">
                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-blue-300">
                                01 / Add knowledge
                            </p>

                            <h2 className="mt-2 text-xl font-semibold">
                                Upload project files
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Give the assistant source material to use
                                when answering project questions.
                            </p>

                            <label
                                htmlFor="project-document"
                                className="mt-6 block text-sm font-medium text-slate-300"
                            >
                                Choose a document
                            </label>

                            <input
                                id="project-document"
                                type="file"
                                accept=".txt,.md,.pdf,text/plain,text/markdown,application/pdf"
                                onChange={handleFileChange}
                                className="mt-2 block w-full cursor-pointer rounded-lg border border-white/10 bg-[#08090d] p-3 text-sm text-slate-400 file:mr-4 file:rounded-md file:border-0 file:bg-blue-300 file:px-3 file:py-2 file:font-medium file:text-[#08090d]"
                            />

                            {selectedFile && (
                                <p className="mt-3 truncate text-xs text-blue-200">
                                    Selected: {selectedFile.name}
                                </p>
                            )}

                            <button
                                onClick={handleUpload}
                                disabled={uploading || !selectedFile}
                                className="mt-5 w-full rounded-lg bg-blue-300 px-5 py-2.5 text-sm font-semibold text-[#08090d] transition hover:bg-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {uploading
                                    ? "Uploading..."
                                    : "Upload document"}
                            </button>

                            {uploadMessage && (
                                <p className="mt-3 text-sm text-emerald-300">
                                    {uploadMessage}
                                </p>
                            )}

                            {uploadError && (
                                <p className="mt-3 text-sm text-red-300">
                                    {uploadError}
                                </p>
                            )}

                            <p className="mt-4 text-xs text-slate-600">
                                TXT, Markdown, or PDF up to 10 MB.
                            </p>
                        </div>

                        {/* Documents Section */}
                        <div>
                            <div className="mb-4 flex items-end justify-between gap-3">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-blue-300">
                                        02 / Sources
                                    </p>

                                    <h2 className="mt-2 text-xl font-semibold">
                                        Project knowledge
                                    </h2>
                                </div>

                                <span className="text-xs text-slate-600">
                                    {documents.length} file
                                    {documents.length === 1
                                        ? ""
                                        : "s"}
                                </span>
                            </div>

                            {documentsLoading && (
                                <div className="rounded-xl border border-white/10 bg-[#0d0f13] p-5 text-sm text-slate-500">
                                    Loading documents...
                                </div>
                            )}

                            {!documentsLoading && documentsError && (
                                <div className="rounded-xl border border-red-300/20 bg-red-300/5 p-4 text-sm text-red-300">
                                    {documentsError}
                                </div>
                            )}

                            {!documentsLoading &&
                                !documentsError &&
                                documents.length === 0 && (
                                    <div className="rounded-xl border border-dashed border-white/15 p-5 text-sm text-slate-600">
                                        Upload your first document to
                                        build project context.
                                    </div>
                                )}

                            {!documentsLoading &&
                                !documentsError &&
                                documents.length > 0 && (
                                    <div className="space-y-2">
                                        {documents.map((document) => (
                                            <div
                                                key={document._id}
                                                className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#0d0f13] px-4 py-3"
                                            >
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium text-slate-200">
                                                        {document.name}
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-600">
                                                        {document.fileType} /{" "}
                                                        {(
                                                            document.fileSize /
                                                            1024 /
                                                            1024
                                                        ).toFixed(2)}{" "}
                                                        MB
                                                    </p>
                                                </div>

                                                <span
                                                    className={`shrink-0 text-[10px] uppercase tracking-[0.12em] ${document.processingStatus ===
                                                            "completed"
                                                            ? "text-emerald-300"
                                                            : document.processingStatus ===
                                                                "processing"
                                                                ? "text-amber-300"
                                                                : "text-red-300"
                                                        }`}
                                                >
                                                    {
                                                        document.processingStatus
                                                    }
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                        </div>
                    </section>

                    {/* =============================
                        Right Column - AI
                    ============================== */}
                    <section>
                        <div className="mb-5">
                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-blue-300">
                                03 / Project assistant
                            </p>

                            <h2 className="mt-2 text-2xl font-semibold">
                                Ask about this project
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                The assistant uses your uploaded documents
                                when relevant context is available.
                            </p>
                        </div>

                        {/* Question Form */}
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                handleAsk();
                            }}
                            className="rounded-xl border border-white/10 bg-[#0d0f13] p-6 shadow-2xl sm:p-7"
                        >
                            <label
                                htmlFor="project-question"
                                className="mb-2 block text-sm font-medium text-slate-300"
                            >
                                Your question
                            </label>

                            <textarea
                                id="project-question"
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                placeholder="Where should I start with this project?"
                                rows={8}
                                disabled={loading}
                                className="w-full resize-y rounded-lg border border-white/10 bg-[#08090d] px-4 py-3.5 text-sm leading-6 text-white outline-none transition placeholder:text-slate-700 focus:border-blue-300/60 focus:ring-2 focus:ring-blue-300/10 disabled:opacity-60"
                            />

                            <div className="mt-4 flex items-center justify-between gap-4">
                                <span className="text-xs text-slate-600">
                                    {query.length} characters
                                </span>

                                <button
                                    type="submit"
                                    disabled={
                                        loading || !query.trim()
                                    }
                                    className="rounded-lg bg-blue-300 px-5 py-2.5 text-sm font-semibold text-[#08090d] transition hover:bg-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading
                                        ? "Thinking..."
                                        : "Ask Project AI"}
                                </button>
                            </div>
                        </form>

                        {/* AI Error */}
                        {error && (
                            <div className="mt-5 rounded-xl border border-red-300/20 bg-red-300/5 p-4 text-sm text-red-300">
                                {error}
                            </div>
                        )}

                        {/* =============================
                            AI Answer
                        ============================== */}
                        {answer && (
                            <article className="mt-6 rounded-xl border border-white/10 bg-[#0d0f13] p-6 sm:p-7">
                                <h3 className="text-lg font-semibold">
                                    Answer
                                </h3>

                                <article className="prose prose-invert max-w-none prose-headings:font-semibold prose-headings:text-white prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-sm prose-p:leading-7 prose-p:text-slate-300 prose-strong:text-white prose-a:text-cyan-300 prose-code:text-cyan-200 prose-pre:border prose-pre:border-white/10 prose-pre:bg-[#08090d] prose-ul:my-4 prose-ul:pl-6 prose-li:text-slate-300 prose-li:leading-7 prose-ol:my-4 prose-ol:pl-6">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {answer}
                                    </ReactMarkdown>
                                </article>

                                {/* Small Sources at the End */}
                                {sources.length > 0 && (
                                    <div className="mt-7 border-t border-white/5 pt-3">
                                        <p className="text-[10px] uppercase tracking-[0.14em] text-slate-600">
                                            Sources
                                        </p>

                                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                                            {sources.map(
                                                (source, index) => (
                                                    <span
                                                        key={`${source.documentId}-${source.chunkIndex}`}
                                                        className="text-[11px] text-slate-600"
                                                    >
                                                        Source {index + 1} ·
                                                        Chunk{" "}
                                                        {
                                                            source.chunkIndex
                                                        }{" "}
                                                        ·{" "}
                                                        {source.score?.toFixed(
                                                            3
                                                        )}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                            </article>
                        )}
                    </section>
                </div>
            </div>
        </main>
        </>
    );
};

export default ProjectDetails;