import { useEffect, useRef, useState, useCallback } from "react";
import { BASE_URL } from "services/axios";
import { useAuth } from "hooks/useAuth";

function getWsUrl(roomId: string, token: string): string {
  const wsBase = BASE_URL.replace(/^http/, "ws");
  return `${wsBase}/rooms/${roomId}/ws?token=${encodeURIComponent(token)}&roomId=${roomId}`;
}

interface PlayerStats {
  successfulBluffs: number;
  caughtBluffs: number;
  correctChallenges: number;
  wrongChallenges: number;
  successfulSteals: number;
  kills: number;
}
interface PublicPlayer {
  id: string;
  name: string;
  photoUrl: string | null;
  connected: boolean;
  coins: number;
  roleCount: number;
  revealedRoles: string[];
  isAlive: boolean;
  stats: PlayerStats;
}

interface RestartVoteState {
  reopenForJoining: boolean;
  responses: Record<string, "stay" | "leave">;
  waitingFor: string[];
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

interface SelectionPending {
  playerId: string;
  mode: "exchange" | "contessa";
}

interface ProofEvent {
  playerId: string;
  playerName: string;
  role: string;
  success: boolean;
}

interface ProvePending {
  playerId: string;
  claimedRole: string;
}

interface AnarchistPendingState {
  originalAttackerId: string;
  currentTargetId: string;
  chain: string[];
  status: "awaiting_block_decision" | "awaiting_block_challenge" | "awaiting_pass_target";
  blockChallengeResponses: Record<string, "allow" | "challenge">;
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
  anarchistPending: AnarchistPendingState | null;
  pendingAction: PendingAction | null;
  revealPending: RevealPending | null;
  provePending: ProvePending | null;
  selectionPending: SelectionPending | null;
  restartVote: RestartVoteState | null;
  winnerId: string | null;
}

interface PrivateState {
  yourRoles: string[];
  yourRevealed: boolean[];
  exchangePool?: string[];
  exchangeKeepCount?: number;
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
  const [proofEvent, setProofEvent] = useState<ProofEvent | null>(null);

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
        const state = data.state;

        const generatedPlayers = state.players.map((playerItem: PublicPlayer) => ({
          ...playerItem,
          stats: {
            successfulBluffs: playerItem.stats?.successfulBluffs ?? 0,
            caughtBluffs: playerItem.stats?.caughtBluffs ?? 0,
            correctChallenges: playerItem.stats?.correctChallenges ?? 0,
            wrongChallenges: playerItem.stats?.wrongChallenges ?? 0,
            successfulSteals: playerItem.stats?.successfulSteals ?? 0,
            kills: playerItem.stats?.kills ?? 0,
          },
        }));

        setGameState({
          ...state,
          players: generatedPlayers,
        });

        setLoaded(true);
      }

      if (data.type === "private") {
        setPrivateState(data.private);
      }
      if (data.type === "proof_result") {
        setProofEvent(data.result);
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
  const blockAction = useCallback(
    (claimedRole: string) => send({ type: "block", claimedRole }),
    [send]
  );
  const respondToBlock = useCallback(
    (response: "allow" | "challenge") => send({ type: "respond_to_block", response }),
    [send]
  );
  const revealCard = useCallback(
    (roleIndex: number) => send({ type: "reveal_card", roleIndex }),
    [send]
  );
  const restartGame = useCallback(
    (reopenForJoining: boolean) => send({ type: "restart_game", reopenForJoining }),
    [send]
  );
  const sendExchangeSelect = useCallback(
    (keepIndexes: number[]) => send({ type: "exchange_select", keepIndexes }),
    [send]
  );
  const sendContessaSelect = useCallback(
    (messageType: "contessa_self_select" | "contessa_other_select", roleIndex: number) =>
      send({ type: messageType, roleIndex }),
    [send]
  );
  const anarchistRespond = useCallback(
    (response: "allow" | "block") => send({ type: "anarchist_respond", response }),
    [send]
  );
  const anarchistBlockRespond = useCallback(
    (response: "allow" | "challenge") => send({ type: "anarchist_block_respond", response }),
    [send]
  );
  const anarchistPass = useCallback(
    (targetId: string) => send({ type: "anarchist_pass", targetId }),
    [send]
  );
  const anarchistNeutralize = useCallback(
  () => send({ type: "anarchist_neutralize" }),
  [send]
);
  const respondToRestartVote = useCallback(
    (choice: "stay" | "leave") => send({ type: "respond_to_restart_vote", choice }),
    [send]
  );
  const leaveRoom = useCallback(() => send({ type: "leave_room" }), [send]);
  const closeRoom = useCallback(() => send({ type: "close_room" }), [send]);
  const forceReset = useCallback(() => send({ type: "force_reset" }), [send]);
  const sendProveCard = useCallback(
    (roleIndex: number) => send({ type: "prove_card", roleIndex }),
    [send]
  );
  const clearProofEvent = useCallback(() => setProofEvent(null), []);

  return {
    connected,
    loaded,
    gameState,
    privateState,
    proofEvent, sendProveCard, clearProofEvent,
    startGame,
    sendChat,
    sendAction,
    respond,
    blockAction,
    respondToBlock,
    revealCard,
    sendContessaSelect,
    sendExchangeSelect,
    anarchistRespond,
    anarchistBlockRespond,
    anarchistPass,
    anarchistNeutralize,
    restartGame,
    respondToRestartVote,
    leaveRoom,
    closeRoom,
    forceReset,
  };
}