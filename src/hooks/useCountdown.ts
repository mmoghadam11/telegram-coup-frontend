import { useEffect, useState } from "react";

export function useCountdown(deadlineAt?: number | null): number | null {
  const [s, setS] = useState<number | null>(null);
  useEffect(() => {
    if (!deadlineAt) { setS(null); return; }
    const tick = () => setS(Math.max(0, Math.ceil((deadlineAt - Date.now()) / 1000)));
    tick();
    const iv = setInterval(tick, 250);
    return () => clearInterval(iv);
  }, [deadlineAt]);
  return s;
}