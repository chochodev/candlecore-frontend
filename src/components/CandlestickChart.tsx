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
  type ISeriesMarkersPluginApi
} from "lightweight-charts";
import type { CandleData, Decision } from "@/types/trading";

interface CandlestickChartProps {
  candles: CandleData[];
  decisions: Decision[];
}

export function CandlestickChart({ candles, decisions }: CandlestickChartProps) {
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

    const resizeObserver = new ResizeObserver(entries => {
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
          const time = (Math.floor(new Date(c.timestamp).getTime() / 1000));
          if (isNaN(time)) return null;
          return {
            time: time as Time,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
          };
        } catch (e) { return null; }
      })
      .filter((c): c is CandlestickData => c !== null);

    if (candleData.length === 0) return;

    const fastMaData: LineData[] = candles
      .filter((c) => c.indicators?.fast_ma)
      .map((c) => {
        const time = (Math.floor(new Date(c.timestamp).getTime() / 1000));
        return { time: time as Time, value: c.indicators!.fast_ma! };
      })
      .filter(d => !isNaN(d.time as number));

    const slowMaData: LineData[] = candles
      .filter((c) => c.indicators?.slow_ma)
      .map((c) => {
        const time = (Math.floor(new Date(c.timestamp).getTime() / 1000));
        return { time: time as Time, value: c.indicators!.slow_ma! };
      })
      .filter(d => !isNaN(d.time as number));

    if (seriesRef.current) seriesRef.current.setData(candleData);
    if (fastMaRef.current) fastMaRef.current.setData(fastMaData);
    if (slowMaRef.current) slowMaRef.current.setData(slowMaData);

    // Only scroll to real time on the first batch of significant data
    if (!hasFittedRef.current && candleData.length > 5) {
      chartRef.current?.timeScale().scrollToRealTime();
      hasFittedRef.current = true;
    }

    // Trade Markers
    const markers: SeriesMarker<Time>[] = decisions.map((d) => ({
      time: (Math.floor(new Date(d.timestamp).getTime() / 1000)) as Time,
      position: (d.signal === 'buy' ? 'belowBar' : d.signal === 'sell' ? 'aboveBar' : 'inBar') as any,
      color: d.signal === 'buy' ? '#10b981' : d.signal === 'sell' ? '#ef4444' : '#6b7280',
      shape: (d.signal === 'buy' ? 'arrowUp' : d.signal === 'sell' ? 'arrowDown' : 'circle') as any,
      text: d.signal.toUpperCase(),
    })).filter(m => m.text !== 'HOLD');

    if (markersApiRef.current) {
      markersApiRef.current.setMarkers(markers);
    }
  }, [candles, decisions]);

  return (
    <div className="relative h-full w-full">
      <div 
        ref={chartContainerRef} 
        className="dot-grid h-full w-full opacity-90 brightness-110" 
      />
      
      {candles.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0c0c0e]/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
             <div className="h-0.5 w-12 bg-emerald-500/20 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 animate-[loading_1.5s_infinite_ease-in-out]" />
             </div>
             <p className="text-[10px] font-black italic tracking-[0.3em] text-gray-500 uppercase">
               Syncing Neural Stream...
             </p>
          </div>
        </div>
      )}

      {/* Internal Legend */}
      <div className="absolute left-6 top-6 z-10 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
              <div className="h-0.5 w-3 bg-blue-500" />
              <span className="text-[9px] font-black uppercase text-gray-500">Neural Fast</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="h-0.5 w-3 bg-orange-500" />
              <span className="text-[9px] font-black uppercase text-gray-500">Neural Slow</span>
           </div>
        </div>
      </div>
    </div>
  );
}
