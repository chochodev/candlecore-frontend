import { useEffect, useRef, useState } from 'react';
import type { WSEventType, WSEvent, CandleData, Decision, Position, PnLData } from '@/types/trading';

interface UseWebSocketReturn {
  candles: CandleData[];
  decisions: Decision[];
  position: Position | null;
  pnl: PnLData | null;
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

          switch (wsEvent.type) {
            case 'candle':
              setCandles(prev => {
                // Check if candle already exists (prevent duplicates)
                const candleExists = prev.some(c =>
                  c.timestamp === wsEvent.data.timestamp &&
                  c.close === wsEvent.data.close
                );

                if (candleExists) {
                  return prev; // Don't add duplicate
                }

                const newCandles = [...prev, wsEvent.data];
                // Keep last 100 candles max (for performance and clean display)
                return newCandles.slice(-100);
              });
              break;

            case 'decision':
              setDecisions(prev => {
                const newDecisions = [...prev, wsEvent.data];
                return newDecisions.slice(-50); // Keep last 50 decisions
              });
              break;

            case 'position':
              setPosition(wsEvent.data);
              break;

            case 'pnl':
              setPnl(wsEvent.data);
              break;

            case 'status':
              setStatus(wsEvent.data.status);
              // Clear candles when bot starts fresh
              if (wsEvent.data.status === 'started') {
                setCandles([]);
                setDecisions([]);
                setPosition(null);
              }
              break;
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
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
    decisions,
    position,
    pnl,
    status,
    isConnected,
    connect,
    disconnect,
  };
}
