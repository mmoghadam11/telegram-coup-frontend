import { useEffect, useRef, useState, useCallback } from "react";
import { BASE_URL } from "services/axios";

function getWsUrl(roomId: string): string {
  const wsBase = BASE_URL.replace(/^http/, "ws");
  return `${wsBase}/rooms/${roomId}/ws`;
}

export function useRoomSocket(roomId?: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!roomId) return;

    const url = getWsUrl(roomId);

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      setMessages((prev) => [...prev, `✅ Connected to: ${url}`]);
    };
    ws.onclose = (e) => {
      setConnected(false);
      setMessages((prev) => [...prev, `❌ Closed: code=${e.code} reason=${e.reason || "(none)"}`]);
    };
    ws.onerror = () => {
      setConnected(false);
      setMessages((prev) => [...prev, `⚠️ Error occurred`]);
    };
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