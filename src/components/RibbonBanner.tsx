import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "motion/react";

const OPEN_S = 0.9;              // مدت باز شدن روبان
const NAME_AT = OPEN_S + 0.1;    // اسم کمی بعد از باز شدن ظاهر می‌شود
const NAME_FADE = 0.6;
const SPEED_MS = 90;             // سرعت تایپ هر حرف
const GREETING = "خوش آمدید";

// تایپ حرف‌به‌حرف؛ Array.from به‌جای slice روی رشته تا حروف چندبایتی نشکنن
function useTyped(text: string, startDelayMs: number, speedMs: number, enabled: boolean) {
  const [n, setN] = useState(enabled ? 0 : Array.from(text).length);

  useEffect(() => {
    const all = Array.from(text);
    if (!enabled) { setN(all.length); return; }
    setN(0);
    let i = 0;
    let iv: ReturnType<typeof setInterval> | undefined;
    const t = setTimeout(() => {
      iv = setInterval(() => {
        i += 1;
        setN(i);
        if (i >= all.length && iv) clearInterval(iv);
      }, speedMs);
    }, startDelayMs);
    return () => { clearTimeout(t); if (iv) clearInterval(iv); };
  }, [text, startDelayMs, speedMs, enabled]);

  return Array.from(text).slice(0, n).join("");
}

export default function RibbonBanner({ name = "mahdiyar", reduce }: { name?: string; reduce: boolean }) {
  const typed = useTyped(GREETING, (NAME_AT + NAME_FADE) * 1000 + 100, SPEED_MS, !reduce);
  const letters = Array.from(GREETING);
  const shown = Array.from(typed).length;

  return (
    // filter روی والد: اگه روی عنصر clip‌شده بود، سایه هم بریده می‌شد
    <Box sx={{ position: "relative", width: "min(70vw, 300px)", mx: "auto", filter: "drop-shadow(0 6px 10px rgba(0,0,0,.35))" }}>
      <motion.div
        initial={reduce ? false : { clipPath: "inset(0% 50% 0% 50%)" }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
        transition={{ duration: OPEN_S, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "relative" }}
      >
        <svg viewBox="0 0 360 100" width="100%" style={{ display: "block" }} aria-hidden>
          <defs>
            <linearGradient id="ribbonBand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#b02a3f" />
              <stop offset="1" stopColor="#7a1626" />
            </linearGradient>
          </defs>
          <path d="M0 34 H64 V86 H0 L16 60 Z" fill="#5e1220" />
          <path d="M360 34 H296 V86 H360 L344 60 Z" fill="#5e1220" />
          <polygon points="64,72 82,72 64,86" fill="#3d0b15" />
          <polygon points="296,72 278,72 296,86" fill="#3d0b15" />
          <rect x="30" y="14" width="300" height="58" rx="3" fill="url(#ribbonBand)" />
          <line x1="38" y1="21" x2="316" y2="21" stroke="#f5c451" strokeOpacity=".85" strokeWidth="1.5" />
          <line x1="38" y1="65" x2="316" y2="65" stroke="#f5c451" strokeOpacity=".85" strokeWidth="1.5" />
        </svg>

        <Box sx={{ position: "absolute", left: "14%", right: "14%", top: "14%", height: "58%", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <Typography component="div" sx={{ fontWeight: 800, fontSize: { xs: "1.05rem", sm: "1.35rem" }, color: "#fff3c4", textShadow: "0 1px 4px rgba(0,0,0,.5)" }}>
            {/* لایه‌ی بیرونی: fade-in اسم. لایه‌ی داخلی: گرادیان متحرک (جدا، تا transform و background با هم تداخل نکنن) */}
            <motion.span
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduce ? 0 : NAME_AT, duration: NAME_FADE }}
              style={{ display: "inline-block" }}
            >
              <motion.span
                animate={reduce ? undefined : { backgroundPosition: ["0% 50%", "100% 50%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                style={{
                  background: "linear-gradient(90deg,#f5c451,#fff3c4,#f5c451,#fff3c4,#f5c451)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {name}
              </motion.span>
            </motion.span>{" "}
            {/* قسمت تایپ‌شده + باقیِ نامرئی (جای متن رزرو می‌شود و ظاهرِ حروف متصل می‌ماند) */}
            <span>{letters.slice(0, shown).join("")}</span>
            <span style={{ visibility: "hidden" }}>{letters.slice(shown).join("")}</span>
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
}