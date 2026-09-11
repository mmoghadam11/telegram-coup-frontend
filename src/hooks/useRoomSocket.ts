import { useEffect, useRef, useState, useCallback } from "react";
import { BASE_URL } from "services/axios";
import { useAuth } from "hooks/useAuth";

function getWsUrl(roomId: string, token: string): string {
  const wsBase = BASE_URL.replace(/^http/, "ws");
  return `${wsBase}/rooms/${roomId}/ws?token=${encodeURIComponent(token)}&roomId=${roomId}`;
}

interface PublicPlayer {
  id: string;
  name: string;
  connected: boolean;
  coins: number;
  roleCount: number;
  revealedRoles: string[];
  isAlive: boolean;
}

interface PendingAction {
  id: string;
  actorId: string;
  action: string;
  targetId?: string;
  claimedRole?: string;
  awaitingResponseFrom: string[];
  responses: Record<string, "allow" | "challenge">;
  blockedBy?: { playerId: string; claimedRole: string };
  blockChallengeResponses?: Record<string, "allow" | "challenge">;
}

interface RevealPending {
  playerId: string;
  reason: string;
}

interface PublicGameState {
  phase: string;
  roomName: string | null;
  creatorId: string | null;
  players: PublicPlayer[];
  turnOrder: string[];
  currentTurnIndex: number;
  deckCount: number;
  log: string[];
  pendingAction: PendingAction | null;
  revealPending: RevealPending | null;
  winnerId: string | null;
}

interface PrivateState {
  yourRoles: string[];
  yourRevealed: boolean[];
}

export function useRoomSocket(roomId?: string) {
  const Auth = useAuth();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReconnectRef = useRef(true);

  const [connected, setConnected] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [gameState, setGameState] = useState<PublicGameState | null>(null);
  const [privateState, setPrivateState] = useState<PrivateState | null>(null);

  const connect = useCallback(() => {
    if (!roomId || !Auth?.token) return;

    const ws = new WebSocket(getWsUrl(roomId, Auth.token));
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => {
      setConnected(false);
      if (shouldReconnectRef.current) {
        reconnectTimeoutRef.current = setTimeout(connect, 2000);
      }
    };
    ws.onerror = () => ws.close();

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

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && wsRef.current?.readyState !== WebSocket.OPEN) {
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        connect();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      shouldReconnectRef.current = false;
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
  const sendAction = useCallback(
    (action: string, targetId?: string) => send({ type: "action", action, targetId }),
    [send]
  );
  const respond = useCallback(
    (response: "allow" | "challenge") => send({ type: "respond", response }),
    [send]
  );
  const blockAction = useCallback(() => send({ type: "block" }), [send]);
  const respondToBlock = useCallback(
    (response: "allow" | "challenge") => send({ type: "respond_to_block", response }),
    [send]
  );
  const revealCard = useCallback(
    (roleIndex: number) => send({ type: "reveal_card", roleIndex }),
    [send]
  );
  const restartGame = useCallback(() => send({ type: "restart_game" }), [send]);
  const leaveRoom = useCallback(() => send({ type: "leave_room" }), [send]);
  const closeRoom = useCallback(() => send({ type: "close_room" }), [send]);
  const forceReset = useCallback(() => send({ type: "force_reset" }), [send]);

  return {
    connected,
    loaded,
    gameState,
    privateState,
    startGame,
    sendChat,
    sendAction,
    respond,
    blockAction,
    respondToBlock,
    revealCard,
    restartGame,
    leaveRoom,
    closeRoom,
    forceReset,
  };
}