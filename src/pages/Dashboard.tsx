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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function Dashboard() {
  const { candles, decisions, position, pnl, isConnected, connect } = useWebSocket()
  const [botStatus, setBotStatus] = useState<any>(null)
  const [symbols, setSymbols] = useState<string[]>([])
  const [timeframes, setTimeframes] = useState<string[]>([])
  const [configOpen, setConfigOpen] = useState(false)
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
      setConfigOpen(false)
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
            {/* Left: Title + Compact Stats */}
            <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-6">
              <div className="min-w-0">
                <h1 className="truncate text-base font-bold text-white md:text-lg">Trading Bot</h1>
                <p className="hidden text-xs text-gray-500 sm:block">
                  {config.symbol.toUpperCase()} / {config.timeframe}
                </p>
              </div>
              
              {/* Compact Stats - Hidden on small mobile */}
              <div className="hidden items-center gap-3 sm:flex md:gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">PnL</span>
                  <span
                    className={`text-sm font-semibold ${
                      (pnl?.total_pnl || 0) >= 0 ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {(pnl?.total_pnl || 0) >= 0 ? "+" : ""}${pnl?.total_pnl?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="hidden h-4 w-px bg-gray-800 md:block" />
                <div className="hidden items-center gap-2 md:flex">
                  <span className="text-xs text-gray-400">Candles</span>
                  <span className="text-sm font-semibold text-white">{candles.length}</span>
                </div>
              </div>
            </div>

            {/* Right: Config Modal + Start/Stop */}
            <div className="flex items-center gap-2">
              {/* Config Modal */}
              <Dialog open={configOpen} onOpenChange={setConfigOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={botStatus?.running}
                    className="h-8 gap-2 border-gray-800 bg-gray-900 px-3 text-xs hover:bg-gray-800"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="hidden sm:inline">Config</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-gray-800 bg-gray-950 text-white sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Bot Configuration</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Configure your trading bot settings
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    {/* Symbol */}
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-300">Symbol</Label>
                      <Select
                        value={config.symbol}
                        onValueChange={(value) => setConfig({ ...config, symbol: value })}
                      >
                        <SelectTrigger className="border-gray-800 bg-gray-900">
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
                    </div>

                    {/* Timeframe */}
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-300">Timeframe</Label>
                      <Select
                        value={config.timeframe}
                        onValueChange={(value) => setConfig({ ...config, timeframe: value })}
                      >
                        <SelectTrigger className="border-gray-800 bg-gray-900">
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
                    </div>

                    {/* Strategy */}
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-300">Strategy</Label>
                      <Select
                        value={config.strategy}
                        onValueChange={(value) => setConfig({ ...config, strategy: value })}
                      >
                        <SelectTrigger className="border-gray-800 bg-gray-900">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ma_crossover">MA Crossover</SelectItem>
                          <SelectItem value="rsi">RSI Strategy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Replay Mode */}
                    <div className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                      <div className="space-y-0.5">
                        <Label className="text-sm text-gray-300">Replay Mode</Label>
                        <p className="text-xs text-gray-500">Simulate historical trading</p>
                      </div>
                      <Switch
                        checked={config.replay_mode}
                        onCheckedChange={(checked) => setConfig({ ...config, replay_mode: checked })}
                      />
                    </div>

                    {/* Apply Button */}
                    <Button
                      onClick={handleConfigure}
                      className="w-full bg-emerald-500 hover:bg-emerald-600"
                    >
                      Apply Configuration
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Start/Stop Button */}
              {botStatus?.running ? (
                <Button
                  onClick={handleStop}
                  size="sm"
                  className="h-8 gap-2 bg-red-500 text-xs hover:bg-red-600"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  <span>Stop</span>
                </Button>
              ) : (
                <Button
                  onClick={handleStart}
                  size="sm"
                  className="h-8 gap-2 bg-emerald-500 text-xs hover:bg-emerald-600"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  <span>Start</span>
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
                <Badge variant={botStatus?.running ? "default" : "secondary"} className="text-xs">
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
                        className="text-xs"
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
                    <Badge variant="outline" className="capitalize text-xs">
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
                      className="text-xs"
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
