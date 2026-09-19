import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const modes = [
  {
    id: "projects",
    number: "01",
    icon: "🗂",
    route: "/projects",
    category: "workspace",
    title: "Projects Workspace",
    tagline: "Codebase & State Management",
    shortDescription:
      "Organize multi-file repositories, preserve development context, and connect your codebase directly to all AI reasoning modes.",
    description:
      "Projects Workspace is the command hub of DevMentor AI. Instead of working with isolated snippets, manage full project scopes, organize code files, and maintain continuous shared context across Debugging, Code Review, Explain, and KillCritic modes without losing state.",
    bestFor:
      "Developers managing multi-file codebases, feature branches, or complex refactoring sessions that require persistent context.",
    color: "emerald",
    badgeText: "Workspace Hub",
    features: [
      "Multi-project codebase management",
      "Cross-mode shared context bridge",
      "Multi-file snippet & note organization",
      "Persistent session state across tools",
      "Project-level architecture metadata",
      "Quick-switch workspace dashboard",
      "One-click handoff to any AI mode",
      "Safe workspace creation & deletion controls",
    ],
    process: [
      "Create or select an active project workspace",
      "Store codebase notes, descriptions, and file snippets",
      "Context automatically syncs with AI reasoning tools",
      "Launch deep audits, reviews, or debug sessions",
      "Save fixes and iterate on project architecture",
    ],
    input: "Project title + description + codebase context",
    output: [
      "Organized project workspace dashboard",
      "Persistent context bridge across all AI modes",
      "Direct action buttons to Review, Debug, Explain, and KillCritic",
      "Centralized project notes and code memory",
    ],
    example: {
      input: `// Project: "E-Commerce Checkout & Webhook Service"
// Files: routes/checkout.js, services/stripeWebhook.js
// Description: Handling idempotent payment processing`,
      issue:
        "Isolated snippet reviews miss cross-file race conditions during asynchronous webhook delivery.",
      improvement:
        "Projects Workspace keeps the shared architecture in memory so all AI modes evaluate the complete picture.",
    },
    useCases: [
      "Organizing full-stack feature development",
      "Managing complex multi-step refactorings",
      "Preserving context between debug and explanation steps",
      "Tracking code improvements across multiple modules",
      "Centralizing project-specific AI prompts and reasoning",
    ],
  },
  {
    id: "ai-mode",
    number: "02",
    icon: "✦",
    route: "/ai",
    category: "intelligence",
    title: "Ask AI Partner",
    tagline: "Context-Aware Engineering Intelligence",
    shortDescription:
      "Ask open-ended technical questions, explore architectural tradeoffs, and bounce ideas off an AI that understands your code context.",
    description:
      "Ask AI operates as your principal engineer pair-programmer. Built with context-aware intelligence, it retains context from recent debugging, review, or project sessions to deliver precise, grounded answers on system design, algorithm selection, and technical tradeoffs.",
    bestFor:
      "Engineers exploring architecture alternatives, evaluating library tradeoffs, designing APIs, or reasoning about complex system decisions.",
    color: "amber",
    badgeText: "AI Partner",
    features: [
      "Open-ended technical reasoning partner",
      "Context-aware memory from previous sessions",
      "Architectural tradeoff & pattern evaluation",
      "Token-optimized focused query handling",
      "Rich markdown formatting with syntax highlights",
      "System design and API contract guidance",
      "Multi-paradigm code generation & refactoring",
      "Seamless integration with specialized modes",
    ],
    process: [
      "Type your technical question or design dilemma",
      "System automatically attaches relevant active context",
      "AI evaluates tradeoffs, edge cases, and architectures",
      "Structured markdown response with actionable code",
      "Seamlessly transition into Debug or Review if needed",
    ],
    input: "Technical question, architecture dilemma, or coding inquiry",
    output: [
      "Comprehensive technical breakdown",
      "Architectural tradeoffs & alternatives",
      "Concrete production-ready code examples",
      "Context-aware recommendations tailored to your stack",
    ],
    example: {
      input: `Should we use WebSockets or Server-Sent Events (SSE) for our real-time notification feed with 50k concurrent users?`,
      issue:
        "WebSockets introduce stateful connection overhead and complex load balancing when traffic is 99% unidirectional.",
      improvement:
        "Use SSE over HTTP/2 for lightweight unidirectional streaming, automatic reconnects, and seamless standard HTTP caching/firewall traversal.",
    },
    useCases: [
      "Evaluating tech stack and database tradeoffs",
      "Brainstorming microservice communication patterns",
      "Clarifying tricky concurrency and async behavior",
      "Designing clean REST / GraphQL API contracts",
      "Pair-programming through complex business logic",
    ],
  },
  {
    id: "explain",
    number: "03",
    icon: "💡",
    route: "/ai/explain",
    category: "intelligence",
    title: "Explain Mode",
    tagline: "Mental Model Builder & Code Deconstruction",
    shortDescription:
      "Deconstruct complex algorithms, unpack unfamiliar syntax, and turn dense code into intuitive, step-by-step mental models.",
    description:
      "Explain Mode turns unfamiliar or cryptic code into clear mental models. Instead of giving generic line summaries, it unpacks the intent, data flow, computational complexity (Big-O), design patterns, and engineering rationale behind every construct.",
    bestFor:
      "Developers onboarding onto legacy codebases, reviewing complex PRs, mastering advanced language idioms, or understanding tricky algorithms.",
    color: "cyan",
    badgeText: "Mental Models",
    features: [
      "Step-by-step logic and data-flow deconstruction",
      "Intuitive mental model building & plain-English summaries",
      "Multi-language syntax and idiom breakdown",
      "Time & Space complexity analysis (Big-O)",
      "Design pattern and paradigm identification",
      "Targeted Q&A on specific functions or expressions",
      "Contextual integration with Debug fixed code",
      "Clear explanation of why code was structured that way",
    ],
    process: [
      "Paste unfamiliar code snippet or complex function",
      "Select language and optionally ask a specific question",
      "DevMentor decomposes the logic and architecture",
      "Review the structured walkthrough and mental model",
      "Gain deep confidence in how the code behaves",
    ],
    input: "Source code snippet + language + optional specific curiosity",
    output: [
      "Executive overview & high-level purpose",
      "Line-by-line / block-by-block breakdown",
      "Data transformation flow explanation",
      "Time/space complexity & underlying design patterns",
    ],
    example: {
      input: `const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);`,
      issue:
        "Higher-order currying and right-to-left reduction can obscure the execution flow for teammates unfamiliar with functional paradigms.",
      improvement:
        "Explain Mode details how compose creates a pipeline executing right-to-left: the return value of each function feeds into the next, transforming x step-by-step.",
    },
    useCases: [
      "Onboarding to complex legacy or open-source repositories",
      "Demystifying complex regular expressions and AST parsers",
      "Understanding functional programming pipelines and monads",
      "Explaining unfamiliar third-party library internals",
      "Preparing clean technical documentation and PR notes",
    ],
  },
  {
    id: "code-review",
    number: "04",
    icon: "⌘",
    route: "/ai/review",
    category: "audit",
    title: "Code Review",
    tagline: "Senior Staff Engineering Quality Audit",
    shortDescription:
      "Audit your code for correctness, security, performance, maintainability, and clean architecture best practices.",
    description:
      "Code Review examines implementations from the perspective of a senior staff engineer. Rather than simply checking basic syntax, it inspects structure, error boundaries, type safety, potential edge-case leaks, and maintainability to ensure production-grade quality.",
    bestFor:
      "Developers who have a working implementation and want a thorough, structured technical review before merging.",
    color: "blue",
    badgeText: "Quality & Standards",
    features: [
      "In-depth code quality and cleanliness audit",
      "Potential bug and defect detection",
      "Maintainability and readability improvements",
      "Severity-graded review findings (Critical / Warning / Notice)",
      "Performance bottleneck and memory leak detection",
      "Edge-case vulnerability identification",
      "Structured technical refactoring suggestions",
      "Clean diff-ready code improvements",
    ],
    process: [
      "Submit your existing implementation and language",
      "DevMentor analyzes AST, patterns, and logic paths",
      "Potential defects and anti-patterns are flagged",
      "Each finding is explained with severity and rationale",
      "Actionable refactored code is generated",
    ],
    input: "Existing source code + language + optional context",
    output: [
      "Overall quality assessment score",
      "Prioritized review findings categorized by severity",
      "Clear explanation of why each issue matters",
      "Ready-to-copy refactored code solution",
    ],
    example: {
      input: `function getUser(id) {
  return users.find(user => user.id == id);
}`,
      issue:
        "Loose equality (==) allows unintended type coercion (e.g., '12' == 12), and find() returns undefined if not found without guard handling.",
      improvement:
        "Use strict equality (===) and return a structured Result/Option type or handle undefined explicitly at the boundary.",
    },
    useCases: [
      "Pre-pull request self-audits to catch bugs early",
      "Standardizing clean code practices across engineering teams",
      "Auditing critical business logic before deployment",
      "Refactoring legacy code into clean modern paradigms",
      "Enhancing type safety and boundary validations",
    ],
  },
  {
    id: "debugging",
    number: "05",
    icon: "⌁",
    route: "/ai/debug",
    category: "audit",
    title: "Deep Debugging",
    tagline: "Root-Cause Diagnosis & Verified Fixes",
    shortDescription:
      "Diagnose runtime exceptions, logic flaws, and async bugs with pinpoint root-cause explanations and verified fixes.",
    description:
      "Debugging is engineered for situations where code behaves unexpectedly or throws runtime errors. Instead of treating visible symptoms, it isolates the exact mechanism causing the failure, maps the breakdown to specific code lines, and generates a tested correction.",
    bestFor:
      "Developers facing runtime errors, unexpected outputs, broken state, async race conditions, or unhandled exceptions.",
    color: "purple",
    badgeText: "Root Cause Engine",
    features: [
      "Root-cause flaw identification and stack analysis",
      "Runtime exception and promise rejection breakdown",
      "State synchronization and async race condition diagnosis",
      "Pinpointed line-by-line failure pointers",
      "Step-by-step explanation of why the defect occurs",
      "Verified replacement code with clean edge-case handling",
      "Regression prevention recommendations",
      "Shared context export to Explain and Ask AI modes",
    ],
    process: [
      "Provide your source code and select the language",
      "Paste the error message or describe unexpected behavior",
      "DevMentor traces the execution path and root cause",
      "The underlying reason is explained clearly",
      "A complete, corrected implementation is delivered",
    ],
    input: "Code + error trace / unexpected behavior description",
    output: [
      "Defect identification and exact error mapping",
      "Root-cause explanation with line pointers",
      "Why the failure occurs under specific conditions",
      "Fully corrected, production-ready replacement code",
    ],
    example: {
      input: `const result = users.map(user => {
  return user.profile.name;
});`,
      issue:
        "Throws TypeError: Cannot read properties of undefined (reading 'name') when a user object has an unpopulated profile.",
      improvement:
        "Utilize optional chaining `user.profile?.name ?? 'Anonymous'` or validate input array schemas before mapping.",
    },
    useCases: [
      "Resolving tricky runtime exceptions and null pointer bugs",
      "Debugging async/await deadlocks and unhandled rejections",
      "Diagnosing React re-render loops and state desyncs",
      "Fixing third-party API payload mismatch errors",
      "Triage production incidents with rapid root-cause isolation",
    ],
  },
  {
    id: "killcritic",
    number: "06",
    icon: "⚔",
    route: "/ai/kill-critic",
    category: "audit",
    title: "KillCritic",
    tagline: "Adversarial Stress-Testing & Blindspot Hunter",
    shortDescription:
      "Aggressively attack your solutions to uncover hidden assumptions, failure modes, race conditions, and scale bottlenecks.",
    description:
      "KillCritic adopts an adversarial engineering stance to challenge your solution before production does. It systematically questions assumptions, simulates extreme edge cases, identifies race conditions, tests scale limits, and exposes critical blind spots.",
    bestFor:
      "Developers who believe their code works and want to discover hidden weaknesses, security vulnerabilities, or scale bottlenecks before shipping.",
    color: "rose",
    badgeText: "Adversarial Engine",
    features: [
      "Adversarial engineering critique and stress-testing",
      "Hidden assumption and boundary condition hunting",
      "Extreme edge-case and failure scenario modeling",
      "Concurrency and race condition vulnerability checks",
      "Scalability, memory leakage, and DOS attack surface audits",
      "Security pitfall and injection surface exposure",
      "Defensive architecture hardening recommendations",
      "Zero-fluff, high-impact technical criticism",
    ],
    process: [
      "Submit your working code, architecture, or algorithm",
      "KillCritic assumes an adversarial engineering mindset",
      "Fragile assumptions and failure vectors are exposed",
      "Catastrophic edge-case scenarios are simulated",
      "Defensive hardening strategies are outlined",
    ],
    input: "Working code, system algorithm, or architecture design",
    output: [
      "Critical vulnerability and fragility observations",
      "Exposed hidden assumptions and boundary flaws",
      "Concrete failure scenarios and reproduction paths",
      "Hardened defensive architecture recommendations",
    ],
    example: {
      input: `function withdraw(balance, amount) {
  return balance - amount;
}`,
      issue:
        "Fails to handle negative withdrawal amounts (money injection), concurrent balance deductions (race condition), floating-point precision loss, and overdraft bounds.",
      improvement:
        "Enforce strict positive integer amount validation, atomic transactional balance deductions, and database-level invariant checks.",
    },
    useCases: [
      "Hardening payment processing and financial transaction flows",
      "Stress-testing high-concurrency microservices and queues",
      "Auditing authentication, authorization, and token flows",
      "Finding subtle edge-cases before shipping to enterprise clients",
      "Preparing for intensive staff-level system design interviews",
    ],
  },
];

