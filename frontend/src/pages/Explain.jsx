import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { explainAI } from "../services/ai";
import { useSharedContext } from "../context/SharedContext";
import ModeNavigation from "../components/ModeNavigation";

const Explain = () => {
    const { context: sharedContext } = useSharedContext();

    const [code, setCode] = useState(sharedContext?.code || "");
    const [language, setLanguage] = useState(
        sharedContext?.language || "javascript"
    );
    const [question, setQuestion] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleExplain = async (event) => {
        event?.preventDefault();

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
        <main className="min-h-screen bg-[#08090d] bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:40px_40px] text-white">
            <ModeNavigation />

            <div className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
                <header className="mb-9 max-w-3xl">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-sky-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
                        Learn the shape of your code
                    </div>

                    <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                        Explain your code
                    </h1>

                    <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
                        Turn unfamiliar code into a clear mental model. Ask about
                        the flow, the concepts, or the decisions behind the
                        implementation.
                    </p>
                </header>

                <div className="grid gap-6 lg:grid-cols-[minmax(340px,0.86fr)_minmax(0,1.14fr)]">
                    {/* Source Section */}
                    <section className="h-fit rounded-xl border border-white/10 bg-[#0d0f13] p-6 shadow-2xl sm:p-7">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.16em] text-sky-300">
                                    01 / Source
                                </p>

                                <h2 className="mt-2 text-xl font-semibold">
                                    What should I unpack?
                                </h2>
                            </div>

                            <span className="rounded-md border border-white/10 px-2 py-1 text-[10px] text-slate-600">
                                EXPLAIN
                            </span>
                        </div>

                        <form onSubmit={handleExplain} className="space-y-5">
                            {/* Language */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label
                                        htmlFor="explain-language"
                                        className="text-sm font-medium text-slate-300"
                                    >
                                        Language
                                    </label>

                                    {sharedContext?.code && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCode(sharedContext.code)
                                            }
                                            disabled={loading}
                                            className="text-xs text-sky-300 transition hover:text-sky-200 disabled:opacity-40"
                                        >
                                            Use shared code
                                        </button>
                                    )}
                                </div>

                                <select
                                    id="explain-language"
                                    value={language}
                                    onChange={(event) =>
                                        setLanguage(event.target.value)
                                    }
                                    disabled={loading}
                                    className="w-full rounded-lg border border-white/10 bg-[#08090d] px-3.5 py-3 text-sm text-white outline-none focus:border-sky-300/60 focus:ring-2 focus:ring-sky-300/10 disabled:opacity-60"
                                >
                                    <option value="javascript">
                                        JavaScript
                                    </option>
                                    <option value="typescript">
                                        TypeScript
                                    </option>
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                    <option value="cpp">C++</option>
                                    <option value="csharp">C#</option>
                                    <option value="go">Go</option>
                                    <option value="rust">Rust</option>
                                    <option value="php">PHP</option>
                                    <option value="ruby">Ruby</option>
                                </select>
                            </div>

                            {/* Code */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label
                                        htmlFor="explain-code"
                                        className="text-sm font-medium text-slate-300"
                                    >
                                        Your code
                                    </label>

                                    <span className="text-[11px] text-slate-600">
                                        {code.length}/20000
                                    </span>
                                </div>

                                <textarea
                                    id="explain-code"
                                    value={code}
                                    onChange={(event) =>
                                        setCode(event.target.value)
                                    }
                                    disabled={loading}
                                    maxLength={20000}
                                    rows={13}
                                    placeholder="Paste the code you want to understand..."
                                    className="w-full resize-y rounded-lg border border-white/10 bg-[#08090d] px-4 py-3.5 font-mono text-xs leading-6 text-white outline-none transition placeholder:text-slate-700 focus:border-sky-300/60 focus:ring-2 focus:ring-sky-300/10 disabled:opacity-60"
                                />
                            </div>

                            {/* Question */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label
                                        htmlFor="explain-question"
                                        className="text-sm font-medium text-slate-300"
                                    >
                                        What do you want to understand?
                                    </label>

                                    <span className="text-[11px] text-slate-600">
                                        {question.length}/1000
                                    </span>
                                </div>

                                <textarea
                                    id="explain-question"
                                    value={question}
                                    onChange={(event) =>
                                        setQuestion(event.target.value)
                                    }
                                    disabled={loading}
                                    maxLength={1000}
                                    rows={4}
                                    placeholder="Example: Why is async/await used here?"
                                    className="w-full resize-y rounded-lg border border-white/10 bg-[#08090d] px-4 py-3.5 text-sm leading-6 text-white outline-none transition placeholder:text-slate-700 focus:border-sky-300/60 focus:ring-2 focus:ring-sky-300/10 disabled:opacity-60"
                                />
                            </div>

                            {/* Shared Context */}
                            {sharedContext?.problem && (
                                <div className="rounded-lg border border-sky-300/10 bg-sky-300/5 px-3 py-2.5 text-xs text-slate-400">
                                    <span className="text-sky-300">
                                        Context attached:
                                    </span>{" "}
                                    current debugging session
                                </div>
                            )}

                            {/* Error */}
                            {error && (
                                <p
                                    role="alert"
                                    className="rounded-lg border border-red-400/20 bg-red-400/5 px-3 py-2.5 text-sm leading-5 text-red-300"
                                >
                                    {error}
                                </p>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={!code.trim() || loading}
                                className="flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {loading
                                    ? "Building an explanation..."
                                    : "Explain this code"}

                                {!loading && (
                                    <span aria-hidden="true">-&gt;</span>
                                )}
                            </button>
                        </form>
                    </section>

                    {/* Response Section */}
                    <section className="min-h-[620px] rounded-xl border border-white/10 bg-[#0d0f13] shadow-2xl">
                        <div className="flex items-center justify-between border-b border-white/5 px-6 py-5 sm:px-7">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.16em] text-sky-300">
                                    02 / Mental model
                                </p>

                                <h2 className="mt-2 text-xl font-semibold">
                                    The code, made legible
                                </h2>
                            </div>

                            {response && (
                                <span className="rounded-full border border-sky-300/20 bg-sky-300/5 px-3 py-1 text-[11px] text-sky-300">
                                    Explanation ready
                                </span>
                            )}
                        </div>

                        <div className="p-6 sm:p-7">
                            {/* Loading State */}
                            {loading && (
                                <div className="flex min-h-[510px] flex-col items-center justify-center text-center">
                                    <div className="mb-5 h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-sky-300" />

                                    <p className="text-sm text-slate-300">
                                        Reading the code...
                                    </p>

                                    <p className="mt-2 text-xs text-slate-600">
                                        Connecting the implementation to the
                                        concepts behind it.
                                    </p>
                                </div>
                            )}

                            {/* Empty State */}
                            {!loading && !response && (
                                <div className="flex min-h-[510px] flex-col items-center justify-center text-center">
                                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-sky-300/20 bg-sky-300/5 text-xl text-sky-300">
                                        ?
                                    </div>

                                    <p className="text-sm font-medium text-slate-300">
                                        Your explanation will appear here.
                                    </p>

                                    <p className="mt-2 max-w-xs text-xs leading-5 text-slate-600">
                                        Paste code and ask a specific question,
                                        or let DevMentor walk through the whole
                                        thing.
                                    </p>
                                </div>
                            )}

                            {/* Response */}
                            {!loading && response && (
                                <article className="prose prose-invert max-w-none prose-headings:font-semibold prose-headings:text-white prose-p:text-sm prose-p:leading-7 prose-p:text-slate-300 prose-a:text-sky-300 prose-code:text-sky-200 prose-pre:border prose-pre:border-white/10 prose-pre:bg-[#08090d] prose-strong:text-white prose-li:text-slate-300">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {response}
                                    </ReactMarkdown>
                                </article>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default Explain;