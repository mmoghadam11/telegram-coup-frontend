import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

const ROLES = ["duke", "captain", "ambassador", "princess", "assassin", "contessa", "anarchist"];

export const GAME_ASSETS = [
  "/assets/images/cards/minimal/card-back.webp",
  "/assets/images/cards/coin.png",
  ...ROLES.map((r) => `/assets/images/cards/minimal/${r}.webp`),
  // تصویر وسط میز و بقیه‌ی تصاویر ثابت بازی رو اینجا اضافه کنید
];

interface Value {
  /** آدرس امن برای استفاده در src؛ اگه هنوز لود نشده، خود آدرس اصلی رو برمی‌گردونه */
  src: (url: string) => string;
  ready: boolean;     // همه‌ی تصاویر مهم آماده‌ان
  loaded: number;
  total: number;
}

const Ctx = createContext<Value>({ src: (u) => u, ready: false, loaded: 0, total: 0 });

async function fetchWithRetry(url: string, attempts = 5): Promise<string | null> {
  for (let n = 0; n < attempts; n++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(String(res.status));
      const blob = await res.blob();
      return URL.createObjectURL(blob);
    } catch {
      // با نت ضعیف: ۱، ۲، ۴، ۸ ثانیه صبر و دوباره
      await new Promise((r) => setTimeout(r, 1000 * 2 ** n));
    }
  }
  return null;
}

export const AssetPreloadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useRef(new Map<string, string>());
  const [loaded, setLoaded] = useState(0);

  const loadAll = useCallback(() => {
    GAME_ASSETS.forEach(async (url) => {
      if (store.current.has(url)) return;
      const blobUrl = await fetchWithRetry(url);
      if (blobUrl) {
        store.current.set(url, blobUrl);
        setLoaded(store.current.size);
      }
    });
  }, []);

  useEffect(() => {
    loadAll();
    // وقتی نت برگشت، چیزهایی که لود نشده بودن دوباره امتحان بشن
    window.addEventListener("online", loadAll);
    return () => window.removeEventListener("online", loadAll);
  }, [loadAll]);

  const src = useCallback((url: string) => store.current.get(url) ?? url, []);

  return (
    <Ctx.Provider value={{ src, ready: loaded >= GAME_ASSETS.length, loaded, total: GAME_ASSETS.length }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAssets = () => useContext(Ctx);