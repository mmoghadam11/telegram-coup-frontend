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

interface Item { s: string; img?: string; left: string; top: string; size: number; rate: number; rot: number; dur: number }

const SUITS: Item[] = [
  { s: "🏆", /* img: "/assets/images/decor/trophy.webp", */ left: "8%", top: "14%", size: 64, rate: -0.15, rot: -12, dur: 7 },
  { s: "💰", /* img: "/assets/images/decor/coins.webp", */ left: "80%", top: "20%", size: 54, rate: -0.28, rot: 10, dur: 8 },
  { s: "🕹", /* img: "/assets/images/decor/joystick.webp", */ left: "68%", top: "58%", size: 84, rate: -0.4, rot: -8, dur: 9 },
  { s: "🎮", /* img: "/assets/images/decor/gamepad.webp", */ left: "12%", top: "64%", size: 72, rate: -0.22, rot: 14, dur: 7.5 },
  { s: "♛", /* img: "/assets/images/decor/crown.webp", */ left: "44%", top: "38%", size: 120, rate: -0.1, rot: 0, dur: 10 },
];

export default function ParallaxBackdrop({ scrollY, reduce }: { scrollY: MotionValue<number>; reduce: boolean }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const k = reduce ? 0 : 1;
  const gold = "#e0a52f";

  // لایت: ایموجی کم‌رنگ‌تر و خاکستری‌تر تا روی زمینه‌ی روشن شلوغ نشه
  const decoOpacity = isDark ? 0.2 : 0.13;
  const decoFilter = isDark ? "none" : "saturate(0.7)";

  return (
    // fixed + overflow hidden: نه اسکرول افقی می‌سازه، نه روی کلیک‌ها اثر می‌ذاره
    <Box aria-hidden sx={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <Layer scrollY={scrollY} rate={-0.12 * k} style={{ top: "-8%", left: "-20%", width: "70vw", height: "70vw" }}>
        <Box sx={{ width: "100%", height: "100%", borderRadius: "50%", background: `radial-gradient(circle, ${alpha(gold, isDark ? 0.22 : 0.3)}, transparent 65%)` }} />
      </Layer>
      <Layer scrollY={scrollY} rate={-0.3 * k} style={{ bottom: "-15%", right: "-25%", width: "80vw", height: "80vw" }}>
        <Box sx={{ width: "100%", height: "100%", borderRadius: "50%", background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, isDark ? 0.2 : 0.14)}, transparent 65%)` }} />
      </Layer>

      {SUITS.map((it) => (
        <Layer key={it.s} scrollY={scrollY} rate={it.rate * k} style={{ left: it.left, top: it.top }}>
          <motion.div
            animate={reduce ? undefined : { y: [0, -14, 0], rotate: [it.rot, it.rot + 7, it.rot] }}
            transition={{ duration: it.dur, repeat: Infinity, ease: "easeInOut" }}
            style={{ fontSize: it.size, lineHeight: 1, userSelect: "none", opacity: decoOpacity, filter: decoFilter, color: theme.palette.text.primary }}
          >
            {it.img ? <img src={it.img} alt="" draggable={false} style={{ width: it.size, height: it.size, objectFit: "contain", display: "block" }} /> : it.s}
          </motion.div>
        </Layer>
      ))}
    </Box>
  );
}