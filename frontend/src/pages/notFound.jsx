import { Link, useLocation } from "react-router-dom";

function NotFound() {
	const location = useLocation();

	return (
		<main className="relative flex min-h-screen overflow-hidden bg-[#08090d] px-6 py-6 text-white">
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:40px_40px]" />
			<div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-lime-300/10 blur-3xl" />

			<div className="relative mx-auto flex w-full max-w-6xl flex-col">
				<header className="flex items-center justify-between border-b border-white/10 pb-5">
					<Link to="/" className="flex items-center gap-2 text-sm font-semibold">
						<span className="text-lime-300">&lt;/&gt;</span>
						<span>
							DevMentor <span className="text-lime-300">AI</span>
						</span>
					</Link>
					<span className="font-mono text-xs text-slate-600">STATUS: 404</span>
				</header>

				<section className="flex flex-1 items-center justify-center py-20 text-center">
					<div className="max-w-2xl">
						<p className="mb-5 font-mono text-sm text-lime-300">ERROR_ROUTE_NOT_FOUND</p>
						<h1 className="text-7xl font-semibold tracking-tight text-white sm:text-9xl">
							404<span className="text-slate-700">.</span>
						</h1>
						<h2 className="mt-5 text-2xl font-semibold sm:text-3xl">
							This page needs a better address.
						</h2>
						<p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
							The route you entered does not exist in the DevMentor workspace.
							Check the URL or head back to a place where the code makes sense.
						</p>

						<div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
							<Link
								to="/"
								className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-slate-200"
							>
								Back to home
							</Link>
							<Link
								to="/ai"
								className="rounded-md border border-white/10 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
							>
								Open AI workspace
							</Link>
						</div>

						<p className="mt-10 truncate font-mono text-xs text-slate-700" title={location.pathname}>
							requested_path: {location.pathname}
						</p>
					</div>
				</section>
			</div>
		</main>
	);
}

export default NotFound;
