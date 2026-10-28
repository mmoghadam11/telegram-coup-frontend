import React, { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, Typography, Stack, Box } from "@mui/material";
import { motion } from "motion/react";
import RoleCardImage from "./proving/RoleCardImage";
import { SkinSelection } from "shared/cardSkins";

const CARD_W = 78;
const CARD_H = 109;
const LAYERS = 12;                 // باید بر ۶ بخش‌پذیر باشه
const GAP = 2.5;                   // ضخامت هر کارت
const SLIDE = CARD_H * 1.08;       // جابه‌جایی طولی؛ به‌قدری که دسته کامل از روی بقیه کنار بره
const BEND_DEG = 16;               // شدت خمیدگی (۰ = بدون خمیدگی)
const ISO = { rotateX: 58, rotateZ: 38 };
const FACING = { rotateX: 30, rotateZ: 0 };   // وضعیت «رو به بیننده»
const CARD_BACK_IMAGE = "/assets/images/cards/minimal/card-back.webp";

type StepName =
  | "split" | "zshift" | "merge"
  | "o1_out" | "o1_up" | "o1_in" | "o1_settle"
  | "o2_out" | "o2_up" | "o2_in" | "o2_settle"
  | "t_in" | "turn" | "draw";
type Style = "riffle" | "overhand" | "tuck";
type Num = number | number[];

// [نام مرحله، مدت به میلی‌ثانیه]؛ بعد از آخرین مرحله «show» نمایش داده می‌شه
const SEQUENCES: Record<Style, [StepName, number][]> = {
  riffle: [["split", 650], ["zshift", 250], ["merge", 950], ["turn", 750], ["draw", 950]],
  overhand: [
    ["o1_out", 500], ["o1_up", 350], ["o1_in", 500], ["o1_settle", 250],
    ["o2_out", 500], ["o2_up", 350], ["o2_in", 500], ["o2_settle", 250],
    ["turn", 750], ["draw", 950],
  ],
  tuck: [["t_in", 900], ["turn", 750], ["draw", 950]],
};

const zOf = (pos: number) => pos * GAP;

interface Target { y: Num; z: Num; top: Num; bottom: Num }

function riffleTarget(step: StepName, i: number): Target {
  const half = LAYERS / 2;
  const isA = i < half;
  const order = isA ? i : i - half;
  const sign = isA ? -1 : 1;
  // هر دو دسته یکی‌درمیون توی ارتفاع نهایی قرار می‌گیرن
  const mergeZ = zOf(order * 2 + (isA ? 0 : 1));
  const bt = isA ? 0 : -BEND_DEG; // دسته‌ی B: نیمه‌ی بالایی خم می‌شه
  const bb = isA ? BEND_DEG : 0;  // دسته‌ی A: نیمه‌ی پایینی خم می‌شه

  switch (step) {
    case "split":
      return { y: sign * SLIDE, z: zOf(i), top: bt, bottom: bb };
    case "zshift": // وقتی از هم جدان، ارتفاعشون عوض می‌شه تا موقع ورود به هم گیر نکنن
      return { y: sign * SLIDE, z: mergeZ, top: bt, bottom: bb };
    case "merge": // اول صاف می‌شن، بعد (وقتی هنوز هم‌پوشانی ندارن) به هم می‌رن
      return {
        y: [sign * SLIDE, sign * SLIDE * 0.65, 0],
        z: [mergeZ, mergeZ, mergeZ],
        top: [bt, 0, 0],
        bottom: [bb, 0, 0],
      };
    default:
      return { y: 0, z: mergeZ, top: 0, bottom: 0 };
  }
}

