import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  createChart,
  ColorType,
  LineStyle,
  CandlestickSeries,
  LineSeries,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type LineData,
  type Time,
  type IPriceLine,
  type Coordinate,
} from "lightweight-charts";
import type { CandleData, Decision, Position, Trade } from "@/types/trading";

// ─── Sub-components ───────────────────────────────────────────────────────────

function TradeInfoPanel({ trade }: { trade: Trade | null }) {
  if (!trade) {
    return (
      <div className="flex min-h-[56px] items-center justify-between bg-white/2 px-5 py-4">
        <span className="text-[10px] font-black tracking-widest text-zinc-600 uppercase">
          Select a tactical anchor to inspect neural telemetry
        </span>
        <div className="flex items-center gap-6 text-[9px] font-black text-zinc-500 uppercase italic">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]" /> Entry
            Vector
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.3)]" /> Target Exit
          </div>
          <div className="flex items-center gap-4 border-l border-white/5 pl-6">
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-3 rounded-full bg-blue-500" />
              <span className="text-[9px] font-black tracking-widest uppercase">Fast MA</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-0.5 w-3 rounded-full bg-orange-500" />
              <span className="text-[9px] font-black tracking-widest uppercase">Slow MA</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const dirLabel = trade.dir === "buy" ? "LONG" : "SHORT";
  const dirColor = trade.dir === "buy" ? "text-emerald-400" : "text-red-400";

  const badge =
    trade.result === "open" ? (
      <div className="inline-flex items-center gap-2 rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-[10px] font-black tracking-tighter text-blue-400">
        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
        LIVE EXPOSURE
      </div>
    ) : trade.result === "profit" ? (
      <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-[10px] font-black tracking-tighter text-emerald-400">
        +{trade.pnlPct}% SUCCESS
      </div>
    ) : (
      <div className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-1.5 text-[10px] font-black tracking-tighter text-red-400">
        {trade.pnlPct}% RECOVERY
      </div>
    );

  const dsl = trade.dynamicSlPrice;
  const shieldStatus = dsl
    ? (() => {
        const isWarp = trade.dir === "buy" ? dsl > trade.entryPrice * 1.003 : dsl < trade.entryPrice * 0.997;

        return (
          <div className="flex items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">
            <span className="text-[8px] leading-none font-black tracking-widest text-emerald-400 uppercase">
              {isWarp ? "Warp Shield Active" : "Fee Shield Active"}
            </span>
          </div>
        );
      })()
    : null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 transition-all animate-in slide-in-from-bottom-2">
      <div className="flex flex-wrap items-center gap-6 font-mono text-[10px]">
        <div className="flex flex-col">
          <span className="mb-1 text-[8px] font-black tracking-widest text-zinc-600 uppercase">Asset Direction</span>
          <span className={`text-[12px] font-black tracking-tighter ${dirColor}`}>{dirLabel}</span>
        </div>
        <div className="h-8 w-px bg-white/5" />
        <div className="flex flex-col">
          <span className="mb-1 text-[8px] font-black tracking-widest text-zinc-600 uppercase">Entry Quote</span>
          <span className="text-[11px] font-bold text-zinc-100">${trade.entryPrice.toFixed(2)}</span>
        </div>
        <div className="flex flex-col">
          <span className="mb-1 text-[8px] font-black tracking-widest text-blue-600/60 uppercase">Target TP</span>
          <span className="text-[11px] font-bold text-blue-400">${trade.tpPrice.toFixed(2)}</span>
        </div>
        <div className="flex flex-col">
          <span className="mb-1 text-[8px] font-black tracking-widest text-red-600/60 uppercase">Neural SL</span>
          <span className="text-[11px] font-bold text-red-400">${trade.slPrice.toFixed(2)}</span>
        </div>
        {trade.exitPrice !== undefined && (
          <div className="flex flex-col">
            <span className="mb-1 text-[8px] font-black tracking-widest text-zinc-600 uppercase">Final Result</span>
            <span className={`text-[11px] font-bold ${trade.result === "profit" ? "text-emerald-400" : "text-white"}`}>
              ${trade.exitPrice.toFixed(2)}
            </span>
          </div>
        )}
      </div>
      {shieldStatus}
      {badge}
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface CandlestickChartProps {
  candles: CandleData[];
  decisions: Decision[];
  historicalTrades: any[];
  activeSymbol?: string;
  timeframe?: string;
  isSearching?: boolean;
  activePosition: Position | null;
}

