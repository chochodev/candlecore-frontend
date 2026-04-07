import { useState, useEffect } from "react";
import { botAPI } from "@/lib/api";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { type DateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Backtest() {
  const [symbol, setSymbol] = useState("sol");
  const [symbolList, setSymbolList] = useState<string[]>(["sol", "btc", "eth"]);
  const [timeframe, setTimeframe] = useState("1h");

  // Date range state — default: Aug 2020
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date("2020-08-01"),
    to: new Date("2020-08-31"),
  });

  const [showReasoning, setShowReasoning] = useState(false);
  const [trades, setTrades] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Statistics
  const totalPnL = trades.reduce((acc, t) => acc + (t.realized_pnl || 0), 0);
  const totalTrades = trades.length;
  const wins = trades.filter((t) => t.realized_pnl > 0).length;
  const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const { symbols } = await botAPI.getSymbols();
        if (symbols?.length > 0) setSymbolList(symbols);
      } catch (err) {
        console.error("Meta fetch failed", err);
      }
    };
    fetchMeta();
  }, []);

  const performBacktest = async () => {
    if (!dateRange?.from || !dateRange?.to) return;
    setTrades([]);
    setIsLoading(true);
    try {
      const startUnix = Math.floor(dateRange.from.getTime() / 1000);
      const endUnix = Math.floor(dateRange.to.setHours(23, 59, 59) / 1000);

      await botAPI.configure({
        symbol,
        timeframe,
        strategy: "pulse_scalper",
        replay_mode: true,
        dry_run: true,
        replay_speed: 0,
        start_time: startUnix,
        end_time: endUnix,
      });

      await botAPI.start();

      const interval = setInterval(async () => {
        const stats = await botAPI.getStatus();
        const pnl = await botAPI.getPnL();
        if (pnl?.trades) setTrades(pnl.trades);
        if (!stats.running) clearInterval(interval);
      }, 500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const canRun = !isLoading && !!dateRange?.from && !!dateRange?.to;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-screen bg-dark-core p-8 font-mono text-[11px] text-white">

        {/* ── Header ── */}
        <div className="flex flex-col gap-6 border-b border-white/10 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-black tracking-tighter text-emerald-500 uppercase">
                Backtest Terminal
              </h1>
              <Badge
                variant="outline"
                className="border-emerald-500/20 bg-emerald-500/5 text-[9px] font-black tracking-widest text-emerald-500 uppercase"
              >
                Neural Vector Sync
              </Badge>
            </div>
            <Link to="/dashboard">
              <Button
                variant="outline"
                className="h-8 border-white/10 bg-transparent text-[10px] font-bold text-white uppercase hover:bg-white/5"
              >
                To Dashboard
              </Button>
            </Link>
          </div>

          {/* ── Controls ── */}
          <div className="grid grid-cols-6 items-end gap-6 rounded-xl border border-white/5 bg-white/2 p-6 shadow-2xl">

            {/* Symbol */}
            <div className="flex flex-col gap-2">
              <Label className="text-[9px] font-bold tracking-widest text-gray-500 uppercase">
                Currency Registry
              </Label>
              <Select value={symbol} onValueChange={setSymbol}>
                <SelectTrigger className="h-10 border-white/10 bg-black font-mono text-[11px] text-white uppercase focus:ring-emerald-500">
                  <SelectValue placeholder="Symbol" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#0c0c0c] font-mono text-white">
                  {symbolList.map((s) => (
                    <SelectItem key={s} value={s} className="uppercase hover:bg-white/5">
                      {s.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Timeframe */}
            <div className="flex flex-col gap-2">
              <Label className="text-[9px] font-bold tracking-widest text-gray-500 uppercase">
                Audit Interval
              </Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="h-10 border-white/10 bg-black font-mono text-[11px] text-white focus:ring-emerald-500">
                  <SelectValue placeholder="Timeframe" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#0c0c0c] font-mono text-white">
                  <SelectItem value="15m" className="text-[10px] hover:bg-white/5">15M (Scalp)</SelectItem>
                  <SelectItem value="1h" className="text-[10px] hover:bg-white/5">1H (Intraday)</SelectItem>
                  <SelectItem value="4h" className="text-[10px] hover:bg-white/5">4H (Swing)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ── Date Range Picker (shadcn) ── */}
            <div className="col-span-2 flex flex-col gap-2">
              <Label className="text-[9px] font-bold tracking-widest text-gray-500 uppercase">
                Neural Sequence (Start ➔ End)
              </Label>
              <Popover>
                <PopoverTrigger>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-10 w-full justify-start border-white/10 bg-black text-left font-mono text-[10px] text-white hover:bg-white/5 hover:border-emerald-500/50 focus:ring-emerald-500",
                      !dateRange && "text-gray-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "MMM d, yyyy")}
                          <span className="mx-1.5 text-gray-600">➔</span>
                          {format(dateRange.to, "MMM d, yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "MMM d, yyyy")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-auto border-white/10 bg-[#0c0c0c] p-0 text-white shadow-2xl"
                >
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    className="rounded-xl bg-[#0c0c0c] font-mono text-[11px] text-white"
                    classNames={{
                      months: "flex gap-4 p-3",
                      month: "space-y-3",
                      caption: "flex justify-center relative items-center text-[10px] font-black tracking-widest text-gray-400 uppercase",
                      caption_label: "text-[10px] font-black tracking-widest",
                      nav: "flex items-center gap-1",
                      nav_button: cn(
                        "h-6 w-6 bg-transparent p-0 text-gray-500 hover:text-white hover:bg-white/10 rounded transition-colors"
                      ),
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse",
                      head_row: "flex",
                      head_cell: "text-gray-600 rounded w-8 font-bold text-[9px] uppercase tracking-wider",
                      row: "flex w-full mt-1",
                      cell: cn(
                        "relative p-0 text-center text-[10px] focus-within:relative focus-within:z-20",
                        "[&:has([aria-selected])]:bg-emerald-500/10",
                        "[&:has([aria-selected].day-outside)]:bg-transparent",
                        "[&:has([aria-selected].day-range-end)]:rounded-r-md",
                        "[&:has([aria-selected].day-range-start)]:rounded-l-md"
                      ),
                      day: cn(
                        "h-8 w-8 p-0 font-mono text-[10px] rounded hover:bg-white/10 hover:text-white transition-colors aria-selected:opacity-100"
                      ),
                      day_range_start:
                        "day-range-start bg-emerald-600 text-white hover:bg-emerald-500 rounded-l-md font-black",
                      day_range_end:
                        "day-range-end bg-emerald-600 text-white hover:bg-emerald-500 rounded-r-md font-black",
                      day_selected:
                        "bg-emerald-600 text-white hover:bg-emerald-500 font-black",
                      day_today: "text-emerald-400 font-black underline underline-offset-2",
                      day_outside: "text-gray-700 opacity-50",
                      day_disabled: "text-gray-700 opacity-30 cursor-not-allowed",
                      day_range_middle:
                        "aria-selected:bg-emerald-500/15 aria-selected:text-emerald-400 rounded-none",
                      day_hidden: "invisible",
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Live Reasoning Toggle */}
            <div className="flex flex-col justify-center gap-2 px-4 pb-1.5">
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center space-x-3 cursor-pointer">
                    <Switch
                      id="audit-mode"
                      checked={showReasoning}
                      onCheckedChange={setShowReasoning}
                      className="data-[state=checked]:bg-emerald-500"
                    />
                    <Label
                      htmlFor="audit-mode"
                      className="cursor-pointer text-[9px] font-black tracking-widest text-gray-400 uppercase"
                    >
                      Live Reasoning
                    </Label>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="border-white/10 bg-[#0c0c0c] text-[10px] text-gray-300"
                >
                  Show the neural logic signature for each trade
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Run Button */}
            <div className="flex items-end">
              <Button
                onClick={performBacktest}
                disabled={!canRun}
                className={cn(
                  "h-10 w-full rounded-lg text-[10px] font-black tracking-widest uppercase transition-all duration-500",
                  canRun
                    ? "bg-emerald-600 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-[1.02] hover:bg-emerald-500 active:scale-95"
                    : "cursor-not-allowed bg-white/10 text-gray-600"
                )}
              >
                {isLoading ? "Synchronizing..." : "Engage Warp Sync"}
              </Button>
            </div>
          </div>
        </div>

        {/* ── Trade Table ── */}
        <div className="mt-8 overflow-x-auto rounded-xl border border-white/10 bg-white/2">
          <table className="w-full border-collapse text-left">
            <thead className="border-b border-white/10 bg-white/5 text-[9px] font-black tracking-widest text-gray-400 uppercase">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Vector</th>
                <th className="p-4">Entry Quote</th>
                <th className="p-4">Exit Quote</th>
                {showReasoning && <th className="p-4">Neural Logic Signature</th>}
                <th className="p-4">Status</th>
                <th className="p-4 text-right">PnL (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {trades.length === 0 ? (
                <tr>
                  <td
                    colSpan={showReasoning ? 7 : 6}
                    className="p-12 text-center tracking-widest text-gray-600 italic"
                  >
                    Temporal buffer empty. Awaiting synchronization.
                  </td>
                </tr>
              ) : (
                trades.map((t, i) => (
                  <tr key={i} className="group transition-colors hover:bg-white/2">
                    <td className="p-4 text-gray-400">
                      {new Date(t.opened_at).toLocaleString()}
                    </td>
                    <td
                      className={cn(
                        "p-4 font-black",
                        t.side?.toLowerCase() === "buy" || t.side?.toLowerCase() === "long"
                          ? "text-emerald-500"
                          : "text-red-500"
                      )}
                    >
                      {t.side?.toUpperCase()}
                    </td>
                    <td className="p-4 font-mono font-bold tracking-tighter">
                      ${t.entry_price.toFixed(4)}
                    </td>
                    <td className="p-4 font-mono font-bold tracking-tighter text-gray-300">
                      {t.closed_at ? `$${t.current_price.toFixed(4)}` : "—"}
                    </td>
                    {showReasoning && (
                      <td className="max-w-xs truncate p-4 text-[9px] text-gray-500 italic">
                        "{t.reasoning || "Neural Autonomous Out"}"
                      </td>
                    )}
                    <td className="p-4">
                      <span
                        className={cn(
                          "px-2 py-0.5 text-[9px] font-black uppercase",
                          t.realized_pnl >= 0
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-red-500/10 text-red-500"
                        )}
                      >
                        {t.realized_pnl >= 0 ? "PROFIT" : "LOSS"}
                      </span>
                    </td>
                    <td
                      className={cn(
                        "p-4 text-right font-mono font-black",
                        t.realized_pnl >= 0 ? "text-emerald-500" : "text-red-500"
                      )}
                    >
                      {t.realized_pnl >= 0 ? "+" : ""}
                      {t.realized_pnl.toFixed(4)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Summary Matrix ── */}
        <div className="mt-8 flex gap-6">
          <div className="flex-1 rounded-xl border border-white/10 bg-white/2 p-6">
            <h4 className="mb-6 text-[10px] font-bold tracking-widest text-gray-500 uppercase">
              Audited Neural Metrics
            </h4>
            <div className="grid grid-cols-4 gap-8">
              <div>
                <p className={cn("text-lg font-black", totalPnL >= 0 ? "text-emerald-500" : "text-red-500")}>
                  {totalPnL >= 0 ? "+" : ""}
                  {totalPnL.toFixed(4)}
                </p>
                <p className="text-[9px] font-bold tracking-tighter text-gray-600 uppercase">
                  Net Profit Multiplier
                </p>
              </div>
              <div>
                <p className="text-lg font-black text-emerald-500">{winRate.toFixed(1)}%</p>
                <p className="text-[9px] font-bold tracking-tighter text-gray-600 uppercase">
                  Vector Accuracy (Win Rate)
                </p>
              </div>
              <div>
                <p className="text-lg font-black text-blue-500">{totalTrades}</p>
                <p className="text-[9px] font-bold tracking-tighter text-gray-600 uppercase">
                  Total Neural Events
                </p>
              </div>
              <div>
                <p className="text-lg font-black text-white">$10,000.00</p>
                <p className="text-[9px] font-bold tracking-tighter text-gray-600 uppercase">
                  Initial Liquidity
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </TooltipProvider>
  );
}