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
  side: "buy" | "sell" | "long" | "short";
  entry_price: number;
  quantity: number;
  current_price: number;
  unrealized_pnl: number;
  realized_pnl: number;
  opened_at: string;
  closed_at?: string;
  trailing_sl?: number; // ← Backwards-mapped from engine's internal shield logic
}

export type TradeDirection = "buy" | "sell";
export type TradeResult = "profit" | "loss" | "open";

export interface Trade {
  id: string | number;
  entryIdx: number;
  entryTime: number; // ← stable Unix-seconds anchor (no candle array lookup)
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
