import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { motion, useReducedMotion } from "motion/react";
import ConfettiBurst from "components/confetti/ConfettiBurst";
import { useAssets } from "context/AssetPreloadContext";
import { cardImagePath, SkinSelection } from "shared/cardSkins";
import RoleCardImage from "../proving/RoleCardImage";

export type CardFateKind = "truth" | "bluff" | "sacrificed" | "eliminated";

const LABELS: Record<string, string> = {
  duke: "بزرگ‌زاده", captain: "فرمانده", ambassador: "سفیر",
  princess: "شاهدخت", assassin: "قاتل", contessa: "بازرس",
};

// خط پارگی دندانه‌دار؛ دو چندضلعی دقیقاً روی همین نقاط به هم می‌رسن
const TEAR_LEFT =
  "polygon(0 0, 58% 0, 49% 14%, 56% 28%, 46% 43%, 55% 58%, 45% 72%, 54% 86%, 47% 100%, 0 100%)";
const TEAR_RIGHT =
  "polygon(58% 0, 100% 0, 100% 100%, 47% 100%, 54% 86%, 45% 72%, 55% 58%, 46% 43%, 56% 28%, 49% 14%)";

const FLIP_DONE = 1.5; // ثانیه؛ بعد از پایان چرخش RoleCardImage
const SPLIT_AT: Record<CardFateKind, number | null> = {
  truth: null, bluff: 2.5, sacrificed: 1.8, eliminated: 1.8,
};

interface Props {
  role: string;
  size?: number;
  skins?: SkinSelection;
  fate: CardFateKind;
}

export default function CardFate({ role, size = 130, skins, fate }: Props) {
  const { src } = useAssets();
  const reduce = useReducedMotion();
  const [split, setSplit] = useState(false);
  const splitAt = SPLIT_AT[fate];
  const h = size * 1.4;

  useEffect(() => {
    setSplit(false);
    if (splitAt === null || reduce) return;
    const t = setTimeout(() => setSplit(true), splitAt * 1000);
    return () => clearTimeout(t);
  }, [fate, role, splitAt, reduce]);

  const key = `${fate}-${role}`;
  // truth: شلیک بعد از چرخش؛ بقیه: هم‌زمان با پاره شدن (وقتی split درست می‌شه)
  const trigger: string | false = fate === "truth" ? key : split ? key : false;

  const half = (clip: string, dir: 1 | -1) => (
    <motion.img
      key={dir}
      src={src(cardImagePath(role, skins))}
      alt=""
      draggable={false}
      style={{
        position: "absolute", top: 0, left: 0, width: size, height: h, objectFit: "cover",
        borderRadius: 6, clipPath: clip, WebkitClipPath: clip,
        transformOrigin: dir === -1 ? "30% 100%" : "70% 100%",
      }}
      initial={{ x: 0, y: 0, rotate: 0, opacity: 1, filter: "brightness(1) sepia(0) saturate(1)" }}
      animate={{
        x: [0, dir * 5, dir * size * 0.65],
        y: [0, 0, h * 0.35],
        rotate: [0, dir * 2, dir * 26],
        opacity: [1, 1, 0],
        // کارت اول داغ و نارنجی می‌شه، بعد تیره
        filter: [
          "brightness(1) sepia(0) saturate(1)",
          "brightness(1.5) sepia(1) saturate(5)",
          "brightness(0.25) sepia(1) saturate(5)",
        ],
      }}
      transition={{ duration: 1.25, times: [0, 0.22, 1], ease: "easeIn" }}
    />
  );

  const stamp =
    fate === "truth"
      ? { text: "درسته ✓", color: "#43a047" }
      : fate === "bluff"
      ? { text: "دروغ!", color: "#e53935" }
      : null;

  return (
    <ConfettiBurst
      fire={trigger}
      variant={fate === "truth" ? "gold" : "fire"}
      intensity={fate === "eliminated" ? 2 : 1}
      delayMs={fate === "truth" ? FLIP_DONE * 1000 : 120}
    >
      <Box sx={{ position: "relative", width: size, minHeight: h + 22, mx: "auto" }}>
        {!split ? (
          <motion.div
            animate={fate === "bluff" && !reduce ? { x: [0, -7, 7, -5, 5, 0] } : undefined}
            transition={{ delay: FLIP_DONE + 0.1, duration: 0.4 }}
          >
            <RoleCardImage role={role} size={size} reveal skins={skins} />
          </motion.div>
        ) : (
          <>
            <Box sx={{ position: "relative", width: size, height: h }}>
              {half(TEAR_LEFT, -1)}
              {half(TEAR_RIGHT, 1)}
            </Box>
            <Typography variant="caption" display="block" textAlign="center">
              {LABELS[role] ?? role}
            </Typography>
          </>
        )}

        {stamp && (
          <Box sx={{ position: "absolute", top: 0, left: 0, width: size, height: h, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <motion.div
              initial={reduce ? false : { scale: 3.2, opacity: 0, rotate: -30 }}
              animate={{ scale: 1, opacity: 0.95, rotate: -16 }}
              transition={reduce ? { duration: 0 } : { delay: FLIP_DONE, type: "spring", stiffness: 420, damping: 16 }}
            >
              <Box
                sx={{
                  px: 1.2, py: 0.2, border: "4px solid", borderColor: stamp.color, color: stamp.color,
                  borderRadius: 2, fontWeight: 900, fontSize: size * 0.2, whiteSpace: "nowrap",
                  bgcolor: "rgba(0,0,0,.4)", textShadow: "0 2px 6px rgba(0,0,0,.6)",
                }}
              >
                {stamp.text}
              </Box>
            </motion.div>
          </Box>
        )}
      </Box>
    </ConfettiBurst>
  );
}