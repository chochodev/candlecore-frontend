import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-10 md:px-6">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-1/4 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-20 h-96 w-96 rounded-full bg-emerald-400/5 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-2xl text-center">
        {/* 404 Number */}
        <div className="relative mb-8">
          <div className="absolute inset-0 blur-2xl">
            <h1 className="font-gellix text-[10rem] leading-none font-bold text-emerald-500/20 md:text-[14rem]">404</h1>
          </div>
          <h1 className="relative font-gellix text-[10rem] leading-none font-bold text-white md:text-[14rem]">404</h1>
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h2 className="font-gellix text-2xl font-bold text-white md:text-3xl">Page Not Found</h2>
          <p className="text-base text-gray-400 md:text-lg">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 text-base font-semibold text-white shadow-md shadow-emerald-500/10 transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/15"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go Home
          </Link>
          <a
            href="http://localhost:8080/api/v1/health"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-gray-800 bg-gray-900/50 px-6 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-emerald-500 hover:bg-emerald-950/50"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            View API
          </a>
        </div>

        {/* Error Code */}
        <div className="mt-12 rounded-2xl border border-gray-800/50 bg-gray-900/30 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">Error Details</span>
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500"></div>
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-black p-4 font-mono text-sm">
            <div className="text-gray-500">$ curl -I {window.location.pathname}</div>
            <div className="mt-2 text-red-400">HTTP/1.1 404 Not Found</div>
            <div className="text-gray-400">Content-Type: application/json</div>
            <div className="mt-2 text-gray-500">
              {"{"} "error": "Route not found" {"}"}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
          <Link to="/#features" className="text-gray-400 transition-colors hover:text-emerald-400">
            Features
          </Link>
          <span className="text-gray-700">•</span>
          <Link to="/docs" className="text-gray-400 transition-colors hover:text-emerald-400">
            Documentation
          </Link>
          <span className="text-gray-700">•</span>
          <a
            href="https://github.com/chochodev/candlecore"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 transition-colors hover:text-emerald-400"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
