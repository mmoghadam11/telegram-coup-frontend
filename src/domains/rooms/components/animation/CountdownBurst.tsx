import React from "react";
import { Box } from "@mui/material";
import { motion } from "motion/react";

interface Props {
  value: number;
  size?: number;
}

// ✅ شبه‌رندوم ساده — بر اساس value و index، ولی توی یه ثانیه ثابت می‌مونه
function seeded(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x); // عدد بین 0 و 1
}

export default function CountdownBurst({ value, size = 140 }: Props) {
  // ✅ ۹ تا دایره با جهت‌ها و اندازه‌های نامنظم
  const rings = Array.from({ length: 9 }).map((_, i) => {
    const r1 = seeded(value * 17 + i * 3);
    const r2 = seeded(value * 23 + i * 7);
    const r3 = seeded(value * 31 + i * 11);

    // زاویه‌ی تصادفی (نه متقارن)
    const angle = r1 * Math.PI * 2;
    // فاصله‌ی تصادفی از مرکز
    const dist = 15 + r2 * 35;
    // اندازه‌ی اولیه‌ی تصادفی
    const startScale = 0.25 + r3 * 0.25;
    // تأخیر تصادفی
    const delay = r1 * 0.15;

    return {
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
      startScale,
      delay,
      // رنگ: ترکیبی از سفید-طلایی-نارنجی
      hue: r2 > 0.5 ? "#fff8e6" : "#f5d28a",
      edge: r2 > 0.7 ? "#8b4513" : "#c97f1a",
    };
  });

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
      {/* ✅ دایره‌ها — هر کدوم جای تصادفی می‌ره، اندازه‌ی کوچیک‌تر */}
      {rings.map((ring, idx) => (
        <motion.div
          key={`${value}-${idx}`}
          initial={{
            x: 0,
            y: 0,
            scale: ring.startScale * 0.5,
            opacity: 0,
          }}
          animate={{
            x: [0, ring.dx * 0.6, ring.dx],
            y: [0, ring.dy * 0.6, ring.dy],
            scale: [ring.startScale * 0.5, ring.startScale * 1.1, ring.startScale * 0.95],
            opacity: [0, 0.85, 0.7],
          }}
          transition={{
            duration: 0.65,
            delay: ring.delay,
            times: [0, 0.45, 1],
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            position: "absolute",
            width: size * 0.55,     // ✅ کوچیک‌تر از قبل
            height: size * 0.55,
            borderRadius: "50%",
            background: `radial-gradient(
              circle at 50% 45%,
              #ffffff 0%,
              ${ring.hue} 35%,
              #f5d28a 60%,
              #e0a52f 80%,
              ${ring.edge} 100%
            )`,
            boxShadow: `
              0 0 10px rgba(224, 165, 47, 0.35),
              inset 0 -2px 5px rgba(139, 69, 19, 0.25),
              inset 0 2px 4px rgba(255, 255, 255, 0.6)
            `,
            zIndex: idx,
          }}
        />
      ))}

      {/* ✅ حلقه‌ی موج — کوچیک‌تر */}
      <motion.div
        key={`ring-${value}`}
        initial={{ scale: 0.5, opacity: 0.7 }}
        animate={{ scale: 1.15, opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{
          position: "absolute",
          width: size * 0.7,
          height: size * 0.7,
          borderRadius: "50%",
          border: "2px solid rgba(224, 165, 47, 0.6)",
          pointerEvents: "none",
          zIndex: 20,
        }}
      />

      {/* ✅ ذرات دود کوچیک که نامنظم پخش می‌شن */}
      {Array.from({ length: 10 }).map((_, i) => {
        const r1 = seeded(value * 41 + i * 5);
        const r2 = seeded(value * 53 + i * 9);
        const angle = r1 * Math.PI * 2;
        const dist = 25 + r2 * 30;

        return (
          <motion.div
            key={`particle-${value}-${i}`}
            initial={{ x: 0, y: 0, scale: 0.3, opacity: 0.8 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              scale: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.55,
              delay: r1 * 0.1,
              ease: "easeOut",
            }}
            style={{
              position: "absolute",
              width: 8,        // ✅ کوچیک‌تر
              height: 8,
              borderRadius: "50%",
              background: `radial-gradient(circle,
                rgba(255, 240, 200, 0.95) 0%,
                rgba(224, 165, 47, 0.4) 60%,
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