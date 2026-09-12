import { Link, useLocation } from "react-router-dom";

const modes = [
    ["Ask AI", "/ai"],
    ["Debug", "/ai/debug"],
    ["Explain", "/ai/explain"],
    ["Review", "/ai/review"],
    ["KillCritic", "/ai/kill-critic"],
];

const ModeNavigation = () => {
    const location = useLocation();

    return (
        <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#08090d]/95 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
                <Link to="/" className="flex shrink-0 items-center gap-2">
                    <span className="text-lime-300">&lt;/&gt;</span>
                    <span className="font-semibold">DevMentor <span className="text-lime-300">AI</span></span>
                </Link>

                <div className="flex min-w-0 items-center gap-1 overflow-x-auto text-sm text-slate-500 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {modes.map(([label, path]) => {
                        const isActive = location.pathname === path;

                        return (
                            <Link
                                key={path}
                                to={path}
                                aria-current={isActive ? "page" : undefined}
                                className={`whitespace-nowrap rounded-md px-3 py-2 transition ${isActive
                                    ? "bg-lime-300/10 text-lime-300"
                                    : "hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default ModeNavigation;
