import { useEffect, useRef, useState, useCallback } from "react";
import { BASE_URL } from "services/axios";
import { useAuth } from "hooks/useAuth";

function getWsUrl(roomId: string, token: string): string {
  const wsBase = BASE_URL.replace(/^http/, "ws");
  return `${wsBase}/rooms/${roomId}/ws?token=${encodeURIComponent(token)}`;
}

interface PublicPlayer {
  id: string;
  name: string;
  connected: boolean;
  coins: number;
  roleCount: number;
}

interface PublicGameState {
  phase: string;
  creatorId: string | null
  players: PublicPlayer[];
  turnOrder: string[];
  currentTurnIndex: number;
  deckCount: number;
  log: string[];
}

interface PrivateState {
  yourRoles: string[];
  yourRevealed: boolean[];
}

export function useRoomSocket(roomId?: string) {
  const Auth = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReconnectRef = useRef(true); // برای جلوگیری از reconnect بعد از unmount عمدی

  const [connected, setConnected] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [gameState, setGameState] = useState<PublicGameState | null>(null);
  const [privateState, setPrivateState] = useState<PrivateState | null>(null);

  const connect = useCallback(() => {
    if (!roomId || !Auth?.token) return;

    const ws = new WebSocket(getWsUrl(roomId, Auth.token));
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onclose = () => {
      setConnected(false);
      // اگه عمدی (unmount) نبوده، بعد از یه تاخیر کوتاه دوباره تلاش کن
      if (shouldReconnectRef.current) {
        reconnectTimeoutRef.current = setTimeout(connect, 2000);
      }
    };

    ws.onerror = () => {
      ws.close(); // این خودش onclose رو trigger می‌کنه که reconnect منطق رو مدیریت می‌کنه
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "state") {
        setGameState(data.state);
        setLoaded(true);
      }
      if (data.type === "private") {
        setPrivateState(data.private);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, Auth?.token]);

  useEffect(() => {
    shouldReconnectRef.current = true;
    setLoaded(false);
    connect();

    // وقتی صفحه دوباره visible می‌شه (مثلاً از حالت قفل برگشتیم)، فوراً وضعیت اتصال رو چک کن
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        if (wsRef.current?.readyState !== WebSocket.OPEN) {
          if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
          connect();
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      shouldReconnectRef.current = false; // دیگه بعد از این، reconnect نکن
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      wsRef.current?.close();
    };
  }, [connect]);

  const send = useCallback((data: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  const startGame = useCallback(() => send({ type: "start_game" }), [send]);
  const sendChat = useCallback((text: string) => send({ type: "chat", text }), [send]);

  return { connected, loaded, gameState, privateState, startGame, sendChat };
}