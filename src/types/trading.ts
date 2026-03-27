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
  indicators?: Record<string, number>; // Added for visualization
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
  side: 'buy' | 'sell';
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
  win_rate: number;
}
