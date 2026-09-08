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
  const [connected, setConnected] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [gameState, setGameState] = useState<PublicGameState | null>(null);
  const [privateState, setPrivateState] = useState<PrivateState | null>(null);

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
      if (data.type === "state") {
        setGameState(data.state);
        setLoaded(true);
      }
      if (data.type === "private") {
        setPrivateState(data.private);
      }
    };

    return () => ws.close();
  }, [roomId, Auth?.token]);

  const send = useCallback((data: object) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  const startGame = useCallback(() => send({ type: "start_game" }), [send]);
  const sendChat = useCallback((text: string) => send({ type: "chat", text }), [send]);

  return { connected, loaded, gameState, privateState, startGame, sendChat };
}