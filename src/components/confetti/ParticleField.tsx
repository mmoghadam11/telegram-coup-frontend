import React, { forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { useReducedMotion } from "motion/react";

export type ParticleKind = "ember" | "ash" | "gold";
export interface ParticleFieldHandle {
  /** x و y نسبت به گوشه‌ی بالا-چپ children (خود کارت) */
  emit: (kind: ParticleKind, x: number, y: number, count?: number) => void;
}

interface Particle {
  kind: ParticleKind; x: number; y: number; vx: number; vy: number;
  age: number; life: number; size: number; phase: number; rot: number; vr: number;
}

const MAX = 180;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
type RGB = [number, number, number];
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

// رنگِ جرقه با عمرش: سفید-زرد، نارنجی، قرمز، قرمز تیره
function emberColor(t: number): RGB {
  if (t < 0.2) return mix([255, 238, 175], [255, 170, 60], t / 0.2);
  if (t < 0.6) return mix([255, 170, 60], [235, 80, 20], (t - 0.2) / 0.4);
  return mix([235, 80, 20], [120, 22, 8], (t - 0.6) / 0.4);
}

function spawn(kind: ParticleKind, x: number, y: number): Particle {
  const base = { kind, x, y, age: 0, phase: rand(0, 6.28), rot: rand(0, 6.28), vr: 0 };
  if (kind === "ember") return { ...base, size: rand(0.9, 2.4), life: rand(0.9, 1.9), vx: rand(-16, 16), vy: rand(-95, -35) };
  if (kind === "ash") return { ...base, size: rand(1.4, 3.2), life: rand(1.6, 2.8), vx: rand(-14, 14), vy: rand(-34, -8), vr: rand(-3, 3) };
  return { ...base, size: rand(0.9, 2.3), life: rand(1.2, 2.3), vx: rand(-6, 6), vy: rand(-30, -6) };
}

interface Props { pad?: number; children: React.ReactNode }

const ParticleField = forwardRef<ParticleFieldHandle, Props>(({ pad = 70, children }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parts = useRef<Particle[]>([]);
  const raf = useRef(0);
  const last = useRef(0);
  const reduce = useReducedMotion();
  const reduceRef = useRef(false);
  reduceRef.current = !!reduce;

  // همه‌ی توابع فقط از refها استفاده می‌کنند؛ پس نسخه‌ی اولِ closure هم درست کار می‌کند
  const fit = () => {
    const c = canvasRef.current;
    if (!c) return null;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = Math.round(c.clientWidth * dpr), H = Math.round(c.clientHeight * dpr);
    if (c.width !== W || c.height !== H) { c.width = W; c.height = H; }
    const ctx = c.getContext("2d");
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  };

  const frame = (now: number) => {
    const c = canvasRef.current;
    const ctx = fit();
    if (!c || !ctx) { raf.current = 0; return; }
    const dt = Math.min(0.05, (now - last.current) / 1000);
    last.current = now;
    ctx.clearRect(0, 0, c.clientWidth, c.clientHeight);

    const alive: Particle[] = [];
    for (const p of parts.current) {
      p.age += dt;
      if (p.age >= p.life) continue;
      if (p.kind === "ember") {
        p.x += (p.vx + Math.sin(p.age * 7 + p.phase) * 16) * dt; p.y += p.vy * dt; p.vy *= 1 - 0.35 * dt;
      } else if (p.kind === "ash") {
        p.x += (p.vx + Math.sin(p.age * 2.2 + p.phase) * 12) * dt; p.y += p.vy * dt; p.vy += 14 * dt; p.rot += p.vr * dt;
      } else {
        p.x += (p.vx + Math.sin(p.age * 2.4 + p.phase) * 7) * dt; p.y += p.vy * dt;
      }
      alive.push(p);
    }
    parts.current = alive;

    // درخشان‌ها: additive تا روی هم نورِ بیشتری بسازند
    ctx.globalCompositeOperation = "lighter";
    for (const p of alive) {
      if (p.kind === "ash") continue;
      const t = p.age / p.life;
      let a: number, col: RGB;
      if (p.kind === "ember") {
        col = emberColor(t);
        a = Math.pow(1 - t, 1.3) * (0.65 + 0.35 * Math.sin(p.age * 30 + p.phase)); // سوسو
      } else {
        col = [255, 224, 138];
        a = Math.sin(Math.PI * t) * (0.55 + 0.45 * Math.sin(p.age * 9 + p.phase));  // چشمک
      }
      const s = p.size * (1 - 0.45 * t);
      const rgb = `${col[0] | 0},${col[1] | 0},${col[2] | 0}`;
      ctx.fillStyle = `rgba(${rgb},${Math.max(0, a * 0.22)})`;
      ctx.beginPath(); ctx.arc(p.x + pad, p.y + pad, s * 3, 0, 6.283); ctx.fill();   // هاله
      ctx.fillStyle = `rgba(${rgb},${Math.max(0, a)})`;
      ctx.beginPath(); ctx.arc(p.x + pad, p.y + pad, s, 0, 6.283); ctx.fill();       // هسته
    }
    // خاکستر: ورقه‌ی کوچک چرخان
    ctx.globalCompositeOperation = "source-over";
    for (const p of alive) {
      if (p.kind !== "ash") continue;
      const t = p.age / p.life;
      ctx.save();
      ctx.translate(p.x + pad, p.y + pad);
      ctx.rotate(p.rot);
      ctx.fillStyle = `rgba(96,90,86,${Math.min(1, (1 - t) * 1.4) * 0.85})`;
      ctx.fillRect(-p.size, -p.size * 0.5, p.size * 2, p.size);
      ctx.restore();
    }
    raf.current = alive.length ? requestAnimationFrame(frame) : 0;
  };

  useImperativeHandle(ref, () => ({
    emit(kind, x, y, count = 1) {
      if (reduceRef.current) return;
      for (let i = 0; i < count && parts.current.length < MAX; i++) {
        parts.current.push(spawn(kind, x + rand(-2, 2), y + rand(-2, 2)));
      }
      if (!raf.current) { last.current = performance.now(); raf.current = requestAnimationFrame(frame); }
    },
  }), []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); raf.current = 0; }, []);

  return (
    <Box sx={{ position: "relative", display: "inline-block" }}>
      {children}
      {/* canvas بزرگ‌تر از کارت؛ بالای کارت تا جرقه‌ها جلوی آن دیده شوند */}
      <Box component="canvas" ref={canvasRef}
        sx={{ position: "absolute", left: -pad, top: -pad, width: `calc(100% + ${pad * 2}px)`, height: `calc(100% + ${pad * 2}px)`, pointerEvents: "none", zIndex: 3 }} />
    </Box>
  );
});

export default ParticleField;