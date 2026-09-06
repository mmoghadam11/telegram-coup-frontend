import { useEffect, useRef, useState, useCallback } from "react";
import { BASE_URL } from "services/axios";

function getWsUrl(roomId: string): string {
  // آدرس https رو به wss تبدیل می‌کنیم
  const wsBase = BASE_URL.replace(/^http/, "ws");
  return `${wsBase}/rooms/${roomId}/ws`;
}

export function useRoomSocket(roomId?: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!roomId) return;

    const ws = new WebSocket(getWsUrl(roomId));
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev.slice(-49), event.data]);
    };

    return () => {
      ws.close();
    };
  }, [roomId]);

  const send = useCallback((data: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  return { connected, messages, send };
}