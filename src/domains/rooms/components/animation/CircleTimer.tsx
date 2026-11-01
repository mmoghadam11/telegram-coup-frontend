import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { motion } from "motion/react";
import { useCountdown } from "hooks/useCountdown";

interface Props {
  deadlineAt?: number | null;
  totalMs?: number | null;
  label: string;          // فقط برای دسترس‌پذیری و tooltip
  size?: number;
}

export default function CircleTimer({ deadlineAt, totalMs, label, size = 40 }: Props) {
  const left = useCountdown(deadlineAt);
  if (left == null || !totalMs) return null;

  const urgent = left <= 5;
  const pct = Math.min(100, (left * 1000 * 100) / totalMs);

  return (
    <motion.div
      role="timer" aria-label={`${label}: ${left} ثانیه`} title={label}
      animate={urgent ? { scale: [1, 1.08, 1] } : { scale: 1 }}
      transition={urgent ? { duration: 1, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
      style={{ position: "relative", width: size, height: size, flexShrink: 0 }}
    >
      {/* حلقه‌ی پس‌زمینه */}
      <CircularProgress variant="determinate" value={100} size={size} thickness={4}
        sx={{ position: "absolute", color: "action.disabledBackground" }} />
      {/* حلقه‌ی باقی‌مانده؛ transition کوتاه تا حرکت نرم و بدون پرش باشد */}
      <CircularProgress variant="determinate" value={pct} size={size} thickness={4}
        color={urgent ? "error" : "primary"}
        sx={{ position: "absolute", "& .MuiCircularProgress-circle": { transition: "stroke-dashoffset .3s linear" } }} />
      <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="caption" fontWeight={800} color={urgent ? "error.main" : "text.primary"} sx={{ fontSize: size * 0.34, lineHeight: 1 }}>
          {left}
        </Typography>
      </Box>
    </motion.div>
  );
}