const comparisonRows = [
  {
    capability: "Codebase & Workspace Management",
    projects: true,
    "ai-mode": false,
    explain: false,
    "code-review": false,
    debugging: false,
    killcritic: false,
  },
  {
    capability: "Cross-Mode Shared Context Bridge",
    projects: true,
    "ai-mode": true,
    explain: true,
    "code-review": true,
    debugging: true,
    killcritic: true,
  },
  {
    capability: "Interactive Q&A & Technical Pair-Programming",
    projects: false,
    "ai-mode": true,
    explain: true,
    "code-review": false,
    debugging: false,
    killcritic: false,
  },
  {
    capability: "Mental Model & Concept Deconstruction",
    projects: false,
    "ai-mode": true,
    explain: true,
    "code-review": false,
    debugging: false,
    killcritic: false,
  },
  {
    capability: "Code Quality & Clean Architecture Audit",
    projects: false,
    "ai-mode": false,
    explain: false,
    "code-review": true,
    debugging: false,
    killcritic: true,
  },
  {
    capability: "Root-Cause Error & Stack Trace Diagnosis",
    projects: false,
    "ai-mode": false,
    explain: false,
    "code-review": false,
    debugging: true,
    killcritic: false,
  },
  {
    capability: "Adversarial Stress-Testing & Assumption Hunting",
    projects: false,
    "ai-mode": false,
    explain: false,
    "code-review": false,
    debugging: false,
    killcritic: true,
  },
  {
    capability: "Time/Space Complexity (Big-O) Analysis",
    projects: false,
    "ai-mode": true,
    explain: true,
    "code-review": true,
    debugging: false,
    killcritic: true,
  },
  {
    capability: "Automated Fix Generation & Diff Refactoring",
    projects: false,
    "ai-mode": true,
    explain: false,
    "code-review": true,
    debugging: true,
    killcritic: true,
  },
  {
    capability: "Concurrency & Failure Scenario Simulation",
    projects: false,
    "ai-mode": false,
    explain: false,
    "code-review": false,
    debugging: true,
    killcritic: true,
  },
];

