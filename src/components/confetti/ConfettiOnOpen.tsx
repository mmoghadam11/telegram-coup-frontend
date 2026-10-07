import { useEffect } from "react";
import confetti from "canvas-confetti";

const DEFAULT_COLORS = [
  "#e0a52f", "#ffd700", "#ff3d68", "#00d4ff",
  "#ff00a2", "#ff8c00", "#34d399", "#fbbf24",
];

interface Props {
  active: boolean;
  colors?: string[];
  untilTimestamp?: number | null;
  fallbackDuration?: number;
  /** ✅ z-index قابل تنظیم — پیش‌فرض خیلی بالا */
  zIndex?: number;
  /** ✅ اندازه کاغذ */
  scalar?: number;
}

// حداکثر z-index ممکن — بالاتر از هر چیزی که MUI می‌سازه
const DEFAULT_Z_INDEX = 2147483000;

export default function ConfettiOnOpen({
  active,
  colors = DEFAULT_COLORS,
  untilTimestamp,
  fallbackDuration = 8000,
  zIndex = DEFAULT_Z_INDEX,
  scalar = 2.2,
}: Props) {
  useEffect(() => {
    if (!active) return;

    const endTime = untilTimestamp ?? (Date.now() + fallbackDuration);

    // ✅ هر canvas با aria-hidden=true رو boost کن
    const boostAllCanvases = () => {
      const canvases = document.querySelectorAll(
        'canvas[aria-hidden="true"]'
      );
      canvases.forEach((c) => {
        const el = c as HTMLCanvasElement;
        el.style.zIndex = String(zIndex);
        el.style.pointerEvents = "none";
        el.style.position = "fixed";
        el.style.top = "0";
        el.style.left = "0";
      });
    };

    // ✅ MutationObserver: هر وقت canvas جدید اضافه شد، فوراً boost کن
    const observer = new MutationObserver(boostAllCanvases);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style"],
    });

    // ✅ به‌عنوان fallback، هر ۲۰۰ms هم boost کن
    const interval = setInterval(boostAllCanvases, 200);

    // ✅ اولین boost فوری
    boostAllCanvases();

    // ✅ انفجار اولیه
    confetti({
      particleCount: 60,
      spread: 110,
      origin: { y: 0 },
      colors,
      scalar,
      gravity: 0.85,
      drift: 0.4,
      ticks: 500,
      startVelocity: 42,
    });

    // ✅ جریان دو طرف
    const streamInterval = setInterval(() => {
      if (Date.now() >= endTime) {
        clearInterval(streamInterval);
        return;
      }

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
        scalar,
        gravity: 0.85,
        drift: 0.4,
        ticks: 450,
      });

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
        scalar,
        gravity: 0.85,
        drift: -0.4,
        ticks: 450,
      });
    }, 220);

    return () => {
      clearInterval(streamInterval);
      clearInterval(interval);
      observer.disconnect();
      confetti.reset();
    };
  }, [active, untilTimestamp, fallbackDuration, colors, zIndex, scalar]);

  return null;
}