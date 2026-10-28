import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";
import type { ParticleKind } from "./ParticleField";

export const TEAR_LEFT =
  "polygon(0 0, 58% 0, 49% 14%, 56% 28%, 46% 43%, 55% 58%, 45% 72%, 54% 86%, 47% 100%, 0 100%)";
export const TEAR_RIGHT =
  "polygon(58% 0, 100% 0, 100% 100%, 47% 100%, 54% 86%, 45% 72%, 55% 58%, 46% 43%, 56% 28%, 49% 14%)";

// همان نقاط clip-path؛ میدان سوختن دقیقاً از همین خط شروع می‌شود
const TEAR: [number, number][] = [[0.58, 0], [0.49, 0.14], [0.56, 0.28], [0.46, 0.43], [0.55, 0.58], [0.45, 0.72], [0.54, 0.86], [0.47, 1]];
function tearX(yp: number) {
  for (let i = 0; i < TEAR.length - 1; i++) {
    const [x0, y0] = TEAR[i], [x1, y1] = TEAR[i + 1];
    if (yp <= y1) return x0 + ((x1 - x0) * (yp - y0)) / (y1 - y0 || 1);
  }
  return TEAR[TEAR.length - 1][0];
}

const W1 = 0.035, W2 = 0.11, W3 = 0.2;   // پهنای هر مرحله (واحد: میدان سوختن)

// نویز مقداری با درون‌یابی نرم؛ cell اندازه‌ی لکه‌هاست
function makeNoise(W: number, H: number, cell: number) {
  const gw = Math.ceil(W / cell) + 2, gh = Math.ceil(H / cell) + 2;
  const g = new Float32Array(gw * gh);
  for (let i = 0; i < g.length; i++) g[i] = Math.random();
  const out = new Float32Array(W * H);
  for (let y = 0; y < H; y++) {
    const fy = y / cell, y0 = Math.floor(fy), ty = fy - y0, sy = ty * ty * (3 - 2 * ty);
    for (let x = 0; x < W; x++) {
      const fx = x / cell, x0 = Math.floor(fx), tx = fx - x0, sx = tx * tx * (3 - 2 * tx);
      const a = g[y0 * gw + x0], b = g[y0 * gw + x0 + 1], c = g[(y0 + 1) * gw + x0], d = g[(y0 + 1) * gw + x0 + 1];
      out[y * W + x] = a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
    }
  }
  return out;
}

interface Props {
  url: string; w: number; h: number;
  intensity?: 1 | 2;
  durationMs?: number;
  onEmit: (kind: ParticleKind, x: number, y: number) => void;
  onDone?: () => void;
}

