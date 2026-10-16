import React from "react";
import { Chip, List, ListItem, ListItemText, Paper, Stack } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

const ROLE_LABELS_FA: Record<string, string> = {
  duke: "بزرگ‌زاده", captain: "فرمانده", ambassador: "سفیر",
  princess: "شاهدخت", assassin: "قاتل", contessa: "بازرس",
};

interface P {
  id: string; name: string; connected: boolean; coins: number;
  roleCount: number; revealedRoles: string[]; isAlive: boolean;
}

export default function TextPlayersList({ players, myUserId, currentTurnPlayerId }: {
  players: P[]; myUserId: string; currentTurnPlayerId?: string;
}) {
  return (
    <Paper variant="outlined" sx={{ mb: 2 }}>
      <List dense>
        {players.map((p) => (
          <ListItem key={p.id} sx={{ opacity: p.isAlive ? 1 : 0.5 }}>
            <ListItemText
              primary={
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <span>{p.name} {p.id === myUserId ? "(شما)" : ""} {!p.isAlive ? "☠️" : ""}</span>
                  {p.connected && <CheckCircle sx={{ fontSize: 14, color: "success.main" }} />}
                </Stack>
              }
              secondary={
                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                  <span>سکه: {p.coins} · کارت باقی: {p.roleCount}</span>
                  {p.revealedRoles.map((r, i) => (
                    <Chip key={i} size="small" variant="outlined" label={ROLE_LABELS_FA[r] ?? r} sx={{ height: 18 }} />
                  ))}
                </Stack>
              }
            />
            {currentTurnPlayerId === p.id && p.isAlive && <Chip size="small" color="secondary" label="نوبت" />}
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}