function overhandTarget(step: StepName, i: number): Target {
  const third = LAYERS / 3;
  const k = i % third;
  const g = i < third ? "B" : i < 2 * third ? "M" : "T"; // پایین، میانی، بالا
  const top = zOf(LAYERS + k); // بالاتر از کل دسته

  const base = { B: 0, M: third, T: 2 * third };
  const afterFirst = { B: 0, T: third, M: 2 * third };    // M رفته روی دسته
  const afterSecond = { T: 0, M: third, B: 2 * third };   // B هم رفته روی دسته
  const flat = { top: 0, bottom: 0 };

  switch (step) {
    case "o1_out": // دسته‌ی اول از جلو بیرون می‌آد
      return { y: g === "M" ? SLIDE : 0, z: zOf(base[g] + k), ...flat };
    case "o1_up": // می‌ره بالای دسته؛ بقیه جاش رو پر می‌کنن
      return g === "M"
        ? { y: SLIDE, z: top, ...flat }
        : { y: 0, z: zOf(afterFirst[g] + k), ...flat };
    case "o1_in": // می‌آد روی دسته
      return g === "M"
        ? { y: 0, z: top, ...flat }
        : { y: 0, z: zOf(afterFirst[g] + k), ...flat };
    case "o1_settle":
      return { y: 0, z: zOf(afterFirst[g] + k), ...flat };
    case "o2_out": // فقط بعد از نشستن کامل دسته‌ی اول، دسته‌ی دوم از زیر بیرون می‌آد
      return { y: g === "B" ? -SLIDE : 0, z: zOf(afterFirst[g] + k), ...flat };
    case "o2_up":
      return g === "B"
        ? { y: -SLIDE, z: top, ...flat }
        : { y: 0, z: zOf(afterSecond[g] + k), ...flat };
    case "o2_in":
      return g === "B"
        ? { y: 0, z: top, ...flat }
        : { y: 0, z: zOf(afterSecond[g] + k), ...flat };
    default:
      return { y: 0, z: zOf(afterSecond[g] + k), ...flat };
  }
}

function layerTarget(style: Style, step: StepName, i: number): Target {
  if (style === "riffle") return riffleTarget(step, i);
  if (style === "overhand") return overhandTarget(step, i);
  return { y: 0, z: zOf(i), top: 0, bottom: 0 };
}

// کارت رویی هر حالت (بالاترین z)
const topLayerIndex = (style: Style) => (style === "overhand" ? LAYERS / 3 - 1 : LAYERS - 1);

const faceStyle: React.CSSProperties = {
  position: "absolute",
  left: 0,
  width: CARD_W,
  height: CARD_H / 2,
  backgroundColor: "#eed5a9",
  backgroundImage: `url(${CARD_BACK_IMAGE}), radial-gradient(ellipse at center, #a8232b 0 28%, #d9573f 30% 100%)`,
  backgroundSize: `${CARD_W}px ${CARD_H}px, cover`,
  boxShadow: "0 1px 0 #8a4a2a",
};

// کارت دو‌نیمه‌ی لولا‌دار؛ نیمه‌ها مستقل خم می‌شن
function BendCard({ top, bottom, transition }: { top: Num; bottom: Num; transition: any }) {
  return (
    <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
      <motion.div
        style={{ ...faceStyle, top: 0, backgroundPosition: "0 0", borderRadius: "8px 8px 0 0", transformOrigin: "50% 100%" }}
        animate={{ rotateX: top }}
        transition={transition}
      />
      <motion.div
        style={{ ...faceStyle, top: CARD_H / 2, backgroundPosition: `0 -${CARD_H / 2}px, center`, borderRadius: "0 0 8px 8px", transformOrigin: "50% 0%" }}
        animate={{ rotateX: bottom }}
        transition={transition}
      />
    </div>
  );
}

function FlatBack({ w = CARD_W }: { w?: number }) {
  return (
    <Box
      sx={{
        width: w,
        height: w * (CARD_H / CARD_W),
        borderRadius: "8px",
        backgroundColor: "#d9573f",
        backgroundImage: `url(${CARD_BACK_IMAGE}), radial-gradient(ellipse at center, #a8232b 0 28%, #d9573f 30% 100%)`,
        backgroundSize: "cover",
        boxShadow: "0 4px 10px rgba(0,0,0,.5)",
      }}
    />
  );
}

