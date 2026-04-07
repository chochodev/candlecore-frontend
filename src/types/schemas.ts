import { z } from "zod";

// ── Neural State Registries (Zod Managed) ──

export const CandleSchema = z.object({
  symbol: z.string(),
  timeframe: z.string(),
  timestamp: z.string(),
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  volume: z.number(),
  indicators: z.record(z.string(), z.number()).optional(),
});

export const DecisionSchema = z.object({
  symbol: z.string(),
  price: z.number(),
  signal: z.enum(["buy", "sell", "hold"]),
  reasoning: z.string(),
  timestamp: z.string(),
  indicators: z.record(z.string(), z.number()).optional(),
  stop_loss: z.number().optional(),
  take_profit: z.number().optional(),
  trailing_sl: z.number().optional(),
});

export const PositionSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  side: z.enum(["buy", "sell", "long", "short"]),
  entry_price: z.number(),
  quantity: z.number(),
  current_price: z.number(),
  unrealized_pnl: z.number(),
  realized_pnl: z.number().default(0),
  opened_at: z.string(),
  closed_at: z.string().optional().nullable(),
  stop_loss: z.number(),
  take_profit: z.number(),
  trailing_sl: z.number().optional().nullable(),
});

export const PnLSchema = z.object({
  balance: z.number(),
  total_pnl: z.number(),
  win_rate: z.number(),
  trades: z.array(PositionSchema).optional().default([]),
});

export const BotConfigSchema = z.object({
  symbol: z.string(),
  timeframe: z.string(),
  strategy: z.string(),
  replay_mode: z.boolean(),
  dry_run: z.boolean(),
  replay_speed: z.number(),
  strategy_params: z.record(z.string(), z.any()).optional(),
});

// ── Unified Inference ──

export type CandleData = z.infer<typeof CandleSchema>;
export type Decision = z.infer<typeof DecisionSchema>;
export type Position = z.infer<typeof PositionSchema>;
export type PnLData = z.infer<typeof PnLSchema>;
export type BotConfig = z.infer<typeof BotConfigSchema>;
