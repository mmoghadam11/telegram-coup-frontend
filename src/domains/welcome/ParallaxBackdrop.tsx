import React from "react";
import { Box, alpha, useTheme } from "@mui/material";
import { motion, MotionValue, useTransform } from "motion/react";

function Layer({ scrollY, rate, style, children }: {
  scrollY: MotionValue<number>; rate: number; style: React.CSSProperties; children: React.ReactNode;
}) {
  // rate منفی = با اسکرول به بالا می‌ره؛ عدد بزرگ‌تر = «نزدیک‌تر» به بیننده
  const y = useTransform(scrollY, (v) => v * rate);
  return <motion.div style={{ position: "absolute", y, willChange: "transform", ...style }}>{children}</motion.div>;
}

const SUITS = [
  { s: "🏆", left: "8%", top: "14%", size: 64, rate: -0.15, rot: -12, dur: 7, red: false },
  { s: "💰", left: "80%", top: "20%", size: 54, rate: -0.28, rot: 10, dur: 8, red: true },
  { s: "🕹", left: "68%", top: "58%", size: 84, rate: -0.4, rot: -8, dur: 9, red: true },
  { s: "🎮", left: "12%", top: "64%", size: 72, rate: -0.22, rot: 14, dur: 7.5, red: false },
  { s: "♛", left: "44%", top: "38%", size: 120, rate: -0.1, rot: 0, dur: 10, red: false },
];

export default function ParallaxBackdrop({ scrollY, reduce }: { scrollY: MotionValue<number>; reduce: boolean }) {
  const theme = useTheme();
  const k = reduce ? 0 : 1;
  const gold = "#e0a52f";

  return (
    // fixed + overflow hidden: نه اسکرول افقی می‌سازه، نه روی کلیک‌ها اثر می‌ذاره
    <Box aria-hidden sx={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <Layer scrollY={scrollY} rate={-0.12 * k} style={{ top: "-8%", left: "-20%", width: "70vw", height: "70vw" }}>
        <Box sx={{ width: "100%", height: "100%", borderRadius: "50%", background: `radial-gradient(circle, ${alpha(gold, 0.22)}, transparent 65%)` }} />
      </Layer>
      <Layer scrollY={scrollY} rate={-0.3 * k} style={{ bottom: "-15%", right: "-25%", width: "80vw", height: "80vw" }}>
        <Box sx={{ width: "100%", height: "100%", borderRadius: "50%", background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)}, transparent 65%)` }} />
      </Layer>

      {SUITS.map((it) => (
        <Layer key={it.s} scrollY={scrollY} rate={it.rate * k} style={{ left: it.left, top: it.top }}>
          <motion.div
            animate={reduce ? undefined : { y: [0, -14, 0], rotate: [it.rot, it.rot + 7, it.rot] }}
            transition={{ duration: it.dur, repeat: Infinity, ease: "easeInOut" }}
            style={{
              fontSize: it.size, lineHeight: 1, userSelect: "none",
              color: it.red ? alpha("#e53935", 0.13) : alpha(theme.palette.text.primary, 0.08),
            }}
          >
            {it.s}
          </motion.div>
        </Layer>
      ))}
    </Box>
  );
}