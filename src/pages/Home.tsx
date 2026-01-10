import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 md:px-6">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/5 blur-3xl"></div>
          <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-screen-2xl py-16 md:py-24 lg:py-32">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            {/* Left: Content */}
            <div className="flex flex-col justify-center space-y-6">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-900/50 bg-emerald-950/50 px-3.5 py-1.5 text-xs font-medium text-emerald-300 md:text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                Production Ready
              </div>

              <h1 className="font-gellix text-4xl leading-[1.1] font-bold tracking-tight text-white md:text-5xl lg:text-6xl xl:text-7xl">
                Algorithmic
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                  Trading Engine
                </span>
              </h1>

              <p className="text-base leading-relaxed text-gray-400 md:text-lg lg:text-xl lg:leading-relaxed">
                High-performance backtesting infrastructure built in Go. Test strategies on years of historical crypto
                data with PostgreSQL persistence and REST API access.
              </p>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <a
                  href="#features"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 text-base font-semibold text-white shadow-md shadow-emerald-500/10 transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/15"
                >
                  Get Started
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
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

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 border-t border-gray-800/50 pt-6 md:gap-8">
                <div>
                  <div className="text-xl font-bold text-white md:text-2xl">8+</div>
                  <div className="text-xs text-gray-400 md:text-sm">Years Data</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white md:text-2xl">5</div>
                  <div className="text-xs text-gray-400 md:text-sm">Timeframes</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-emerald-500 md:text-2xl">REST</div>
                  <div className="text-xs text-gray-400 md:text-sm">API Ready</div>
                </div>
              </div>
            </div>

            {/* Right: Visual Element */}
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-20 blur-2xl"></div>
                <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl">
                  <div className="space-y-3 p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-400 md:text-sm">Terminal</span>
                      <div className="flex gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500 md:h-3 md:w-3"></div>
                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500 md:h-3 md:w-3"></div>
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 md:h-3 md:w-3"></div>
                      </div>
                    </div>
                    <div className="space-y-2 overflow-x-auto rounded-lg bg-black p-3 font-mono text-xs md:p-4 md:text-sm">
                      <div className="text-gray-500">$ ./candlecore serve</div>
                      <div className="text-emerald-400">✓ API server started on :8080</div>
                      <div className="text-emerald-400">✓ Connected to PostgreSQL</div>
                      <div className="text-gray-400">→ GET /api/v1/data</div>
                      <div className="text-gray-400">→ POST /api/v1/backtest</div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
                        <span className="text-gray-500">Ready for requests...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="container mx-auto max-w-screen-2xl px-4 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <div className="text-3xl font-bold">8+ Years</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Historical Data</div>
            </div>
            <div>
              <div className="text-3xl font-bold">5 Timeframes</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">5m to Daily</div>
            </div>
            <div>
              <div className="text-3xl font-bold">REST API</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Full HTTP Access</div>
            </div>
            <div>
              <div className="text-3xl font-bold">PostgreSQL</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">State Persistence</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto max-w-screen-2xl px-4 py-24">
        <div className="flex flex-col space-y-4">
          <h2 className="font-gellix text-3xl font-bold tracking-tight">Built for Performance</h2>
          <p className="max-w-[600px] text-gray-600 dark:text-gray-400">
            Candlecore prioritizes speed, reliability, and clean architecture. No unnecessary abstractions—just
            production-ready infrastructure.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Multi-Timeframe Data</CardTitle>
              <CardDescription>Download historical OHLCV data at 5m, 15m, 1h, 4h, or daily intervals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-gray-100 p-4 font-mono text-sm dark:bg-gray-900">
                <div className="text-gray-600 dark:text-gray-400"># Download 5 years of data</div>
                <div>./candlecore data bulk BTCUSDT</div>
                <div className="mt-2 text-gray-600 dark:text-gray-400">--interval 1h --start 2020</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Strategy Backtesting</CardTitle>
              <CardDescription>
                Test trading strategies on years of historical data with realistic fees and slippage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-900 dark:bg-gray-50"></span>
                  Paper trading simulation
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-900 dark:bg-gray-50"></span>
                  Configurable MA strategies
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-900 dark:bg-gray-50"></span>
                  Performance analytics
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">REST API</CardTitle>
              <CardDescription>Complete HTTP API for data access and backtest execution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-gray-100 p-4 font-mono text-sm dark:bg-gray-900">
                <div className="text-gray-600 dark:text-gray-400">GET /api/v1/data</div>
                <div className="text-gray-600 dark:text-gray-400">GET /api/v1/data/:coin/:interval</div>
                <div className="mt-2 text-gray-600 dark:text-gray-400">POST /api/v1/backtest</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">PostgreSQL Storage</CardTitle>
              <CardDescription>Persistent state management with comprehensive schema</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-900 dark:bg-gray-50"></span>
                  Account state tracking
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-900 dark:bg-gray-50"></span>
                  Trade history logging
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-900 dark:bg-gray-50"></span>
                  Performance metrics
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Go Performance</CardTitle>
              <CardDescription>Native Go implementation for speed and reliability</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-900 dark:bg-gray-50"></span>
                  Fast candle processing
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-900 dark:bg-gray-50"></span>
                  Low memory footprint
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-900 dark:bg-gray-50"></span>
                  Production-ready
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Data Sources</CardTitle>
              <CardDescription>Multiple data acquisition methods for flexibility</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-900 dark:bg-gray-50"></span>
                  CoinGecko API (365 days)
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-900 dark:bg-gray-50"></span>
                  Binance bulk downloads
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-900 dark:bg-gray-50"></span>
                  Synthetic data generator
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Technical Stack */}
      <section className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="container mx-auto max-w-screen-2xl px-4 py-24">
          <h2 className="font-gellix text-3xl font-bold tracking-tight">Technical Stack</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="mb-4 font-semibold">Backend</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>Go 1.25+</li>
                <li>Gin Web Framework</li>
                <li>PostgreSQL 14+</li>
                <li>Cobra CLI</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Data Processing</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>CSV Storage</li>
                <li>CoinGecko Integration</li>
                <li>Binance Public Data</li>
                <li>Incremental Updates</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Trading Engine</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>Paper Trading Broker</li>
                <li>MA Crossover Strategies</li>
                <li>Fee/Slippage Modeling</li>
                <li>State Persistence</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto max-w-screen-2xl px-4 py-24">
        <div className="flex flex-col items-center space-y-4 text-center">
          <h2 className="font-gellix text-3xl font-bold tracking-tight">Start Building Today</h2>
          <p className="max-w-[600px] text-gray-600 dark:text-gray-400">
            Clone the repository and start backtesting strategies on real historical data in minutes.
          </p>
          <div className="flex gap-4 pt-4">
            <a
              href="https://github.com/chochodev/candlecore"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-500 px-8 text-base font-semibold text-white shadow-md shadow-emerald-500/10 transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/15"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto max-w-screen-2xl px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Built for production-grade algorithmic trading infrastructure.
            </p>
            <div className="flex gap-4">
              <a
                href="http://localhost:8080/api/v1/health"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              >
                API Status
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
