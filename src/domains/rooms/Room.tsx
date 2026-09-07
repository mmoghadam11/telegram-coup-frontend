import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Typography, Chip, TextField, Button, Paper, Stack, List, ListItem, ListItemText } from "@mui/material";
import { useRoomSocket } from "hooks/useRoomSocket";

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const { connected, players, log, sendChat } = useRoomSocket(roomId);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    sendChat(input);
    setInput("");
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6">روم: {roomId}</Typography>
        <Chip
          size="small"
          color={connected ? "success" : "default"}
          label={connected ? "متصل" : "در حال اتصال..."}
        />
      </Stack>

      {/* لیست بازیکن‌های وصل‌شده به این روم */}
      <Paper variant="outlined" sx={{ mb: 2 }}>
        <List dense>
          {players.length === 0 && (
            <ListItem>
              <ListItemText primary="هنوز بازیکنی وصل نشده" />
            </ListItem>
          )}
          {players.map((p) => (
            <ListItem key={p.userId}>
              <ListItemText primary={p.firstName} />
              <Chip size="small" color={p.connected ? "success" : "default"} label={p.connected ? "آنلاین" : "آفلاین"} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* ورودی چت تستی */}
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="یه پیام بنویس"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button variant="contained" onClick={handleSend} disabled={!connected}>
          ارسال
        </Button>
      </Stack>

      {/* تاریخچه‌ی چت */}
      <Paper variant="outlined" sx={{ p: 1, maxHeight: 300, overflowY: "auto" }}>
        {log.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
            هنوز پیامی نیومده
          </Typography>
        )}
        {log.map((line, i) => (
          <Typography key={i} variant="body2" sx={{ p: 0.5 }}>
            {line}
          </Typography>
        ))}
      </Paper>
    </Container>
  );
}