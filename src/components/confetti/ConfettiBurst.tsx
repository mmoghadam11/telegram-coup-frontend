import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { useReducedMotion } from "motion/react";
import confetti from "canvas-confetti";

type Variant = "gold" | "fire";

interface Props {
  fire: boolean | string | number;   // با هر تغییرِ مقدارِ truthy، یک‌بار شلیک می‌شه
  variant?: Variant;
  intensity?: 1 | 2;                 // ۲ = شدیدتر (مثلاً حذف کامل بازیکن)
  delayMs?: number;
  children: React.ReactNode;
}

const GOLD = ["#f5c451", "#e0a52f", "#fff3c4", "#ffffff"];
const EMBER = ["#ff7a18", "#ffb347", "#ff3d00", "#ffd180"];

// ایموجی به‌عنوان شکل ذره؛ از canvas-confetti نسخه‌ی ۱.۶ به بالا هست و scalar باید با شلیک یکی باشه
function shapeOf(text: string, scalar: number): any {
  const make = (confetti as any).shapeFromText;
  return typeof make === "function" ? make({ text, scalar }) : "circle";
}

export default function ConfettiBurst({ fire, variant = "gold", intensity = 1, delayMs = 0, children }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!fire || !canvas || reduce) return;

    const shoot = confetti.create(canvas, { resize: true, useWorker: false });
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    const run = () => {
      if (variant === "gold") {
        const scalar = 2.4;
        const shapes = [shapeOf("⭐", scalar), shapeOf("✨", scalar), "circle"];
        shoot({ particleCount: 14, spread: 75, startVelocity: 30, gravity: 0.9, ticks: 150, scalar, shapes, colors: GOLD, origin: { x: 0.5, y: 0.5 } });
        later(300, () =>
          shoot({ particleCount: 8, spread: 120, startVelocity: 20, gravity: 0.8, ticks: 120, scalar: 2, shapes, colors: GOLD, origin: { x: 0.5, y: 0.5 } })
        );
        return;
      }

      // fire: شعله‌ها و جرقه‌ها به سمت بالا (angle: 90) می‌رن و گرانش کمه تا آروم برگردن
      const k = intensity === 2 ? 1.6 : 1;
      const flameScalar = 2.8;
      const origin = { x: 0.5, y: 0.62 };
      shoot({
        particleCount: Math.round(9 * k), angle: 90, spread: 80, startVelocity: 24,
        gravity: 0.4, decay: 0.93, ticks: 110, scalar: flameScalar, shapes: [shapeOf("🔥", flameScalar)], origin,
      });
      shoot({
        particleCount: Math.round(16 * k), angle: 90, spread: 100, startVelocity: 20,
        gravity: 0.5, ticks: 100, scalar: 1.5, shapes: ["circle"], colors: EMBER, origin,
      });
      if (intensity === 2) {
        later(350, () =>
          shoot({ particleCount: 8, angle: 90, spread: 120, startVelocity: 18, gravity: 0.35, ticks: 110, scalar: flameScalar, shapes: [shapeOf("🔥", flameScalar)], origin })
        );
      }
    };

    later(delayMs, run);
    return () => {
      timers.forEach(clearTimeout);
      shoot.reset();
    };
  }, [fire, variant, intensity, delayMs, reduce]);

  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      {/* canvas بزرگ‌تر از کارته تا ذرات بیرون بزنن؛ pointerEvents none تا کلیک مختل نشه */}
      <Box
        component="canvas"
        ref={canvasRef}
        sx={{ position: "absolute", inset: "-80px", width: "calc(100% + 160px)", height: "calc(100% + 160px)", pointerEvents: "none", zIndex: 0 }}
      />
      <Box sx={{ position: "relative", zIndex: 1 }}>{children}</Box>
    </Box>
  );
}