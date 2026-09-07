import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setIsSubmitting(true);

        try {
            await login(formData);
            navigate("/ai");
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Unable to login. Please try again.";

            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#08090d] bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:40px_40px] text-white">
            <nav className="border-b border-white/10">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-lime-300">&lt;/&gt;</span>
                        <span className="font-semibold">
                            DevMentor <span className="text-lime-300">AI</span>
                        </span>
                    </Link>
                    <Link
                        to="/register"
                        className="text-sm text-gray-400 transition hover:text-white"
                    >
                        Create account <span className="ml-1 text-lime-300">-&gt;</span>
                    </Link>
                </div>
            </nav>

            <div className="relative mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl items-center gap-16 px-6 py-14 lg:grid-cols-[1fr_420px] lg:gap-24">
                <div className="pointer-events-none absolute left-1/4 top-1/4 -z-0 h-72 w-72 rounded-full bg-lime-300/10 blur-3xl" />

                <section className="relative z-10 hidden lg:block">
                    <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/5 px-4 py-2 text-xs font-medium text-lime-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-lime-300" />
                        YOUR CODE, UNDERSTOOD
                    </div>
                    <h1 className="max-w-xl text-5xl font-semibold leading-tight tracking-tight">
                        Pick up where your <span className="text-slate-500">thinking left off.</span>
                    </h1>
                    <p className="mt-6 max-w-lg text-base leading-7 text-slate-500">
                        Return to your workspace and keep building with a mentor that explains the why behind every line.
                    </p>

                    <div className="mt-10 max-w-md overflow-hidden rounded-xl border border-white/10 bg-[#0d0f13] shadow-2xl">
                        <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
                            <span className="text-[10px] text-slate-500">session.js</span>
                            <span className="flex items-center gap-2 text-[10px] text-lime-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-lime-300" />
                                AI Online
                            </span>
                        </div>
                        <div className="p-5 font-mono text-xs leading-7">
                            <p><span className="mr-5 text-slate-700">01</span><span className="text-purple-300">const</span> <span className="text-blue-300">nextStep</span> <span className="text-slate-500">= mentor.ask(code);</span></p>
                            <p><span className="mr-5 text-slate-700">02</span><span className="text-lime-300">// keep learning</span></p>
                            <p><span className="mr-5 text-slate-700">03</span><span className="text-slate-500">workspace.continue();</span></p>
                        </div>
                    </div>
                </section>

                <section className="relative z-10 mx-auto w-full max-w-[420px] rounded-xl border border-white/10 bg-[#0d0f13]/95 p-7 shadow-2xl backdrop-blur-sm sm:p-9">
                    <div className="mb-8">
                        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-lime-300">Welcome back</p>
                        <h2 className="text-3xl font-semibold tracking-tight">Log in to your workspace</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-500">Your next breakthrough is waiting.</p>
                    </div>

                    {error && (
                        <p role="alert" className="mb-5 rounded-md border border-red-400/20 bg-red-400/5 px-3 py-2 text-sm leading-5 text-red-300">
                            {error}
                        </p>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="mb-2 block text-xs font-medium text-slate-300">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full rounded-md border border-white/10 bg-[#08090d] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-lime-300/60 focus:ring-2 focus:ring-lime-300/10"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="mb-2 block text-xs font-medium text-slate-300">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className="w-full rounded-md border border-white/10 bg-[#08090d] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-700 focus:border-lime-300/60 focus:ring-2 focus:ring-lime-300/10"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-md bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? "Logging in..." : "Continue to workspace"}
                        </button>
                    </form>

                    <p className="mt-7 text-center text-sm text-slate-500">
                        Don't have an account?{" "}
                        <Link to="/register" className="font-medium text-lime-300 transition hover:text-lime-200">Create one</Link>
                    </p>
                </section>
            </div>
        </main>
    );
}

export default Login;