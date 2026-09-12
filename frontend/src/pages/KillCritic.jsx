import { useEffect, useState } from "react";
import { killCriticAI } from "../services/ai";
import { useSharedContext } from "../context/SharedContext";
import ModeNavigation from "../components/ModeNavigation";

const KillCritic = () => {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { context: sharedContext } = useSharedContext();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedInput = input.trim();
        if (!trimmedInput) {
            return;
        }

        try {
            setLoading(true);
            setError("");
            setResponse(null);

            const relevantContext = sharedContext
                ? {
                      code: sharedContext.code,
                      language: sharedContext.language,
                      error: sharedContext.error,
                      problem: sharedContext.problem,
                      rootCause: sharedContext.rootCause,
                      solution: sharedContext.solution,
                      fixedCode: sharedContext.fixedCode,
                  }
                : {};

            const result = await killCriticAI(trimmedInput, relevantContext);
            const responseData = result?.response ?? result?.data?.response ?? result;

            if (!responseData || typeof responseData !== "object") {
                throw new Error("KillCritic returned an empty response.");
            }

            setResponse(responseData);
        } catch (error) {
            console.error("KillCritic error:", error);
            setError(
                error?.response?.data?.message ||
                "Something went wrong while analyzing your input."
            );
        } finally {
            setLoading(false);
        }
    };

    const result = response;

    const listSections = [
        ["Key assumptions", "keyAssumptions", "No major assumptions identified."],
        ["What holds up", "whatHoldsUp", "Nothing significant to highlight here."],
        ["What I'm challenging", "whatImChallenging", "No major challenge identified."],
        ["Risks and tradeoffs", "risksAndTradeoffs", "No significant risks or tradeoffs identified."],
        ["Alternatives", "alternatives", "No alternatives identified."],
        ["What would change my recommendation", "whatWouldChangeMyRecommendation", "No specific condition identified."],
    ];

    return (
        <main className="min-h-screen bg-[#08090d] bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:40px_40px] text-white">
            <ModeNavigation />

            <div className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
                <header className="mb-9 max-w-3xl">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-400/5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-red-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-300" /> Adversarial thinking partner
                    </div>
                    <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">KillCritic</h1>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
                        Pressure-test a decision, idea, plan, or claim before it costs you time.
                        Get the strongest objections, risks, and a recommendation you can act on.
                    </p>
                </header>

                <div className="grid gap-6 lg:grid-cols-[minmax(320px,0.82fr)_minmax(0,1.18fr)]">
                    <section className="h-fit rounded-xl border border-white/10 bg-[#0d0f13] p-6 shadow-2xl sm:p-7">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.16em] text-lime-300">01 / Challenge</p>
                                <h2 className="mt-2 text-xl font-semibold">What should I attack?</h2>
                            </div>
                            <span className="rounded-md border border-white/10 px-2 py-1 text-[10px] text-slate-600">PRIVATE</span>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <label htmlFor="kill-critic-input" className="mb-2 block text-sm font-medium text-slate-300">
                                Your reasoning
                            </label>
                            <textarea
                                id="kill-critic-input"
                                value={input}
                                onChange={(event) => setInput(event.target.value)}
                                placeholder="I want to use... because..."
                                rows={12}
                                maxLength={10000}
                                disabled={loading}
                                className="w-full resize-y rounded-lg border border-white/10 bg-[#08090d] px-4 py-3.5 text-sm leading-6 text-white outline-none transition placeholder:text-slate-700 focus:border-lime-300/60 focus:ring-2 focus:ring-lime-300/10 disabled:opacity-60"
                            />
                            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600">
                                <span>Be specific. The better the context, the sharper the critique.</span>
                                <span>{input.trim().length}/10000</span>
                            </div>

                            {sharedContext?.code && (
                                <div className="mt-5 rounded-lg border border-lime-300/10 bg-lime-300/5 px-3 py-2.5 text-xs text-slate-400">
                                    <span className="text-lime-300">Context attached:</span> current debugging session
                                </div>
                            )}

                            {error && (
                                <p role="alert" className="mt-5 rounded-lg border border-red-400/20 bg-red-400/5 px-3 py-2.5 text-sm leading-5 text-red-300">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {loading ? "Examining your reasoning..." : "Challenge this reasoning"}
                                {!loading && <span aria-hidden="true">-&gt;</span>}
                            </button>
                        </form>
                    </section>

                    <section className="min-h-[520px] rounded-xl border border-white/10 bg-[#0d0f13] shadow-2xl">
                        <div className="flex items-center justify-between border-b border-white/5 px-6 py-5 sm:px-7">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.16em] text-red-300">02 / Verdict</p>
                                <h2 className="mt-2 text-xl font-semibold">The uncomfortable read</h2>
                            </div>
                            {result && <span className="rounded-full border border-lime-300/20 bg-lime-300/5 px-3 py-1 text-[11px] text-lime-300">Analysis complete</span>}
                        </div>

                        <div className="p-6 sm:p-7">
                            {loading && (
                                <div className="flex min-h-[410px] flex-col items-center justify-center text-center">
                                    <div className="mb-5 h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-lime-300" />
                                    <p className="text-sm text-slate-300">Finding the weak points...</p>
                                    <p className="mt-2 text-xs text-slate-600">The critic is separating assumptions from evidence.</p>
                                </div>
                            )}

                            {!loading && !result && (
                                <div className="flex min-h-[410px] flex-col items-center justify-center text-center">
                                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-red-400/20 bg-red-400/5 text-xl text-red-300">!</div>
                                    <p className="text-sm font-medium text-slate-300">Your critique will appear here.</p>
                                    <p className="mt-2 max-w-xs text-xs leading-5 text-slate-600">Give KillCritic something real to challenge and we'll map the risks.</p>
                                </div>
                            )}

                            {!loading && result && (
                                <div className="space-y-7">
                                    <div className="border-l-2 border-red-300 pl-4">
                                        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-red-300">Verdict</p>
                                        <p className="text-lg leading-8 text-white">{result.verdict}</p>
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div className="rounded-lg border border-white/5 bg-[#08090d] p-4">
                                            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">What I understood</p>
                                            <p className="text-sm leading-6 text-slate-300">{result.whatIUnderstood}</p>
                                        </div>
                                        <div className="rounded-lg border border-lime-300/10 bg-lime-300/5 p-4">
                                            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-lime-300">Recommendation</p>
                                            <p className="text-sm leading-6 text-slate-200">{result.recommendation}</p>
                                        </div>
                                    </div>

                                    {listSections.map(([title, key, emptyMessage]) => (
                                        <div key={key}>
                                            <h3 className="mb-3 text-sm font-semibold text-slate-200">{title}</h3>
                                            {result[key]?.length ? (
                                                <ul className="space-y-2.5">
                                                    {result[key].map((item, index) => (
                                                        <li key={index} className="flex gap-3 text-sm leading-6 text-slate-400">
                                                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-600" />
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : <p className="text-sm text-slate-600">{emptyMessage}</p>}
                                        </div>
                                    ))}

                                    <div className="border-t border-white/5 pt-5">
                                        <span className="text-xs uppercase tracking-wider text-slate-600">Confidence</span>
                                        <p className="mt-2 text-sm text-slate-300">{result.confidence}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default KillCritic;