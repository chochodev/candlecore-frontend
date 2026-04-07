export const Introduction = () => (
  <section id="intro" className="mb-24 scroll-mt-20 py-10">
    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-500/5 px-3 py-1 text-[10px] font-semibold tracking-tighter text-emerald-500 uppercase">
      v1.3.1 Mission Briefing
    </div>
    <h1 className="mb-6 text-5xl font-semibold tracking-tighter lg:text-8xl">
      The Pulse <span className="italic">Standard</span>
    </h1>
    <p className="max-w-2xl font-sans text-xl leading-relaxed text-gray-400">
      Candlecore is not a generic signal bot. It is a strictly optimized **High-Frequency Scalper** designed to extract
      micro-capital growth from volatile technical pulses. Built using Go's concurrent runtimes, it handles hundreds of
      ticks per second with zero-gc-latency.
    </p>
  </section>
);

export const GettingStarted = () => (
  <section id="getting-started" className="mb-24 scroll-mt-20 border-white/5 pb-10">
    <h2 className="mb-8 text-4xl font-semibold tracking-tighter">Getting Started</h2>
    <div className="prose prose-invert max-w-none space-y-6">
      <p className="text-gray-400">
        Operation begins in the <strong>Strategy Laboratory</strong>. Before committing live assets, you must
        synchronize your local historical pulse files (`.csv`) with the engine's internal data provider. This ensures
        your neural parameters are tuned to real market friction.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-white/2 p-6">
          <h4 className="mb-3 text-xs font-semibold tracking-widest text-emerald-500 uppercase">01. Signal Check</h4>
          <p className="text-[12px] leading-relaxed text-gray-500">
            Ensure your Binance/OKX data feed is correctly cached in data/historical. Use the built-in scraper scripts
            if necessary.
          </p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/2 p-6">
          <h4 className="mb-3 text-xs font-semibold tracking-widest text-blue-500 uppercase">02. Env Logic</h4>
          <p className="text-[12px] leading-relaxed text-gray-500">
            Configure your environment variables to set the initial balance. For first-timers, $10 is the recommended
            stress-test floor.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export const Installation = () => (
  <section id="installation" className="mb-24 scroll-mt-20 border-white/5 pb-10">
    <h2 className="mb-8 text-4xl font-semibold tracking-tighter">Installation</h2>
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-gray-400">
        Candlecore utilizes a **Monolithic Architecture** for the backend and a **Vite-powered React** frontend. Follow
        the technical manifest to bootstrap your instance.
      </p>
      <div className="overflow-hidden rounded-2xl border border-white/5 bg-black/40">
        <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-2">
          <span className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase">Terminal Manifesto</span>
          <div className="flex gap-1.5">
            <div className="h-2 w-2 rounded-full bg-red-500/50"></div>
            <div className="h-2 w-2 rounded-full bg-yellow-500/50"></div>
            <div className="h-2 w-2 rounded-full bg-emerald-500/50"></div>
          </div>
        </div>
        <div className="overflow-x-auto p-6 font-mono text-[11px] leading-6 text-emerald-400/90">
          <div>
            <span className="text-gray-600"># Clone with Technical Submodules</span>
          </div>
          <div>git clone https://github.com/chocho/candlecore.git</div>
          <div className="pt-2">
            <span className="text-gray-600"># Compile Pulse Engine (Binary)</span>
          </div>
          <div>cd server && go build -o pulse cmd/main.go</div>
          <div className="pt-2">
            <span className="text-gray-600"># Ignite Frontend Interface</span>
          </div>
          <div>cd client && npm run ignite</div>
        </div>
      </div>
    </div>
  </section>
);

export const FeeShield = () => (
  <section id="fee-shield" className="mb-24 scroll-mt-20 border-white/5 pb-10">
    <h2 className="mb-8 text-4xl font-semibold tracking-tighter text-emerald-500 underline decoration-emerald-500/20 underline-offset-8">
      The Fee Shield
    </h2>
    <article className="prose prose-invert max-w-none space-y-6 text-gray-400">
      <p>
        The <strong>Shield</strong> is an automated algorithmic safeguard. Its purpose is to neutralize the "Trading
        Friction" (0.1% Taker Fees and 0.05% Slippage) before it erodes your wallet.
      </p>
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8">
        <h4 className="mb-4 font-semibold tracking-tight text-white">The Break-even Math</h4>
        <p className="border-l-2 border-emerald-500 pl-6 text-sm italic">
          Entry ($10) &rarr; Fee ($0.01) &rarr; Exit Pulse (+0.1%) &rarr; 50% Profit Take &rarr; Move SL to Entry + Fee
          Buffer.
        </p>
        <p className="mt-4 font-mono text-[11px] opacity-50">Status: Enabled by Default | Sensitivity: 0.1% Delta</p>
      </div>
    </article>
  </section>
);

export const DashboardOps = () => (
  <section id="dashboard" className="mb-24 scroll-mt-20 border-white/5 pb-10">
    <h2 className="mb-8 text-4xl font-semibold tracking-tighter">Dashboard Ops</h2>
    <div className="grid gap-8 md:grid-cols-3">
      <div className="space-y-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/5">
          <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h5 className="text-[11px] font-semibold tracking-widest text-white uppercase">Live Launch</h5>
        <p className="text-[11px] leading-relaxed text-pretty text-gray-500">
          Instant REST initialization. No queueing.
        </p>
      </div>
      <div className="space-y-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/5">
          <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h5 className="text-[11px] font-semibold tracking-widest text-white uppercase">Action Jump</h5>
        <p className="text-[11px] leading-relaxed text-gray-500">Fast-forward searching until signal peak.</p>
      </div>
      <div className="space-y-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/5">
          <svg className="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h5 className="text-[11px] font-semibold tracking-widest text-white uppercase">Stats Hub</h5>
        <p className="text-[11px] leading-relaxed text-gray-500">Real-time Winrate vs Drawdown analytics.</p>
      </div>
    </div>
  </section>
);

export const CloudDeployment = () => (
  <section id="deployment" className="mb-24 scroll-mt-20 border-white/5 pb-10">
    <h2 className="mb-8 text-4xl font-semibold tracking-tighter text-gray-500">Cloud Deployment</h2>
    <div className="rounded-2xl border border-white/5 bg-white/2 p-10 text-center">
      <span className="mb-4 block text-[10px] font-semibold tracking-[0.3em] text-blue-400 uppercase">
        e2-micro Optimized
      </span>
      <p className="mx-auto max-w-lg text-sm leading-relaxed text-gray-400">
        The Candlecore swarm is designed for maximum efficiency. Deploy onto free-tier cloud VMs with absolute safety.
        The Go engine handles memory isolation and automatic recovery on process restarts.
      </p>
    </div>
  </section>
);
