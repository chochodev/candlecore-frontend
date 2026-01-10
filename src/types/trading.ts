export type WSEventType = 'candle' | 'decision' | 'position' | 'pnl' | 'status';

export interface WSEvent {
  type: WSEventType;
  timestamp: string;
  data: any;
}

export interface CandleData {
  symbol: string;
  timeframe: string;
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Decision {
  timestamp: string;
  signal: 'buy' | 'sell' | 'hold';
  symbol: string;
  price: number;
  quantity: number;
  confidence: number;
  reasoning: string;
  indicators: Record<string, number>;
}

export interface Position {
  id: string;
  symbol: string;
  side: 'long' | 'short';
  entry_price: number;
  quantity: number;
  current_price: number;
  unrealized_pnl: number;
  realized_pnl: number;
  opened_at: string;
  closed_at?: string;
}

export interface PnLData {
  balance: number;
  total_pnl: number;
  unrealized_pnl?: number;
}
