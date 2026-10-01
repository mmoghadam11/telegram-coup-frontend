import React, { useEffect, useState } from "react";
import { Box, Typography, Paper } from "@mui/material";

interface Props {
  winnerName?: string;
  handResultEndsAt: number | null;
}

export default function HandResultOverlay({ winnerName, handResultEndsAt }: Props) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!handResultEndsAt) return;
    const tick = () => setSecondsLeft(Math.max(0, Math.ceil((handResultEndsAt - Date.now()) / 1000)));
    tick();
    const interval = setInterval(tick, 250);
    return () => clearInterval(interval);
  }, [handResultEndsAt]);

  return (
    <Box
      sx={{
        position: "fixed", inset: 0, bgcolor: "rgba(0,0,0,.75)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1300,
      }}
    >
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          🏆 {winnerName || "-"} برنده‌ی این دست شد!
        </Typography>
        <Typography variant="body2" color="text.secondary">
          دست بعدی تا {secondsLeft ?? "..."} ثانیه‌ی دیگه شروع می‌شه
        </Typography>
      </Paper>
    </Box>
  );
}