import { useEffect, useRef, useState } from 'react';
import type { WSEvent, CandleData, Decision, Position, PnLData } from '@/types/trading';

interface UseWebSocketReturn {
  candles: CandleData[];
  setCandles: React.Dispatch<React.SetStateAction<CandleData[]>>;
  decisions: Decision[];
  setDecisions: React.Dispatch<React.SetStateAction<Decision[]>>;
  position: Position | null;
  pnl: PnLData | null;
  setPnl: React.Dispatch<React.SetStateAction<PnLData | null>>;
  status: string;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const WS_URL = 'ws://localhost:8080/ws';

export function useWebSocket(): UseWebSocketReturn {
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [position, setPosition] = useState<Position | null>(null);
  const [pnl, setPnl] = useState<PnLData | null>(null);
  const [status, setStatus] = useState<string>('disconnected');
  const [isConnected, setIsConnected] = useState(false);

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
              setCandles((prev) => {
                const candleExists = prev.some(c =>
                  c.timestamp === wsEvent.data.timestamp &&
                  c.close === wsEvent.data.close
                );
                if (candleExists) return prev;
                
                const newCandles = [...prev, wsEvent.data];
                return newCandles.sort((a, b) => 
                  new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                ).slice(-1000);
              });
              break;

            case 'decision':
              console.info("🎯 NEURAL SIGNAL DETECTED:", wsEvent.data);
              setDecisions((prev) => [...prev, wsEvent.data]);
              break;

            case 'position':
              console.info("📊 POSITION UPDATE:", wsEvent.data);
              setPosition(wsEvent.data);
              break;

            case 'pnl':
              console.info("💰 PNL UPDATE:", wsEvent.data);
              setPnl(wsEvent.data);
              break;

            case 'history':
              console.info(`🛰️ NEURAL WARP COMPLETE: Batch size: ${wsEvent.data.length} candles`);
              setCandles(wsEvent.data);
              break;

            case 'status':
              console.info(`📟 ENGINE STATUS: ${wsEvent.data.status}`);
              setStatus(wsEvent.data.status);
              if (wsEvent.data.status === 'started' || wsEvent.data.status === 'reset') {
                 setCandles([]);
                 setDecisions([]);
                 setPnl(null);
                 setPosition(null);
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

        // Auto reconnect after 3 seconds
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
    return () => {
      disconnect();
    };
  }, []);

  return {
    candles,
    setCandles,
    decisions,
    setDecisions,
    position,
    pnl,
    setPnl,
    status,
    isConnected,
    connect,
    disconnect,
  };
}
