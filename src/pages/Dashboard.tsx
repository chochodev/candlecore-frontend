import { useState, useEffect } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { botAPI, type BotConfig } from "@/lib/api";
import { CandlestickChart } from "@/components/CandlestickChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export function Dashboard() {
  const { candles, decisions, position, pnl, status, isConnected, connect } = useWebSocket();
  const [botStatus, setBotStatus] = useState<any>(null);
  const [symbols, setSymbols] = useState<string[]>([]);
  const [timeframes, setTimeframes] = useState<string[]>([]);
  const [config, setConfig] = useState<BotConfig>({
    symbol: "bitcoin",
    timeframe: "1h",
    strategy: "ma_crossover",
    replay_mode: true,
  });

  useEffect(() => {
    loadMetadata();
    loadBotStatus();
    connect();

    const interval = setInterval(loadBotStatus, 2000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMetadata = async () => {
    try {
      const [symbolsRes, timeframesRes] = await Promise.all([botAPI.getSymbols(), botAPI.getTimeframes()]);
      setSymbols(symbolsRes.symbols);
      setTimeframes(timeframesRes.timeframes);
    } catch (error) {
      console.error("Failed to load metadata:", error);
    }
  };

  const loadBotStatus = async () => {
    try {
      const status = await botAPI.getStatus();
      setBotStatus(status);
    } catch (error) {
      console.error("Failed to load bot status:", error);
    }
  };

  const handleStart = async () => {
    try {
      await botAPI.start();
      await loadBotStatus();
    } catch (error) {
      console.error("Failed to start bot:", error);
    }
  };

  const handleStop = async () => {
    try {
      await botAPI.stop();
      await loadBotStatus();
    } catch (error) {
      console.error("Failed to stop bot:", error);
    }
  };

  const handleConfigure = async () => {
    try {
      await botAPI.configure(config);
      await loadBotStatus();
    } catch (error) {
      console.error("Failed to configure bot:", error);
    }
  };

  const latestDecision = decisions[decisions.length - 1];

  return (
    <div className="min-h-screen bg-gray-950 py-6">
      <div className="container mx-auto max-w-screen-2xl space-y-6 px-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-gellix text-3xl font-bold text-white">Trading Dashboard</h1>
            <p className="text-gray-400">Real-time bot performance and controls</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900 px-4 py-2">
              <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-500" : "bg-red-500"}`}></div>
              <span className="text-sm text-gray-400">{isConnected ? "Connected" : "Disconnected"}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardDescription>Balance</CardDescription>
              <CardTitle className="text-2xl">${pnl?.balance.toFixed(2) || "10,000.00"}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Total PnL</CardDescription>
              <CardTitle className={`text-2xl ${(pnl?.total_pnl || 0) >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                {(pnl?.total_pnl || 0) >= 0 ? "+" : ""}${pnl?.total_pnl.toFixed(2) || "0.00"}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Status</CardDescription>
              <CardTitle className="text-2xl capitalize">
                {botStatus?.running ? (
                  <span className="text-emerald-500">Running</span>
                ) : (
                  <span className="text-gray-400">Stopped</span>
                )}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Candles Processed</CardDescription>
              <CardTitle className="text-2xl">{candles.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>
              Live Chart - {config.symbol.toUpperCase()} ({config.timeframe})
            </CardTitle>
            <CardDescription>Real-time candlestick data from bot</CardDescription>
          </CardHeader>
          <CardContent>
            <CandlestickChart candles={candles} />
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Bot Controls */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Bot Controls</CardTitle>
              <CardDescription>Configure and control the trading bot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Symbol</label>
                <select
                  value={config.symbol}
                  onChange={(e) => setConfig({ ...config, symbol: e.target.value })}
                  disabled={botStatus?.running}
                  className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
                >
                  {symbols.map((symbol) => (
                    <option key={symbol} value={symbol}>
                      {symbol.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Timeframe</label>
                <select
                  value={config.timeframe}
                  onChange={(e) => setConfig({ ...config, timeframe: e.target.value })}
                  disabled={botStatus?.running}
                  className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
                >
                  {timeframes.map((tf) => (
                    <option key={tf} value={tf}>
                      {tf}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Strategy</label>
                <select
                  value={config.strategy}
                  onChange={(e) => setConfig({ ...config, strategy: e.target.value })}
                  disabled={botStatus?.running}
                  className="w-full rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-white disabled:opacity-50"
                >
                  <option value="ma_crossover">MA Crossover</option>
                  <option value="rsi">RSI Strategy</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="replay"
                  checked={config.replay_mode}
                  onChange={(e) => setConfig({ ...config, replay_mode: e.target.checked })}
                  disabled={botStatus?.running}
                  className="h-4 w-4 rounded border-gray-800 bg-gray-900"
                />
                <label htmlFor="replay" className="text-sm text-gray-300">
                  Replay Mode (Historical)
                </label>
              </div>

              <div className="space-y-2 pt-4">
                <button
                  onClick={handleConfigure}
                  disabled={botStatus?.running}
                  className="w-full rounded-full bg-gray-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-700 disabled:opacity-50"
                >
                  Configure
                </button>

                {botStatus?.running ? (
                  <button
                    onClick={handleStop}
                    className="w-full rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-red-500/10 transition-all hover:bg-red-600"
                  >
                    Stop Bot
                  </button>
                ) : (
                  <button
                    onClick={handleStart}
                    className="w-full rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-500/10 transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/15"
                  >
                    Start Bot
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Position & Latest Decision */}
          <div className="space-y-6 lg:col-span-2">
            {/* Current Position */}
            {position && (
              <Card>
                <CardHeader>
                  <CardTitle>Current Position</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <div className="text-sm text-gray-400">Side</div>
                      <div className="text-lg font-semibold text-white capitalize">{position.side}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Entry Price</div>
                      <div className="text-lg font-semibold text-white">${position.entry_price.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Current Price</div>
                      <div className="text-lg font-semibold text-white">${position.current_price.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Unrealized PnL</div>
                      <div
                        className={`text-lg font-semibold ${position.unrealized_pnl >= 0 ? "text-emerald-500" : "text-red-500"}`}
                      >
                        {position.unrealized_pnl >= 0 ? "+" : ""}${position.unrealized_pnl.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Latest Decision */}
            {latestDecision && (
              <Card>
                <CardHeader>
                  <CardTitle>Latest Decision</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Signal</span>
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          latestDecision.signal === "buy"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : latestDecision.signal === "sell"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-gray-500/10 text-gray-400"
                        }`}
                      >
                        {latestDecision.signal.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Reasoning</div>
                      <div className="text-sm text-white">{latestDecision.reasoning}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Confidence</span>
                      <span className="text-sm text-white">{latestDecision.confidence}%</span>
                    </div>
                    {latestDecision.indicators && Object.keys(latestDecision.indicators).length > 0 && (
                      <div>
                        <div className="mb-2 text-sm text-gray-400">Indicators</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(latestDecision.indicators).map(([key, value]) => (
                            <div key={key} className="flex justify-between rounded bg-gray-800 px-2 py-1">
                              <span className="text-gray-400">{key}:</span>
                              <span className="text-white">{(value as number).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Decisions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Decisions</CardTitle>
                <CardDescription>{decisions.length} total signals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {decisions
                    .slice(-5)
                    .reverse()
                    .map((decision, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 px-4 py-2"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                              decision.signal === "buy"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : decision.signal === "sell"
                                  ? "bg-red-500/10 text-red-500"
                                  : "bg-gray-500/10 text-gray-400"
                            }`}
                          >
                            {decision.signal}
                          </span>
                          <span className="text-sm text-gray-400">
                            {new Date(decision.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <span className="text-sm text-gray-400">{decision.confidence}%</span>
                      </div>
                    ))}
                  {decisions.length === 0 && <p className="text-center text-sm text-gray-500">No decisions yet</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
