import React from "react";
import { Alert, Avatar, Box, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { motion } from "motion/react";
import type { PublicGameState } from "hooks/useRoomSocket";

const CARD_BACK = "/assets/images/cards/minimal/card-back.webp";
const RING = 170;
const RADIUS = 64;

interface Status { playerId: string; text: string; cardCount: number }

function resolveStatus(g: PublicGameState, myId: string): Status | null {
  // کارت سوخته/نمایش کارت دیالوگ خودشون رو دارن
  if (g.showcase || g.revealPending || g.phase === "game_over") return null;
  const find = (id: string) => g.players.find((p) => p.id === id);
  const name = (id: string) => find(id)?.name ?? "یک بازیکن";

  if (g.selectionPending && g.selectionPending.playerId !== myId) {
    const { playerId, mode, cardCount } = g.selectionPending;
    return {
      playerId,
      cardCount,
      text: mode === "exchange"
        ? `${name(playerId)} در حال انتخاب کارت (سفیر) است`
        : `${name(playerId)} در حال انتخاب کارتی برای تعویض است`,
    };
  }
  if (g.provePending && g.provePending.playerId !== myId) {
    const id = g.provePending.playerId;
    return { playerId: id, cardCount: find(id)?.roleCount ?? 0, text: `${name(id)} در حال انتخاب کارت برای اثبات ادعا است` };
  }
  if (g.phase === "awaiting_action") {
    const turnId = g.turnOrder[g.currentTurnIndex];
    if (turnId && turnId !== myId) {
      return { playerId: turnId, cardCount: 0, text: `نوبت ${name(turnId)} است؛ در حال انتخاب اکشن` };
    }
  }
  return null;
}

const backStyle = {
  backgroundColor: "#d9573f",
  backgroundImage: `url(${CARD_BACK}), radial-gradient(ellipse at center, #a8232b 0 28%, #d9573f 30% 100%)`,
  backgroundSize: "cover",
  borderRadius: "4px",
  border: "1px solid #f3e3c3",
  boxShadow: "0 2px 5px rgba(0,0,0,.5)",
};

function AvatarRing({ src, name, size }: { src?: string | null; name: string; size: number }) {
  return (
    <Box sx={{ p: "2px", borderRadius: "50%", background: "linear-gradient(135deg,#fff6b0,#e0a52f,#fff6b0)", display: "inline-flex" }}>
      <Avatar src={src || undefined} alt={name} imgProps={{ referrerPolicy: "no-referrer" }} sx={{ width: size, height: size }}>
        {name?.[0]}
      </Avatar>
    </Box>
  );
}

interface Props { gameState: PublicGameState; myUserId: string; animated: boolean }

export default function WaitingForPlayerPanel({ gameState, myUserId, animated }: Props) {
  const me = gameState.players.find((p) => p.id === myUserId);
  const status = resolveStatus(gameState, myUserId);
  const spectating = !!me && !me.isAlive && gameState.phase !== "game_over";
  if (!status && !spectating) return null;

  const target = status ? gameState.players.find((p) => p.id === status.playerId) : undefined;
  const text = status
    ? status.text + (target && !target.connected ? " (آفلاین است؛ اگه برنگرده از بازی حذف می‌شه)" : "")
    : "";

  if (!animated) {
    return (
      <>
        {status && (
          <Alert severity="info" icon={<CircularProgress size={16} />} sx={{ mb: 2 }}>{text}</Alert>
        )}
        {spectating && <Alert severity="warning" sx={{ mb: 2 }}>شما حذف شدید؛ در حال تماشا هستید.</Alert>}
      </>
    );
  }

  const n = status?.cardCount ?? 0;

  return (
    <Stack spacing={1} sx={{ mb: 2 }}>
      {status && target && (
        <Paper sx={{ p: 2 }}>
          {n > 0 ? (
            <Stack alignItems="center" spacing={1}>
              <Box sx={{ position: "relative", width: RING, height: RING }}>
                <motion.div
                  style={{ position: "absolute", inset: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  {Array.from({ length: n }).map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        position: "absolute", top: "50%", left: "50%", width: 26, height: 36,
                        transform: `translate(-50%, -50%) rotate(${(360 / n) * i}deg) translateY(-${RADIUS}px)`,
                        ...backStyle,
                      }}
                    />
                  ))}
                </motion.div>
                <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                  <AvatarRing src={target.photoUrl} name={target.name} size={52} />
                </Box>
              </Box>
              <Typography variant="body2" textAlign="center">{text}</Typography>
            </Stack>
          ) : (
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1.4, repeat: Infinity }}>
                <AvatarRing src={target.photoUrl} name={target.name} size={36} />
              </motion.div>
              <Typography variant="body2">{text}</Typography>
            </Stack>
          )}
        </Paper>
      )}
      {spectating && (
        <Typography variant="caption" color="text.secondary" textAlign="center">
          شما حذف شدید؛ در حال تماشا هستید.
        </Typography>
      )}
    </Stack>
  );
}