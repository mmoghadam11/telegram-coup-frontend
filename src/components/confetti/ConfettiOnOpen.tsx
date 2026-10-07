import { useEffect } from "react";
import confetti from "canvas-confetti";

interface Props {
  /** فعال بودن افکت */
  active: boolean;
  /** رنگ کاغذها */
  colors?: string[];
  /** مدت کل انیمیشن (ms) */
  duration?: number;
}

export default function ConfettiOnOpen({
  active,
  colors = ["#e0a52f", "#f5d76e", "#fff8dc", "#b8860b", "#ffd700"],
  duration = 3000,
}: Props) {
  useEffect(() => {
    if (!active) return;

    const end = Date.now() + duration;

    // انیمیشن اول: پاشش از دو طرف
    const frame = () => {
      // از سمت چپ
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
        scalar: 1.2,
        gravity: 0.9,
        drift: 0.5,
        ticks: 400,
      });
      // از سمت راست
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
        scalar: 1.2,
        gravity: 0.9,
        drift: -0.5,
        ticks: 400,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    // یه انفجار اولیه از بالا
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0 },
      colors,
      scalar: 1.1,
      gravity: 0.8,
      drift: 0.3,
      ticks: 500,
      startVelocity: 45,
    });

    // شروع انیمیشن دو طرف
    frame();

    return () => {
      confetti.reset();
    };
  }, [active, colors, duration]);

  return null;
}