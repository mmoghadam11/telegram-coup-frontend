import { useEffect, useRef, useState, useCallback } from "react";
import { BASE_URL } from "services/axios";
import { useAuth } from "hooks/useAuth";

function getWsUrl(roomId: string, token: string): string {
  const wsBase = BASE_URL.replace(/^http/, "ws");
  return `${wsBase}/rooms/${roomId}/ws?token=${encodeURIComponent(token)}`;
}

export function useRoomSocket(roomId?: string) {
  const Auth = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [players, setPlayers] = useState<any[]>([]);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    if (!roomId || !Auth?.token) return;
    setLoaded(false);

    const ws = new WebSocket(getWsUrl(roomId, Auth.token));
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "players") setPlayers(data.players);
      if (data.type === "log") {
        setLog(data.log);
        setLoaded(true);
    }
    };

    return () => ws.close();
  }, [roomId, Auth?.token]);

  const sendChat = useCallback((text: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "chat", text }));
    }
  }, []);

  return { connected, loaded, players, log, sendChat };
}