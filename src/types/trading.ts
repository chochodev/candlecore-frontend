import { z } from "zod";
export * from "./schemas";
import type { CandleData, Decision, Position, PnLData, BotConfig } from "./schemas";

export interface BotStatus {
  running: boolean;
  paused: boolean;
}

export type TradeDirection = "buy" | "sell";
export type TradeResult = "profit" | "loss" | "open";

export interface Trade {
  id: string | number;
  entryIdx: number;
  entryTime: number; // ← stable Unix-seconds anchor (no candle array lookup)
  visualAnchorTime: number;
  dir: TradeDirection;
  entryPrice: number;
  tpPrice: number;
  slPrice: number;
  dynamicSlPrice?: number; // ← The shifting profit-lock entry
  exitIdx: number | null;
  exitPrice?: number;
  result: TradeResult;
  pnlPct?: string;
  timestamp: string;
  reasoning?: string;
}

export interface WSEvent {
  type: 'candle' | 'decision' | 'position' | 'pnl' | 'history' | 'status';
  data: any;
}
