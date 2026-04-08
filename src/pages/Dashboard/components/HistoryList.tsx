import { LocateFixed } from "lucide-react";
import { useDashboardStore } from "@/zustand";
import type { Position } from "@/types/trading";

export type HistoryListProps = {
  trades: Position[];
  onAudit: (id: string) => void;
};

export function HistoryList({ trades, onAudit }: HistoryListProps) {
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
          .map((t) => (
            <div
              key={String(t.id)}
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
                    {(t.pnl_pct || 0).toFixed(2)}%
                  </span>
                  <span className="text-[9px] font-medium text-zinc-600">${t.realized_pnl.toFixed(2)}</span>
                </div>
                <button
                  type="button"
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
            </div>
          ))
      )}
    </div>
  );
}