const layerStyle: React.CSSProperties = { position: "absolute", inset: 0, transformStyle: "preserve-3d" };

interface Props {
  open: boolean;
  endsAt?: number;
  playerName: string;
  isMe: boolean;
  newRole?: string;
  shuffle?: boolean;
  shuffleStyle?: "riffle" | "overhand";
  skins?: SkinSelection;
}

export default function ReplacementDialog({
  open, endsAt, playerName, isMe, newRole, shuffle = false, shuffleStyle = "riffle", skins,
}: Props) {
  const style: Style = shuffle ? shuffleStyle : "tuck";
  const seq = useMemo(() => SEQUENCES[style], [style]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!open) return;
    setIdx(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    let acc = 0;
    seq.forEach(([, ms], n) => {
      acc += ms;
      timers.push(setTimeout(() => setIdx(n + 1), acc));
    });
    return () => timers.forEach(clearTimeout);
  }, [open, endsAt, seq]);

  if (!open) return null;

  const step: StepName | "show" = idx < seq.length ? seq[idx][0] : "show";
  const stepMs = idx < seq.length ? seq[idx][1] : 0;
  const faced = step === "turn" || step === "draw" || step === "show";
  const tr = {
    duration: stepMs / 1000,
    ease: "easeInOut" as const,
    ...(step === "merge" ? { times: [0, 0.35, 1] } : {}),
  };

  const caption =
    step === "show" ? (isMe ? "کارت جدید شما" : `یک کارت جدید به ${playerName} داده شد`)
    : step === "draw" ? "کارت رویی دسته برداشته می‌شه..."
    : step === "turn" ? "دسته رو به بیننده می‌چرخه..."
    : style === "tuck" ? `${playerName} کارتش رو زیر دسته می‌ذاره...`
    : "دسته در حال بُر خوردنه...";

  const topIdx = topLayerIndex(style);

  return (
    <Dialog open disableEscapeKeyDown >
      <DialogContent>
        <Stack alignItems="center" spacing={1} sx={{ minWidth: 280, minHeight: 300 }}>
          <Typography variant="subtitle1" textAlign="center">{caption}</Typography>

          {step !== "show" ? (
            <Box key={endsAt} sx={{ perspective: 900, height: 260, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <motion.div
                initial={ISO}
                animate={faced ? FACING : ISO}
                transition={{ duration: 0.75, ease: "easeInOut" }}
                style={{ position: "relative", width: CARD_W, height: CARD_H, transformStyle: "preserve-3d" }}
              >
                {/* کارتی که زیر دسته می‌ره (فقط حالت بدون بُر) */}
                {style === "tuck" && (
                  <motion.div
                    style={layerStyle}
                    initial={{ y: SLIDE, z: -GAP }}
                    animate={{ y: 0, z: -GAP }}
                    transition={{ duration: 0.9, ease: "easeInOut" }}
                  >
                    <BendCard top={0} bottom={0} transition={{ duration: 0 }} />
                  </motion.div>
                )}

                {Array.from({ length: LAYERS }).map((_, i) => {
                  const t = layerTarget(style, step as StepName, i);
                  const drawing = step === "draw" && i === topIdx;
                  const y: Num = drawing ? CARD_H * 0.75 : t.y;
                  const z: Num = drawing ? (t.z as number) + 90 : t.z;
                  return (
                    <motion.div
                      key={i}
                      style={layerStyle}
                      initial={{ y: 0, z: zOf(i) }}
                      animate={{ y, z }}
                      transition={tr}
                    >
                      <BendCard top={t.top} bottom={t.bottom} transition={tr} />
                    </motion.div>
                  );
                })}
              </motion.div>
            </Box>
          ) : (
            <Box sx={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {isMe && newRole ? (
                <RoleCardImage role={newRole} size={130} reveal skins={skins}/>
              ) : (
                <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
                  <FlatBack w={110} />
                </motion.div>
              )}
            </Box>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}