const modeSelector = [
  {
    question: "I want to organize multiple files and keep my codebase context in one place.",
    answer: "Projects Workspace",
    modeId: "projects",
    description:
      "Use Projects Workspace to manage repository state, save file snippets, and synchronize context across all AI tools.",
  },
  {
    question: "I have general technical questions, architecture dilemmas, or want to discuss tradeoffs.",
    answer: "Ask AI Partner",
    modeId: "ai-mode",
    description:
      "Use Ask AI as your technical pair-programmer to explore design choices, libraries, and system architecture.",
  },
  {
    question: "I am looking at unfamiliar code and want to understand how it works step-by-step.",
    answer: "Explain Mode",
    modeId: "explain",
    description:
      "Use Explain Mode to dissect complex algorithms, unfamiliar syntax, design patterns, and build a clear mental model.",
  },
  {
    question: "I have working code and want a comprehensive senior engineering quality audit.",
    answer: "Code Review",
    modeId: "code-review",
    description:
      "Use Code Review to audit maintainability, type safety, anti-patterns, and receive categorized improvement findings.",
  },
  {
    question: "My code is throwing an error, crashing, or returning unexpected output.",
    answer: "Deep Debugging",
    modeId: "debugging",
    description:
      "Use Debugging to pinpoint the root cause behind failures, analyze stack traces, and get verified code fixes.",
  },
  {
    question: "I think my solution works, but I want to stress-test it against adversarial edge cases.",
    answer: "KillCritic",
    modeId: "killcritic",
    description:
      "Use KillCritic to expose hidden assumptions, race conditions, memory leaks, and failure scenarios before shipping.",
  },
];

