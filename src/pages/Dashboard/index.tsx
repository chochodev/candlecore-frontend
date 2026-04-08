import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useWebSocket } from "@/hooks/useWebSocket";
import { botAPI } from "@/lib/api";
import { CandlestickChart } from "@/components/CandlestickChart";
import { Button } from "@/components/ui/button";
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
import { Target, LocateFixed } from "lucide-react";
import "./dashboard.css";

import { useShallow } from "zustand/shallow";
import { useDashboardStore } from "@/zustand";

export function Dashboard() {
  const { pathname } = useLocation();
  const { connect } = useWebSocket();

  // ── Neural States (Optimized with Shallow Registry) ──
  const {
    candles,
    decisions,
    position,
    pnl,
    status,
    focusedTradeId,
    activeTab,
    config,
    botStatus,
    symbols,
    timeframes,
    configOpen,
    sidebarExpanded,
    sidebarPos,
    isDragging,
    dragOffset,
    configError,
  } = useDashboardStore(
    useShallow((s) => ({
      candles: s.candles,
      decisions: s.decisions,
      position: s.position,
      pnl: s.pnl,
      status: s.status,
      focusedTradeId: s.focusedTradeId,
      activeTab: s.activeTab,
      config: s.config,
      botStatus: s.botStatus,
      symbols: s.symbols,
      timeframes: s.timeframes,
      configOpen: s.configOpen,
      sidebarExpanded: s.sidebarExpanded,
      sidebarPos: s.sidebarPos,
      isDragging: s.isDragging,
      dragOffset: s.dragOffset,
      configError: s.configError,
    }))
  );

  // ── Neural Actions (Static Execution Pulse) ──
  const {
    setFocusedTradeId,
    setActiveTab,
    setConfig,
    setBotStatus,
    setSymbols,
    setTimeframes,
    setConfigOpen,
    setSidebarExpanded,
    setSidebarPos,
    setIsDragging,
    setDragOffset,
    setConfigError,
  } = useDashboardStore();

  const onMouseDown = (e: React.MouseEvent) => {
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
      setSymbols(["sol", "btc"]);
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

  const handleReset = async () => {
    try {
      await botAPI.reset();
      useDashboardStore.getState().reset();
      await loadBotStatus();
    } catch (error) {
      console.error("Failed to reset bot:", error);
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

  const isActive = (link: string) => {
    if (link === pathname.split("/")[1]) return true;
    return false;
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-dark-core font-sans selection:bg-emerald-500/30">
      <header className="z-50 shrink-0 border-b border-white/5 bg-dark-core backdrop-blur-xl">
        <div className="flex h-full items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="group relative flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20 transition-all hover:scale-110 active:scale-95"
            >
              <Logo className="h-5 w-5 text-white" />
            </Link>

            <nav className="hidden items-center gap-1 rounded-lg bg-white/5 p-1 md:flex">
              <Link to="/dashboard">
                <Button
                  variant="ghost"
                  className={cn(
                    "h-7 px-3 text-[11px] font-bold transition-all hover:bg-white/10 hover:text-white",
                    isActive("dashboard") ? "bg-white/10 text-white" : "text-white/60"
                  )}
                >
                  Dashboard
                </Button>
              </Link>
              <Link to="/backtest">
                <Button
                  variant="ghost"
                  className={cn(
                    "h-7 px-3 text-[11px] font-bold transition-all hover:bg-white/10 hover:text-white",
                    isActive("backtest") ? "bg-white/10 text-white" : "text-white/60"
                  )}
                >
                  Backtest
                </Button>
              </Link>
              <Link to="/docs">
                <Button
                  variant="ghost"
                  className={cn(
                    "h-7 px-3 text-[11px] font-bold transition-all hover:bg-white/10 hover:text-white",
                    isActive("docs") ? "bg-white/10 text-white" : "text-white/60"
                  )}
                >
                  Docs
                </Button>
              </Link>
            </nav>

            <div className="h-4 w-px bg-white/10" />

            <div className="flex items-center gap-2.5">
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold tracking-widest text-gray-600 uppercase">Trading Pair</span>
                <span className="text-xs font-bold text-white">
                  {config.symbol.toUpperCase()} / {config.timeframe}
                </span>
              </div>
            </div>
          </div>

          {/* REAL-TIME ENGINE STATS */}
          <div className="flex items-center gap-10">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">Total PnL</span>
              <span
                className={`font-mono text-sm font-semibold tracking-tighter ${pnlStats.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}
              >
                {pnlStats.pnl >= 0 ? "+" : ""}${pnlStats.pnl.toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">Accuracy</span>
              <span
                className={`font-mono text-sm font-semibold tracking-tighter ${pnlStats.winRate >= 50 ? "text-emerald-400" : "text-orange-400"}`}
              >
                {pnlStats.winRate.toFixed(1)}%
              </span>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold tracking-widest text-gray-600 uppercase">Wallet</span>
              <span className="font-mono text-sm font-semibold tracking-tighter text-white">
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
                <DialogContent className="overflow-hidden border-white/5 bg-dark-core text-white shadow-2xl">
                  <DialogHeader className="border-b border-white/5 pb-4">
                    <DialogTitle className="text-xl font-semibold">Engine Config</DialogTitle>
                    <DialogDescription className="text-gray-500">
                      Fine-tune the bot's neural parameters.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-6 font-sans">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-semibold text-gray-500 uppercase">Asset</Label>
                        <Select value={config.symbol} onValueChange={(v) => setConfig({ ...config, symbol: v })}>
                          <SelectTrigger className="border-white/5 bg-white/5 font-bold uppercase">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border-white/5 bg-dark-core text-white">
                            {symbols.map((s) => (
                              <SelectItem key={s} value={s} className="font-bold uppercase">
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] leading-none font-semibold tracking-widest text-gray-500 uppercase">
                          Interval
                        </Label>
                        <Select value={config.timeframe} onValueChange={(v) => setConfig({ ...config, timeframe: v })}>
                          <SelectTrigger className="h-10 border-white/5 bg-white/5 font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border-white/5 bg-dark-core text-white">
                            {timeframes.map((tf) => (
                              <SelectItem key={tf} value={tf} className="font-bold">
                                {tf}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="mb-1 block text-[10px] leading-none font-semibold tracking-[0.2em] text-emerald-500 uppercase">
                        Neural Parameters
                      </Label>
                      <div className="space-y-4 rounded-xl border border-white/5 bg-white/2 p-4">
                        <div className="space-y-2">
                          <div className="flex h-4 items-center justify-between">
                            <Label className="text-[9px] leading-none font-bold text-gray-500 uppercase">
                              Fee Shield Target
                            </Label>
                            <span className="text-[9px] leading-none font-semibold text-emerald-400">
                              {((config.strategy_params?.tp1Pct ?? 0.001) * 100).toFixed(2)}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.05"
                            max="0.5"
                            step="0.01"
                            defaultValue={0.1}
                            onChange={(e) =>
                              setConfig({
                                ...config,
                                strategy_params: {
                                  ...config.strategy_params,
                                  tp1Pct: parseFloat(e.target.value) / 100,
                                },
                              })
                            }
                            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-emerald-500"
                          />
                        </div>
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
                      className="w-full bg-emerald-500 font-semibold shadow-lg hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:text-gray-600"
                    >
                      {botStatus?.running ? "Stop Engine to Reconfigure" : "Force Config Update"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {botStatus?.running ? (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={async () => {
                      try {
                        await botAPI.skip();
                      } catch (e) {
                        console.error("Skip Failed:", e);
                      }
                    }}
                    size="sm"
                    className="group relative flex h-9 gap-2 overflow-hidden border border-blue-500/20 bg-blue-500/10 px-5 text-[11px] font-semibold text-blue-400 transition-all hover:bg-blue-500/20"
                  >
                    <span className="relative z-10">SKIP</span>
                    <div className="absolute inset-0 z-0 bg-blue-500/5 group-hover:animate-pulse"></div>
                  </Button>
                  <Button
                    onClick={handleStop}
                    size="sm"
                    className="h-9 gap-2.5 border border-red-500/20 bg-red-500/10 px-5 text-[11px] font-semibold text-red-500 transition-all hover:bg-red-500/20"
                  >
                    STOP
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleStart}
                    size="sm"
                    className={`h-9 gap-2 border ${botStatus?.paused ? "border-neutral-200/20 bg-neutral-200 text-neutral-900 hover:bg-neutral-300" : "border-emerald-500/20 bg-emerald-500 text-white hover:bg-emerald-600"} px-6 text-[11px] font-semibold shadow-lg transition-all active:scale-95`}
                  >
                    {botStatus?.paused ? "PLAY" : "START"}
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="sm"
                    className="h-9 gap-2 border-white/10 bg-white/5 px-6 text-[11px] font-semibold text-gray-400 hover:bg-white/10 hover:text-white"
                  >
                    RESET
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN VIEWPORT AREA */}
      <main className="relative flex-1 overflow-hidden">
        {/* Full-bleed Immersive Chart */}
        <div className="h-full w-full overflow-hidden bg-dark-core">
          <CandlestickChart
            candles={candles}
            decisions={decisions}
            historicalTrades={pnl?.trades || []}
            activeSymbol={config.symbol}
            timeframe={config.timeframe}
            isSearching={botStatus?.running && candles.length === 0}
            activePosition={position}
          />
        </div>

        {/* FLOATING GLASS SIDEBAR (Movable) */}
        <div
          onMouseDown={onMouseDown}
          className={`absolute z-40 transition-shadow ${isDragging ? "shadow-glow cursor-grabbing duration-0" : "duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"} ${sidebarExpanded ? "h-[600px] w-[320px]" : "h-[48px] w-[48px]"} overflow-hidden rounded-[1rem] border border-white/5 bg-zinc-950/80 backdrop-blur-2xl`}
          style={{
            left: `${sidebarPos.x}px`,
            top: `${sidebarPos.y}px`,
            transitionProperty: isDragging ? "none" : "width, left, top",
          }}
        >
          <div className="drag-handle flex h-full p-0.75 cursor-grab flex-col active:cursor-grabbing">
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
              <div className="flex border-b border-white/5 bg-white/2">
                <button
                  onClick={() => setActiveTab("live")}
                  className={`flex-1 px-4 py-2 text-[10px] font-bold tracking-widest transition-all ${activeTab === "live" ? "border-b border-emerald-500 text-emerald-400" : "text-gray-500 hover:text-white"}`}
                >
                  {focusedTradeId ? "AUDIT" : "LIVE"}
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`flex-1 px-4 py-2 text-[10px] font-bold tracking-widest transition-all ${activeTab === "history" ? "border-b border-blue-500 text-blue-400" : "text-gray-500 hover:text-white"}`}
                >
                  HISTORY
                </button>
              </div>
            )}

            {sidebarExpanded && (
              <div className="custom-scrollbar flex-1 overflow-y-auto p-1 pt-2">
                {activeTab === "live" ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-semibold tracking-widest text-emerald-500 uppercase">
                        {focusedTradeId ? "Trade Audit" : "Live Exposure"}
                      </h3>
                      {focusedTradeId && (
                        <button
                          onClick={() => setFocusedTradeId(null)}
                          className="text-[9px] font-bold text-blue-400 hover:underline"
                        >
                          LATEST
                        </button>
                      )}
                    </div>

                    {/* Trade Details (Focused or Active) */}
                    <PositionDetails position={position} focusedTradeId={focusedTradeId} trades={pnl?.trades || []} />
                  </div>
                ) : (
                  <HistoryList
                    trades={pnl?.trades || []}
                    onAudit={(id) => {
                      setFocusedTradeId(id);
                      setActiveTab("live");
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* NEURAL WARP OVERLAY */}
        {status === "skipping" && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md transition-all animate-in fade-in zoom-in-95">
            <div className="relative max-h-48 max-w-sm rounded-[2.5rem] border border-white/5 bg-linear-to-b from-white/5 to-transparent p-12 text-center shadow-2xl">
              {/* Glowing Background Glow */}
              <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-emerald-500/10 opacity-50 blur-3xl" />
              <div className="absolute -right-10 -bottom-10 h-16 w-32 rounded-full bg-blue-500/10 opacity-50 blur-3xl" />

              <div className="relative z-10">
                <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 shadow-[0_0_60px_-10px_rgba(16,185,129,0.4)]">
                  <svg
                    className="h-10 w-10 animate-spin text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>

                <h3 className="mb-2 text-2xl font-bold tracking-tight text-white transition-all hover:text-emerald-400">
                  Neural Warp Search
                </h3>
                <p className="mb-10 text-[10px] font-bold tracking-[.3em] text-gray-500 uppercase">
                  Finding Next Technical Signal
                </p>

                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-5 py-2">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-emerald-400">Analysing 17,000+ Candles...</span>
                </div>
              </div>

              {/* Decorative corner accents */}
              <div className="absolute top-0 right-0 h-10 w-10 rounded-tr-[2.5rem] border-t border-r border-white/10" />
              <div className="absolute bottom-0 left-0 h-10 w-10 rounded-bl-[2.5rem] border-b border-l border-white/10" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function PositionDetails({
  position,
  focusedTradeId,
  trades,
}: {
  position: any;
  focusedTradeId: string | null;
  trades: any[];
}) {
  const trade = focusedTradeId ? trades.find((t: any) => t.id === focusedTradeId) : position;

  if (!trade) {
    return (
      <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/2">
        <span className="text-[10px] font-semibold tracking-widest text-gray-600 uppercase">
          Listening for Neural Signal...
        </span>
      </div>
    );
  }

  const isBuy = trade.side?.toLowerCase() === "buy" || trade.side?.toLowerCase() === "long";

  return (
    <div className="group relative space-y-3 overflow-hidden rounded-xl border border-white/5 bg-white/2 p-4 transition-all hover:bg-white/5">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-bold text-zinc-500 uppercase">Vector</span>
          <span className={`text-xs font-semibold ${isBuy ? "text-emerald-400" : "text-red-400"}`}>
            {trade.side?.toUpperCase()}
          </span>
        </div>
        <button
          onClick={() => useDashboardStore.getState().triggerJump()}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-zinc-500 transition-all hover:bg-emerald-500/20 hover:text-emerald-400 active:scale-90"
          title="Center Chart"
        >
          <Target size={14} strokeWidth={2.5} />
        </button>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-[9px] font-bold text-gray-500 uppercase">Entry Quote</span>
        <span className="font-mono text-xs font-bold text-white">${(trade.entry_price || 0).toFixed(4)}</span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-[9px] font-bold text-gray-500 uppercase">Target (TP)</span>
        <span className="font-mono text-xs font-bold text-emerald-400">${(trade.take_profit || 0).toFixed(4)}</span>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-end justify-between">
          <span className="text-[9px] font-bold text-gray-500 uppercase">Neural SL</span>
          <span className={`font-mono text-xs font-bold ${trade.trailing_sl ? "text-blue-400" : "text-red-400"}`}>
            ${(trade.trailing_sl || trade.stop_loss || 0).toFixed(4)}
          </span>
        </div>
        {trade.trailing_sl && (
          <div className="flex justify-end">
            <span className="text-[8px] font-black tracking-tighter text-blue-500 uppercase">
              Shield Locked (Modified)
            </span>
          </div>
        )}
      </div>

      {focusedTradeId || trade.closed_at ? (
        <div className="mt-2 border-t border-white/5 pt-2">
          <span className="text-[9px] font-bold text-gray-500 uppercase">Realized Result</span>
          <p className={`text-xs font-black ${trade.realized_pnl >= 0 ? "text-emerald-500" : "text-red-500"}`}>
            {trade.realized_pnl >= 0 ? "PROFIT" : "LOSS"} | {trade.realized_pnl?.toFixed(4)}
          </p>
        </div>
      ) : (
        <div className="pt-2">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[9px] font-semibold text-gray-500 uppercase">Profit Tracker</span>
            <span
              className={`font-mono text-xs font-semibold ${trade.unrealized_pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}
            >
              {trade.unrealized_pnl >= 0 ? "+" : ""}
              {trade.unrealized_pnl?.toFixed(4)}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className={`h-full transition-all duration-700 ${trade.unrealized_pnl >= 0 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"}`}
              style={{ width: `${Math.min(100, Math.max(0, 50 + trade.unrealized_pnl * 10))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function HistoryList({ trades, onAudit }: { trades: any[]; onAudit: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-1">
      {trades.length === 0 ? (
        <div className="flex h-20 items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/2">
          <span className="text-[10px] font-semibold tracking-widest text-gray-600 uppercase italic">
            History empty
          </span>
        </div>
      ) : (
        trades
          .slice()
          .reverse()
          .map((t, i) => (
            <button
              key={i}
              onClick={() => onAudit(t.id)}
              className="flex w-full items-center justify-between rounded-lg border border-transparent bg-white/2 px-3 py-2 text-left transition-all hover:border-white/5 hover:bg-white/5"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-gray-400 italic">
                  {new Date(t.opened_at).toLocaleTimeString()}
                </span>
                <span className="text-[10px] font-black text-white uppercase">{t.side?.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end gap-0.5">
                  <span
                    className={`text-[10px] font-black ${t.realized_pnl >= 0 ? "text-emerald-500" : "text-red-500"}`}
                  >
                    {t.realized_pnl >= 0 ? "+" : ""}
                    {(((t.current_price - t.entry_price) / t.entry_price) * 100).toFixed(2)}%
                  </span>
                  <span className="text-[9px] font-medium text-zinc-600">${t.realized_pnl.toFixed(2)}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAudit(t.id);
                    useDashboardStore.getState().triggerJump();
                  }}
                  className="flex h-6 w-6 items-center justify-center rounded-md border border-white/5 bg-white/2 text-zinc-500 transition-all hover:bg-blue-500/20 hover:text-blue-400 active:scale-90"
                >
                  <LocateFixed size={12} strokeWidth={2.5} />
                </button>
              </div>
            </button>
          ))
      )}
    </div>
  );
}
