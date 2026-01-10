const API_BASE = 'http://localhost:8080/api/v1';

export interface BotConfig {
  symbol: string;
  timeframe: string;
  strategy: string;
  replay_mode: boolean;
}

export interface BotStatus {
  running: boolean;
  symbol: string;
  timeframe: string;
  strategy: string;
  replay_mode: boolean;
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