const themeMap = {
  emerald: {
    shell: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    glow: "shadow-[0_0_30px_rgba(16,185,129,0.18)]",
    accent: "from-emerald-500 to-teal-400",
    badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    button: "bg-emerald-400 text-slate-950 hover:bg-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.35)]",
    activeTab: "border-emerald-400/40 bg-emerald-400/15 text-emerald-200 shadow-sm",
    pill: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
  },
  amber: {
    shell: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    glow: "shadow-[0_0_30px_rgba(245,158,11,0.18)]",
    accent: "from-amber-500 to-yellow-400",
    badge: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    button: "bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.35)]",
    activeTab: "border-amber-400/40 bg-amber-400/15 text-amber-200 shadow-sm",
    pill: "bg-amber-400/10 text-amber-300 border-amber-400/30",
  },
  cyan: {
    shell: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
    glow: "shadow-[0_0_30px_rgba(6,182,212,0.18)]",
    accent: "from-cyan-500 to-sky-400",
    badge: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
    button: "bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.35)]",
    activeTab: "border-cyan-400/40 bg-cyan-400/15 text-cyan-200 shadow-sm",
    pill: "bg-cyan-400/10 text-cyan-300 border-cyan-400/30",
  },
  blue: {
    shell: "border-sky-500/30 bg-sky-500/10 text-sky-300",
    glow: "shadow-[0_0_30px_rgba(56,189,248,0.18)]",
    accent: "from-sky-500 to-indigo-500",
    badge: "border-sky-500/30 bg-sky-500/10 text-sky-300",
    button: "bg-sky-400 text-slate-950 hover:bg-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.35)]",
    activeTab: "border-sky-400/40 bg-sky-400/15 text-sky-200 shadow-sm",
    pill: "bg-sky-400/10 text-sky-300 border-sky-400/30",
  },
  purple: {
    shell: "border-violet-500/30 bg-violet-500/10 text-violet-300",
    glow: "shadow-[0_0_30px_rgba(139,92,246,0.18)]",
    accent: "from-violet-500 to-fuchsia-500",
    badge: "border-violet-500/30 bg-violet-500/10 text-violet-300",
    button: "bg-violet-400 text-slate-950 hover:bg-violet-300 shadow-[0_0_20px_rgba(167,139,250,0.35)]",
    activeTab: "border-violet-400/40 bg-violet-400/15 text-violet-200 shadow-sm",
    pill: "bg-violet-400/10 text-violet-300 border-violet-400/30",
  },
  rose: {
    shell: "border-rose-500/30 bg-rose-500/10 text-rose-300",
    glow: "shadow-[0_0_30px_rgba(244,63,94,0.18)]",
    accent: "from-rose-500 to-orange-500",
    badge: "border-rose-500/30 bg-rose-500/10 text-rose-300",
    button: "bg-rose-400 text-slate-950 hover:bg-rose-300 shadow-[0_0_20px_rgba(251,113,133,0.35)]",
    activeTab: "border-rose-400/40 bg-rose-400/15 text-rose-200 shadow-sm",
    pill: "bg-rose-400/10 text-rose-300 border-rose-400/30",
  },
};

