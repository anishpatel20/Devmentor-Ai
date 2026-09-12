import { useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { askAI } from "../services/ai";
import { useSharedContext } from "../context/SharedContext";
import ModeNavigation from "../components/ModeNavigation";

function AI() {

    const { context: sharedContext } = useSharedContext();

    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleAskAI = async (event) => {
        event?.preventDefault();

        const trimmedPrompt = prompt.trim();
        if (!trimmedPrompt) {
            setError("Please enter a question.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setResponse("");


            // Only send context that is relevant to the current AI request.
            // We intentionally avoid sending the entire application state or
            // previous conversation history to Gemini.
            // This keeps prompts focused, reduces token usage, and prevents
            // unrelated information from influencing the AI response.

            //mtlb user ne debug page pr jo task or question solve karha h uska context hum ASK mode mai bhej rhe h taki AI ko pata ho ki user ne kya kaam kiya h aur uske basis pr wo answer de sake.
            const relevantContext = {
                code: sharedContext?.code || "",
                language: sharedContext?.language || "",
                error: sharedContext?.error || "",
                problem: sharedContext?.problem || "",
                rootCause: sharedContext?.rootCause || "",
                solution: sharedContext?.solution || "",
                fixedCode: sharedContext?.fixedCode || "",
            };

            const data = await askAI(
                trimmedPrompt,
                relevantContext
            );


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
        <main className="min-h-screen bg-[#08090d] bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:40px_40px] text-white">
            <ModeNavigation />

            <div className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
                <header className="mb-9 max-w-3xl">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-lime-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-lime-300" /> Your technical thinking partner
                    </div>
                    <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Ask DevMentor</h1>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
                        Ask clear questions, explore tradeoffs, and understand the reasoning behind your code.
                    </p>
                </header>

                <div className="grid gap-6 lg:grid-cols-[minmax(320px,0.82fr)_minmax(0,1.18fr)]">
                    <section className="h-fit rounded-xl border border-white/10 bg-[#0d0f13] p-6 shadow-2xl sm:p-7">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.16em] text-lime-300">01 / Question</p>
                                <h2 className="mt-2 text-xl font-semibold">What are you working through?</h2>
                            </div>
                            <span className="rounded-md border border-white/10 px-2 py-1 text-[10px] text-slate-600">ASK</span>
                        </div>

                        <form onSubmit={handleAskAI}>
                            <label htmlFor="ai-prompt" className="mb-2 block text-sm font-medium text-slate-300">Your question</label>
                            <textarea
                                id="ai-prompt"
                                value={prompt}
                                onChange={(event) => setPrompt(event.target.value)}
                                placeholder="Why does this work? What should I consider before...?"
                                rows={12}
                                maxLength={10000}
                                disabled={loading}
                                className="w-full resize-y rounded-lg border border-white/10 bg-[#08090d] px-4 py-3.5 text-sm leading-6 text-white outline-none transition placeholder:text-slate-700 focus:border-lime-300/60 focus:ring-2 focus:ring-lime-300/10 disabled:opacity-60"
                            />
                            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600">
                                <span>Ask for an explanation, example, or second opinion.</span>
                                <span>{prompt.trim().length}/10000</span>
                            </div>

                            {sharedContext?.code && (
                                <div className="mt-5 rounded-lg border border-lime-300/10 bg-lime-300/5 px-3 py-2.5 text-xs text-slate-400">
                                    <span className="text-lime-300">Context attached:</span> current debugging session
                                </div>
                            )}

                            {error && (
                                <p role="alert" className="mt-5 rounded-lg border border-red-400/20 bg-red-400/5 px-3 py-2.5 text-sm leading-5 text-red-300">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={!prompt.trim() || loading}
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {loading ? "Thinking through it..." : "Ask DevMentor"}
                                {!loading && <span aria-hidden="true">-&gt;</span>}
                            </button>
                        </form>

                        <div className="mt-7 border-t border-white/5 pt-5">
                            <p className="mb-3 text-xs uppercase tracking-[0.16em] text-slate-600">Need a focused mode?</p>
                            <div className="grid grid-cols-2 gap-2">
                                <Link to="/ai/debug" className="rounded-md border border-white/10 px-3 py-2.5 text-center text-xs font-medium text-slate-400 transition hover:border-white/20 hover:text-white">Debug code</Link>
                                <Link to="/ai/explain" className="rounded-md border border-white/10 px-3 py-2.5 text-center text-xs font-medium text-slate-400 transition hover:border-white/20 hover:text-white">Explain code</Link>
                            </div>
                        </div>
                    </section>

                    <section className="min-h-[520px] rounded-xl border border-white/10 bg-[#0d0f13] shadow-2xl">
                        <div className="flex items-center justify-between border-b border-white/5 px-6 py-5 sm:px-7">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.16em] text-lime-300">02 / Response</p>
                                <h2 className="mt-2 text-xl font-semibold">The answer, unpacked</h2>
                            </div>
                            {response && <span className="rounded-full border border-lime-300/20 bg-lime-300/5 px-3 py-1 text-[11px] text-lime-300">Response ready</span>}
                        </div>

                        <div className="p-6 sm:p-7">
                            {loading && (
                                <div className="flex min-h-[410px] flex-col items-center justify-center text-center">
                                    <div className="mb-5 h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-lime-300" />
                                    <p className="text-sm text-slate-300">DevMentor is thinking...</p>
                                    <p className="mt-2 text-xs text-slate-600">Building a useful answer around your question.</p>
                                </div>
                            )}

                            {!loading && !response && (
                                <div className="flex min-h-[410px] flex-col items-center justify-center text-center">
                                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-lime-300/20 bg-lime-300/5 text-xl text-lime-300">?</div>
                                    <p className="text-sm font-medium text-slate-300">Your answer will appear here.</p>
                                    <p className="mt-2 max-w-xs text-xs leading-5 text-slate-600">Ask anything about the code or problem you are currently exploring.</p>
                                </div>
                            )}

                            {!loading && response && (
                                <article className="prose prose-invert max-w-none prose-headings:font-semibold prose-headings:text-white prose-p:text-sm prose-p:leading-7 prose-p:text-slate-300 prose-a:text-lime-300 prose-code:text-lime-200 prose-pre:border prose-pre:border-white/10 prose-pre:bg-[#08090d] prose-strong:text-white prose-li:text-slate-300">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{response}</ReactMarkdown>
                                </article>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}

export default AI;