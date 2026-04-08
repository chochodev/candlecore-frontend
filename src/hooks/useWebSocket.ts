import { useEffect, useRef, useState } from 'react';
import type { WSEvent } from '@/types/trading';
import { useDashboardStore } from "@/zustand";

interface UseWebSocketReturn {
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const WS_URL = 'ws://localhost:8080/ws';

export function useWebSocket(): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  
  // Connect to Local Zustand Store
  const { setCandles, setDecisions, setPosition, setPnl, setStatus } = useDashboardStore();

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      const ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setStatus('connected');
      };

      ws.onmessage = (event) => {
        try {
          const wsEvent: WSEvent = JSON.parse(event.data);
          console.debug(`[WS] Incoming Event: ${wsEvent.type}`, wsEvent.data);

          switch (wsEvent.type) {
            case 'candle':
              setCandles([wsEvent.data]); // Store handles the aggregation/validation
              break;

            case "decision": {
              const newD = wsEvent.data;
              if (newD.signal !== "hold") {
                console.log(`[WS] [SIGNAL] ${newD.signal.toUpperCase()} @ ${newD.price}`);
                setDecisions([newD]);
              }
              break;
            }

            case "position":
              if (wsEvent.data) {
                const pos = wsEvent.data;
                const slInfo = pos.trailing_sl 
                  ? `SHIELD SL: ${pos.trailing_sl.toFixed(4)} (Locked)` 
                  : `SL: ${pos.stop_loss ? pos.stop_loss.toFixed(4) : "N/A"}`;
                  
                console.log(
                  `[WS] [POSITION] ${pos.side.toUpperCase()} Entry: ${pos.entry_price.toFixed(4)} | TP: ${pos.take_profit ? pos.take_profit.toFixed(4) : "N/A"} | ${slInfo}`
                );
              }
              setPosition(wsEvent.data);
              break;

            case 'pnl':
              setPnl(wsEvent.data);
              break;

            case 'history':
              setCandles(wsEvent.data);
              break;

            case 'status':
              setStatus(wsEvent.data.status);
              // Only reset on explicit engine reset signals, not every time it starts
              if (wsEvent.data.status === 'reset') {
                 useDashboardStore.getState().reset();
              }
              break;
          }
        } catch (e) {
          console.error('[WS] Neural Stream Parse Error:', e);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setStatus('disconnected');

        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connect();
        }, 3000);
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setIsConnected(false);
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setStatus('disconnected');
  };

  useEffect(() => {
    return () => disconnect();
  }, []);

  return {
    isConnected,
    connect,
    disconnect,
  };
}
