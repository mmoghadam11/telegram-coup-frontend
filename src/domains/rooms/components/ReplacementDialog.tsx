import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, Typography, Stack, Box } from "@mui/material";
import { motion } from "motion/react";
import RoleCardImage from "./proving/RoleCardImage";

const CARD_W = 78;
const CARD_H = 109;
const LAYERS = 10;   // تعداد لایه‌های دسته
const GAP = 2.5;     // ضخامت هر کارت
const CARD_BACK_IMAGE = "/assets/images/cards/minimal/card-back.svg";
const SLIDE_AXIS: "x" | "y" = "y"; // محور ضلع کوتاه؛ دسته‌ها به اندازه‌ی طول کارت جابه‌جا می‌شن

type ShuffleStyle = "riffle" | "overhand";

// مقدار انیمیشن را روی محور انتخابی می‌سازد
const slide = (v: number) => (SLIDE_AXIS === "y" ? { y: v } : { x: v });

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
    shuffleStyle?: ShuffleStyle;
}

export default function ReplacementDialog({ open, endsAt, playerName, isMe, newRole, shuffle = false, shuffleStyle = "overhand" }: Props) {
    const [phase, setPhase] = useState<Phase>(shuffle ? "riffle" : "tuck");
    const shuffleMs = shuffleStyle === "riffle" ? 2600 : 2800;
    const drawAt = shuffle ? shuffleMs : 1900;

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
        <Dialog open disableEscapeKeyDown >
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

                                        // if (phase === "riffle") {
                                        //     animate = {
                                        //         x: [0, side * CARD_W * 0.85, side * CARD_W * 0.85, 0],
                                        //         rotateZ: [0, side * 7, side * 7, 0],
                                        //         y: [0, 0, 0, 0],
                                        //         z: baseZ,
                                        //     };
                                        //     // با تأخیر وابسته به i، کارت‌های دو نیمه یکی‌درمیون برمی‌گردن
                                        //     transition = { duration: 2.1, times: [0, 0.3, 0.45 + (i % 5) * 0.08, 1], ease: "easeInOut", delay: (i % 3) * 0.03 };
                                        // } 
                                        const half = Math.floor(LAYERS / 2);
                                        const isBottomHalf = i < half;          // نیمه‌ی پایینی = دسته‌ی A، نیمه‌ی بالایی = دسته‌ی B
                                        const sign = isBottomHalf ? -1 : 1;
                                        const slideDist = CARD_H * 0.95;        // جابه‌جایی طولی به اندازه‌ی طول کارت

                                        if (phase === "riffle" && shuffleStyle === "riffle") {
                                            // ۱) دو دسته جدا می‌شن  ۲) نزدیک می‌شن و یکی‌درمیون توی هم می‌رن (با خمیدگی)  ۳) جمع می‌شن
                                            const order = isBottomHalf ? i : i - half;            // ترتیب ورود هر کارت داخل دسته‌اش
                                            const mergeZ = (order * 2 + (isBottomHalf ? 0 : 1)) * GAP; // یکی‌درمیون در ارتفاع نهایی
                                            animate = {
                                                ...slide(sign * slideDist),
                                                rotateX: 0,
                                                z: baseZ,
                                            };
                                            animate = {
                                                [SLIDE_AXIS]: [0, sign * slideDist, sign * slideDist * 0.15, 0],
                                                rotateX: [0, 0, sign * -18, 0],                    // خم شدن لبه‌ها موقع ورود
                                                z: [baseZ, baseZ + 14, mergeZ, mergeZ],
                                            };
                                            transition = {
                                                duration: 2.6,
                                                times: [0, 0.3, 0.7 + (order % 3) * 0.04, 1],     // ورود پله‌ای کارت‌ها
                                                ease: "easeInOut",
                                                delay: order * 0.035,
                                            };
                                        } else if (phase === "riffle" && shuffleStyle === "overhand") {
                                            // مرحله ۱: یک‌سوم میانی رو بیار روی دسته  مرحله ۲: نصف پایینی رو از زیر دربیار و بذار روی دسته
                                            const third = Math.floor(LAYERS / 3);
                                            const inMiddleThird = i >= third && i < third * 2;
                                            const inBottomHalf = i < half;

                                            let seq: number[] = [0, 0, 0, 0];
                                            let zSeq: number[] = [baseZ, baseZ, baseZ, baseZ];

                                            if (inMiddleThird) {
                                                seq = [0, slideDist, slideDist, 0];                // بیرون، کنار، برگشت (روی دسته)
                                                zSeq = [baseZ, baseZ, baseZ + LAYERS * GAP, baseZ + LAYERS * GAP];
                                            } else if (inBottomHalf) {
                                                seq = [0, 0, -slideDist, 0];                       // بعدش نصف پایینی از زیر در میاد
                                                zSeq = [baseZ, baseZ, baseZ, baseZ + LAYERS * GAP * 2];
                                            }

                                            animate = { [SLIDE_AXIS]: seq, z: zSeq, rotateX: 0 };
                                            transition = { duration: 2.8, times: [0, 0.35, 0.7, 1], ease: "easeInOut", delay: (i % 3) * 0.02 };
                                        }
                                        else if (phase === "draw" && isTop) {
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