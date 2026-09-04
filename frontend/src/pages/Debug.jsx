import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { debugAI } from "../services/ai";
import "./AI.css";
import { useSharedContext } from "../context/SharedContext";

function Debug() {

    const { updateUserContext, updateDebugContext } = useSharedContext();
    const navigate = useNavigate();

    const [code, setCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [language, setLanguage] = useState("javascript");
    const [context, setContext] = useState("");

    const [debugResult, setDebugResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleDebug = async () => {
        if (!code.trim()) {
            setError("Please enter the code you want to debug.");
            return;
        }

        if (!errorMessage.trim()) {
            setError("Please enter the error or describe the problem.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setDebugResult(null);

            updateUserContext({
                code: code.trim(),
                language,
                error: errorMessage.trim(),
                problem: context.trim(),
            });

            const response = await debugAI({
                code: code.trim(),
                error: errorMessage.trim(),
                language,
                context: context.trim(),
            });

            const result = response.data;
            setDebugResult(result);


            updateDebugContext({
                rootCause: result.rootCause || "",
                solution: result.solution || "",
                fixedCode: result.fixedCode || "",
            });

        }
        
        catch (err) {
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
                    "Something went wrong while debugging. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setCode("");
        setErrorMessage("");
        setLanguage("javascript");
        setContext("");
        setDebugResult(null);
        setError("");
    };

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10">
            <title>DevMentor AI - Debug Code and Find Root Causes with AI Assistance</title>
            <div className="mx-auto max-w-5xl">

                {/* =========================
                    HEADER
                ========================= */}

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Debug Mode
                    </h1>

                    <p className="mt-2 text-slate-600">
                        Find the root cause of your coding problem,
                        understand why it happened, and get a practical
                        solution.
                    </p>
                </div>

                {/* =========================
                    DEBUG INPUT
                ========================= */}

                <div className="rounded-xl bg-white p-6 shadow-lg">

                    {/* Code */}

                    <div className="mb-6">
                        <label
                            htmlFor="debug-code"
                            className="mb-2 block text-sm font-semibold text-slate-800"
                        >
                            Your Code
                        </label>

                        <textarea
                            id="debug-code"
                            value={code}
                            onChange={(event) =>
                                setCode(event.target.value)
                            }
                            disabled={loading}
                            placeholder={`Paste your code here... Example: const user = undefined; console.log(user.name);`}
                            className="min-h-64 w-full resize-y rounded-lg
                            border border-slate-300 bg-slate-50 p-4
                            font-mono text-sm text-slate-900 outline-none
                            focus:border-indigo-500
                            focus:ring-2 focus:ring-indigo-200
                            disabled:cursor-not-allowed
                            disabled:opacity-60"
                        />
                    </div>

                    {/* Error */}

                    <div className="mb-6">
                        <label
                            htmlFor="debug-error"
                            className="mb-2 block text-sm font-semibold text-slate-800"
                        >
                            Error / Problem
                        </label>

                        <textarea
                            id="debug-error"
                            value={errorMessage}
                            onChange={(event) =>
                                setErrorMessage(event.target.value)
                            }
                            disabled={loading}
                            placeholder={`Paste the error message here...
                         Example:
                              TypeError: Cannot read properties of undefined (reading 'name')`}
                            className="min-h-32 w-full resize-y rounded-lg
                            border border-slate-300 bg-slate-50 p-4
                            font-mono text-sm text-slate-900 outline-none
                            focus:border-indigo-500
                            focus:ring-2 focus:ring-indigo-200
                            disabled:cursor-not-allowed
                            disabled:opacity-60"
                        />
                    </div>

                    {/* Language */}

                    <div className="mb-6">
                        <label
                            htmlFor="debug-language"
                            className="mb-2 block text-sm font-semibold text-slate-800"
                        >
                            Programming Language
                        </label>

                        <select
                            id="debug-language"
                            value={language}
                            onChange={(event) =>
                                setLanguage(event.target.value)
                            }
                            disabled={loading}
                            className="w-full rounded-lg border
                            border-slate-300 bg-white p-3
                            text-slate-900 outline-none
                            focus:border-indigo-500
                            focus:ring-2 focus:ring-indigo-200
                            disabled:cursor-not-allowed
                            disabled:opacity-60"
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

                            <option value="c">
                                C
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

                            <option value="other">
                                Other
                            </option>
                        </select>
                    </div>

                    {/* Context */}

                    <div className="mb-6">
                        <label
                            htmlFor="debug-context"
                            className="mb-2 block text-sm font-semibold text-slate-800"
                        >
                            Additional Context
                            <span className="ml-2 font-normal text-slate-500">
                                Optional
                            </span>
                        </label>

                        <textarea
                            id="debug-context"
                            value={context}
                            onChange={(event) =>
                                setContext(event.target.value)
                            }
                            disabled={loading}
                            placeholder="Tell the AI what you expected to happen, what actually happened, relevant framework/version information, or anything else that may help."
                            className="min-h-28 w-full resize-y rounded-lg
                            border border-slate-300 bg-slate-50 p-4
                            text-sm text-slate-900 outline-none
                            focus:border-indigo-500
                            focus:ring-2 focus:ring-indigo-200
                            disabled:cursor-not-allowed
                            disabled:opacity-60"
                        />
                    </div>

                    {/* Error */}

                    {error && (
                        <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Buttons */}

                    <div className="flex flex-wrap gap-3">

                        <button
                            type="button"
                            onClick={handleDebug}
                            disabled={loading}
                            className="rounded-lg bg-indigo-600 px-6 py-3
                            font-semibold text-white transition
                            hover:bg-indigo-700
                            disabled:cursor-not-allowed
                            disabled:opacity-60"
                        >
                            {loading
                                ? "Analyzing..."
                                : "Debug Code"}
                        </button>

                        <button
                            type="button"
                            onClick={handleClear}
                            disabled={loading}
                            className="rounded-lg border border-slate-300
                            bg-white px-6 py-3 font-semibold
                            text-slate-700 transition
                            hover:bg-slate-100
                            disabled:cursor-not-allowed
                            disabled:opacity-60"
                        >
                            Clear
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/ai")}
                            disabled={loading}
                            className="rounded-lg border border-indigo-200
                            bg-indigo-50 px-6 py-3 font-semibold
                            text-indigo-700 transition
                            hover:bg-indigo-100
                            disabled:cursor-not-allowed
                            disabled:opacity-60"
                        >
                            Ask AI
                        </button>
                    </div>
                </div>

                {/* =========================
                    DEBUG RESULT
                ========================= */}

                {debugResult && (
                    <div className="mt-8 rounded-xl bg-white p-7 shadow-lg">

                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">
                                    Debug Analysis
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    DevMentor AI analysis
                                </p>
                            </div>
                        </div>

                        {/* More Information */}

                        {debugResult.needsMoreInformation && (
                            <div className="mb-6 rounded-lg bg-yellow-50 p-5 text-yellow-800">
                                <h3 className="font-semibold">
                                    More Information Needed
                                </h3>

                                <p className="mt-2 text-sm">
                                    The available information is not
                                    enough to confidently determine the
                                    root cause.
                                </p>

                                {debugResult.missingInformation?.length > 0 && (
                                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                                        {debugResult.missingInformation.map(
                                            (item, index) => (
                                                <li key={index}>
                                                    {item}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                )}
                            </div>
                        )}

                        {/* Problem */}

                        <div className="mb-6">
                            <h3 className="mb-2 text-lg font-semibold text-slate-900">
                                Problem
                            </h3>

                            <p className="leading-7 text-slate-600">
                                {debugResult.problem}
                            </p>
                        </div>

                        {/* Root Cause */}

                        <div className="mb-6">
                            <h3 className="mb-2 text-lg font-semibold text-slate-900">
                                Root Cause
                            </h3>

                            <p className="leading-7 text-slate-600">
                                {debugResult.rootCause}
                            </p>
                        </div>

                        {/* Why It Happened */}

                        <div className="mb-6">
                            <h3 className="mb-2 text-lg font-semibold text-slate-900">
                                Why It Happened
                            </h3>

                            <p className="leading-7 text-slate-600">
                                {debugResult.whyItHappened}
                            </p>
                        </div>

                        {/* Solution */}

                        <div className="mb-6">
                            <h3 className="mb-2 text-lg font-semibold text-slate-900">
                                Solution
                            </h3>

                            <p className="leading-7 text-slate-600">
                                {debugResult.solution}
                            </p>
                        </div>

                        {/* Fixed Code */}

                        {debugResult.fixedCode && (
                            <div className="mb-6">
                                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                                    Fixed Code
                                </h3>

                                <pre className="overflow-x-auto rounded-lg bg-slate-900 p-5 text-sm leading-6 text-slate-100">
                                    <code>
                                        {debugResult.fixedCode}
                                    </code>
                                </pre>
                            </div>
                        )}

                        {/* Explanation */}

                        <div className="mb-6">
                            <h3 className="mb-2 text-lg font-semibold text-slate-900">
                                Explanation
                            </h3>

                            <p className="leading-7 text-slate-600">
                                {debugResult.explanation}
                            </p>
                        </div>

                        {/* Test Cases */}

                        {debugResult.testCases?.length > 0 && (
                            <div className="mb-6">
                                <h3 className="mb-3 text-lg font-semibold text-slate-900">
                                    Test Cases
                                </h3>

                                <div className="space-y-3">
                                    {debugResult.testCases.map(
                                        (testCase, index) => (
                                            <div
                                                key={index}
                                                className="rounded-lg border
                                                border-slate-200 bg-slate-50 p-4"
                                            >
                                                <p className="font-semibold text-slate-800">
                                                    Test {index + 1}:{" "}
                                                    {testCase.description}
                                                </p>

                                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                                    <span className="font-semibold">
                                                        Expected result:
                                                    </span>{" "}
                                                    {testCase.expectedResult}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Verification */}

                        <div>
                            <h3 className="mb-2 text-lg font-semibold text-slate-900">
                                Verification
                            </h3>

                            <p className="leading-7 text-slate-600">
                                {debugResult.verification}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* for testing purposes only. */}

            {/* <div>
                <h3>Shared Context Debug</h3>

                <pre>
                    {JSON.stringify(sharedContext, null, 2)}
                </pre>
            </div> */}

        </div>
    );
}

export default Debug;