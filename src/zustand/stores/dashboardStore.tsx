import { create } from "zustand";
import {
  CandleSchema,
  PositionSchema,
  PnLSchema,
  DecisionSchema,
  BotConfigSchema,
  type CandleData,
  type Decision,
  type Position,
  type PnLData,
  type BotConfig,
} from "@/types/schemas";

// ── Store Definition ──

interface DashboardState {
  candles: CandleData[];
  decisions: Decision[];
  position: Position | null;
  pnl: PnLData | null;
  status: string;
  focusedTradeId: string | null;
  activeTab: "live" | "history";

  // ── Engine Metadata ──
  config: BotConfig;
  botStatus: any;
  symbols: string[];
  timeframes: string[];

  // ── UI/Layout State ──
  configOpen: boolean;
  sidebarExpanded: boolean;
  sidebarPos: { x: number; y: number };
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  configError: string | null;

  // Actions
  setCandles: (candles: any[]) => void;
  setDecisions: (decisions: any[]) => void;
  setPosition: (pos: any) => void;
  setPnl: (pnl: any) => void;
  setStatus: (status: string) => void;
  setFocusedTradeId: (id: string | null) => void;
  setActiveTab: (tab: "live" | "history") => void;
  setConfig: (config: Partial<BotConfig>) => void;
  setBotStatus: (status: any) => void;
  setSymbols: (symbols: string[]) => void;
  setTimeframes: (timeframes: string[]) => void;

  // UI Actions
  setConfigOpen: (open: boolean) => void;
  setSidebarExpanded: (expanded: boolean) => void;
  setSidebarPos: (pos: { x: number; y: number }) => void;
  setIsDragging: (dragging: boolean) => void;
  setDragOffset: (offset: { x: number; y: number }) => void;
  setConfigError: (error: string | null) => void;

  reset: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  candles: [],
  decisions: [],
  position: null,
  pnl: null,
  status: "disconnected",
  focusedTradeId: null,
  activeTab: "live",

  config: {
    symbol: "sol",
    timeframe: "1h",
    strategy: "ma_crossover",
    replay_mode: true,
    dry_run: true,
    replay_speed: 1.0,
  },
  botStatus: null,
  symbols: [],
  timeframes: [],

  // UI Initial State
  configOpen: false,
  sidebarExpanded: false,
  sidebarPos: { x: 16, y: 72 },
  isDragging: false,
  dragOffset: { x: 0, y: 0 },
  configError: null,

  setCandles: (data) => {
    const parsedArr = data
      .map((c) => CandleSchema.safeParse(c))
      .filter((p) => p.success)
      .map((p) => p.data!);
    if (parsedArr.length === 0) return;
    set((state) => ({
      candles: [...state.candles, ...parsedArr]
        .filter((c, i, self) => i === self.findIndex((t) => t.timestamp === c.timestamp))
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .slice(-1000),
    }));
  },

  setDecisions: (data) => {
    const parsedArr = data
      .map((d) => DecisionSchema.safeParse(d))
      .filter((p) => p.success)
      .map((p) => p.data!);
    if (parsedArr.length === 0) return;
    set((state) => ({ decisions: [...state.decisions, ...parsedArr] }));
  },

  setPosition: (data) => {
    if (!data) {
      set({ position: null });
      return;
    }
    const parsed = PositionSchema.safeParse(data);
    if (parsed.success) {
      set({ position: parsed.data });
    }
  },

  setPnl: (data) => {
    if (!data) return;
    const parsed = PnLSchema.safeParse(data);
    if (parsed.success) {
      set({ pnl: parsed.data });
    }
  },

  setStatus: (status) => set({ status }),
  setFocusedTradeId: (id) => set({ focusedTradeId: id }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  setConfig: (newConfig) =>
    set((state) => {
      const merged = { ...state.config, ...newConfig };
      const parsed = BotConfigSchema.safeParse(merged);
      return parsed.success ? { config: parsed.data } : state;
    }),

  setBotStatus: (botStatus) => set({ botStatus }),
  setSymbols: (symbols) => set({ symbols }),
  setTimeframes: (timeframes) => set({ timeframes }),

  // UI Dispatchers
  setConfigOpen: (configOpen) => set({ configOpen }),
  setSidebarExpanded: (sidebarExpanded) => set({ sidebarExpanded }),
  setSidebarPos: (sidebarPos) => set({ sidebarPos }),
  setIsDragging: (isDragging) => set({ isDragging }),
  setDragOffset: (dragOffset) => set({ dragOffset }),
  setConfigError: (configError) => set({ configError }),

  reset: () =>
    set({
      candles: [],
      decisions: [],
      position: null,
      pnl: null,
      focusedTradeId: null,
      activeTab: "live",
    }),
}));
