// components/WaitingRoomPanel.tsx
import React from "react";
import { Avatar, Chip, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from "@mui/material";

interface P { id: string; name: string; photoUrl: string | null; connected: boolean }

export default function WaitingRoomPanel({ players, creatorId, myUserId }: {
  players: P[]; creatorId: string | null; myUserId: string;
}) {
  const isCreator = creatorId === myUserId;
  const creatorName = players.find((p) => p.id === creatorId)?.name ?? "سازنده";
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Typography variant="body2" textAlign="center" sx={{ mb: 1 }}>
        {isCreator
          ? players.length < 2 ? "حداقل ۲ بازیکن لازمه؛ منتظر ورود بقیه..." : "هر وقت آماده بودید بازی رو شروع کنید"
          : `منتظر شروع بازی توسط ${creatorName}...`}
      </Typography>
      <List dense>
        {players.map((p) => (
          <ListItem key={p.id}>
            <ListItemAvatar>
              <Avatar src={p.photoUrl || undefined} imgProps={{ referrerPolicy: "no-referrer" }}>{p.name?.[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={`${p.name}${p.id === myUserId ? " (شما)" : ""}`} />
            {p.connected && <Chip size="small" color="success" label="آنلاین" />}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}