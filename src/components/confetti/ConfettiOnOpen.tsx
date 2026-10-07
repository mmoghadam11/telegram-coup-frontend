import { useEffect } from "react";
import confetti from "canvas-confetti";

const DEFAULT_COLORS = [
  "#e0a52f", "#ffd700", "#ff3d68", "#00d4ff",
  "#ff00a2", "#ff8c00", "#34d399", "#fbbf24",
];

interface Props {
  active: boolean;
  colors?: string[];
  /** اندازه کاغذ */
  scalar?: number;
  /** z-index کانواس */
  zIndex?: number;
}

const DEFAULT_Z_INDEX = 2147483000;

export default function ConfettiOnOpen({
  active,
  colors = DEFAULT_COLORS,
  scalar = 2.2,
  zIndex = DEFAULT_Z_INDEX,
}: Props) {
  useEffect(() => {
    if (!active) return;

    // ✅ boost z-index کانواس
    const boostCanvas = () => {
      document
        .querySelectorAll('canvas[aria-hidden="true"]')
        .forEach((c) => {
          const el = c as HTMLCanvasElement;
          el.style.zIndex = String(zIndex);
          el.style.pointerEvents = "none";
          el.style.position = "fixed";
          el.style.top = "0";
          el.style.left = "0";
        });
    };

    boostCanvas();

    // ✅ یه انفجار از چپ
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.7 },
      // colors,
      // scalar,
      gravity: 0.9,
      drift: 0.5,
      // startVelocity: 55,
    });

    // ✅ یه انفجار از راست
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.7 },
      // colors,
      // scalar,
      gravity: 0.9,
      drift: -0.5,
      // startVelocity: 55,
    });

    // ✅ بعد از اولین اجرا، کانواس رو دوباره boost کن
    const timeout = setTimeout(boostCanvas, 50);

    return () => {
      clearTimeout(timeout);
      confetti.reset();
    };
  }, [active, colors, scalar, zIndex]);

  return null;
}