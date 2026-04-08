import type { MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { HistoryList } from "./HistoryList";
import { PositionDetails } from "./PositionDetails";
import type { Position } from "@/types/trading";

export type DashboardSidebarProps = {
  onMouseDown: (e: MouseEvent<HTMLDivElement>) => void;
  isDragging: boolean;
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
  sidebarPos: { x: number; y: number };
  activeTab: "live" | "history";
  setActiveTab: (tab: "live" | "history") => void;
  focusedTradeId: string | null;
  setFocusedTradeId: (id: string | null) => void;
  position: Position | null;
  trades: Position[];
};

export function DashboardSidebar({
  onMouseDown,
  isDragging,
  sidebarExpanded,
  setSidebarExpanded,
  sidebarPos,
  activeTab,
  setActiveTab,
  focusedTradeId,
  setFocusedTradeId,
  position,
  trades,
}: DashboardSidebarProps) {
  return (
    <div
      onMouseDown={onMouseDown}
      className={`absolute z-40 transition-shadow ${isDragging ? "shadow-glow cursor-grabbing duration-0" : "duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"} ${sidebarExpanded ? "h-[600px] w-[320px]" : "h-[48px] w-[48px]"} overflow-hidden rounded-[1rem] border border-white/5 bg-zinc-950/80 backdrop-blur-2xl`}
      style={{
        left: `${sidebarPos.x}px`,
        top: `${sidebarPos.y}px`,
        transitionProperty: isDragging ? "none" : "width, left, top",
      }}
    >
      <div className="drag-handle flex h-full cursor-grab flex-col p-0.75 active:cursor-grabbing">
        <Button
          type="button"
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
          variant="ghost"
          className="pointer-events-auto h-10 w-10 rounded-xl p-0 text-gray-500 transition-colors hover:bg-white/10 hover:text-white"
        >
          {sidebarExpanded ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          ) : (
            <svg className="h-5 w-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          )}
        </Button>

        {sidebarExpanded && (
          <div className="flex border-b border-white/5 bg-white/2">
            <button
              type="button"
              onClick={() => setActiveTab("live")}
              className={`flex-1 px-4 py-2 text-[10px] font-bold tracking-widest transition-all ${activeTab === "live" ? "border-b border-emerald-500 text-emerald-400" : "text-gray-500 hover:text-white"}`}
            >
              {focusedTradeId ? "AUDIT" : "LIVE"}
            </button>
            <button
              type="button"
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
                      type="button"
                      onClick={() => setFocusedTradeId(null)}
                      className="text-[9px] font-bold text-blue-400 hover:underline"
                    >
                      LATEST
                    </button>
                  )}
                </div>

                <PositionDetails position={position} focusedTradeId={focusedTradeId} trades={trades} />
              </div>
            ) : (
              <HistoryList
                trades={trades}
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
  );
}
