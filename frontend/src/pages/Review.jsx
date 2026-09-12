import { useState } from "react";
import ModeNavigation from "../components/ModeNavigation";
import { reviewAI } from "../services/ai";
import { useSharedContext } from "../context/SharedContext";
import NormalReviewResults from "../components/NormalReviewResults";
import KillCriticResults from "../components/KillCriticResults";

const Review = () => {
    const { context: sharedContext } = useSharedContext();

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
        <main className="min-h-screen bg-[#08090d] bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:40px_40px] text-white">
            <ModeNavigation />

            <div className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
                <header className="mb-9 max-w-3xl">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-300/5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-blue-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-300" /> Code quality signal
                    </div>
                    <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Review your code</h1>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
                        Get practical feedback on correctness, security, performance, and maintainability before the code ships.
                    </p>
                </header>

                <div className="grid gap-6 lg:grid-cols-[minmax(320px,0.82fr)_minmax(0,1.18fr)]">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            handleReview();
                        }}
                        className="h-fit rounded-xl border border-white/10 bg-[#0d0f13] p-6 shadow-2xl sm:p-7"
                    >
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.16em] text-blue-300">01 / Inspect</p>
                                <h2 className="mt-2 text-xl font-semibold">Set your review lens</h2>
                            </div>
                            <span className="rounded-md border border-white/10 px-2 py-1 text-[10px] text-slate-600">REVIEW</span>
                        </div>

                        <fieldset className="mb-5">
                            <legend className="mb-2 block text-sm font-medium text-slate-300">Review mode</legend>
                            <div className="grid grid-cols-2 gap-2 rounded-lg border border-white/10 bg-[#08090d] p-1">
                                <button
                                    type="button"
                                    onClick={() => setMode("normal")}
                                    disabled={loading}
                                    aria-pressed={mode === "normal"}
                                    className={`rounded-md px-3 py-2.5 text-sm font-medium transition ${mode === "normal" ? "bg-blue-300 text-[#08090d]" : "text-slate-500 hover:bg-white/5 hover:text-white"}`}
                                >
                                    Normal review
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode("kill-critic")}
                                    disabled={loading}
                                    aria-pressed={mode === "kill-critic"}
                                    className={`rounded-md px-3 py-2.5 text-sm font-medium transition ${mode === "kill-critic" ? "bg-red-300 text-[#08090d]" : "text-slate-500 hover:bg-white/5 hover:text-white"}`}
                                >
                                    KillCritic
                                </button>
                            </div>
                            <p className="mt-2 text-xs leading-5 text-slate-600">
                                {mode === "normal" ? "Balanced feedback on quality, risks, and improvements." : "An adversarial pass focused on attack surfaces and edge cases."}
                            </p>
                        </fieldset>

                        <label htmlFor="review-language" className="mb-2 block text-sm font-medium text-slate-300">Language</label>
                        <select
                            id="review-language"
                            value={language}
                            onChange={(event) => setLanguage(event.target.value)}
                            disabled={loading}
                            className="mb-5 w-full rounded-lg border border-white/10 bg-[#08090d] px-3 py-3 text-sm text-white outline-none focus:border-blue-300/60 focus:ring-2 focus:ring-blue-300/10"
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

                        <label htmlFor="review-code" className="mb-2 block text-sm font-medium text-slate-300">Code</label>
                        <textarea
                            id="review-code"
                            value={code}
                            onChange={(event) => setCode(event.target.value)}
                            disabled={loading}
                            placeholder="Paste the code you want to review..."
                            rows={8}
                            maxLength={50000}
                            className="w-full resize-y rounded-lg border border-white/10 bg-[#08090d] px-4 py-3.5 font-mono text-sm leading-6 text-white outline-none transition placeholder:text-slate-700 focus:border-blue-300/60 focus:ring-2 focus:ring-blue-300/10 disabled:opacity-60"
                        />

                        <div className="mt-2 text-right text-[11px] text-slate-600">
                            {code.length}/50000
                        </div>

                        <label htmlFor="review-requirements" className="mb-2 mt-5 block text-sm font-medium text-slate-300">
                            Requirements <span className="ml-1 text-xs font-normal text-slate-600">optional</span>
                        </label>

                        <textarea
                            id="review-requirements"
                            value={requirements}
                            onChange={(event) => setRequirements(event.target.value)}
                            disabled={loading}
                            placeholder="Example: This API should be secure and handle high traffic."
                            rows={4}
                            maxLength={5000}
                            className="w-full resize-none rounded-lg border border-white/10 bg-[#08090d] px-4 py-3.5 text-sm leading-6 text-white outline-none transition placeholder:text-slate-700 focus:border-blue-300/60 focus:ring-2 focus:ring-blue-300/10 disabled:opacity-60"
                        />

                        <div className="mt-2 text-right text-[11px] text-slate-600">
                            {requirements.length}/5000
                        </div>

                        {sharedContext?.code && (
                            <div className="mt-5 rounded-lg border border-blue-300/10 bg-blue-300/5 px-3 py-2.5 text-xs text-slate-400">
                                <span className="text-blue-300">Context attached:</span> current debugging session
                            </div>
                        )}

                        {error && (
                            <div role="alert" className="mt-5 rounded-lg border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm leading-5 text-red-300">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !code.trim()}
                            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {loading ? "Reviewing your code..." : "Review this code"}
                            {!loading && <span aria-hidden="true">-&gt;</span>}
                        </button>
                    </form>

                    <section className="min-h-[520px] rounded-xl border border-white/10 bg-[#0d0f13] shadow-2xl">
                        <div className="flex items-center justify-between border-b border-white/5 px-6 py-5 sm:px-7">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.16em] text-blue-300">02 / Findings</p>
                                <h2 className="mt-2 text-xl font-semibold">What the reviewer sees</h2>
                            </div>
                            {reviewResult && <span className="rounded-full border border-blue-300/20 bg-blue-300/5 px-3 py-1 text-[11px] text-blue-300">Review complete</span>}
                        </div>

                        <div className="p-6 sm:p-7">
                        {loading && (
                            <div className="flex min-h-[410px] flex-col items-center justify-center text-center">
                                <div className="mb-5 h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-blue-300" />
                                <p className="text-sm text-slate-300">Reading your code...</p>
                                <p className="mt-2 text-xs text-slate-600">Checking the code against your selected review lens.</p>
                            </div>
                        )}

                        {!loading && !reviewResult && (
                            <div className="flex min-h-[410px] flex-col items-center justify-center text-center">
                                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-blue-300/20 bg-blue-300/5 text-xl text-blue-300">{}</div>
                                <p className="text-sm font-medium text-slate-300">Your review will appear here.</p>
                                <p className="mt-2 max-w-xs text-xs leading-5 text-slate-600">Paste your code, choose a review lens, and let DevMentor surface the important details.</p>
                            </div>
                        )}

                        {!loading && reviewResult && (
                            <div className="review-results text-slate-300">
                                {mode === "kill-critic" ? (
                                    <KillCriticResults result={reviewResult} />
                                ) : (
                                    <NormalReviewResults result={reviewResult} />
                                )}
                            </div>
                        )}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default Review;