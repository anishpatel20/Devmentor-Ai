import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { debugAI } from "../services/ai";
import { useSharedContext } from "../context/SharedContext";
import ModeNavigation from "../components/ModeNavigation";

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

    const handleDebug = async (event) => {
        event?.preventDefault();

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
        <main className="min-h-screen bg-[#08090d] bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:40px_40px] text-white">
            <ModeNavigation />

            <div className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
                <header className="mb-9 max-w-3xl">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/5 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-amber-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-300" /> Root-cause analysis
                    </div>
                    <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Debug your code</h1>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
                        Bring the code, the error, and your context. DevMentor will separate facts from guesses and give you a practical path forward.
                    </p>
                </header>

                <div className="grid gap-6 lg:grid-cols-[minmax(340px,0.86fr)_minmax(0,1.14fr)]">
                    <section className="h-fit rounded-xl border border-white/10 bg-[#0d0f13] p-6 shadow-2xl sm:p-7">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.16em] text-amber-300">01 / Evidence</p>
                                <h2 className="mt-2 text-xl font-semibold">Show me what broke</h2>
                            </div>
                            <span className="rounded-md border border-white/10 px-2 py-1 text-[10px] text-slate-600">DEBUG</span>
                        </div>

                        <form onSubmit={handleDebug} className="space-y-5">
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label htmlFor="debug-code" className="text-sm font-medium text-slate-300">Your code</label>
                                    <span className="text-[11px] text-slate-600">{code.length} chars</span>
                                </div>
                                <textarea
                                    id="debug-code"
                                    value={code}
                                    onChange={(event) => setCode(event.target.value)}
                                    disabled={loading}
                                    rows={11}
                                    placeholder="Paste the smallest piece of code that reproduces the problem..."
                                    className="w-full resize-y rounded-lg border border-white/10 bg-[#08090d] px-4 py-3.5 font-mono text-xs leading-6 text-white outline-none transition placeholder:text-slate-700 focus:border-amber-300/60 focus:ring-2 focus:ring-amber-300/10 disabled:opacity-60"
                                />
                            </div>

                            <div>
                                <label htmlFor="debug-error" className="mb-2 block text-sm font-medium text-slate-300">Error or problem</label>
                                <textarea
                                    id="debug-error"
                                    value={errorMessage}
                                    onChange={(event) => setErrorMessage(event.target.value)}
                                    disabled={loading}
                                    rows={5}
                                    placeholder="Paste the error message or describe what happened..."
                                    className="w-full resize-y rounded-lg border border-white/10 bg-[#08090d] px-4 py-3.5 font-mono text-xs leading-6 text-white outline-none transition placeholder:text-slate-700 focus:border-amber-300/60 focus:ring-2 focus:ring-amber-300/10 disabled:opacity-60"
                                />
                            </div>

                            <div>
                                <label htmlFor="debug-language" className="mb-2 block text-sm font-medium text-slate-300">Language</label>
                                <select
                                    id="debug-language"
                                    value={language}
                                    onChange={(event) => setLanguage(event.target.value)}
                                    disabled={loading}
                                    className="w-full rounded-lg border border-white/10 bg-[#08090d] px-3.5 py-3 text-sm text-white outline-none focus:border-amber-300/60 focus:ring-2 focus:ring-amber-300/10 disabled:opacity-60"
                                >
                                    <option value="javascript">JavaScript</option>
                                    <option value="typescript">TypeScript</option>
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                    <option value="cpp">C++</option>
                                    <option value="c">C</option>
                                    <option value="csharp">C#</option>
                                    <option value="go">Go</option>
                                    <option value="rust">Rust</option>
                                    <option value="php">PHP</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="debug-context" className="mb-2 block text-sm font-medium text-slate-300">Additional context <span className="ml-1 font-normal text-slate-600">optional</span></label>
                                <textarea
                                    id="debug-context"
                                    value={context}
                                    onChange={(event) => setContext(event.target.value)}
                                    disabled={loading}
                                    rows={4}
                                    placeholder="What did you expect? Include relevant versions, recent changes, or reproduction steps."
                                    className="w-full resize-y rounded-lg border border-white/10 bg-[#08090d] px-4 py-3.5 text-sm leading-6 text-white outline-none transition placeholder:text-slate-700 focus:border-amber-300/60 focus:ring-2 focus:ring-amber-300/10 disabled:opacity-60"
                                />
                            </div>

                            {error && <p role="alert" className="rounded-lg border border-red-400/20 bg-red-400/5 px-3 py-2.5 text-sm leading-5 text-red-300">{error}</p>}

                            <div className="flex gap-3">
                                <button type="submit" disabled={!code.trim() || !errorMessage.trim() || loading} className="flex flex-1 items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40">
                                    {loading ? "Analyzing evidence..." : "Find the root cause"}
                                    {!loading && <span aria-hidden="true">-&gt;</span>}
                                </button>
                                <button type="button" onClick={handleClear} disabled={loading} className="rounded-md border border-white/10 px-4 py-3 text-sm font-medium text-slate-400 transition hover:border-white/20 hover:text-white disabled:opacity-40">Clear</button>
                            </div>
                        </form>

                        <button type="button" onClick={() => navigate("/ai")} disabled={loading} className="mt-5 w-full text-center text-xs text-slate-600 transition hover:text-lime-300 disabled:opacity-40">Need to ask a broader question? Open Ask AI -&gt;</button>
                    </section>

                    <section className="min-h-[620px] rounded-xl border border-white/10 bg-[#0d0f13] shadow-2xl">
                        <div className="flex items-center justify-between border-b border-white/5 px-6 py-5 sm:px-7">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.16em] text-amber-300">02 / Diagnosis</p>
                                <h2 className="mt-2 text-xl font-semibold">What is actually happening?</h2>
                            </div>
                            {debugResult && <span className="rounded-full border border-lime-300/20 bg-lime-300/5 px-3 py-1 text-[11px] text-lime-300">Analysis ready</span>}
                        </div>

                        <div className="p-6 sm:p-7">
                            {loading && <div className="flex min-h-[510px] flex-col items-center justify-center text-center"><div className="mb-5 h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-amber-300" /><p className="text-sm text-slate-300">Tracing the failure...</p><p className="mt-2 text-xs text-slate-600">Separating the symptom from the root cause.</p></div>}

                            {!loading && !debugResult && <div className="flex min-h-[510px] flex-col items-center justify-center text-center"><div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-amber-300/20 bg-amber-300/5 text-xl text-amber-300">&lt;/&gt;</div><p className="text-sm font-medium text-slate-300">Your diagnosis will appear here.</p><p className="mt-2 max-w-xs text-xs leading-5 text-slate-600">Add code and the error you are seeing to begin a focused investigation.</p></div>}

                            {!loading && debugResult && (
                                <div className="space-y-7">
                                    {debugResult.needsMoreInformation && <div className="rounded-lg border border-amber-300/20 bg-amber-300/5 p-4"><p className="text-sm font-semibold text-amber-300">More information needed</p><p className="mt-2 text-sm leading-6 text-slate-400">The available evidence is not enough to confidently determine the root cause.</p>{debugResult.missingInformation?.length > 0 && <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-400">{debugResult.missingInformation.map((item, index) => <li key={index}>{item}</li>)}</ul>}</div>}

                                    <div className="border-l-2 border-amber-300 pl-4"><p className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-amber-300">Root cause</p><p className="text-lg leading-8 text-white">{debugResult.rootCause}</p></div>
                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div className="rounded-lg border border-white/5 bg-[#08090d] p-4"><p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">Problem</p><p className="text-sm leading-6 text-slate-300">{debugResult.problem}</p></div>
                                        <div className="rounded-lg border border-lime-300/10 bg-lime-300/5 p-4"><p className="mb-2 text-xs font-medium uppercase tracking-wider text-lime-300">Solution</p><p className="text-sm leading-6 text-slate-200">{debugResult.solution}</p></div>
                                    </div>

                                    <div><h3 className="mb-2 text-sm font-semibold text-slate-200">Why it happened</h3><p className="text-sm leading-7 text-slate-400">{debugResult.whyItHappened}</p></div>
                                    <div><h3 className="mb-2 text-sm font-semibold text-slate-200">Explanation</h3><p className="text-sm leading-7 text-slate-400">{debugResult.explanation}</p></div>

                                    {debugResult.fixedCode && <div><h3 className="mb-3 text-sm font-semibold text-slate-200">Fixed code</h3><pre className="overflow-x-auto rounded-lg border border-white/10 bg-[#08090d] p-4 font-mono text-xs leading-6 text-lime-100"><code>{debugResult.fixedCode}</code></pre></div>}

                                    {debugResult.testCases?.length > 0 && <div><h3 className="mb-3 text-sm font-semibold text-slate-200">Test cases</h3><div className="space-y-3">{debugResult.testCases.map((testCase, index) => <div key={index} className="rounded-lg border border-white/5 bg-[#08090d] p-4"><p className="text-sm font-medium text-slate-200">Test {index + 1}: {testCase.description}</p><p className="mt-2 text-sm leading-6 text-slate-500"><span className="text-slate-300">Expected:</span> {testCase.expectedResult}</p></div>)}</div></div>}

                                    <div className="border-t border-white/5 pt-5"><p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-600">Verification</p><p className="text-sm leading-7 text-slate-400">{debugResult.verification}</p></div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}

export default Debug;