type MarkerPosition = {
  trade: Trade;
  x: Coordinate;
  y: Coordinate;
  dotSize: number;
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function CandlestickChart({
  candles,
  decisions,
  historicalTrades,
  activeSymbol = "SOL",
  timeframe = "1h",
  isSearching = false,
  activePosition,
}: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const fastMaRef = useRef<ISeriesApi<"Line"> | null>(null);
  const slowMaRef = useRef<ISeriesApi<"Line"> | null>(null);
  const priceLinesRef = useRef<IPriceLine[]>([]);
  const hasFittedRef = useRef(false);
  const rafRef = useRef<number>(0);

  const [selectedTradeId, setSelectedTradeId] = useState<string | number | null>(null);
  const [markerPositions, setMarkerPositions] = useState<MarkerPosition[]>([]);

  // ── Build trades ────────────────────────────────────────────────────────────
  const trades = useMemo(() => {
    if (!candles.length) return [];

    const sortedCandles = [...candles].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const result: Trade[] = [];

    // ── Build Trades from Historical Source (The Stable Source) ──
    historicalTrades.forEach((ht) => {
      const entryTimeMs = new Date(ht.opened_at).getTime();
      const entryTimeSec = Math.floor(entryTimeMs / 1000);

      let sortedIdx = -1;
      for (let i = sortedCandles.length - 1; i >= 0; i--) {
        if (new Date(sortedCandles[i].timestamp).getTime() <= entryTimeMs) {
          sortedIdx = i;
          break;
        }
      }
      if (sortedIdx === -1) return;

      const candle = sortedCandles[sortedIdx];
      const candleIdx = candles.indexOf(candle);
      const anchorTime = Math.floor(new Date(candle.timestamp).getTime() / 1000);

      result.push({
        id: ht.id,
        entryIdx: candleIdx,
        entryTime: entryTimeSec,
        visualAnchorTime: anchorTime,
        dir: ht.side.toLowerCase() === "buy" || ht.side.toLowerCase() === "long" ? "buy" : "sell",
        entryPrice: ht.entry_price,
        tpPrice: ht.take_profit || ht.entry_price * 1.018,
        slPrice: ht.stop_loss || ht.entry_price * 0.992,
        exitIdx: ht.closed_at ? candleIdx : null,
        exitPrice: ht.current_price,
        result: ht.realized_pnl >= 0 ? "profit" : "loss",
        pnlPct: (ht.realized_pnl || 0).toFixed(2),
        timestamp: ht.opened_at,
        reasoning: ht.reasoning || "Technical Execution",
      } as Trade);
    });

    // ── Merge Real-time Decisions (Not yet in history) ──
    decisions.forEach((d, idx) => {
      const entryTimeMs = new Date(d.timestamp).getTime();
      const entryTimeSec = Math.floor(entryTimeMs / 1000);

      if (result.some((t) => Math.abs(t.entryTime - entryTimeSec) < 60)) return;

      let sortedIdx = -1;
      for (let i = sortedCandles.length - 1; i >= 0; i--) {
        if (new Date(sortedCandles[i].timestamp).getTime() <= entryTimeMs) {
          sortedIdx = i;
          break;
        }
      }
      if (sortedIdx === -1) return;

      const candle = sortedCandles[sortedIdx];
      const anchorTime = Math.floor(new Date(candle.timestamp).getTime() / 1000);

      if (d.signal === "buy") {
        result.push({
          id: `signal-${idx}`,
          entryIdx: candles.indexOf(candle),
          entryTime: entryTimeSec,
          visualAnchorTime: anchorTime,
          dir: "buy",
          entryPrice: d.price,
          tpPrice: d.take_profit || d.price * 1.018,
          slPrice: d.stop_loss || d.price * 0.992,
          timestamp: d.timestamp,
          reasoning: d.reasoning,
          exitIdx: null,
          result: "open",
        });
      }
    });

    // ── Apply Active Position Override ──
    if (activePosition) {
      const entryTimeMs = new Date(activePosition.opened_at).getTime();
      const entryTimeSec = Math.floor(entryTimeMs / 1000);

      const existingIdx = result.findIndex((t) => Math.abs(t.entryTime - entryTimeSec) < 60);
      if (existingIdx !== -1) {
        result[existingIdx] = {
          ...result[existingIdx],
          id: "active",
          dynamicSlPrice: activePosition.trailing_sl || undefined,
        };
      } else {
        let sortedIdx = -1;
        for (let i = sortedCandles.length - 1; i >= 0; i--) {
          if (new Date(sortedCandles[i].timestamp).getTime() <= entryTimeMs) {
            sortedIdx = i;
            break;
          }
        }
        if (sortedIdx !== -1) {
          const candle = sortedCandles[sortedIdx];
          const anchorTime = Math.floor(new Date(candle.timestamp).getTime() / 1000);
          result.push({
            id: "active",
            entryIdx: candles.indexOf(candle),
            entryTime: entryTimeSec,
            visualAnchorTime: anchorTime,
            dir:
              activePosition.side.toLowerCase() === "buy" || activePosition.side.toLowerCase() === "long"
                ? "buy"
                : "sell",
            entryPrice: activePosition.entry_price,
            tpPrice: activePosition.take_profit,
            slPrice: activePosition.stop_loss,
            exitIdx: null,
            result: "open",
            timestamp: activePosition.opened_at,
            reasoning: "Live Neutral Exposure",
            dynamicSlPrice: activePosition.trailing_sl || undefined,
          } as Trade);
        }
      }
    }

    return result;
  }, [historicalTrades, decisions, candles, activePosition]);

  const tradesRef = useRef<Trade[]>(trades);
  useEffect(() => {
    tradesRef.current = trades;
  }, [trades]);

  const activeTrade = useMemo(() => {
    // 1. Prioritize manual focus (user clicked a point)
    if (selectedTradeId !== null) return trades.find((t) => t.id === selectedTradeId) ?? null;

    // 2. Secondary: Active Position currently being managed by the engine
    if (activePosition) return trades.find((t) => t.id === "active") ?? null;

    // 3. Tertiary: Fallback to the most recent completed trade for immediate visibility
    if (trades.length > 0) return trades[trades.length - 1];

    return null;
  }, [trades, selectedTradeId, activePosition]);

  // ── Perspective Scroll Implementation ──────────────────────────────────────
  useEffect(() => {
    if (!activeTrade || !chartRef.current || !seriesRef.current) return;

    // Smooth scroll to the trade execution point
    chartRef.current.timeScale().scrollToPosition(0, false); // Clear position buffer
    chartRef.current.timeScale().setVisibleLogicalRange({
      from: chartRef.current.timeScale().getVisibleLogicalRange()?.from || 0,
      to: chartRef.current.timeScale().getVisibleLogicalRange()?.to || 100,
    });

    // Center logic: find the logical index and set range around it
    const logical = seriesRef.current.dataByIndex(activeTrade.entryIdx, 1);
    if (logical) {
      // Request a scroll centering event
      chartRef.current.timeScale().scrollToRealTime();
      // Note: In lightweight charts, the most reliable way is often setVisibleRange
    }
  }, [activeTrade?.id]);

  // ── Chart init ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#0c0c0e" },
        textColor: "#71717a",
        fontFamily: "var(--font-mono, monospace)",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.03)", style: LineStyle.Dotted },
        horzLines: { color: "rgba(255,255,255,0.03)", style: LineStyle.Dotted },
      },
      rightPriceScale: { borderColor: "rgba(255,255,255,0.05)", autoScale: true },
      timeScale: {
        borderColor: "rgba(255,255,255,0.05)",
        timeVisible: true,
        secondsVisible: false,
        barSpacing: 10,
        rightOffset: 20,
      },
      crosshair: {
        vertLine: { labelBackgroundColor: "#10b981", color: "rgba(16,185,129,0.2)" },
        horzLine: { labelBackgroundColor: "#10b981", color: "rgba(16,185,129,0.2)" },
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#10b981",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#10b981",
      wickDownColor: "#ef4444",
    });

    const fastMaSeries = chart.addSeries(LineSeries, {
      color: "#3b82f6",
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
    });

    const slowMaSeries = chart.addSeries(LineSeries, {
      color: "#f59e0b",
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
    });

    chartRef.current = chart;
    seriesRef.current = candleSeries;
    fastMaRef.current = fastMaSeries;
    slowMaRef.current = slowMaSeries;

    const ro = new ResizeObserver((entries) => {
      if (!entries[0]?.contentRect) return;
      const { width, height } = entries[0].contentRect;
      chart.applyOptions({ width, height });
    });
    ro.observe(chartContainerRef.current);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      fastMaRef.current = null;
      slowMaRef.current = null;
      priceLinesRef.current = [];
    };
  }, []);

  // ── Feed candle data ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!candles.length || !seriesRef.current) return;

    const candleData: CandlestickData[] = candles
      .map((c) => {
        const time = Math.floor(new Date(c.timestamp).getTime() / 1000);
        if (isNaN(time)) return null;
        return { time: time as Time, open: c.open, high: c.high, low: c.low, close: c.close };
      })
      .filter((c): c is CandlestickData => c !== null)
      .sort((a, b) => (a.time as number) - (b.time as number));

    seriesRef.current.setData(candleData);

    const fastMaData: LineData[] = candles
      .filter((c) => c.indicators?.fast_ma != null)
      .map((c) => ({ time: Math.floor(new Date(c.timestamp).getTime() / 1000) as Time, value: c.indicators!.fast_ma! }))
      .sort((a, b) => (a.time as number) - (b.time as number));

    const slowMaData: LineData[] = candles
      .filter((c) => c.indicators?.slow_ma != null)
      .map((c) => ({ time: Math.floor(new Date(c.timestamp).getTime() / 1000) as Time, value: c.indicators!.slow_ma! }))
      .sort((a, b) => (a.time as number) - (b.time as number));

    fastMaRef.current?.setData(fastMaData);
    slowMaRef.current?.setData(slowMaData);

    if (!hasFittedRef.current && candleData.length > 5) {
      chartRef.current?.timeScale().scrollToRealTime();
      hasFittedRef.current = true;
    }

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(scheduleRecalc);
  }, [candles]);

  // ── Price lines ─────────────────────────────────────────────────────────────
  const applyPriceLines = useCallback((trade: Trade | null) => {
    priceLinesRef.current.forEach((l) => {
      try {
        seriesRef.current?.removePriceLine(l);
      } catch (_) {}
    });
    priceLinesRef.current = [];

    if (!trade || !seriesRef.current) return;

    const s = seriesRef.current;
    const lines: IPriceLine[] = [
      s.createPriceLine({
        price: trade.entryPrice,
        color: "#10b981",
        lineWidth: 2,
        lineStyle: LineStyle.Solid,
        axisLabelVisible: true,
        title: "ENTRY POINT",
      }),
      s.createPriceLine({
        price: trade.tpPrice,
        color: "#3b82f6",
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: "CORE TARGET (TP)",
      }),
    ];

    // Only draw initial SL if dynamic SL is NOT at the same price
    if (!trade.dynamicSlPrice || Math.abs(trade.slPrice - trade.dynamicSlPrice) > 0.0001) {
      lines.push(
        s.createPriceLine({
          price: trade.slPrice,
          color: "#ef4444",
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          axisLabelVisible: true,
          title: "INITIAL NEURAL SL",
        })
      );
    }

    if (trade.dynamicSlPrice) {
      lines.push(
        s.createPriceLine({
          price: trade.dynamicSlPrice,
          color: "#fbbf24", // Amber for Shield
          lineWidth: 2,
          lineStyle: LineStyle.Solid,
          axisLabelVisible: true,
          title: trade.dynamicSlPrice > trade.entryPrice ? "SHIELD: FEE LOCK (SL)" : "SHIELD: WARP LOCK (SL)",
        })
      );
    }

    if (trade.exitPrice !== undefined) {
      lines.push(
        s.createPriceLine({
          price: trade.exitPrice,
          color: trade.result === "profit" ? "#10b981" : "#ef4444",
          lineWidth: 2,
          lineStyle: LineStyle.Dotted,
          axisLabelVisible: true,
          title: trade.result === "profit" ? `REALIZED EXIT (+${trade.pnlPct}%)` : `REALIZED EXIT (${trade.pnlPct}%)`,
        })
      );
    }

    priceLinesRef.current = lines;
  }, []);

  useEffect(() => {
    applyPriceLines(activeTrade);
  }, [activeTrade, applyPriceLines]);

  // ── Marker recalculation ────────────────────────────────────────────────────
  function computeMarkerPositions(): MarkerPosition[] {
    const chart = chartRef.current;
    const series = seriesRef.current;
    if (!chart || !series) return [];

    const barSpacing = chart.timeScale().options().barSpacing;
    const dotSize = Math.min(20, Math.max(10, barSpacing * 1.25));

    return (tradesRef.current || [])
      .map((trade) => {
        // Use the visualAnchorTime (exact candle start) to get coordinate
        const x = chart.timeScale().timeToCoordinate(trade.visualAnchorTime as Time);
        const y = series.priceToCoordinate(trade.entryPrice);

        if (x === null || y === null) return null;
        return { trade, x: x as Coordinate, y: y as Coordinate, dotSize };
      })
      .filter((p): p is MarkerPosition => p !== null);
  }

  function scheduleRecalc() {
    setMarkerPositions(computeMarkerPositions());
  }

  const scheduleRecalcRef = useRef(scheduleRecalc);
  useEffect(() => {
    scheduleRecalcRef.current = scheduleRecalc;
  });
  const stableRecalc = useCallback(() => scheduleRecalcRef.current(), []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    chart.timeScale().subscribeVisibleLogicalRangeChange(stableRecalc);
    stableRecalc();
    return () => chart.timeScale().unsubscribeVisibleLogicalRangeChange(stableRecalc);
  }, [stableRecalc]);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(stableRecalc);
  }, [trades, stableRecalc]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <div className="relative min-h-0 flex-1 overflow-hidden border border-zinc-100/5 bg-dark-core shadow-2xl">
        <div ref={chartContainerRef} className="dot-grid h-full w-full opacity-90" />

        {/* ── Trade entry dots ── */}
        {markerPositions.map(({ trade, x, y, dotSize }) => {
          const isActive = activeTrade?.id === trade.id;
          const isBuy = trade.dir === "buy";
          const size = isActive ? dotSize + 4 : dotSize;

          return (
            <button
              key={trade.id}
              onClick={() => setSelectedTradeId((prev) => (prev === trade.id ? null : trade.id))}
              style={{
                left: x,
                top: y,
                width: size,
                height: size,
              }}
              className={[
                "absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-3 border-zinc-950",
                "animate-pulse cursor-pointer transition-[width,height,box-shadow] duration-150 focus:outline-none",
                isBuy ? "bg-emerald-500" : "bg-red-500",
                isActive ? "shadow-[0_0_25px_rgba(255,255,255,0.3)] ring-2 ring-white/20" : "hover:brightness-125",
              ].join(" ")}
              title={`${trade.dir.toUpperCase()} — click to inspect`}
            >
              {isActive && <div className="absolute inset-0 rounded-full border border-white/40" />}
            </button>
          );
        })}

        {/* MA legend */}
        <div className="pointer-events-none absolute top-4 left-4 z-10 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-3 rounded-full bg-blue-500" />
            <span className="text-[9px] font-black tracking-widest text-zinc-500 uppercase">Fast MA</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-3 rounded-full bg-orange-500" />
            <span className="text-[9px] font-black tracking-widest text-zinc-500 uppercase">Slow MA</span>
          </div>
        </div>

        {/* Empty state */}
        {candles.length === 0 && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-dark-core/80 backdrop-blur-xl">
            <div className="relative max-w-sm rounded-3xl border border-white/5 bg-linear-to-b from-white/2 to-transparent p-10 text-center shadow-2xl">
              <div className="relative mx-auto mb-8 flex h-18 w-18 items-center justify-center rounded-[2rem] bg-emerald-500/10 shadow-[0_0_80px_-15px_rgba(16,185,129,0.4)]">
                <div className="absolute inset-0 animate-pulse rounded-[2rem] border border-emerald-500/20" />
                <svg
                  className={`h-8 w-8 text-emerald-500 ${isSearching ? "animate-spin" : "animate-pulse"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="mb-4 text-[11px] font-black tracking-[.3em] text-zinc-500 uppercase">
                Simulation Engine v1.3.1
              </p>
              <p className="text-[11px] leading-relaxed font-medium text-zinc-400 uppercase">
                Ready for{" "}
                <span className="font-black text-white">
                  {activeSymbol.toUpperCase()} / {timeframe}
                </span>{" "}
                stream
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0">
        <TradeInfoPanel trade={activeTrade} />
      </div>
    </div>
  );
}
