import { Target } from "lucide-react";
import { useDashboardStore } from "@/zustand";
import type { Position } from "@/types/trading";

export type PositionDetailsProps = {
  position: Position | null;
  focusedTradeId: string | null;
  trades: Position[];
};

export function PositionDetails({ position, focusedTradeId, trades }: PositionDetailsProps) {
  const trade = focusedTradeId ? trades.find((t) => t.id === focusedTradeId) : position;

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
          type="button"
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
