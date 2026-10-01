import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button, CircularProgress, Chip } from "@mui/material";

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
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!countdownEndsAt) {
      setSecondsLeft(null);
      return;
    }
    const tick = () => {
      const diff = Math.max(0, Math.ceil((countdownEndsAt - Date.now()) / 1000));
      setSecondsLeft(diff);
    };
    tick();
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [countdownEndsAt]);

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
            <Typography variant="h3" fontWeight="bold" color="warning.main">
              {secondsLeft ?? "..."}
            </Typography>
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