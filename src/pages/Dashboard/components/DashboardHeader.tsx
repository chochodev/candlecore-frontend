import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
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
import type { BotConfig } from "@/types/trading";

export type PnlStats = {
  pnl: number;
  winRate: number;
  balance: number;
};

export type DashboardHeaderProps = {
  pnlStats: PnlStats;
  config: BotConfig;
  symbols: string[];
  timeframes: string[];
  configOpen: boolean;
  setConfigOpen: (open: boolean) => void;
  setConfig: (config: Partial<BotConfig>) => void;
  configError: string | null;
  botStatus: { running?: boolean; paused?: boolean } | null;
  onConfigure: () => void | Promise<void>;
  onStart: () => void | Promise<void>;
  onStop: () => void | Promise<void>;
  onReset: () => void | Promise<void>;
  onSkip: () => void | Promise<void>;
};

function isNavActive(pathname: string, segment: string) {
  return pathname.split("/")[1] === segment;
}

export function DashboardHeader({
  pnlStats,
  config,
  symbols,
  timeframes,
  configOpen,
  setConfigOpen,
  setConfig,
  configError,
  botStatus,
  onConfigure,
  onStart,
  onStop,
  onReset,
  onSkip,
}: DashboardHeaderProps) {
  const { pathname } = useLocation();

  return (
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
                  isNavActive(pathname, "dashboard") ? "bg-white/10 text-white" : "text-white/60"
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
                  isNavActive(pathname, "backtest") ? "bg-white/10 text-white" : "text-white/60"
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
                  isNavActive(pathname, "docs") ? "bg-white/10 text-white" : "text-white/60"
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
                      <p className="text-[10px] font-bold tracking-tight text-red-400 uppercase">Configuration Error</p>
                      <p className="text-[11px] text-red-300/80">{configError}</p>
                    </div>
                  )}
                  <Button
                    onClick={() => void onConfigure()}
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
                  onClick={() => void onSkip()}
                  size="sm"
                  className="group relative flex h-9 gap-2 overflow-hidden border border-blue-500/20 bg-blue-500/10 px-5 text-[11px] font-semibold text-blue-400 transition-all hover:bg-blue-500/20"
                >
                  <span className="relative z-10">SKIP</span>
                  <div className="absolute inset-0 z-0 bg-blue-500/5 group-hover:animate-pulse"></div>
                </Button>
                <Button
                  onClick={() => void onStop()}
                  size="sm"
                  className="h-9 gap-2.5 border border-red-500/20 bg-red-500/10 px-5 text-[11px] font-semibold text-red-500 transition-all hover:bg-red-500/20"
                >
                  STOP
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => void onStart()}
                  size="sm"
                  className={`h-9 gap-2 border ${botStatus?.paused ? "border-neutral-200/20 bg-neutral-200 text-neutral-900 hover:bg-neutral-300" : "border-emerald-500/20 bg-emerald-500 text-white hover:bg-emerald-600"} px-6 text-[11px] font-semibold shadow-lg transition-all active:scale-95`}
                >
                  {botStatus?.paused ? "PLAY" : "START"}
                </Button>
                <Button
                  onClick={() => void onReset()}
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
  );
}
