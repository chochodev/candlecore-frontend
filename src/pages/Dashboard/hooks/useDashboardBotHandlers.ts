import { useCallback, useEffect } from "react";
import { botAPI } from "@/lib/api";
import { useDashboardStore } from "@/zustand";

export function useDashboardBotHandlers(connect: () => void) {
  const config = useDashboardStore((s) => s.config);
  const setSymbols = useDashboardStore((s) => s.setSymbols);
  const setTimeframes = useDashboardStore((s) => s.setTimeframes);
  const setBotStatus = useDashboardStore((s) => s.setBotStatus);
  const setConfigOpen = useDashboardStore((s) => s.setConfigOpen);
  const setConfigError = useDashboardStore((s) => s.setConfigError);

  const loadMetadata = useCallback(async () => {
    try {
      const [, timeframesRes] = await Promise.all([botAPI.getSymbols(), botAPI.getTimeframes()]);
      setSymbols(["sol", "btc"]);
      setTimeframes(timeframesRes.timeframes);
    } catch (error) {
      console.error("Failed to load metadata:", error);
    }
  }, [setSymbols, setTimeframes]);

  const loadBotStatus = useCallback(async () => {
    try {
      const status = await botAPI.getStatus();
      setBotStatus(status);
      return status;
    } catch (error) {
      console.error("Failed to load bot status:", error);
      return null;
    }
  }, [setBotStatus]);

  const handleConfigure = useCallback(async () => {
    setConfigError(null);
    try {
      await botAPI.configure(config);
      await loadBotStatus();
      setConfigOpen(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Engine Configuration Blocked:", message);
      setConfigError(message);
    }
  }, [config, loadBotStatus, setConfigError, setConfigOpen]);

  useEffect(() => {
    const init = async () => {
      await loadMetadata();
      const status = await loadBotStatus();

      if (!status?.running) {
        await handleConfigure();
      }

      connect();
    };

    init();

    const interval = setInterval(loadBotStatus, 2000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- init once on mount; matches original Dashboard

  const handleStart = useCallback(async () => {
    try {
      await botAPI.start();
      await loadBotStatus();
    } catch (error) {
      console.error("Failed to start bot:", error);
    }
  }, [loadBotStatus]);

  const handleStop = useCallback(async () => {
    try {
      await botAPI.stop();
      await loadBotStatus();
    } catch (error) {
      console.error("Failed to stop bot:", error);
    }
  }, [loadBotStatus]);

  const handleReset = useCallback(async () => {
    try {
      await botAPI.reset();
      useDashboardStore.getState().reset();
      await loadBotStatus();
    } catch (error) {
      console.error("Failed to reset bot:", error);
    }
  }, [loadBotStatus]);

  const handleSkip = useCallback(async () => {
    try {
      await botAPI.skip();
    } catch (e) {
      console.error("Skip Failed:", e);
    }
  }, []);

  return {
    loadBotStatus,
    handleConfigure,
    handleStart,
    handleStop,
    handleReset,
    handleSkip,
  };
}
