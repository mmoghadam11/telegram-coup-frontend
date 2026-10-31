import React from "react";
import { Box, Container, Typography, Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button, CircularProgress, Chip } from "@mui/material";
import CountdownBurst from "./animation/CountdownBurst";
import { useCountdown } from "hooks/useCountdown";

interface Player {
  id: string;
  name: string;
  photoUrl: string | null;
  connected: boolean;
}

interface Props {
  roomPhase: "waiting" | "starting";
  players: Player[];
  myUserId: string;
  countdownEndsAt: number | null;
  minPlayers: number;
  maxPlayers: number;
  onLeave: () => void;
}

export default function MatchmakingLobbyView({
  roomPhase, players, myUserId, countdownEndsAt, minPlayers, maxPlayers, onLeave,
}: Props) {
  const secondsLeft = useCountdown(countdownEndsAt);

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Paper sx={{ p: 3, mb: 2, textAlign: "center" }}>
        {roomPhase === "waiting" ? (
          <>
            <CircularProgress size={28} sx={{ mb: 1 }} />
            <Typography variant="body1">
              در انتظار بازیکنان ({players.length} / حداقل {minPlayers})
            </Typography>
          </>
        ) : (
          <>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
              {secondsLeft !== null && <CountdownBurst value={secondsLeft} size={140} />}
            </Box>
            <Typography variant="body2" color="text.secondary">
              بازی به‌زودی شروع می‌شه
            </Typography>
          </>
        )}
      </Paper>

      <Paper variant="outlined" sx={{ mb: 2 }}>
        <List dense>
          {players.map((p) => (
            <ListItem key={p.id}>
              <ListItemAvatar>
                <Avatar src={p.photoUrl || undefined}>{p.name?.[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={`${p.name}${p.id === myUserId ? " (شما)" : ""}`} />
              {p.connected && <Chip size="small" color="success" label="آنلاین" />}
            </ListItem>
          ))}
          {players.length === 0 && (
            <ListItem>
              <ListItemText primary="هنوز کسی وصل نشده" />
            </ListItem>
          )}
        </List>
      </Paper>

      <Typography variant="caption" color="text.secondary" display="block" textAlign="center" sx={{ mb: 2 }}>
        حداکثر {maxPlayers} نفر در هر روم
      </Typography>

      <Button variant="outlined" color="error" fullWidth onClick={onLeave}>
        خروج از صف
      </Button>
    </Container>
  );
}