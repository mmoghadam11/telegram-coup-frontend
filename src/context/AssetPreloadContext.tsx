import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ANARCHIST_IMAGE, CARD_BACK_PATH, CARD_ROLES, COIN_PATH, cardImagePath } from "shared/cardSkins";
import { ACTION_CARD_DATA } from "shared/constants/actionCards";

const SOUNDS = ["/assets/sounds/reveal.mp3", "/assets/sounds/clock-tick.mp3"];
const ACTION_IMAGES = Object.values(ACTION_CARD_DATA).map((d) => d.image); // مسیرها باید همون .webp باشن

// ترتیب این آرایه = اولویت دانلود
export const BASE_ASSETS = Array.from(
  new Set([CARD_BACK_PATH, COIN_PATH, ...CARD_ROLES.map((r) => cardImagePath(r)), ANARCHIST_IMAGE, ...ACTION_IMAGES, ...SOUNDS])
);

const CONCURRENCY = 3;   // حداکثر دانلود هم‌زمان
const MAX_ATTEMPTS = 5;

interface Value {
  src: (url: string) => string;                              // آدرس blob اگه آماده بود، وگرنه خود آدرس
  ready: boolean;                                            // همه‌ی تلاش‌ها تموم شده (موفق یا ناموفق)
  loaded: number;
  total: number;
  ensureAssets: (urls: string[], urgent?: boolean) => void;  // دانلود فایل اضافه، مثلاً اسکین بقیه
}

const Ctx = createContext<Value>({ src: (u) => u, ready: false, loaded: 0, total: 0, ensureAssets: () => {} });

async function fetchWithRetry(url: string): Promise<string | null> {
  for (let n = 0; n < MAX_ATTEMPTS; n++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(String(res.status));
      return URL.createObjectURL(await res.blob());
    } catch {
      await new Promise((r) => setTimeout(r, 1000 * 2 ** n)); // ۱، ۲، ۴، ۸، ۱۶ ثانیه
    }
  }
  return null;
}

export const AssetPreloadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useRef(new Map<string, string>());  // آدرس اصلی ← blob
  const failed = useRef(new Set<string>());
  const inflight = useRef(new Set<string>());
  const queue = useRef<string[]>([]);
  const active = useRef(0);
  const mounted = useRef(true);
  const [version, setVersion] = useState(0);         // با هر تغییر، مصرف‌کننده‌ها دوباره رندر می‌شن

  // تا وقتی کمتر از CONCURRENCY دانلود فعاله، از صف برمی‌داره
  const pump = useCallback(() => {
    while (active.current < CONCURRENCY && queue.current.length > 0) {
      const url = queue.current.shift()!;
      if (store.current.has(url) || inflight.current.has(url)) continue;
      active.current += 1;
      inflight.current.add(url);
      fetchWithRetry(url)
        .then((blobUrl) => {
          if (blobUrl) { store.current.set(url, blobUrl); failed.current.delete(url); }
          else failed.current.add(url);
        })
        .finally(() => {
          active.current -= 1;
          inflight.current.delete(url);
          if (mounted.current) { setVersion((v) => v + 1); pump(); }
        });
    }
  }, []);

  const ensureAssets = useCallback((urls: string[], urgent = false) => {
    const fresh = urls.filter(
      (u) => u && !store.current.has(u) && !inflight.current.has(u) && !queue.current.includes(u)
    );
    if (fresh.length === 0) return;
    fresh.forEach((u) => failed.current.delete(u));  // اگه قبلاً شکست خورده بود، دوباره امتحان می‌شه
    queue.current = urgent ? [...fresh, ...queue.current] : [...queue.current, ...fresh];
    pump();
  }, [pump]);

  useEffect(() => {
    mounted.current = true;
    ensureAssets(BASE_ASSETS);
    // وقتی نت برگشت، فایل‌های شکست‌خورده دوباره
    const retry = () => ensureAssets(Array.from(failed.current), true);
    window.addEventListener("online", retry);
    return () => {
      mounted.current = false;
      window.removeEventListener("online", retry);
      // عمداً blobها رو revoke نمی‌کنم: Provider تا آخر عمر برنامه زنده‌ست و توی StrictMode
      // cleanup زودتر اجرا می‌شه و آدرس‌های هنوز استفاده‌شده رو خراب می‌کرد
    };
  }, [ensureAssets]);

  const src = useCallback((url: string) => store.current.get(url) ?? url, []);

  const value = useMemo<Value>(() => {
    const loaded = BASE_ASSETS.filter((u) => store.current.has(u)).length;
    const settled = BASE_ASSETS.filter((u) => store.current.has(u) || failed.current.has(u)).length;
    return { src, ready: settled >= BASE_ASSETS.length, loaded, total: BASE_ASSETS.length, ensureAssets };
  }, [version, src, ensureAssets]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useAssets = () => useContext(Ctx);

// ---- نسخه‌ی قبلی (جایگزین شد) ----
// GAME_ASSETS.forEach(async (url) => {      // همه هم‌زمان شروع می‌شدن
//   const blobUrl = await fetchWithRetry(url);
//   if (blobUrl) { store.current.set(url, blobUrl); setLoaded(store.current.size); }
// });
// ready = loaded >= GAME_ASSETS.length;     // با یه فایل خراب هیچ‌وقت true نمی‌شد