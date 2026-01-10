import { useState, useEffect } from "react"
import { useWebSocket } from "@/hooks/useWebSocket"
import { botAPI, type BotConfig } from "@/lib/api"
import { CandlestickChart } from "@/components/CandlestickChart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function Dashboard() {
  const { candles, decisions, position, pnl, isConnected, connect } = useWebSocket()
  const [botStatus, setBotStatus] = useState<any>(null)
  const [symbols, setSymbols] = useState<string[]>([])
  const [timeframes, setTimeframes] = useState<string[]>([])
  const [config, setConfig] = useState<BotConfig>({
    symbol: "bitcoin",
    timeframe: "5m",
    strategy: "ma_crossover",
    replay_mode: true,
  })

  useEffect(() => {
    const init = async () => {
      await loadMetadata()
      await loadBotStatus()
      await handleConfigure()
      connect()
    }
    
    init()

    const interval = setInterval(loadBotStatus, 2000)
    return () => clearInterval(interval)
  }, [])

  const loadMetadata = async () => {
    try {
      const [symbolsRes, timeframesRes] = await Promise.all([
        botAPI.getSymbols(),
        botAPI.getTimeframes(),
      ])
      setSymbols(symbolsRes.symbols)
      setTimeframes(timeframesRes.timeframes)
    } catch (error) {
      console.error("Failed to load metadata:", error)
    }
  }

  const loadBotStatus = async () => {
    try {
      const status = await botAPI.getStatus()
      setBotStatus(status)
    } catch (error) {
      console.error("Failed to load bot status:", error)
    }
  }

  const handleStart = async () => {
    try {
      await botAPI.start()
      await loadBotStatus()
    } catch (error) {
      console.error("Failed to start bot:", error)
    }
  }

  const handleStop = async () => {
    try {
      await botAPI.stop()
      await loadBotStatus()
    } catch (error) {
      console.error("Failed to stop bot:", error)
    }
  }

  const handleConfigure = async () => {
    try {
      await botAPI.configure(config)
      await loadBotStatus()
    } catch (error) {
      console.error("Failed to configure bot:", error)
    }
  }

  const latestDecision = decisions[decisions.length - 1]

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Compact Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Title + Stats */}
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-lg font-bold text-white">Trading Bot</h1>
                <p className="text-xs text-gray-500">Real-time simulation</p>
              </div>
              
              <div className="hidden items-center gap-4 md:flex">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Balance</span>
                  <span className="text-sm font-semibold text-white">
                    ${pnl?.balance.toFixed(2) || "10,000"}
                  </span>
                </div>
                <div className="h-4 w-px bg-gray-800" />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">PnL</span>
                  <span
                    className={`text-sm font-semibold ${
                      (pnl?.total_pnl || 0) >= 0 ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {(pnl?.total_pnl || 0) >= 0 ? "+" : ""}${pnl?.total_pnl.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="h-4 w-px bg-gray-800" />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Candles</span>
                  <span className="text-sm font-semibold text-white">{candles.length}</span>
                </div>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Symbol */}
              <Select
                value={config.symbol}
                onValueChange={(value) => setConfig({ ...config, symbol: value })}
                disabled={botStatus?.running}
              >
                <SelectTrigger className="h-8 w-[100px] border-gray-800 bg-gray-900 text-xs md:w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {symbols.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Timeframe */}
              <Select
                value={config.timeframe}
                onValueChange={(value) => setConfig({ ...config, timeframe: value })}
                disabled={botStatus?.running}
              >
                <SelectTrigger className="h-8 w-[60px] border-gray-800 bg-gray-900 text-xs md:w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeframes.map((tf) => (
                    <SelectItem key={tf} value={tf}>
                      {tf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Strategy - Hidden on mobile */}
              <Select
                value={config.strategy}
                onValueChange={(value) => setConfig({ ...config, strategy: value })}
                disabled={botStatus?.running}
              >
                <SelectTrigger className="hidden h-8 w-[110px] border-gray-800 bg-gray-900 text-xs md:flex">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ma_crossover">MA Cross</SelectItem>
                  <SelectItem value="rsi">RSI</SelectItem>
                </SelectContent>
              </Select>

              {/* Replay Toggle - Hidden on mobile */}
              <div className="hidden items-center gap-2 md:flex">
                <Switch
                  id="replay"
                  checked={config.replay_mode}
                  onCheckedChange={(checked) => setConfig({ ...config, replay_mode: checked })}
                  disabled={botStatus?.running}
                />
                <Label htmlFor="replay" className="text-xs text-gray-400">
                  Replay
                </Label>
              </div>

              {/* Configure Button - Hidden on mobile when running */}
              <Button
                onClick={handleConfigure}
                disabled={botStatus?.running}
                variant="outline"
                size="sm"
                className="hidden h-8 border-gray-800 bg-gray-900 text-xs hover:bg-gray-800 md:flex"
              >
                Configure
              </Button>

              {/* Start/Stop Button with State */}
              {botStatus?.running ? (
                <Button
                  onClick={handleStop}
                  size="sm"
                  className="h-8 gap-2 bg-red-500 text-xs hover:bg-red-600"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  <span className="hidden sm:inline">Stop</span>
                </Button>
              ) : (
                <Button
                  onClick={handleStart}
                  size="sm"
                  className="h-8 gap-2 bg-emerald-500 text-xs hover:bg-emerald-600"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  <span className="hidden sm:inline">Start</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative container mx-auto px-4 py-6 min-h-screen">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Chart */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">
                  {config.symbol.toUpperCase()} / {config.timeframe}
                </h3>
                <Badge variant={botStatus?.running ? "default" : "secondary"}>
                  {botStatus?.running ? "Running" : "Stopped"}
                </Badge>
              </div>
              <CandlestickChart candles={candles} />
            </div>

            {/* Recent Signals */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-white">Recent Signals</h3>
              <div className="space-y-2">
                {decisions.slice(-5).reverse().map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900 px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          d.signal === "buy"
                            ? "default"
                            : d.signal === "sell"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {d.signal.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {new Date(d.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{d.confidence}%</span>
                  </div>
                ))}
                {decisions.length === 0 && (
                  <p className="py-8 text-center text-sm text-gray-500">No signals yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sticky top-20 h-max">
            {/* Position Card */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-white">Position</h3>
              {position ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">Side</span>
                    <Badge variant="outline" className="capitalize">
                      {position.side}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">Entry</span>
                    <span className="text-sm font-medium text-white">
                      ${position.entry_price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">Current</span>
                    <span className="text-sm font-medium text-white">
                      ${position.current_price.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-gray-800 pt-2">
                    <span className="text-xs text-gray-400">P&L</span>
                    <span
                      className={`text-sm font-semibold ${
                        position.unrealized_pnl >= 0 ? "text-emerald-500" : "text-red-500"
                      }`}
                    >
                      {position.unrealized_pnl >= 0 ? "+" : ""}${position.unrealized_pnl.toFixed(2)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="h-4 w-12 animate-pulse rounded bg-gray-800" />
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-800" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-800" />
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-800" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-800" />
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-800" />
                  </div>
                  <div className="flex justify-between border-t border-gray-800 pt-2">
                    <div className="h-4 w-10 animate-pulse rounded bg-gray-800" />
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-800" />
                  </div>
                </div>
              )}
            </div>

            {/* Latest Signal Card */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-white">Latest Signal</h3>
              {latestDecision ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Signal</span>
                    <Badge
                      variant={
                        latestDecision.signal === "buy"
                          ? "default"
                          : latestDecision.signal === "sell"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {latestDecision.signal.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400">Reasoning</span>
                    <p className="mt-1 text-xs text-white">{latestDecision.reasoning}</p>
                  </div>
                  <div className="flex justify-between border-t border-gray-800 pt-2">
                    <span className="text-xs text-gray-400">Confidence</span>
                    <span className="text-xs font-medium text-white">{latestDecision.confidence}%</span>
                  </div>
                  {latestDecision.indicators && Object.keys(latestDecision.indicators).length > 0 && (
                    <div className="border-t border-gray-800 pt-2">
                      <span className="text-xs text-gray-400">Indicators</span>
                      <div className="mt-2 space-y-1">
                        {Object.entries(latestDecision.indicators).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-xs">
                            <span className="text-gray-500">{key}</span>
                            <span className="font-mono text-white">{(value as number).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-800" />
                    <div className="h-5 w-12 animate-pulse rounded bg-gray-800" />
                  </div>
                  <div>
                    <div className="h-3 w-20 animate-pulse rounded bg-gray-800" />
                    <div className="mt-2 h-12 w-full animate-pulse rounded bg-gray-800" />
                  </div>
                  <div className="flex justify-between border-t border-gray-800 pt-2">
                    <div className="h-3 w-20 animate-pulse rounded bg-gray-800" />
                    <div className="h-3 w-10 animate-pulse rounded bg-gray-800" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
