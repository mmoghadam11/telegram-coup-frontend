import React from "react";
import { Avatar, Box, Button, Chip, CircularProgress, Container, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { motion } from "motion/react";
import CountdownBurst from "./animation/CountdownBurst";
import { useCountdown } from "hooks/useCountdown";
import { readyQuorum } from "../constants/matchmaking";

interface Player { id: string; name: string; photoUrl: string | null; connected: boolean; ready?: boolean }

interface Props {
  roomPhase: "waiting" | "starting";
  players: Player[];
  myUserId: string;
  countdownEndsAt: number | null;
  minPlayers: number;
  maxPlayers: number;
  onLeave: () => void;
  roomName?: string | null;
  readyMode?: boolean;                    // لابی و گروه
  onToggleReady?: (ready: boolean) => void;
}

export default function MatchmakingLobbyView({
  roomPhase, players, myUserId, countdownEndsAt, minPlayers, maxPlayers, onLeave, roomName, readyMode, onToggleReady,
}: Props) {
  const secondsLeft = useCountdown(countdownEndsAt);
  const online = players.filter((p) => p.connected);
  const readyCount = online.filter((p) => p.ready).length;
  const target = readyMode ? readyQuorum(online.length) : minPlayers;
  const current = readyMode ? readyCount : online.length;
  const me = players.find((p) => p.id === myUserId);

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      {roomName && <Typography variant="h6" fontWeight={800} textAlign="center" sx={{ mb: 1.5 }}>{roomName}</Typography>}

      <Paper sx={{ p: 3, mb: 2, textAlign: "center", borderRadius: 3 }}>
        {roomPhase === "waiting" ? (
          <>
            <CircularProgress size={26} sx={{ mb: 1 }} />
            <Typography fontWeight={700}>
              {readyMode ? `${readyCount} نفر آماده‌اند` : `${online.length} بازیکن در صف`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {readyMode ? `برای شروع حداقل ${target} نفر آماده لازم است` : `برای شروع حداقل ${minPlayers} نفر لازم است`}
            </Typography>
            <LinearProgress variant="determinate" value={Math.min(100, (current / target) * 100)} sx={{ mt: 1.5, height: 6, borderRadius: 3 }} />
          </>
        ) : (
          <>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
              {secondsLeft !== null && <CountdownBurst value={secondsLeft} size={140} />}
            </Box>
            <Typography variant="body2" color="text.secondary">
              {readyMode ? "کسی که آماده نباشد در شروع از میز خارج می‌شود" : "بازی به‌زودی شروع می‌شه"}
            </Typography>
          </>
        )}
      </Paper>

      <Stack spacing={1} sx={{ mb: 2 }}>
        {players.map((p) => {
          const color = !p.connected ? "#9e9e9e" : readyMode ? (p.ready ? "#43a047" : "#ffb300") : "#43a047";
          return (
            <motion.div key={p.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <Paper variant="outlined" sx={{ p: 1, borderRadius: 3, display: "flex", alignItems: "center", gap: 1.25 }}>
                <Box sx={{ p: "2px", borderRadius: "50%", border: `2px solid ${color}` }}>
                  <Avatar src={p.photoUrl || undefined} imgProps={{ referrerPolicy: "no-referrer" }} sx={{ width: 36, height: 36 }}>{p.name?.[0]}</Avatar>
                </Box>
                <Typography sx={{ flex: 1 }} noWrap>{p.name}{p.id === myUserId ? " (شما)" : ""}</Typography>
                {!p.connected
                  ? <Chip size="small" color="warning" label="آفلاین" />
                  : readyMode && <Chip size="small" color={p.ready ? "success" : "default"} label={p.ready ? "آماده" : "منتظر"} />}
              </Paper>
            </motion.div>
          );
        })}
      </Stack>

      <Typography variant="caption" color="text.secondary" display="block" textAlign="center" sx={{ mb: 2 }}>
        حداکثر {maxPlayers} نفر در هر روم
      </Typography>

      {readyMode && onToggleReady && (
        <Button fullWidth size="large" variant={me?.ready ? "outlined" : "contained"} sx={{ mb: 1, borderRadius: 2 }}
          onClick={() => onToggleReady(!me?.ready)}>
          {me?.ready ? "هنوز آماده نیستم" : "آماده‌ام"}
        </Button>
      )}
      <Button variant="outlined" color="error" fullWidth sx={{ borderRadius: 2 }} onClick={onLeave}>خروج از میز</Button>
    </Container>
  );
}