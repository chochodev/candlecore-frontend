import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  LineStyle,
  CandlestickSeries,
  LineSeries,
  createSeriesMarkers,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type LineData,
  type SeriesMarker,
  type Time,
  type ISeriesMarkersPluginApi,
} from "lightweight-charts";
import type { CandleData, Decision } from "@/types/trading";

interface CandlestickChartProps {
  candles: CandleData[];
  decisions: Decision[];
  activeSymbol?: string;
  timeframe?: string;
  isSearching?: boolean;
}

export function CandlestickChart({ candles, decisions, activeSymbol, timeframe, isSearching }: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const fastMaRef = useRef<ISeriesApi<"Line"> | null>(null);
  const slowMaRef = useRef<ISeriesApi<"Line"> | null>(null);
  const markersApiRef = useRef<ISeriesMarkersPluginApi<Time> | null>(null);
  const hasFittedRef = useRef(false);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#0c0c0e" },
        textColor: "#a1a1aa",
        fontFamily: "var(--font-mono, monospace)",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.03)", style: LineStyle.Dotted },
        horzLines: { color: "rgba(255, 255, 255, 0.03)", style: LineStyle.Dotted },
      },
      rightPriceScale: {
        borderColor: "rgba(255, 255, 255, 0.05)",
        autoScale: true,
      },
      timeScale: {
        borderColor: "rgba(255, 255, 255, 0.05)",
        timeVisible: true,
        secondsVisible: false,
        barSpacing: 10,
        rightOffset: 10,
      },
      crosshair: {
        vertLine: { labelBackgroundColor: "#10b981" },
        horzLine: { labelBackgroundColor: "#10b981" },
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

    const markersApi = createSeriesMarkers(candleSeries);

    chartRef.current = chart;
    seriesRef.current = candleSeries;
    fastMaRef.current = fastMaSeries;
    slowMaRef.current = slowMaSeries;
    markersApiRef.current = markersApi;

    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length === 0 || !entries[0].contentRect) return;
      const { width, height } = entries[0].contentRect;
      chart.applyOptions({ width, height });
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (candles.length === 0) {
      hasFittedRef.current = false;
      return;
    }

    const candleData: CandlestickData[] = candles
      .map((c) => {
        try {
          const time = Math.floor(new Date(c.timestamp).getTime() / 1000);
          if (isNaN(time)) return null;
          return {
            time: time as Time,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
          };
        } catch (e) {
          return null;
        }
      })
      .filter((c): c is CandlestickData => c !== null);

    if (candleData.length === 0) return;

    const fastMaData: LineData[] = candles
      .filter((c) => c.indicators?.fast_ma)
      .map((c) => {
        const time = Math.floor(new Date(c.timestamp).getTime() / 1000);
        return { time: time as Time, value: c.indicators!.fast_ma! };
      })
      .filter((d) => !isNaN(d.time as number));

    const slowMaData: LineData[] = candles
      .filter((c) => c.indicators?.slow_ma)
      .map((c) => {
        const time = Math.floor(new Date(c.timestamp).getTime() / 1000);
        return { time: time as Time, value: c.indicators!.slow_ma! };
      })
      .filter((d) => !isNaN(d.time as number));

    // Enforce ascending time order for lightweight-charts
    candleData.sort((a, b) => (a.time as number) - (b.time as number));
    fastMaData.sort((a, b) => (a.time as number) - (b.time as number));
    slowMaData.sort((a, b) => (a.time as number) - (b.time as number));

    if (seriesRef.current) seriesRef.current.setData(candleData);
    if (fastMaRef.current) fastMaRef.current.setData(fastMaData);
    if (slowMaRef.current) slowMaRef.current.setData(slowMaData);

    // Only scroll to real time on the first batch of significant data
    if (!hasFittedRef.current && candleData.length > 5) {
      chartRef.current?.timeScale().scrollToRealTime();
      hasFittedRef.current = true;
    }

    // Trade Markers
    const markers: SeriesMarker<Time>[] = decisions
      .map((d, index) => ({
        time: Math.floor(new Date(d.timestamp).getTime() / 1000) as Time,
        position: (d.signal === "buy" ? "belowBar" : d.signal === "sell" ? "aboveBar" : "inBar") as any,
        color: d.signal === "buy" ? "#10b981" : d.signal === "sell" ? "#ef4444" : "#6b7280",
        shape: (d.signal === "buy" ? "arrowUp" : d.signal === "sell" ? "arrowDown" : "circle") as any,
        text: index === decisions.length - 1 ? `LAST ${d.signal.toUpperCase()}` : d.signal.toUpperCase(),
        size: 2,
      }))
      .filter((m) => !m.text.includes("HOLD"))
      .sort((a, b) => (a.time as number) - (b.time as number));

    if (markersApiRef.current) {
      markersApiRef.current.setMarkers(markers);
    }
  }, [candles, decisions]);

  return (
    <div className="relative h-full w-full">
      <div ref={chartContainerRef} className="dot-grid h-full w-full opacity-90 brightness-110" />

      {candles.length === 0 && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-dark-core/75 backdrop-blur-xl transition-all duration-700 animate-in fade-in zoom-in-95">
          <div className="relative max-w-sm overflow-hidden rounded-3xl border border-white/5 bg-linear-to-b from-white/2 to-transparent p-10 text-center shadow-2xl shadow-black/50">
            {/* 🌌 GLOWING NEURAL CORE */}
            <div className="relative mx-auto mb-8 flex h-18 w-18 items-center justify-center rounded-[2rem] bg-emerald-500/10 shadow-[0_0_80px_-15px_rgba(16,185,129,0.4)] transition-transform hover:scale-110">
              <div className="absolute inset-0 animate-pulse rounded-[2rem] border border-emerald-500/20" />
              <svg
                className={`h-8 w-8 text-emerald-500 ${isSearching ? "animate-spin" : "animate-[pulse_3s_infinite]"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>

            <p className="mb-10 text-sm font-semibold tracking-[.3em] text-gray-400 uppercase">
              Simulation Engine v1.3.1
            </p>

            <div className="mb-10 grid grid-cols-2 gap-4">
              <div className="group rounded-2xl border border-white/5 bg-white/2 p-4 transition-all hover:bg-white/5">
                <p className="mb-1.5 text-[9px] font-black tracking-widest text-gray-600 uppercase">Neural Strat</p>
                <p className="text-[11px] font-bold text-emerald-400 uppercase">Pulse Scalper</p>
              </div>
              <div className="group rounded-2xl border border-white/5 bg-white/2 p-4 transition-all hover:bg-white/5">
                <p className="mb-1.5 text-[9px] font-black tracking-widest text-gray-600 uppercase">Simulation</p>
                <p className="text-[11px] font-bold text-emerald-400 uppercase">Live Ready</p>
              </div>
            </div>

            <p className="text-[11px] leading-relaxed font-medium tracking-tight text-gray-400/70 uppercase">
              Synchronize the neural stream to begin high-fidelity analysis of the{" "}
              <span className="font-bold text-white">{activeSymbol?.toUpperCase() || "SOL"} / {timeframe || "1h"}</span> pulse.
            </p>

            {/* 🔘 DECORATIVE CORNER ACCENTS */}
            <div className="absolute top-0 right-0 h-10 w-10 overflow-hidden">
              <div className="absolute -top-5 -right-5 h-10 w-10 rotate-45 border-r border-emerald-500/20" />
            </div>
          </div>
        </div>
      )}

      {/* Internal Legend */}
      <div className="pointer-events-none absolute top-6 left-6 z-10 flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-3 bg-blue-500" />
            <span className="text-[9px] font-black text-gray-500 uppercase">Neural Fast</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-3 bg-orange-500" />
            <span className="text-[9px] font-black text-gray-500 uppercase">Neural Slow</span>
          </div>
        </div>
      </div>
    </div>
  );
}
