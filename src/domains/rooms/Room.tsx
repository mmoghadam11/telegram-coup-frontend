import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box, Container, Typography, Chip, TextField, Button, Paper,
  Stack, List, ListItem, ListItemText, CircularProgress,
} from "@mui/material";
import { useAuth } from "hooks/useAuth";
import { useRoomSocket } from "hooks/useRoomSocket";

const ROLE_LABELS_FA: Record<string, string> = {
  duke: "بزرگ‌زاده",
  captain: "فرمانده",
  ambassador: "سفیر",
  princess: "شاهدخت",
  assassin: "قاتل",
  contessa: "بازرس",
};

export default function Room() {
  const Auth = useAuth();
  const { roomId } = useParams<{ roomId: string }>();
  const { connected, loaded, gameState, privateState, startGame, sendChat } = useRoomSocket(roomId);
  const [input, setInput] = useState("");

  if (!connected || !loaded || !gameState) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  const myUserId = String(Auth?.userInfo?.id);
  const isMyTurn = gameState.turnOrder[gameState.currentTurnIndex] === myUserId;

  const handleSend = () => {
    if (!input.trim()) return;
    sendChat(input);
    setInput("");
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">روم: {roomId}</Typography>
        <Chip size="small" color="success" label="متصل" />
      </Stack>

      {gameState.phase === "waiting_for_players" && gameState.creatorId === myUserId &&(
        <Button variant="contained" fullWidth sx={{ mb: 2 }} onClick={startGame}>
          شروع بازی ({gameState.players.length} بازیکن)
        </Button>
      )}

      {gameState.phase !== "waiting_for_players" && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>کارت‌های شما</Typography>
          <Stack direction="row" spacing={1}>
            {privateState?.yourRoles.map((role, i) => (
              <Chip
                key={i}
                label={ROLE_LABELS_FA[role] || role}
                color={privateState.yourRevealed[i] ? "default" : "primary"}
                variant={privateState.yourRevealed[i] ? "outlined" : "filled"}
              />
            ))}
          </Stack>
        </Paper>
      )}

      <Paper variant="outlined" sx={{ mb: 2 }}>
        <List dense>
          {gameState.players.map((p) => (
            <ListItem key={p.id}>
              <ListItemText
                primary={`${p.name} ${p.id === myUserId ? "(شما)" : ""}`}
                secondary={`سکه: ${p.coins} · کارت: ${p.roleCount}`}
              />
              {gameState.turnOrder[gameState.currentTurnIndex] === p.id && (
                <Chip size="small" color="secondary" label="نوبت" />
              )}
              <Chip size="small" color={p.connected ? "success" : "default"} label={p.connected ? "آنلاین" : "آفلاین"} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <TextField
          fullWidth size="small" value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="یه پیام بنویس"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button variant="contained" onClick={handleSend}>ارسال</Button>
      </Stack>

      <Paper variant="outlined" sx={{ p: 1, maxHeight: 250, overflowY: "auto" }}>
        {gameState.log.map((line, i) => (
          <Typography key={i} variant="body2" sx={{ p: 0.5 }}>{line}</Typography>
        ))}
      </Paper>
    </Container>
  );
}