export default function BurningCard({ url, w, h, intensity = 1, durationMs = 1900, onEmit, onDone }: Props) {
  const refL = useRef<HTMLCanvasElement>(null);
  const refR = useRef<HTMLCanvasElement>(null);
  const emitRef = useRef(onEmit); emitRef.current = onEmit;
  const doneRef = useRef(onDone); doneRef.current = onDone;

  useEffect(() => {
    let cancelled = false;
    let raf = 0;
    const dpr = Math.min(1.5, window.devicePixelRatio || 1); // سقف ۱.۵؛ حلقه‌ی پیکسلی هر فریم اجرا می‌شود
    const W = Math.round(w * dpr), H = Math.round(h * dpr), N = W * H;
    const scale = W / w;

    const img = new Image();
    img.src = url;
    const ready = img.decode ? img.decode() : new Promise<void>((res, rej) => { img.onload = () => res(); img.onerror = rej; });

    ready.then(() => {
      if (cancelled) return;
      const cL = refL.current, cR = refR.current;
      if (!cL || !cR) return;
      cL.width = cR.width = W; cL.height = cR.height = H;
      const ctxL = cL.getContext("2d")!, ctxR = cR.getContext("2d")!;

      // تصویر پایه با گوشه‌های گرد، به‌صورت cover
      const off = document.createElement("canvas"); off.width = W; off.height = H;
      const octx = off.getContext("2d")!;
      const r = 6 * dpr;
      octx.beginPath(); octx.moveTo(r, 0); octx.arcTo(W, 0, W, H, r); octx.arcTo(W, H, 0, H, r); octx.arcTo(0, H, 0, 0, r); octx.arcTo(0, 0, W, 0, r); octx.closePath(); octx.clip();
      const k = Math.max(W / img.naturalWidth, H / img.naturalHeight);
      const sw = W / k, sh = H / k;
      octx.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, 0, 0, W, H);
      const base = octx.getImageData(0, 0, W, H);
      const out = octx.createImageData(W, H);
      const bd = base.data, od = out.data;

      // میدان سوختن
      const n1 = makeNoise(W, H, 22 * dpr), n2 = makeNoise(W, H, 8 * dpr);
      const fl = makeNoise(W, H, 4 * dpr);                      // سوسو و ناهمواری لبه
      const burn = new Float32Array(N);
      let minB = 9, maxB = -9;
      for (let y = 0; y < H; y++) {
        const yp = y / H, tx = tearX(yp);
        for (let x = 0; x < W; x++) {
          const i = y * W + x;
          const d = Math.abs(x / W - tx) / 0.6;
          const v = d * 0.7 + (n1[i] * 0.6 + n2[i] * 0.4 - 0.5) * 0.34 + (1 - yp) * 0.06;
          burn[i] = v;
          if (v < minB) minB = v; if (v > maxB) maxB = v;
        }
      }
      // مرتب‌سازی سطلی؛ برای انتخاب سریع پیکسل‌های روی جبهه (محل جرقه‌ها)
      const Q = 512;
      const q = (v: number) => Math.min(Q - 1, Math.max(0, Math.floor(((v - minB) / (maxB - minB)) * Q)));
      const starts = new Uint32Array(Q + 1);
      for (let i = 0; i < N; i++) starts[q(burn[i]) + 1]++;
      for (let i = 0; i < Q; i++) starts[i + 1] += starts[i];
      const order = new Uint32Array(N), fillPos = starts.slice(0, Q);
      for (let i = 0; i < N; i++) order[fillPos[q(burn[i])]++] = i;
      const pick = (lo: number, hi: number): number => {
        const a = starts[q(lo)], b = starts[Math.min(Q, q(hi) + 1)];
        return b > a ? order[a + Math.floor(Math.random() * (b - a))] : -1;
      };

      const tStart = minB - 0.09, tEnd = maxB + W3 + 0.03;
      const t0 = performance.now();
      const emitRate = intensity === 2 ? 3.2 : 2;

      const frame = (now: number) => {
        if (cancelled) return;
        const u = Math.min(1, (now - t0) / durationMs);
        const t = tStart + (tEnd - tStart) * u;
        od.set(bd);                                    // پیش‌فرض: دست‌نخورده
        const tm = now;
        for (let i = 0, p = 0; i < N; i++, p += 4) {
          const a = t - burn[i];
          if (a < -0.07) continue;
          const a0 = bd[p + 3];
          if (a0 === 0) continue;
          const r0 = bd[p], g0 = bd[p + 1], b0 = bd[p + 2];
          let R: number, G: number, B: number, A = a0;
          if (a < 0) {                                  // قهوه‌ای شدنِ حرارتی
            const kk = (a + 0.07) / 0.07;
            R = r0 * (1 - 0.4 * kk) + 60 * kk; G = g0 * (1 - 0.55 * kk) + 14 * kk; B = b0 * (1 - 0.75 * kk);
          } else if (a < W1) {                          // جبهه‌ی درخشان
            const kk = a / W1;
            const f = 0.88 + 0.12 * Math.sin(tm * 0.02 + fl[i] * 6.283);
            let hr: number, hg: number, hb: number;
            if (kk < 0.5) { const s = kk / 0.5; hr = 255; hg = 235 - 125 * s; hb = 165 - 145 * s; }
            else { const s = (kk - 0.5) / 0.5; hr = 255 - 95 * s; hg = 110 - 80 * s; hb = 20 - 15 * s; }
            R = hr * f; G = hg * f; B = hb * f;
          } else if (a < W2) {                          // ذغال با لکه‌های جرقه
            const s = (a - W1) / (W2 - W1);
            const glow = 1 - s;
            const sp = Math.sin(tm * 0.006 + fl[i] * 18);
            const spk = sp > 0.82 ? (sp - 0.82) / 0.18 : 0;
            const e = glow * glow * spk, g2 = glow * glow * glow * 0.5;
            R = r0 * 0.1 + 22 + 230 * e + 120 * g2; G = g0 * 0.08 + 16 + 70 * e + 25 * g2; B = b0 * 0.06 + 12 + 10 * e;
          } else if (a < W3) {                          // خاکستر و محو شدن با لبه‌ی ناهموار
            const s = (a - W2) / (W3 - W2) + (fl[i] - 0.5) * 0.7;
            if (s >= 1) { A = 0; R = G = B = 0; }
            else { const kk = s < 0 ? 0 : s; A = a0 * (1 - kk); R = 38 + 40 * kk; G = 33 + 38 * kk; B = 30 + 36 * kk; }
          } else { A = 0; R = G = B = 0; }
          od[p] = R; od[p + 1] = G; od[p + 2] = B; od[p + 3] = A;
        }
        octx.putImageData(out, 0, 0);
        ctxL.clearRect(0, 0, W, H); ctxL.drawImage(off, 0, 0);
        ctxR.clearRect(0, 0, W, H); ctxR.drawImage(off, 0, 0);

        // جرقه از روی جبهه، خاکستر از پشت آن
        if (u < 0.97) {
          const nE = Math.floor(emitRate + Math.random());
          for (let j = 0; j < nE; j++) {
            const i = pick(t - W1, t);
            if (i >= 0 && bd[i * 4 + 3] > 0) emitRef.current("ember", (i % W) / scale, Math.floor(i / W) / scale);
          }
          if (Math.random() < 0.35) {
            const i = pick(t - W3, t - W2);
            if (i >= 0 && bd[i * 4 + 3] > 0) emitRef.current("ash", (i % W) / scale, Math.floor(i / W) / scale);
          }
        }
        if (u >= 1) { ctxL.clearRect(0, 0, W, H); ctxR.clearRect(0, 0, W, H); doneRef.current?.(); return; }
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    }).catch(() => doneRef.current?.());

    return () => { cancelled = true; if (raf) cancelAnimationFrame(raf); };
  }, [url, w, h, intensity, durationMs]);

  const half = (side: "L" | "R") => {
    const dir = side === "L" ? -1 : 1;
    const clip = side === "L" ? TEAR_LEFT : TEAR_RIGHT;
    return (
      <motion.div
        key={side}
        style={{ position: "absolute", inset: 0, clipPath: clip, WebkitClipPath: clip, transformOrigin: side === "L" ? "30% 100%" : "70% 100%" }}
        initial={{ x: 0, y: 0, rotate: 0 }}
        animate={{ x: dir * 7, y: 3, rotate: dir * 2.5 }}  // شکاف آرام باز می‌شود؛ نیمه‌ها نمی‌پرند چون می‌سوزند
        transition={{ duration: durationMs / 1000, ease: "easeOut" }}
      >
        <canvas ref={side === "L" ? refL : refR} style={{ width: w, height: h, display: "block" }} />
      </motion.div>
    );
  };

  return (
    <div style={{ position: "relative", width: w, height: h, filter: "drop-shadow(0 8px 12px rgba(0,0,0,.45))" }}>
      {half("L")}
      {half("R")}
    </div>
  );
}