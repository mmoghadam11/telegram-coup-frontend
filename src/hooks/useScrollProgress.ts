import { RefObject, useEffect, useState } from "react";
import { MotionValue, useMotionValue } from "motion/react";

const SCROLLABLE = ["auto", "scroll", "overlay"];

// نزدیک‌ترین والدی که واقعاً اسکرول می‌خورد؛ وگرنه window
function findScroller(from: HTMLElement): HTMLElement | Window {
  let n = from.parentElement;
  while (n && n !== document.body && n !== document.documentElement) {
    if (SCROLLABLE.includes(getComputedStyle(n).overflowY) && n.scrollHeight > n.clientHeight + 1) return n;
    n = n.parentElement;
  }
  return window;
}

// والدی که overflow دارد ولی اسکرول نمی‌خورد، sticky را می‌شکند
function warnBrokenSticky(from: HTMLElement, scroller: HTMLElement | Window) {
  if (process.env.NODE_ENV === "production") return;
  let n = from.parentElement;
  while (n && n !== scroller && n !== document.body && n !== document.documentElement) {
    const cs = getComputedStyle(n);
    if (![cs.overflowX, cs.overflowY].every((v) => v === "visible" || v === "clip")) {
      console.warn("[scroll] این والد overflow دارد و sticky را می‌شکند (به‌جای hidden از clip استفاده کنید):", n);
    }
    n = n.parentElement;
  }
}

/** پیشرفت اسکرول (۰ تا ۱) روی بازه‌ای که sticky چسبیده است */
export function useScrollProgress(
  track: RefObject<HTMLElement>,
  sticky: RefObject<HTMLElement>,
  enabled: boolean
): MotionValue<number> {
  const progress = useMotionValue(0);

  useEffect(() => {
    const t = track.current;
    const s = sticky.current;
    if (!enabled || !t || !s) { progress.set(0); return; }

    const scroller = findScroller(t);
    warnBrokenSticky(t, scroller);
    const target: EventTarget = scroller;
    const baseTop = () => (scroller === window ? 0 : (scroller as HTMLElement).getBoundingClientRect().top);

    const update = () => {
      const stickTop = parseFloat(getComputedStyle(s).top) || 0;
      const run = t.offsetHeight - s.offsetHeight;                 // مسافتی که sticky چسبیده می‌ماند
      const passed = stickTop - (t.getBoundingClientRect().top - baseTop());
      progress.set(run > 0 ? Math.min(1, Math.max(0, passed / run)) : 0);
    };

    update();
    target.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      target.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [track, sticky, enabled, progress]);

  return progress;
}

export function useElementHeight(ref: RefObject<HTMLElement>): number {
  const [h, setH] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setH(el.offsetHeight));
    ro.observe(el);
    setH(el.offsetHeight);
    return () => ro.disconnect();
  }, [ref]);
  return h;
}

export function useViewportHeight(): number {
  const [h, setH] = useState(() => window.innerHeight);
  useEffect(() => {
    const on = () => setH(window.innerHeight);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return h;
}