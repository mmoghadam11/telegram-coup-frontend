import React from "react";
import { LinearProgress, Typography, Box } from "@mui/material";
import { useCountdown } from "hooks/useCountdown";

export default function PhaseTimer({ deadlineAt, totalMs, label }: { deadlineAt?: number | null; totalMs?: number | null; label: string }) {
  const left = useCountdown(deadlineAt);
  if (left == null || !totalMs) return null;
  return (
    <Box sx={{ mb: 1 }}>
      <LinearProgress variant="determinate" color={left <= 5 ? "error" : "primary"} value={Math.min(100, (left * 1000 * 100) / totalMs)} />
      <Typography variant="caption" color="text.secondary">{label} · {left} ثانیه</Typography>
    </Box>
  );
}