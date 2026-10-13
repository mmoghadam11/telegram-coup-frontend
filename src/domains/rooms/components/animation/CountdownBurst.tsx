import React from "react";
import { Box } from "@mui/material";
import { motion } from "motion/react";

interface Props {
  value: number;
  size?: number;
}

// ✅ تنظیمات هر دایره: جهت پرتاب، تأخیر، اندازه‌ی اولیه، رنگ
const RINGS = [
  // دایره‌ی اصلی (وسط، بزرگ)
  { dx: 0, dy: 0, delay: 0, startScale: 0.4, color: "#ffffff", edge: "#8b4513" },
  // چهار دایره‌ی اطراف که به بیرون پخش می‌شن
  { dx: -30, dy: -20, delay: 0.02, startScale: 0.5, color: "#fff8e6", edge: "#c97f1a" },
  { dx: 30, dy: -20, delay: 0.04, startScale: 0.5, color: "#fff8e6", edge: "#c97f1a" },
  { dx: -30, dy: 20, delay: 0.06, startScale: 0.5, color: "#fff8e6", edge: "#c97f1a" },
  { dx: 30, dy: 20, delay: 0.08, startScale: 0.5, color: "#fff8e6", edge: "#c97f1a" },
  // دایره‌های کوچیک‌تر برای حس دود
  { dx: -50, dy: 0, delay: 0.1, startScale: 0.35, color: "#f5d28a", edge: "#8b4513" },
  { dx: 50, dy: 0, delay: 0.12, startScale: 0.35, color: "#f5d28a", edge: "#8b4513" },
  { dx: 0, dy: -45, delay: 0.14, startScale: 0.35, color: "#f5d28a", edge: "#8b4513" },
  { dx: 0, dy: 45, delay: 0.16, startScale: 0.35, color: "#f5d28a", edge: "#8b4513" },
];

export default function CountdownBurst({ value, size = 160 }: Props) {
  return (
    <Box
      sx={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* ✅ همه‌ی دایره‌ها با key={value} → هر ثانیه از نو mount می‌شن */}
      {RINGS.map((ring, idx) => (
        <motion.div
          key={`${value}-${idx}`}
          initial={{
            x: 0,
            y: 0,
            scale: ring.startScale,
            opacity: 0,
          }}
          animate={{
            x: [0, ring.dx],
            y: [0, ring.dy],
            scale: [ring.startScale, 1.15, 1],
            opacity: [0, 0.95, 0.85],
          }}
          transition={{
            duration: 0.75,
            delay: ring.delay,
            times: [0, 0.5, 1],
            ease: [0.22, 1, 0.36, 1], // easeOut
          }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            // ✅ گرادیانت شعاعی: مرکز سفید، لبه نارنجی-قهوه‌ای
            background: `radial-gradient(
              circle at 50% 45%,
              ${ring.color} 0%,
              #fff8e6 30%,
              #f5d28a 55%,
              #e0a52f 75%,
              ${ring.edge} 100%
            )`,
            boxShadow: `
              0 0 18px rgba(224, 165, 47, 0.45),
              inset 0 -4px 8px rgba(139, 69, 19, 0.25),
              inset 0 3px 6px rgba(255, 255, 255, 0.65)
            `,
            // برای اینکه دایره‌های کوچیک‌تر پشت دایره‌ی اصلی نباشن
            zIndex: idx === 0 ? 10 : 1,
            // هر دایره با نسبت اندازه‌ی خودش
            transform: `scale(${1 - idx * 0.03})`,
          }}
        />
      ))}

      {/* ✅ حلقه‌ی موجی که به بیرون می‌پاشه */}
      <motion.div
        key={`ring-${value}`}
        initial={{ scale: 0.6, opacity: 0.9 }}
        animate={{ scale: 1.8, opacity: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "3px solid rgba(224, 165, 47, 0.7)",
          pointerEvents: "none",
          zIndex: 20,
        }}
      />

      {/* ✅ ذرات دود که به بیرون می‌پاشن */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const dist = 55;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        return (
          <motion.div
            key={`particle-${value}-${i}`}
            initial={{ x: 0, y: 0, scale: 0.4, opacity: 0.7 }}
            animate={{ x: dx, y: dy, scale: 0, opacity: 0 }}
            transition={{
              duration: 0.75,
              delay: 0.05 + i * 0.02,
              ease: "easeOut",
            }}
            style={{
              position: "absolute",
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: `radial-gradient(circle,
                rgba(255, 240, 200, 0.9) 0%,
                rgba(224, 165, 47, 0.5) 60%,
                transparent 100%)`,
              zIndex: 5,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* ✅ عدد وسط */}
      <Box
        sx={{
          position: "relative",
          zIndex: 30,
          fontSize: size * 0.38,
          fontWeight: 900,
          color: "#3a1f0a",
          lineHeight: 1,
          textShadow: "0 1px 0 rgba(255,255,255,.6), 0 0 12px rgba(224,165,47,.5)",
          userSelect: "none",
        }}
      >
        {value}
      </Box>
    </Box>
  );
}