function Features() {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState("projects");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [heroTerminalMode, setHeroTerminalMode] = useState("killcritic");

  const selectedMode =
    modes.find((mode) => mode.id === activeMode) || modes[0];

  const filteredModes =
    categoryFilter === "all"
      ? modes
      : modes.filter((m) => m.category === categoryFilter);

  const handleTryMode = (route) => {
    navigate(route);
  };

  const handleExplore = (modeId) => {
    setActiveMode(modeId);
    setTimeout(() => {
      const element = document.getElementById(`mode-${modeId}`);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 60);
  };

  const scrollToModes = () => {
    const element = document.getElementById("mode-overview");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-lime-400/30 selection:text-lime-200">
      {/* Dynamic Background Gradients */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,_rgba(16,185,129,0.12),_transparent_30%),radial-gradient(circle_at_85%_20%,_rgba(139,92,246,0.12),_transparent_35%),radial-gradient(circle_at_50%_90%,_rgba(56,189,248,0.08),_transparent_40%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />

        {/* Global Navigation Bar */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07090e]/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link to="/" className="flex items-center gap-3 transition hover:opacity-90">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-lime-400/40 bg-lime-400/10 text-base font-bold text-lime-300 shadow-[0_0_15px_rgba(163,230,53,0.2)]">
                &lt;/&gt;
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tracking-tight text-white">DevMentor</span>
                  <span className="rounded-md bg-lime-400/20 px-1.5 py-0.5 text-[10px] font-semibold text-lime-300 border border-lime-400/30">
                    AI SUITE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">Specialized Engineering Modes</p>
              </div>
            </Link>

            {/* Quick Mode Links */}
            <nav className="hidden items-center gap-1 rounded-full border border-slate-800 bg-slate-900/80 p-1 lg:flex">
              <Link
                to="/projects"
                className="rounded-full px-3 py-1 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Projects
              </Link>
              <Link
                to="/ai"
                className="rounded-full px-3 py-1 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Ask AI
              </Link>
              <Link
                to="/ai/explain"
                className="rounded-full px-3 py-1 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Explain
              </Link>
              <Link
                to="/ai/review"
                className="rounded-full px-3 py-1 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Review
              </Link>
              <Link
                to="/ai/debug"
                className="rounded-full px-3 py-1 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Debug
              </Link>
              <Link
                to="/ai/kill-critic"
                className="rounded-full px-3 py-1 text-xs font-medium text-rose-300 transition hover:bg-rose-500/10 hover:text-rose-200"
              >
                KillCritic
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/projects")}
                className="rounded-xl border border-lime-400/40 bg-lime-400/10 px-4 py-2 text-xs font-semibold text-lime-300 transition hover:bg-lime-400/20 hover:shadow-[0_0_20px_rgba(163,230,53,0.3)]"
              >
                Launch Workspace
              </button>
              <button
                type="button"
                onClick={() => navigate("/ai")}
                className="rounded-xl bg-white px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Try AI Now
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative mx-auto max-w-7xl px-4 pt-12 pb-16 sm:px-6 lg:px-8 lg:pt-20 lg:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-lime-400/40 bg-lime-400/10 px-3.5 py-1.5 text-xs font-medium tracking-wide text-lime-300 shadow-[0_0_20px_rgba(163,230,53,0.15)]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-400" />
                </span>
                <span>Complete Developer Intelligence Ecosystem</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                One Suite.
                <span className="mt-2 block bg-gradient-to-r from-lime-300 via-sky-300 to-violet-300 bg-clip-text text-transparent">
                  6 Specialized Modes.
                </span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                Stop forcing generic chatbots into complex engineering problems.
                DevMentor AI delivers dedicated tools tailored for{" "}
                <span className="font-semibold text-emerald-300">Project Workspace management</span>,{" "}
                <span className="font-semibold text-amber-300">Conversational AI reasoning</span>,{" "}
                <span className="font-semibold text-cyan-300">Code Explanation</span>,{" "}
                <span className="font-semibold text-sky-300">Code Reviews</span>,{" "}
                <span className="font-semibold text-violet-300">Deep Debugging</span>, and{" "}
                <span className="font-semibold text-rose-300">Adversarial Stress-Testing</span>.
              </p>

              {/* Quick Pills */}
              <div className="mt-6 flex flex-wrap gap-2">
                {modes.map((m) => {
                  const theme = themeMap[m.color];
                  return (
                    <button
                      key={m.id}
                      onClick={() => handleExplore(m.id)}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition hover:scale-105 ${theme.pill}`}
                    >
                      <span>{m.icon}</span>
                      <span>{m.title}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={scrollToModes}
                  className="rounded-xl bg-lime-400 px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-lime-300 shadow-[0_0_25px_rgba(163,230,53,0.35)]"
                >
                  Explore All 6 Modes ↓
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/projects")}
                  className="rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800"
                >
                  Open Projects Workspace →
                </button>
              </div>

              {/* Stat Bar */}
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-800/80 pt-6 text-slate-400">
                <div>
                  <div className="text-2xl font-bold text-white">6</div>
                  <div className="text-xs text-slate-400">Specialized Modes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-lime-300">100%</div>
                  <div className="text-xs text-slate-400">Shared Context Sync</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-sky-300">Zero</div>
                  <div className="text-xs text-slate-400">Fluff / Hallucination</div>
                </div>
              </div>
            </div>

            {/* Interactive Terminal Simulator Card */}
            <div className="relative">
              <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-tr from-lime-500/20 via-sky-500/15 to-violet-500/20 blur-2xl opacity-75" />
              <div className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-[#0c0f17] shadow-2xl backdrop-blur-xl">
                {/* Terminal Header */}
                <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                    <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono text-[11px] text-slate-400">devmentor-kernel.sh</span>
                  </div>
                  <div className="flex gap-1">
                    {["killcritic", "explain", "debugging"].map((mId) => (
                      <button
                        key={mId}
                        onClick={() => setHeroTerminalMode(mId)}
                        className={`rounded px-2 py-0.5 text-[10px] font-mono transition ${heroTerminalMode === mId
                            ? "bg-slate-800 text-white font-semibold"
                            : "text-slate-500 hover:text-slate-300"
                          }`}
                      >
                        {mId}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Terminal Body */}
                <div className="space-y-4 p-5 font-mono text-xs">
                  {heroTerminalMode === "killcritic" && (
                    <>
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="text-rose-400">$</span>
                        <span>devmentor run --mode=killcritic --target=checkout.ts</span>
                      </div>
                      <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-rose-200">
                        <div className="flex items-center gap-2 font-bold">
                          <span>⚔</span>
                          <span>KillCritic Adversarial Audit</span>
                        </div>
                        <p className="mt-1 text-[11px] text-rose-300/90">
                          3 fragile assumptions detected in payment idempotency logic.
                        </p>
                      </div>
                      <div className="space-y-1.5 pl-3 border-l-2 border-rose-500/30 text-slate-400">
                        <p className="text-amber-300">⚠ [Concurrence] Race condition on simultaneous webhook callbacks.</p>
                        <p className="text-rose-400">✗ [Boundary] Missing negative amount deduction invariant.</p>
                        <p className="text-sky-300">✓ [Defense] Recommended: Atomic Redis locks + idempotency keys.</p>
                      </div>
                    </>
                  )}

                  {heroTerminalMode === "explain" && (
                    <>
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="text-cyan-400">$</span>
                        <span>devmentor run --mode=explain --snippet=composePipeline</span>
                      </div>
                      <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3 text-cyan-200">
                        <div className="flex items-center gap-2 font-bold">
                          <span>💡</span>
                          <span>Explain Mode Mental Model</span>
                        </div>
                        <p className="mt-1 text-[11px] text-cyan-300/90">
                          Functional composition pipeline deconstructed into 3 sequential steps.
                        </p>
                      </div>
                      <div className="space-y-1.5 pl-3 border-l-2 border-cyan-500/30 text-slate-400">
                        <p className="text-slate-300">Step 1: Curried outer function accepts variadic transformer fns.</p>
                        <p className="text-slate-300">Step 2: Inner closure accepts initial payload value x.</p>
                        <p className="text-lime-300">Result: Threads x through fns right-to-left in O(N) linear time.</p>
                      </div>
                    </>
                  )}

                  {heroTerminalMode === "debugging" && (
                    <>
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="text-violet-400">$</span>
                        <span>devmentor run --mode=debug --error="TypeError: profile undefined"</span>
                      </div>
                      <div className="rounded-lg border border-violet-500/30 bg-violet-500/10 p-3 text-violet-200">
                        <div className="flex items-center gap-2 font-bold">
                          <span>⌁</span>
                          <span>Root-Cause Flaw Identified</span>
                        </div>
                        <p className="mt-1 text-[11px] text-violet-300/90">
                          Line 4: users.map accessed nested property without optional chaining.
                        </p>
                      </div>
                      <div className="space-y-1.5 pl-3 border-l-2 border-violet-500/30 text-slate-400">
                        <p className="text-emerald-300">+ const name = user.profile?.name ?? 'Anonymous';</p>
                        <p className="text-slate-400">✓ Fix verified with 0 regressions across nullable datasets.</p>
                      </div>
                    </>
                  )}

                  {/* Terminal Footer */}
                  <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Ready for input
                    </span>
                    <button
                      onClick={() => navigate(modes.find((m) => m.id === heroTerminalMode)?.route || "/ai")}
                      className="text-lime-300 hover:underline"
                    >
                      Open in App →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Mode Capabilities Overview Section */}
      <section id="mode-overview" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-300 mb-3">
              Capabilities Architecture
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Engineered for every stage of development.
            </h2>
            <p className="mt-2 max-w-2xl text-slate-400 text-sm sm:text-base">
              Different engineering challenges require different cognitive strategies.
              Switch modes to get the exact depth of reasoning you need.
            </p>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            {[
              ["all", "All 6 Modes"],
              ["workspace", "Workspace (1)"],
              ["intelligence", "Intelligence (2)"],
              ["audit", "Audits & Stress (3)"],
            ].map(([cat, label]) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${categoryFilter === cat
                    ? "bg-white text-slate-950 shadow font-semibold"
                    : "text-slate-400 hover:text-white"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Modes Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredModes.map((mode) => {
            const theme = themeMap[mode.color];
            const isSelected = activeMode === mode.id;

            return (
              <article
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`group relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-300 cursor-pointer ${isSelected
                    ? `border-slate-600 bg-slate-900/90 ${theme.glow} ring-1 ring-white/10`
                    : "border-slate-800/90 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/80"
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      MODE {mode.number}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${theme.badge}`}>
                      <span>{mode.icon}</span>
                      <span>{mode.badgeText}</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-lime-300 transition">
                    {mode.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-slate-400">
                    {mode.tagline}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {mode.shortDescription}
                  </p>

                  <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Best For
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-300">
                      {mode.bestFor}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExplore(mode.id);
                    }}
                    className="text-xs font-medium text-slate-400 hover:text-white transition flex items-center gap-1"
                  >
                    Deep Dive
                    <span>↓</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTryMode(mode.route);
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${theme.button}`}
                  >
                    Launch Mode
                    <span>→</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Deep Dive Mode Interactive Explorer */}
      <section className="border-y border-slate-800/80 bg-slate-950/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-lime-300">
                Interactive Deep Dive
              </p>
              <h3 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
                Explore every mode in depth
              </h3>
            </div>

            {/* Mode Tab Switcher */}
            <div className="flex flex-wrap gap-2">
              {modes.map((mode) => {
                const theme = themeMap[mode.color];
                const isActive = activeMode === mode.id;

                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setActiveMode(mode.id)}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${isActive
                        ? theme.activeTab
                        : "border-slate-800 bg-slate-900/70 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                  >
                    <span>{mode.icon}</span>
                    <span>{mode.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Mode Spotlight Card */}
          {(() => {
            const mode = selectedMode;
            const theme = themeMap[mode.color];

            return (
              <div
                id={`mode-${mode.id}`}
                className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-md"
              >
                {/* Spotlight Header */}
                <div className="border-b border-slate-800/80 bg-slate-950/70 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl border text-3xl ${theme.shell} ${theme.glow}`}>
                      {mode.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest">
                          DevMentor Mode {mode.number}
                        </span>
                        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${theme.badge}`}>
                          {mode.badgeText}
                        </span>
                      </div>
                      <h4 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
                        {mode.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-400 mt-0.5">{mode.tagline}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleTryMode(mode.route)}
                      className={`rounded-xl px-5 py-2.5 text-sm font-bold text-slate-950 transition ${theme.button}`}
                    >
                      Open {mode.title} →
                    </button>
                  </div>
                </div>

                {/* Spotlight Content Body */}
                <div className="p-6 sm:p-8 space-y-8">
                  {/* Top Grid: Overview & Capabilities */}
                  <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div>
                      <h5 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                        Architectural Rationale
                      </h5>
                      <p className="mt-2 text-base leading-7 text-slate-200">
                        {mode.description}
                      </p>

                      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Recommended When
                        </p>
                        <p className="mt-1.5 text-sm leading-6 text-slate-300">
                          {mode.bestFor}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">
                        Core Capabilities
                      </p>
                      <div className="space-y-2.5">
                        {mode.features.map((feature) => (
                          <div key={feature} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                            <span className="mt-0.5 text-lime-400 font-bold">✓</span>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Execution Flow Pipeline */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 sm:p-6">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Step-by-Step Execution Flow
                    </p>
                    <h5 className="mt-1 text-lg font-bold text-white">
                      From input to verified engineering output
                    </h5>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                      {mode.process.map((step, stepIndex) => (
                        <div
                          key={step}
                          className="flex flex-col justify-between rounded-xl border border-slate-800/90 bg-slate-900/80 p-3.5"
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 font-mono text-xs font-bold text-lime-300 mb-2">
                            {String(stepIndex + 1).padStart(2, "0")}
                          </span>
                          <p className="text-xs leading-5 text-slate-200">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Input / Output Contract */}
                  <div className="grid gap-5 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="text-base text-sky-400 font-bold">↑</span>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Input Contract
                        </p>
                      </div>
                      <h6 className="text-base font-semibold text-white">What you provide</h6>
                      <p className="mt-2 text-xs sm:text-sm leading-6 text-slate-300">{mode.input}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                      <div className="mb-3 flex items-center gap-2">
                        <span className="text-base text-emerald-400 font-bold">↓</span>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Output Contract
                        </p>
                      </div>
                      <h6 className="text-base font-semibold text-white">What you receive</h6>
                      <ul className="mt-2 space-y-1.5 text-xs sm:text-sm text-slate-300">
                        {mode.output.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="text-emerald-400">✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Live Real-World Code Example */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 sm:p-6">
                    <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Live Practical Example
                        </p>
                        <h6 className="text-base font-bold text-white">
                          Real-world scenario in {mode.title}
                        </h6>
                      </div>
                      <span className={`self-start sm:self-auto rounded-full border px-3 py-1 text-[11px] font-semibold ${theme.badge}`}>
                        {mode.title} in Action
                      </span>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-2">
                      <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0a0d14]">
                        <div className="border-b border-slate-800 bg-slate-950 px-3.5 py-2 font-mono text-[11px] text-slate-400 flex items-center justify-between">
                          <span>INPUT</span>
                          <span className="text-[10px] text-slate-500">Snippet</span>
                        </div>
                        <pre className="overflow-x-auto p-4 font-mono text-xs leading-6 text-slate-200">
                          <code>{mode.example.input}</code>
                        </pre>
                      </div>

                      <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0a0d14]">
                        <div className="border-b border-slate-800 bg-slate-950 px-3.5 py-2 font-mono text-[11px] text-slate-400 flex items-center justify-between">
                          <span>DEVMENTOR INSIGHT & FIX</span>
                          <span className="text-[10px] text-lime-400">Analyzed</span>
                        </div>
                        <div className="space-y-3 p-4">
                          <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-rose-300">
                              Identified Risk / Issue
                            </p>
                            <p className="mt-1 text-xs leading-5 text-rose-200">
                              {mode.example.issue}
                            </p>
                          </div>
                          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                              Recommended Solution
                            </p>
                            <p className="mt-1 text-xs leading-5 text-emerald-200">
                              {mode.example.improvement}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Common Engineering Use Cases */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Real-World Use Cases
                    </p>
                    <h6 className="mt-1 text-lg font-bold text-white mb-4">
                      When developers rely on {mode.title}
                    </h6>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {mode.useCases.map((uc, i) => (
                        <div
                          key={uc}
                          className="flex items-start gap-3 rounded-xl border border-slate-800/90 bg-slate-900/60 p-3.5"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-800 font-mono text-xs font-bold text-slate-300">
                            {i + 1}
                          </span>
                          <p className="text-xs leading-5 text-slate-300">{uc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Interactive Mode Decision Helper */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-violet-300 mb-3">
            Decision Matrix
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Which mode do you need right now?
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Match your immediate technical roadblock to the optimal reasoning engine.
          </p>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {modeSelector.map((item, index) => {
            const targetMode = modes.find((m) => m.id === item.modeId);
            const theme = themeMap[targetMode?.color || "blue"];

            return (
              <div
                key={item.question}
                className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 md:grid-cols-[auto_1.2fr_auto_1.4fr_auto] md:items-center hover:border-slate-700 transition"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 font-mono text-xs font-bold text-slate-200">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="text-sm font-semibold text-slate-200">
                  {item.question}
                </div>

                <div className="hidden md:block text-slate-600 text-lg">→</div>

                <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{targetMode?.icon}</span>
                    <strong className="text-sm font-bold text-white">{item.answer}</strong>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    {item.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleTryMode(targetMode?.route || "/ai")}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition whitespace-nowrap ${theme.button}`}
                >
                  Launch →
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comprehensive 6-Mode Comparison Table */}
      <section className="border-t border-slate-800/80 bg-slate-950/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-3">
              Full Comparison
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Compare all 6 capabilities side by side.
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base">
              See how each specialized mode focuses on a distinct dimension of engineering excellence.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/70 shadow-2xl">
            <table className="min-w-full text-left text-xs sm:text-sm text-slate-200">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/90 text-slate-300">
                  <th className="px-5 py-4 font-semibold">Capability Matrix</th>
                  {modes.map((mode) => (
                    <th key={mode.id} className="px-4 py-4 font-semibold text-center whitespace-nowrap">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-lg">{mode.icon}</span>
                        <span className="text-white text-xs">{mode.title}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {comparisonRows.map((row) => (
                  <tr key={row.capability} className="hover:bg-slate-800/30 transition">
                    <td className="px-5 py-3.5 font-medium text-slate-200">
                      {row.capability}
                    </td>
                    {modes.map((mode) => (
                      <td key={mode.id} className="px-4 py-3.5 text-center">
                        {row[mode.id] ? (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/15 text-xs font-bold text-emerald-400 border border-emerald-400/30">
                            ✓
                          </span>
                        ) : (
                          <span className="text-slate-600 font-mono">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Seamless Workflow Architecture */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-lime-300 mb-3">
            Connected Lifecycle
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How the 6 modes connect together.
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            DevMentor synchronizes your code state across tools so you never have to re-explain context.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Organize & Ingest",
              icon: "🗂",
              color: "emerald",
              description:
                "Create a Project Workspace to store multi-file codebases and attach architectural descriptions.",
              routes: ["/projects"],
            },
            {
              step: "02",
              title: "Analyze & Deconstruct",
              icon: "💡",
              color: "cyan",
              description:
                "Use Explain Mode to deconstruct logic or Ask AI to explore tradeoffs and algorithms.",
              routes: ["/ai/explain", "/ai"],
            },
            {
              step: "03",
              title: "Audit, Debug & Stress-Test",
              icon: "⚔",
              color: "rose",
              description:
                "Run Code Review for cleanliness, Debug for root-causes, and KillCritic to attack failure scenarios.",
              routes: ["/ai/review", "/ai/debug", "/ai/kill-critic"],
            },
          ].map((item) => (
            <div
              key={item.title}
              className="relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-lime-400">
                    STAGE {item.step}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-xl border border-slate-800">
                    {item.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-slate-800">
                {item.routes.map((r) => {
                  const m = modes.find((mode) => mode.route === r);
                  return (
                    <button
                      key={r}
                      onClick={() => navigate(r)}
                      className="rounded-lg bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition"
                    >
                      {m?.title || r} →
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-[#0c121e] to-slate-950 p-8 md:p-14 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-lime-400/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl pointer-events-none" />

          <div className="relative max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-lime-300 mb-4">
              Get Started Now
            </div>
            <h2 className="text-3xl font-extrabold text-white sm:text-5xl tracking-tight">
              Ready to elevate your engineering workflow?
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-7 text-slate-300">
              Select any of the 6 specialized modes or start managing your codebases with Projects Workspace today.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => navigate("/projects")}
                className="rounded-xl bg-lime-400 px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-lime-300 shadow-[0_0_30px_rgba(163,230,53,0.35)]"
              >
                Open Projects Workspace
              </button>
              <button
                type="button"
                onClick={() => navigate("/ai")}
                className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 hover:border-slate-500"
              >
                Launch DevMentor AI
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Features;