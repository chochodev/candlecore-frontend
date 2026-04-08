import { useWebSocket } from "@/hooks/useWebSocket";
import { CandlestickChart } from "@/components/CandlestickChart";
import { DashboardHeader, DashboardSidebar, SkippingOverlay } from "./components";
import { useDashboardDrag } from "./hooks/useDashboardDrag";
import { useDashboardBotHandlers } from "./hooks/useDashboardBotHandlers";
import "./dashboard.css";

import { useShallow } from "zustand/shallow";
import { useDashboardStore } from "@/zustand";

export function Dashboard() {
  const { connect } = useWebSocket();
  const { onMouseDown } = useDashboardDrag();
  const { handleConfigure, handleStart, handleStop, handleReset, handleSkip } = useDashboardBotHandlers(connect);

  const {
    candles,
    decisions,
    position,
    pnl,
    status,
    focusedTradeId,
    activeTab,
    config,
    botStatus,
    symbols,
    timeframes,
    configOpen,
    sidebarExpanded,
    sidebarPos,
    isDragging,
    configError,
    setFocusedTradeId,
    setActiveTab,
    setConfig,
    setConfigOpen,
    setSidebarExpanded,
  } = useDashboardStore(
    useShallow((s) => ({
      candles: s.candles,
      decisions: s.decisions,
      position: s.position,
      pnl: s.pnl,
      status: s.status,
      focusedTradeId: s.focusedTradeId,
      activeTab: s.activeTab,
      config: s.config,
      botStatus: s.botStatus,
      symbols: s.symbols,
      timeframes: s.timeframes,
      configOpen: s.configOpen,
      sidebarExpanded: s.sidebarExpanded,
      sidebarPos: s.sidebarPos,
      isDragging: s.isDragging,
      configError: s.configError,
      setFocusedTradeId: s.setFocusedTradeId,
      setActiveTab: s.setActiveTab,
      setConfig: s.setConfig,
      setConfigOpen: s.setConfigOpen,
      setSidebarExpanded: s.setSidebarExpanded,
    }))
  );

  const pnlStats = {
    pnl: pnl?.total_pnl ?? 0,
    winRate: pnl?.win_rate ?? 0,
    balance: pnl?.balance ?? 10.0,
  };

  const trades = pnl?.trades ?? [];

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-dark-core font-sans selection:bg-emerald-500/30">
      <DashboardHeader
        pnlStats={pnlStats}
        config={config}
        symbols={symbols}
        timeframes={timeframes}
        configOpen={configOpen}
        setConfigOpen={setConfigOpen}
        setConfig={setConfig}
        configError={configError}
        botStatus={botStatus}
        onConfigure={handleConfigure}
        onStart={handleStart}
        onStop={handleStop}
        onReset={handleReset}
        onSkip={handleSkip}
      />

      <main className="relative flex-1 overflow-hidden">
        <div className="h-full w-full overflow-hidden bg-dark-core">
          <CandlestickChart
            candles={candles}
            decisions={decisions}
            historicalTrades={trades}
            activeSymbol={config.symbol}
            timeframe={config.timeframe}
            isSearching={!!botStatus?.running && candles.length === 0}
            activePosition={position}
          />
        </div>

        <DashboardSidebar
          onMouseDown={onMouseDown}
          isDragging={isDragging}
          sidebarExpanded={sidebarExpanded}
          setSidebarExpanded={setSidebarExpanded}
          sidebarPos={sidebarPos}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          focusedTradeId={focusedTradeId}
          setFocusedTradeId={setFocusedTradeId}
          position={position}
          trades={trades}
        />

        {status === "skipping" && <SkippingOverlay />}
      </main>
    </div>
  );
}
