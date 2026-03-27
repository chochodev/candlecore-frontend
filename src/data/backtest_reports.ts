export interface StrategyReport {
  version: string;
  pnl: number;
  drawdown: number;
  winRate: number;
  trades: number;
  description: string;
}

export const BACKTEST_REPORTS: StrategyReport[] = [
  {
    version: "1.0.0",
    pnl: 83.61,
    drawdown: 5.37,
    winRate: 37.15,
    trades: 1631,
    description: "Baseline: Dual SMA Crossover. High reward in parabolic runs but zero protection during peak volatility.",
  },
  {
    version: "1.0.2",
    pnl: 45.42,
    drawdown: 3.12,
    winRate: 34.50,
    trades: 1205,
    description: "Tuned Pro: EMA 5/13 with Trend Filter. Engineered for safety above all else. Minimal drawdown profile.",
  },
  {
    version: "1.0.3",
    pnl: 48.56,
    drawdown: 4.88,
    winRate: 32.75,
    trades: 1838,
    description: "Hybrid Alpha: Concurrent Bollinger Breakout + EMA Momentum. Features Triple Guard protection and hyper-active signals.",
  }
];

export const SHOOTOUT_DATA = [
  { window: "Bull Run (2017)", v100: 5.70, v102: 3.78, v103: 2.68 },
  { window: "Bear Crash (2018)", v100: -1.40, v102: -0.75, v103: -1.50 },
  { window: "Choppy (2024)", v100: 0.45, v102: 0.45, v103: 0.31 },
];
