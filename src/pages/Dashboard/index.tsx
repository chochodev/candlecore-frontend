import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useWebSocket } from "@/hooks/useWebSocket";
import { botAPI, type BotConfig } from "@/lib/api";
import { CandlestickChart } from "@/components/CandlestickChart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Logo } from "@/components/Logo";
import "./dashboard.css";

export function Dashboard() {
  const { candles, decisions, position, pnl, isConnected, connect } = useWebSocket();
  const [botStatus, setBotStatus] = useState<any>(null);
  const [symbols, setSymbols] = useState<string[]>([]);
  const [timeframes, setTimeframes] = useState<string[]>([]);
  const [configOpen, setConfigOpen] = useState(false);
  const [config, setConfig] = useState<BotConfig>({
    symbol: "btc",
    timeframe: "1h",
    strategy: "ma_crossover",
    replay_mode: true,
    dry_run: true,
    replay_speed: 1.0,
  });
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [sidebarPos, setSidebarPos] = useState({ x: 16, y: 72 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [configError, setConfigError] = useState<string | null>(null);

  const onMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging from the top area or the button background
    if (!(e.target as HTMLElement).closest(".drag-handle")) return;

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - sidebarPos.x,
      y: e.clientY - sidebarPos.y,
    });
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setSidebarPos({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    };

    const onMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Stats from PNL
  const pnlStats = {
    pnl: pnl?.total_pnl || 0,
    winRate: pnl?.win_rate || 0,
    balance: pnl?.balance || 10.0,
    candles: candles.length,
  };

  useEffect(() => {
    const init = async () => {
      await loadMetadata();
      const status = await loadBotStatus();

      // Only auto-configure if NO bot is currently active
      if (!status?.running) {
        await handleConfigure();
      }

      connect();
    };

    init();

    const interval = setInterval(loadBotStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadMetadata = async () => {
    try {
      const [symbolsRes, timeframesRes] = await Promise.all([botAPI.getSymbols(), botAPI.getTimeframes()]);
      setSymbols(symbolsRes.symbols);
      setTimeframes(timeframesRes.timeframes);
    } catch (error) {
      console.error("Failed to load metadata:", error);
    }
  };

  const loadBotStatus = async () => {
    try {
      const status = await botAPI.getStatus();
      setBotStatus(status);
      return status;
    } catch (error) {
      console.error("Failed to load bot status:", error);
      return null;
    }
  };

  const handleStart = async () => {
    try {
      await botAPI.start();
      await loadBotStatus();
    } catch (error) {
      console.error("Failed to start bot:", error);
    }
  };

  const handleStop = async () => {
    try {
      await botAPI.stop();
      await loadBotStatus();
    } catch (error) {
      console.error("Failed to stop bot:", error);
    }
  };

  const handleConfigure = async () => {
    setConfigError(null);
    try {
      await botAPI.configure(config);
      await loadBotStatus();
      setConfigOpen(false);
    } catch (error: any) {
      console.error("Engine Configuration Blocked:", error.message);
      setConfigError(error.message);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#0c0c0e] font-sans selection:bg-emerald-500/30">
      {/* 🟢 TOP NAVIGATION TERMINAL BAR */}
      <header className="z-50 shrink-0 border-b border-white/5 bg-[#0c0c0e] backdrop-blur-xl">
        <div className="flex h-full items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            {/* Official Logo (Only Icon for Max Space) */}
            <Link
              to="/"
              className="group relative flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20 transition-all hover:scale-110 active:scale-95"
            >
              <Logo className="h-5 w-5 text-white" />
            </Link>

            {/* Menu Links Layer */}
            <nav className="hidden items-center gap-2 rounded-lg bg-white/5 p-1 md:flex">
              <Link to="/dashboard">
                <Button
                  variant="ghost"
                  className="h-7 px-3 text-[11px] font-bold text-white transition-all hover:bg-white/10"
                >
                  Dashboard
                </Button>
              </Link>
              <Link to="/api">
                <Button
                  variant="ghost"
                  className="h-7 px-3 text-[11px] font-bold text-white/60 transition-all hover:bg-white/10 hover:text-white"
                >
                  API
                </Button>
              </Link>
              <Link to="/docs">
                <Button
                  variant="ghost"
                  className="h-7 px-3 text-[11px] font-bold text-white/60 transition-all hover:bg-white/10 hover:text-white"
                >
                  Docs
                </Button>
              </Link>
            </nav>

            <div className="h-4 w-px bg-white/10" />

            {/* Market Context */}
            <div className="flex items-center gap-2.5">
              <div className="flex flex-col">
                <span className="text-[10px] font-black tracking-widest text-gray-600 uppercase">Trading Pair</span>
                <span className="text-xs font-bold text-white">
                  {config.symbol.toUpperCase()} / {config.timeframe}
                </span>
              </div>
            </div>
          </div>

          {/* 📊 REAL-TIME ENGINE STATS */}
          <div className="flex items-center gap-10">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">Total PnL</span>
              <span
                className={`font-mono text-sm font-black tracking-tighter ${pnlStats.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}
              >
                {pnlStats.pnl >= 0 ? "+" : ""}${pnlStats.pnl.toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">Accuracy</span>
              <span
                className={`font-mono text-sm font-black tracking-tighter ${pnlStats.winRate >= 50 ? "text-emerald-400" : "text-orange-400"}`}
              >
                {pnlStats.winRate.toFixed(1)}%
              </span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">Wallet</span>
              <span className="font-mono text-sm font-black tracking-tighter text-white">
                ${pnlStats.balance.toFixed(2)}
              </span>
            </div>

            <div className="h-8 w-px bg-white/5" />

            {/* ENGINE CONTROLS */}
            <div className="flex items-center gap-3">
              <Dialog open={configOpen} onOpenChange={setConfigOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 rounded-xl p-0 text-gray-500 hover:bg-white/5 hover:text-white"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <circle cx="12" cy="12" r="3" strokeWidth={2} />
                    </svg>
                  </Button>
                </DialogTrigger>
                <DialogContent className="overflow-hidden border-white/5 bg-[#0c0c0e] text-white shadow-2xl">
                  <DialogHeader className="border-b border-white/5 pb-4">
                    <DialogTitle className="text-xl font-black">Engine Config</DialogTitle>
                    <DialogDescription className="text-gray-500">
                      Fine-tune the bot's neural parameters.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-6 font-sans">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-gray-500 uppercase">Asset</Label>
                        <Select value={config.symbol} onValueChange={(v) => setConfig({ ...config, symbol: v })}>
                          <SelectTrigger className="border-white/5 bg-white/5 font-bold uppercase">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border-white/5 bg-[#0c0c0e] text-white">
                            {symbols.map((s) => (
                              <SelectItem key={s} value={s} className="font-bold uppercase">
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black text-gray-500 uppercase">Interval</Label>
                        <Select value={config.timeframe} onValueChange={(v) => setConfig({ ...config, timeframe: v })}>
                          <SelectTrigger className="border-white/5 bg-white/5 font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border-white/5 bg-[#0c0c0e] text-white">
                            {timeframes.map((tf) => (
                              <SelectItem key={tf} value={tf} className="font-bold">
                                {tf}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {configError && (
                      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                        <p className="text-[10px] font-bold tracking-tight text-red-400 uppercase">
                          Configuration Error
                        </p>
                        <p className="text-[11px] text-red-300/80">{configError}</p>
                      </div>
                    )}
                    <Button
                      onClick={handleConfigure}
                      disabled={botStatus?.running}
                      className="w-full bg-emerald-500 font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-600"
                    >
                      {botStatus?.running ? "STOP ENGINE TO RECONFIGURE" : "FORCE CONFIG UPDATE"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {botStatus?.running ? (
                <Button
                  onClick={handleStop}
                  size="sm"
                  className="h-9 gap-2.5 border border-red-500/20 bg-red-500/10 px-5 text-[11px] font-black text-red-500 transition-all hover:bg-red-500/20"
                >
                  STOP BOT
                </Button>
              ) : (
                <Button
                  onClick={handleStart}
                  size="sm"
                  className="h-9 gap-2 border border-emerald-500/20 bg-emerald-500 px-6 text-[11px] font-black text-white shadow-lg shadow-emerald-500/30 transition-all hover:bg-emerald-600 active:scale-95"
                >
                  START BOT
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 🧭 MAIN VIEWPORT AREA */}
      <main className="relative flex-1 overflow-hidden">
        {/* Full-bleed Immersive Chart */}
        <div className="h-full w-full overflow-hidden bg-[#0c0c0e]">
          <CandlestickChart candles={candles} decisions={decisions} />
        </div>

        {/* 🛸 FLOATING GLASS SIDEBAR (Movable) */}
        <div
          onMouseDown={onMouseDown}
          className={`absolute z-40 transition-shadow ${isDragging ? "shadow-glow cursor-grabbing duration-0" : "duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"} ${sidebarExpanded ? "w-[320px]" : "w-[48px]"}`}
          style={{
            left: `${sidebarPos.x}px`,
            top: `${sidebarPos.y}px`,
            transitionProperty: isDragging ? "none" : "width, left, top",
          }}
        >
          <div className="glass-panel drag-handle flex cursor-grab flex-col rounded-2xl p-1 shadow-2xl active:cursor-grabbing">
            <Button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              variant="ghost"
              className="pointer-events-auto h-10 w-10 rounded-xl p-0 text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
            >
              {sidebarExpanded ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              )}
            </Button>

            {sidebarExpanded && (
              <div className="max-h-[80vh] overflow-x-hidden overflow-y-auto p-4 pt-2">
                {/* Active Risk Unit */}
                <div className="mb-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black tracking-widest text-emerald-500 uppercase">Live Exposure</h3>
                    <Badge
                      variant="outline"
                      className="h-5 border-white/10 bg-white/5 text-[9px] font-bold text-gray-400"
                    >
                      Position ID: 001
                    </Badge>
                  </div>
                  {position ? (
                    <div className="group relative space-y-3 overflow-hidden rounded-xl border border-white/5 bg-white/2 p-4 transition-all hover:bg-white/5">
                      <div className="flex items-end justify-between">
                        <span className="text-[9px] font-bold text-gray-500 uppercase">Direction</span>
                        <span
                          className={`text-xs font-black ${position.side === "buy" ? "text-emerald-400" : "text-red-400"}`}
                        >
                          {position.side.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-end justify-between">
                        <span className="text-[9px] font-bold text-gray-500 uppercase">Entry Quote</span>
                        <span className="font-mono text-xs font-bold text-white">
                          ${position.entry_price.toFixed(2)}
                        </span>
                      </div>
                      <div className="pt-2">
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-[9px] font-black text-gray-500 uppercase">Profit Tracker</span>
                          <span
                            className={`font-mono text-xs font-black ${position.unrealized_pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}
                          >
                            {position.unrealized_pnl >= 0 ? "+" : ""}
                            {position.unrealized_pnl.toFixed(4)}
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                          <div
                            className={`h-full transition-all duration-700 ${position.unrealized_pnl >= 0 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"}`}
                            style={{ width: `${Math.min(100, Math.max(0, 50 + position.unrealized_pnl * 10))}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/2">
                      <span className="text-[10px] font-black tracking-widest text-gray-600">NO ACTIVE EXPOSURE</span>
                    </div>
                  )}
                </div>

                {/* Tactical Pulse Unit */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black tracking-widest text-blue-500 uppercase">Decision Stream</h3>
                  {decisions.length > 0 ? (
                    <div className="space-y-4">
                      <div className="rounded-xl border border-white/5 bg-white/2 p-4">
                        <div className="mb-3 flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-[9px] font-bold tracking-tighter text-gray-500 uppercase">
                            Current Sentiment
                          </span>
                          <span
                            className={`rounded px-2 py-0.5 text-[9px] font-black tracking-widest uppercase ${
                              decisions[decisions.length - 1].signal === "buy"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : decisions[decisions.length - 1].signal === "sell"
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-white/10 text-gray-400"
                            }`}
                          >
                            {decisions[decisions.length - 1].signal}
                          </span>
                        </div>
                        <p className="text-[10px] leading-relaxed text-gray-400">
                          "{decisions[decisions.length - 1].reasoning}"
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        {decisions
                          .slice(-3)
                          .reverse()
                          .map((d, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between rounded-lg border border-transparent bg-white/2 px-3 py-1.5 transition-all hover:border-white/5"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`h-1 w-1 rounded-full ${d.signal === "buy" ? "bg-emerald-500" : d.signal === "sell" ? "bg-red-500" : "bg-gray-500"}`}
                                />
                                <span className="text-[9px] font-bold text-gray-400">
                                  {new Date(d.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <span className="text-[10px] font-black tracking-tighter text-white uppercase">
                                {d.signal}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-20 items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/2">
                      <span className="text-[10px] font-black tracking-widest text-gray-600">LISTENING...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
