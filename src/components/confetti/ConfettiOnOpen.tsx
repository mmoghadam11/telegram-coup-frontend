import { useEffect } from "react";
import confetti from "canvas-confetti";

const DEFAULT_COLORS = [
  "#e0a52f", // طلایی
  "#ffd700", // طلایی روشن
  "#ff3d68", // صورتی
  "#00d4ff", // آبی
  "#a855f7", // بنفش
  "#ff8c00", // نارنجی
  "#34d399", // سبز
  "#fbbf24", // کهربایی
];

const DEFAULT_Z_INDEX = 9999;

export interface ConfettiProps {
  /** فعال بودن افکت — با true شدن، انیمیشن شروع می‌شه */
  active: boolean;

  /** رنگ کاغذها */
  colors?: string[];

  /** اندازه کاغذها — پیش‌فرض 1 */
  scalar?: number;

  /** تعداد کاغذهای انفجار اولیه */
  particleCount?: number;

  /** تعداد کاغذهای جریان مداوم (هر طرف، در هر تیک) */
  streamParticleCount?: number;

  /** فاصله بین تیک‌های جریان (ms) */
  streamInterval?: number;

  /** سرعت پرش کاغذها */
  startVelocity?: number;

  /** گرانش — بیشتر یعنی سریع‌تر پایین میاد */
  gravity?: number;

  /** z-index کانواس */
  zIndex?: number;

  /** مدت زمان اجرا (ms) — اگه untilTimestamp نداری */
  duration?: number;

  /** اگه ست بشه، انیمیشن تا این timestamp ادامه پیدا می‌کنه */
  untilTimestamp?: number | null;

  /** کاغذها فقط از بالا می‌ریزن (بدون جریان دو طرف) */
  topOnly?: boolean;
}

export default function ConfettiOnOpen({
  active,
  colors = DEFAULT_COLORS,
  scalar = 1,
  particleCount = 60,
  streamParticleCount = 2,
  streamInterval = 220,
  startVelocity = 42,
  gravity = 0.85,
  zIndex = DEFAULT_Z_INDEX,
  duration = 8000,
  untilTimestamp = null,
  topOnly = false,
}: ConfettiProps) {
  useEffect(() => {
    if (!active) return;

    const endTime = untilTimestamp ?? (Date.now() + duration);

    // ✅ انفجار اولیه
    confetti({
      particleCount,
      spread: 110,
      origin: { y: 0 },
      colors,
      scalar,
      gravity,
      drift: 0.4,
      ticks: 500,
      startVelocity,
    });

    // ✅ جریان دو طرف (مگه topOnly باشه)
    const interval = topOnly
      ? null
      : setInterval(() => {
          if (Date.now() >= endTime) {
            if (interval) clearInterval(interval);
            return;
          }

          // سمت چپ
          confetti({
            particleCount: streamParticleCount,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.7 },
            colors,
            scalar,
            gravity,
            drift: 0.4,
            ticks: 450,
          });

          // سمت راست
          confetti({
            particleCount: streamParticleCount,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.7 },
            colors,
            scalar,
            gravity,
            drift: -0.4,
            ticks: 450,
          });
        }, streamInterval);

    // ✅ boost z-index کانواس (چون canvas-confetti خودش z-index نمی‌ذاره)
    const boostCanvas = () => {
      const canvas = document.querySelector(
        'canvas[aria-hidden="true"]'
      ) as HTMLCanvasElement | null;
      if (canvas) {
        canvas.style.zIndex = String(zIndex);
        canvas.style.pointerEvents = "none";
      }
    };

    boostCanvas();
    const boostInterval = setInterval(boostCanvas, 300);

    return () => {
      if (interval) clearInterval(interval);
      clearInterval(boostInterval);
      confetti.reset();
    };
  }, [
    active,
    untilTimestamp,
    duration,
    colors,
    scalar,
    particleCount,
    streamParticleCount,
    streamInterval,
    startVelocity,
    gravity,
    zIndex,
    topOnly,
  ]);

  return null;
}