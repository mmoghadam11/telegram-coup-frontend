import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import confetti from "canvas-confetti";

interface Props {
  fire: boolean | string | number;   // با هر تغییر این مقدار، یه بار شلیک می‌شه
  colors?: string[];
  children: React.ReactNode;
}

export default function ConfettiBurst({ fire, colors = ["#e0a52f", "#d9573f", "#ffffff", "#4caf50"], children }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!fire || !canvasRef.current) return;
    // instance مخصوص این canvas؛ resize:true اندازه‌ی canvas رو با والد هماهنگ می‌کنه
    const shoot = confetti.create(canvasRef.current, { resize: true, useWorker: false });

    shoot({ particleCount: 60, spread: 70, startVelocity: 28, origin: { x: 0.5, y: 0.55 }, colors, scalar: 0.8, ticks: 120 });
    const t = setTimeout(
      () => shoot({ particleCount: 35, spread: 100, startVelocity: 20, origin: { x: 0.5, y: 0.55 }, colors, scalar: 0.7, ticks: 100 }),
      350
    );
    return () => { clearTimeout(t); shoot.reset(); };
  }, [fire]);

  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      {/* canvas بزرگ‌تر از کارته تا ذرات بیرون بزنن؛ pointerEvents none تا کلیک مختل نشه */}
      <Box
        component="canvas"
        ref={canvasRef}
        sx={{ position: "absolute", inset: "-60px", width: "calc(100% + 120px)", height: "calc(100% + 120px)", pointerEvents: "none", zIndex: 0 }}
      />
      <Box sx={{ position: "relative", zIndex: 1 }}>{children}</Box>
    </Box>
  );
}