import { useEffect, useMemo } from "react";
import { ResponsiveContainer, ComposedChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { CandleData } from "@/types/trading";

interface CandlestickChartProps {
  candles: CandleData[];
}

export function CandlestickChart({ candles }: CandlestickChartProps) {
  const chartData = useMemo(() => {
    return candles.map((candle) => ({
      time: new Date(candle.timestamp).toLocaleTimeString(),
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume,
      color: candle.close >= candle.open ? "#10b981" : "#ef4444",
    }));
  }, [candles]);

  if (candles.length === 0) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center rounded-xl border border-gray-800 bg-black">
        <p className="text-sm text-gray-500">Waiting for candle data...</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-800 bg-black p-4">
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: 12 }} tick={{ fill: "#9ca3af" }} />
          <YAxis
            stroke="#9ca3af"
            style={{ fontSize: 12 }}
            tick={{ fill: "#9ca3af" }}
            domain={["dataMin - 100", "dataMax + 100"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#fff",
            }}
            labelStyle={{ color: "#9ca3af" }}
          />
          <Bar
            dataKey="close"
            fill="#10b981"
            shape={(props: any) => {
              const { x, y, width, height, payload } = props;
              const isGreen = payload.close >= payload.open;
              const color = isGreen ? "#10b981" : "#ef4444";

              const bodyHeight = Math.abs(payload.close - payload.open) * (height / (payload.high - payload.low));
              const bodyY = isGreen
                ? y + (payload.high - payload.close) * (height / (payload.high - payload.low))
                : y + (payload.high - payload.open) * (height / (payload.high - payload.low));

              return (
                <g>
                  {/* Wick */}
                  <line x1={x + width / 2} y1={y} x2={x + width / 2} y2={y + height} stroke={color} strokeWidth={1} />
                  {/* Body */}
                  <rect
                    x={x + width * 0.25}
                    y={bodyY}
                    width={width * 0.5}
                    height={Math.max(bodyHeight, 1)}
                    fill={color}
                  />
                </g>
              );
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
