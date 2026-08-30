import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { askAI } from "../services/ai";
import "./AI.css";

function AI() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAskAI = async () => {
        if (!prompt.trim()) {
            setError("Please enter a question.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setResponse("");

            const data = await askAI(prompt.trim());

            setResponse(data.response);
        } catch (error) {
            if (error.response?.status === 401) {
                setError("Please login to use DevMentor AI.");
            } else if (error.response?.status === 429) {
                setError("Too many requests. Please try again later.");
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10">
            <div className="mx-auto max-w-4xl">

                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-900">
                        DevMentor AI
                    </h1>

                    <p className="mt-2 text-slate-600">
                        Ask questions, debug code, and learn programming
                        concepts with AI.
                    </p>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-lg">
                    <textarea
                        className="min-h-45 w-full resize-y rounded-lg border
                    border-slate-300 p-4 text-base outline-none
                    focus:border-indigo-500 focus:ring-2
                    focus:ring-indigo-200"
                        value={prompt}
                        onChange={(event) => setPrompt(event.target.value)}
                        placeholder="Ask DevMentor AI a programming question..."
                        disabled={loading}
                    />

                    <button
                        className="mt-4 rounded-lg bg-indigo-600 px-5 py-3
                    font-semibold text-white transition
                    hover:bg-indigo-700 disabled:cursor-not-allowed
                    disabled:opacity-60"
                        onClick={handleAskAI}
                        disabled={loading}
                    >
                        {loading ? "Thinking..." : "Ask AI"}
                    </button>

                    {error && (
                        <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-700">
                            {error}
                        </div>
                    )}
                </div>

                {response && (
                    <div className="mt-6 rounded-xl bg-white p-7 shadow-lg">
                        <h2 className="mb-6 text-xl font-semibold text-slate-900">
                            🤖 DevMentor AI
                        </h2>

                        <div className="prose max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {response}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default AI;