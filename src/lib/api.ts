const API_BASE = 'http://localhost:8080/api/v1';

export interface BotConfig {
  symbol: string;
  timeframe: string;
  strategy: string;
  replay_mode: boolean;
  dry_run?: boolean;
  replay_speed?: number;
}

export interface BotStatus {
  running: boolean;
  symbol: string;
  timeframe: string;
  strategy: string;
  replay_mode: boolean;
  dry_run?: boolean; // Dry-run mode indicator
  wallet_balance?: number; // Virtual balance in dry-run
  wallet_pnl?: number; // Virtual PnL in dry-run
  balance?: number;
  total_pnl?: number;
  position?: any;
  trades_count?: number;
}

export const botAPI = {
  async start() {
    const res = await fetch(`${API_BASE}/bot/start`, { method: 'POST' });
    return res.json();
  },

  async stop() {
    const res = await fetch(`${API_BASE}/bot/stop`, { method: 'POST' });
    return res.json();
  },

  async getStatus(): Promise<BotStatus> {
    const res = await fetch(`${API_BASE}/bot/status`);
    return res.json();
  },

  async configure(config: BotConfig) {
    const res = await fetch(`${API_BASE}/bot/configure`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to configure bot');
    }
    return res.json();
  },

  async getTrades() {
    const res = await fetch(`${API_BASE}/bot/trades`);
    return res.json();
  },

  async getSymbols(): Promise<{ symbols: string[] }> {
    const res = await fetch(`${API_BASE}/symbols`);
    return res.json();
  },

  async getTimeframes(): Promise<{ timeframes: string[] }> {
    const res = await fetch(`${API_BASE}/timeframes`);
    return res.json();
  },
};
