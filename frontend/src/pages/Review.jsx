import { useState } from "react";
import { reviewAI } from "../services/ai";
import { useSharedContext } from "../context/SharedContext";
import NormalReviewResults  from "../components/NormalReviewResults";
import KillCriticResults from "../components/KillCriticResults";

const Review = () => {
    const { sharedContext } = useSharedContext();

    const [code, setCode] = useState(
        sharedContext?.code || ""
    );

    const [language, setLanguage] = useState(
        sharedContext?.language || "javascript"
    );

    const [requirements, setRequirements] = useState("");
    const [reviewResult, setReviewResult] = useState(null);
    const [mode, setMode] = useState("normal");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleReview = async () => {
        if (!code.trim()) {
            setError("Please enter some code to review.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setReviewResult(null);

            const response = await reviewAI({
                code: code.trim(),
                language,
                requirements: requirements.trim(),
                mode,
                context: {
                    code: sharedContext?.code || "",
                    language: sharedContext?.language || "",
                    error: sharedContext?.error || "",
                    problem: sharedContext?.problem || "",
                    rootCause: sharedContext?.rootCause || "",
                    solution: sharedContext?.solution || "",
                    fixedCode: sharedContext?.fixedCode || "",
                },
            });

            setReviewResult(response.response);

        } catch (err) {
            if (err.response?.status === 401) {
                setError("Please login to use DevMentor AI.");
            } else if (err.response?.status === 429) {
                setError(
                    "Too many requests. Please try again later."
                );
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError(
                    "Something went wrong while reviewing the code. Please try again."
                );
            }
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
                        Code Review
                    </h1>

                    <p className="text-gray-400 mt-2">
                        Evaluate your code for correctness, security,
                        performance, maintainability, and other risks.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Input Section */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleReview();
                        }}
                        className="bg-gray-900 border border-gray-800 rounded-xl p-5"
                    >

                        <h2 className="text-lg font-semibold mb-5">
                            Review Your Code
                        </h2>

                        {/* Review Mode */}
                        <fieldset className="mb-5">
                            <legend className="mb-2 block text-sm text-gray-300">
                                Review mode
                            </legend>

                            <div className="grid grid-cols-2 gap-2 rounded-lg border border-gray-700 bg-gray-950 p-1">
                                <button
                                    type="button"
                                    onClick={() => setMode("normal")}
                                    disabled={loading}
                                    aria-pressed={mode === "normal"}
                                    className={`rounded-md px-3 py-2 text-sm font-medium transition ${mode === "normal"
                                        ? "bg-blue-600 text-white shadow-sm"
                                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                        }`}
                                >
                                    Normal review
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode("kill-critic")}
                                    disabled={loading}
                                    aria-pressed={mode === "kill-critic"}
                                    className={`rounded-md px-3 py-2 text-sm font-medium transition ${mode === "kill-critic"
                                        ? "bg-red-600 text-white shadow-sm"
                                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                        }`}
                                >
                                    Kill Critic
                                </button>
                            </div>

                            <p className="mt-2 text-xs text-gray-500">
                                {mode === "normal"
                                    ? "Balanced feedback on quality, risks, and improvements."
                                    : "An aggressive pass focused on attack surfaces and edge cases."}
                            </p>
                        </fieldset>

                        {/* Language */}
                        <label className="block text-sm text-gray-300 mb-2">
                            Language
                        </label>

                        <select
                            value={language}
                            onChange={(e) =>
                                setLanguage(e.target.value)
                            }
                            disabled={loading}
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

                            <option value="c">
                                C
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

                            <option value="kotlin">
                                Kotlin
                            </option>

                            <option value="swift">
                                Swift
                            </option>

                            <option value="dart">
                                Dart
                            </option>

                            <option value="sql">
                                SQL
                            </option>
                        </select>

                        {/* Code */}
                        <label className="block text-sm text-gray-300 mb-2">
                            Code
                        </label>

                        <textarea
                            value={code}
                            onChange={(e) =>
                                setCode(e.target.value)
                            }
                            disabled={loading}
                            placeholder="Paste the code you want to review..."
                            rows={8}
                            maxLength={50000}
                            className="w-full rounded-lg bg-gray-950 border border-gray-700 px-4 py-3 text-sm font-mono text-gray-100 placeholder-gray-600 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <div className="text-right text-xs text-gray-500 mt-1">
                            {code.length}/50000
                        </div>

                        {/* Requirements */}
                        <label className="block text-sm text-gray-300 mt-5 mb-2">
                            Requirements

                            <span className="ml-2 text-gray-500">
                                Optional
                            </span>
                        </label>

                        <textarea
                            value={requirements}
                            onChange={(e) =>
                                setRequirements(e.target.value)
                            }
                            disabled={loading}
                            placeholder="Example: This API should be secure and handle high traffic."
                            rows={4}
                            maxLength={5000}
                            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-3 text-sm text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <div className="text-right text-xs text-gray-500 mt-1">
                            {requirements.length}/5000
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mt-4 rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300">
                                {error}
                            </div>
                        )}

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed px-4 py-3 font-medium transition"
                        >
                            {loading
                                ? "Reviewing..."
                                : "Review Code"}
                        </button>

                    </form>

                    {/* Result Section */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 min-h-[500px]">

                        <h2 className="text-lg font-semibold mb-5">
                            Review Results
                        </h2>

                        {/* Loading */}
                        {loading && (
                            <div className="flex items-center justify-center min-h-[400px]">
                                <div className="text-gray-400">
                                    Reviewing your code...
                                </div>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && !reviewResult && (
                            <div className="flex items-center justify-center min-h-[400px] text-center">
                                <div>
                                    <p className="text-gray-500">
                                        Your code review will appear here.
                                    </p>

                                    <p className="text-sm text-gray-600 mt-2">
                                        Enter your code and click
                                        "Review Code".
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Review Result */}
                        {!loading && reviewResult && (
                            mode === "kill-critic" ? (
                                <KillCriticResults result={reviewResult} />
                            ) : (
                                <NormalReviewResults result={reviewResult} />
                            )
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Review;