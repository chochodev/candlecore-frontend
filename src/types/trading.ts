import type { Time } from "lightweight-charts";

export interface CandleData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  indicators?: {
    fast_ma?: number;
    slow_ma?: number;
    rsi_14?: number;
  };
}

export interface Decision {
  timestamp: string;
  signal: "buy" | "sell" | "hold";
  symbol: string;
  price: number;
  quantity: number;
  confidence: number;
  reasoning: string;
}

export interface Position {
  id: string;
  symbol: string;
  side: "long" | "short" | "buy" | "sell";
  entry_price: number;
  quantity: number;
  current_price: number;
  unrealized_pnl: number;
  realized_pnl: number;
  opened_at: string;
  closed_at?: string;
}

export type TradeDirection = "buy" | "sell";
export type TradeResult = "profit" | "loss" | "open";

export interface Trade {
  id: string | number;
  entryIdx: number;
  dir: TradeDirection;
  entryPrice: number;
  tpPrice: number;
  slPrice: number;
  exitIdx: number | null;
  exitPrice?: number;
  result: TradeResult;
  pnlPct?: string;
  timestamp: string;
  reasoning?: string;
}
