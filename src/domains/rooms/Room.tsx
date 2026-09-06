import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Typography, Chip, TextField, Button, Paper, Stack } from "@mui/material";
import { useRoomSocket } from "hooks/useRoomSocket";

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const { connected, messages, send } = useRoomSocket(roomId);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    send({ text: input });
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

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="یه پیام تستی بنویس"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button variant="contained" onClick={handleSend} disabled={!connected}>
          ارسال
        </Button>
      </Stack>

      <Paper variant="outlined" sx={{ p: 1, maxHeight: 300, overflowY: "auto" }}>
        {messages.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
            هنوز پیامی نیومده
          </Typography>
        )}
        {messages.map((msg, i) => (
          <Typography key={i} variant="body2" sx={{ p: 0.5, direction: "ltr", textAlign: "left" }}>
            {msg}
          </Typography>
        ))}
      </Paper>
    </Container>
  );
}