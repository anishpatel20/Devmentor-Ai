import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { explainAI } from "../services/ai";
import { useSharedContext } from "../context/SharedContext";

const Explain = () => {
    const { sharedContext } = useSharedContext();

    const [code, setCode] = useState(sharedContext?.code || "");
    const [language, setLanguage] = useState(
        sharedContext?.language || "javascript"
    );
    const [question, setQuestion] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleExplain = async () => {
        if (!code.trim()) {
            setError("Please enter some code to explain.");
            return;
        }

        setLoading(true);
        setError("");
        setResponse("");

        try {
            const result = await explainAI({
                code,
                language,
                question,
                context: {
                    problem: sharedContext?.problem || "",
                    rootCause: sharedContext?.rootCause || "",
                    solution: sharedContext?.solution || "",
                    fixedCode: sharedContext?.fixedCode || "",
                },
            });

            setResponse(result.response || "");
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    "Failed to explain the code. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white px-4 py-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Explain Code
                    </h1>

                    <p className="text-gray-400 mt-2">
                        Understand how your code works, why it works,
                        and the concepts behind it.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Input Section */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">

                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">
                                Your Code
                            </h2>

                            {sharedContext?.code && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCode(sharedContext.code)
                                    }
                                    className="text-sm text-blue-400 hover:text-blue-300"
                                >
                                    Use shared code
                                </button>
                            )}
                        </div>

                        {/* Language */}
                        <label className="block text-sm text-gray-300 mb-2">
                            Language
                        </label>

                        <select
                            value={language}
                            onChange={(e) =>
                                setLanguage(e.target.value)
                            }
                            className="w-full mb-5 rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="javascript">
                                JavaScript
                            </option>

                            <option value="typescript">
                                TypeScript
                            </option>

                            <option value="python">
                                Python
                            </option>

                            <option value="java">
                                Java
                            </option>

                            <option value="cpp">
                                C++
                            </option>

                            <option value="csharp">
                                C#
                            </option>

                            <option value="go">
                                Go
                            </option>

                            <option value="rust">
                                Rust
                            </option>

                            <option value="php">
                                PHP
                            </option>

                            <option value="ruby">
                                Ruby
                            </option>
                        </select>

                        {/* Code */}
                        <label className="block text-sm text-gray-300 mb-2">
                            Code
                        </label>

                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Paste your code here..."
                            rows={16}
                            maxLength={20000}
                            className="w-full rounded-lg bg-gray-950 border border-gray-700 px-4 py-3 text-sm font-mono text-gray-100 placeholder-gray-600 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <div className="text-right text-xs text-gray-500 mt-1">
                            {code.length}/20000
                        </div>

                        {/* Question */}
                        <label className="block text-sm text-gray-300 mt-5 mb-2">
                            What do you want to understand?
                        </label>

                        <textarea
                            value={question}
                            onChange={(e) =>
                                setQuestion(e.target.value)
                            }
                            placeholder="Example: Why is async/await used here?"
                            rows={3}
                            maxLength={1000}
                            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <div className="text-right text-xs text-gray-500 mt-1">
                            {question.length}/1000
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mt-4 rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300">
                                {error}
                            </div>
                        )}

                        {/* Button */}
                        <button
                            type="button"
                            onClick={handleExplain}
                            disabled={loading}
                            className="w-full mt-5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed px-4 py-3 font-medium transition"
                        >
                            {loading
                                ? "Explaining..."
                                : "Explain Code"}
                        </button>
                    </div>

                    {/* Response Section */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 min-h-[500px]">

                        <h2 className="text-lg font-semibold mb-5">
                            Explanation
                        </h2>

                        {loading && (
                            <div className="flex items-center justify-center min-h-[400px]">
                                <div className="text-gray-400">
                                    Analyzing your code...
                                </div>
                            </div>
                        )}

                        {!loading && !response && (
                            <div className="flex items-center justify-center min-h-[400px] text-center">
                                <div>
                                    <p className="text-gray-500">
                                        Your explanation will appear here.
                                    </p>

                                    <p className="text-sm text-gray-600 mt-2">
                                        Enter some code and click
                                        "Explain Code".
                                    </p>
                                </div>
                            </div>
                        )}

                        {!loading && response && (
                            <div className="prose prose-invert max-w-none">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                >
                                    {response}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Explain;