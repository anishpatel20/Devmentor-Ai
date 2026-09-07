import { Link } from "react-router-dom";
import ProductPreview from "../components/home/ProductPreview";

function Home() {
  return (
    <div className="min-h-screen bg-[#08090d] bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:40px_40px] text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-lime-300">&lt;/&gt;</span>
            <span className="font-semibold">
              DevMentor <span className="text-lime-300">AI</span>
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden gap-8 text-sm text-gray-400 md:flex">
            <a href="#features" className="hover:text-white">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-white">
              How It Works
            </a>
            <a href="#mentor" className="hover:text-white">
              AI Mentor
            </a>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-gray-300 hover:text-white">
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-gray-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 py-24 text-center md:py-32">
        {/* Glow */}
        <div className="pointer-events-none absolute left-1/2 top-10 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-lime-300/10 blur-3xl" />

        <div className="mx-auto max-w-4xl">
          {/* Badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-lime-300/20 bg-lime-300/5 px-4 py-2 text-xs font-medium text-lime-300">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-300" />
            AI-POWERED DEVELOPER MENTOR
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-semibold leading-tight tracking-tight md:text-7xl">
            Understand Code.{" "}
            <span className="block text-slate-500">Build With Confidence.</span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-500 md:text-lg">
            DevMentor AI helps developers understand code, debug errors, learn
            programming concepts, and improve their development skills.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-slate-200"
            >
              Start Learning →
            </Link>
            <a
              href="#features"
              className="rounded-md border border-white/10 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
            >
              Explore Features
            </a>
          </div>
        </div>
      </section>
      <ProductPreview />
    </div>
  );
}

export default Home;
