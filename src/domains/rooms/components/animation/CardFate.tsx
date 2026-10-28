import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { motion, useReducedMotion } from "motion/react";
import ParticleField, { ParticleFieldHandle } from "components/confetti/ParticleField";
import { useAssets } from "context/AssetPreloadContext";
import { cardImagePath, SkinSelection } from "shared/cardSkins";
import RoleCardImage from "../proving/RoleCardImage";
import BurningCard from "components/confetti/BurningCard";

export type CardFateKind = "truth" | "bluff" | "sacrificed" | "eliminated";

const LABELS: Record<string, string> = {
  duke: "بزرگ‌زاده", captain: "فرمانده", ambassador: "سفیر",
  princess: "شاهدخت", assassin: "قاتل", contessa: "بازرس",
};

const FLIP_DONE = 1.5; // ثانیه؛ بعد از پایان چرخش RoleCardImage
const BURN_AT: Record<CardFateKind, number | null> = { truth: null, bluff: 2.1, sacrificed: 1.7, eliminated: 1.7 };
const BURN_MS = (fate: CardFateKind) => (fate === "eliminated" ? 2200 : 1900);

interface Props { role: string; size?: number; skins?: SkinSelection; fate: CardFateKind }

export default function CardFate({ role, size = 130, skins, fate }: Props) {
  const { src } = useAssets();
  const reduce = useReducedMotion();
  const fieldRef = useRef<ParticleFieldHandle>(null);
  const [burning, setBurning] = useState(false);
  const burnAt = BURN_AT[fate];
  const h = size * 1.4;

  useEffect(() => {
    setBurning(false);
    if (burnAt === null || reduce) return;
    const t = setTimeout(() => setBurning(true), burnAt * 1000);
    return () => clearTimeout(t);
  }, [fate, role, burnAt, reduce]);

  // ذرات طلایی ریز؛ آرام و در طول زمان، نه یک انفجار
  useEffect(() => {
    if (fate !== "truth" || reduce) return;
    let iv: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      iv = setInterval(() => {
        const onSide = Math.random() < 0.6;
        const x = onSide ? (Math.random() < 0.5 ? 0 : size) : Math.random() * size;
        const y = onSide ? Math.random() * h : h;
        fieldRef.current?.emit("gold", x, y, 2);
      }, 80);
    }, FLIP_DONE * 1000);
    const stop = setTimeout(() => iv && clearInterval(iv), (FLIP_DONE + 1.6) * 1000);
    return () => { clearTimeout(start); clearTimeout(stop); if (iv) clearInterval(iv); };
  }, [fate, role, reduce, size, h]);

  const stamp =
    fate === "truth" ? { text: "درسته ✓", color: "#43a047" }
    : fate === "bluff" ? { text: "دروغ!", color: "#e53935" }
    : null;

  return (
    <ParticleField ref={fieldRef} pad={70}>
      <Box sx={{ position: "relative", width: size, minHeight: h + 22, mx: "auto" }}>
        {burning && (
          // نور گرمِ پشت کارت؛ شدتش با سوختن بالا و پایین می‌رود
          <motion.div aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0.6, 0.85, 0.4, 0] }}
            transition={{ duration: BURN_MS(fate) / 1000, ease: "easeInOut" }}
            style={{ position: "absolute", left: -size * 0.4, top: -h * 0.2, width: size * 1.8, height: h * 1.4, pointerEvents: "none",
              background: "radial-gradient(ellipse at 50% 55%, rgba(255,120,30,.55), rgba(255,60,10,.18) 45%, transparent 70%)" }} />
        )}

        {!burning ? (
          <motion.div
            animate={fate === "bluff" && !reduce ? { x: [0, -7, 7, -5, 5, 0] } : undefined}
            transition={{ delay: FLIP_DONE + 0.1, duration: 0.4 }}
          >
            <RoleCardImage role={role} size={size} reveal gloss={fate === "truth"} skins={skins} />
          </motion.div>
        ) : (
          <>
            <BurningCard
              url={src(cardImagePath(role, skins))}
              w={size} h={h}
              intensity={fate === "eliminated" ? 2 : 1}
              durationMs={BURN_MS(fate)}
              onEmit={(kind, x, y) => fieldRef.current?.emit(kind, x, y)}
            />
            <Typography variant="caption" display="block" textAlign="center">{LABELS[role] ?? role}</Typography>
          </>
        )}

        {stamp && (
          <Box sx={{ position: "absolute", top: 0, left: 0, width: size, height: h, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 2 }}>
            <motion.div
              initial={reduce ? false : { scale: 3.2, opacity: 0, rotate: -30 }}
              animate={{ scale: 1, opacity: 0.95, rotate: -16 }}
              transition={reduce ? { duration: 0 } : { delay: FLIP_DONE, type: "spring", stiffness: 420, damping: 16 }}
            >
              <Box sx={{ px: 1.2, py: 0.2, border: "4px solid", borderColor: stamp.color, color: stamp.color, borderRadius: 2, fontWeight: 900, fontSize: size * 0.2, whiteSpace: "nowrap", bgcolor: "rgba(0,0,0,.4)", textShadow: "0 2px 6px rgba(0,0,0,.6)" }}>
                {stamp.text}
              </Box>
            </motion.div>
          </Box>
        )}
      </Box>
    </ParticleField>
  );
}