import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, Typography, Stack, Box } from "@mui/material";
import { motion } from "motion/react";
import RoleCardImage from "./proving/RoleCardImage";

const CARD_W = 78;
const CARD_H = 109;
const LAYERS = 10;   // تعداد لایه‌های دسته
const GAP = 2.5;     // ضخامت هر کارت
const CARD_BACK_IMAGE = "/assets/images/cards/backCard.png";

type Phase = "riffle" | "tuck" | "draw" | "show";

export function CardBack({ w = CARD_W }: { w?: number }) {
  return (
    <Box
      sx={{
        width: w,
        height: w * (CARD_H / CARD_W),
        boxSizing: "border-box",
        borderRadius: "8px",
        border: "3px solid #f3e3c3",
        backgroundColor: "#d9573f",
        // اگه عکس نبود، طرح CSS جایگزین می‌شه
        backgroundImage: `url(${CARD_BACK_IMAGE}), radial-gradient(ellipse at center, #a8232b 0 28%, #d9573f 30% 100%)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "0 1px 0 #8a4a2a, 0 2px 0 #6b3a1f",
      }}
    />
  );
}

const layer: React.CSSProperties = { position: "absolute", inset: 0, transformStyle: "preserve-3d" };

interface Props {
  open: boolean;
  endsAt?: number;
  playerName: string;
  isMe: boolean;
  newRole?: string;  // فقط برای خود بازیکن پر می‌شه
  shuffle?: boolean; // true: بُر می‌خوره، false: کارت زیر دسته می‌ره
}

export default function ReplacementDialog({ open, endsAt, playerName, isMe, newRole, shuffle = false }: Props) {
  const [phase, setPhase] = useState<Phase>(shuffle ? "riffle" : "tuck");

  useEffect(() => {
    if (!open) return;
    setPhase(shuffle ? "riffle" : "tuck");
    const drawAt = shuffle ? 2200 : 1900;
    const t1 = setTimeout(() => setPhase("draw"), drawAt);
    const t2 = setTimeout(() => setPhase("show"), drawAt + 1100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [open, endsAt, shuffle]);

  if (!open) return null;

  const caption =
    phase === "riffle" ? "دسته در حال بُر خوردنه..."
    : phase === "tuck" ? `${playerName} کارتش رو زیر دسته می‌ذاره...`
    : phase === "draw" ? "کارت رویی دسته برداشته می‌شه..."
    : isMe ? "کارت جدید شما" : `یک کارت جدید به ${playerName} داده شد`;

  return (
    <Dialog open disableEscapeKeyDown PaperProps={{ sx: { bgcolor: "#1a120b" } }}>
      <DialogContent>
        <Stack alignItems="center" spacing={1} sx={{ minWidth: 280, minHeight: 300 }}>
          <Typography variant="subtitle1" textAlign="center">{caption}</Typography>

          {phase !== "show" ? (
            <Box key={endsAt} sx={{ perspective: 900, height: 240, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <motion.div
                style={{ position: "relative", width: CARD_W, height: CARD_H, transformStyle: "preserve-3d", rotateX: 58, rotateZ: 38 }}
              >
                {/* کارتی که زیر دسته می‌ره (فقط حالت بدون بُر) */}
                {!shuffle && (
                  <motion.div
                    style={layer}
                    initial={{ y: CARD_H * 1.7, z: -GAP * 2 }}
                    animate={phase === "tuck" ? { y: [CARD_H * 1.7, CARD_H * 1.7, 0, 0] } : { y: 0 }}
                    transition={{ duration: 1.9, times: [0, 0.28, 0.72, 1], ease: "easeInOut" }}
                  >
                    <CardBack />
                  </motion.div>
                )}

                {/* خود دسته؛ توی tuck بالا می‌ره و بعد روی کارت زیرین می‌شینه */}
                <motion.div
                  style={layer}
                  animate={phase === "tuck" ? { z: [0, 45, 45, 0] } : { z: 0 }}
                  transition={{ duration: 1.9, times: [0, 0.28, 0.72, 1], ease: "easeInOut" }}
                >
                  {Array.from({ length: LAYERS }).map((_, i) => {
                    const isTop = i === LAYERS - 1;
                    const side = i < LAYERS / 2 ? -1 : 1;
                    const baseZ = i * GAP;

                    let animate: any = { x: 0, y: 0, z: baseZ, rotateZ: 0, opacity: 1 };
                    let transition: any = { duration: 0.3 };

                    if (phase === "riffle") {
                      animate = {
                        x: [0, side * CARD_W * 0.85, side * CARD_W * 0.85, 0],
                        rotateZ: [0, side * 7, side * 7, 0],
                        y: [0, 0, 0, 0],
                        z: baseZ,
                      };
                      // با تأخیر وابسته به i، کارت‌های دو نیمه یکی‌درمیون برمی‌گردن
                      transition = { duration: 2.1, times: [0, 0.3, 0.45 + (i % 5) * 0.08, 1], ease: "easeInOut", delay: (i % 3) * 0.03 };
                    } else if (phase === "draw" && isTop) {
                      animate = { x: 0, y: CARD_H * 0.9, z: baseZ + 90, rotateZ: 0, opacity: 1 };
                      transition = { duration: 1, ease: "easeInOut" };
                    }
                    // کارت رویی بعد از برداشتن، توی show اصلاً رندر نمی‌شه (کل صحنه عوض می‌شه)

                    return (
                      <motion.div key={i} style={layer} initial={{ x: 0, y: 0, z: baseZ, rotateZ: 0 }} animate={animate} transition={transition}>
                        <CardBack />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            </Box>
          ) : (
            <Box sx={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {isMe && newRole ? (
                <RoleCardImage role={newRole} size={130} reveal />
              ) : (
                <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
                  <CardBack w={110} />
                </motion.div>
              )}
            </Box>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}