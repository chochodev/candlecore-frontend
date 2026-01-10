import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-950">
      {/* Animated background stars */}
      <div className="absolute inset-0 -z-10">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute h-0.5 w-0.5 rounded-full bg-gray-500 opacity-50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Gradient blobs */}
      <div className="absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
      <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="container relative mx-auto px-4 py-16 md:py-20">
        {/* Badge */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Real-time Engine
          </div>
        </div>

        {/* Hero Heading */}
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-semibold leading-tight text-white md:text-6xl lg:text-7xl">
            <span className="relative inline-block rounded-2xl bg-gray-800/50 px-4 py-1">
              Automate
            </span>{" "}
            crypto trading
            <br />
            with live algorithms
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-400">
            Trading engine with real-time WebSocket streaming, historical data replay,
            and REST API control. Built in Go for high performance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/dashboard"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-8 text-base font-semibold text-gray-950 shadow-lg transition-all hover:bg-gray-100"
            >
              Open Dashboard
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>

            {/* Code snippet */}
            <div className="inline-flex h-12 items-center gap-3 rounded-full border border-gray-800 bg-gray-900/50 px-5 font-mono text-sm text-gray-300 backdrop-blur">
              <span className="text-emerald-500">$</span>
              <span>./candlecore serve</span>
            </div>
          </div>
        </div>

        {/* Terminal Preview */}
        <div className="mx-auto mt-16 max-w-4xl">
          <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-gray-800 bg-gray-950 px-4 py-3">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs text-gray-500">candlecore@localhost</span>
              <div className="w-16" />
            </div>

            {/* Terminal Content */}
            <div className="p-6 font-mono text-sm">
              <div className="space-y-2 text-gray-300">
                <div className="flex gap-2">
                  <span className="text-emerald-500">$</span>
                  <span>./candlecore serve --port 8080</span>
                </div>
                <div className="text-gray-500">Starting Candlecore API Server on port 8080...</div>
                <div className="text-gray-500">Data directory: data/historical</div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-emerald-400">Server running at http://localhost:8080</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-emerald-400">WebSocket ready for streaming</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span className="text-emerald-400">Loaded 1000 candles (bitcoin_1h.csv)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mt-24 grid max-w-6xl gap-6 md:grid-cols-3">
          {[
            {
              title: "Live Streaming",
              description: "WebSocket-based real-time price feeds with sub-second latency for instant market data",
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
            },
            {
              title: "Algorithmic Trading",
              description: "Deploy automated strategies with technical indicators and custom signal generation",
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
            },
            {
              title: "REST API",
              description: "Full programmatic control with RESTful endpoints for integration and automation",
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ),
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur transition-all hover:border-emerald-500/50 hover:bg-gray-900"
            >
              <div className="mb-4 inline-flex rounded-xl border border-gray-800 bg-gray-950 p-3 text-emerald-500 transition-colors group-hover:border-emerald-500/50">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mx-auto mt-24 max-w-4xl">
          <div className="grid grid-cols-2 gap-8 border-t border-gray-800 pt-12 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-500">1000+</div>
              <div className="mt-1 text-sm text-gray-400">Candles/Interval</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-500">6</div>
              <div className="mt-1 text-sm text-gray-400">Timeframes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-500">2+</div>
              <div className="mt-1 text-sm text-gray-400">Strategies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-500">∞</div>
              <div className="mt-1 text-sm text-gray-400">Backtests</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
