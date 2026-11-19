import React from "react";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { motion } from "motion/react";
import { useAssets } from "context/AssetPreloadContext";
import { ANARCHIST_IMAGE, CARD_BACK_PATH, cardImagePath } from "shared/cardSkins";
import { CATS, Cat, ROLE_INFO, RoleInfo, toFa } from "./tutorialData";

const Title = ({ icon, children }: { icon: string; children: React.ReactNode }) => (
  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
    <Typography fontSize={28} lineHeight={1}>{icon}</Typography>
    <Typography variant="h6" fontWeight={800}>{children}</Typography>
  </Stack>
);

function CardBack({ w = 56 }: { w?: number }) {
  const { src } = useAssets();
  return <Box component="img" src={src(CARD_BACK_PATH)} alt="" draggable={false} sx={{ width: w, height: w * 1.4, borderRadius: 1, display: "block", boxShadow: "0 3px 8px rgba(0,0,0,.4)" }} />;
}

// دو کارت؛ اولی دوره‌ای از دست می‌رود
function LoseCardLoop() {
  const loop = { duration: 4, repeat: Infinity, times: [0, 0.35, 0.5, 0.85, 1] };
  return (
    <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ my: 2 }}>
      {[0, 1].map((i) => (
        <Box key={i} sx={{ position: "relative" }}>
          <motion.div
            animate={i === 0 ? { opacity: [1, 1, 0.25, 0.25, 1], filter: ["grayscale(0)", "grayscale(0)", "grayscale(1)", "grayscale(1)", "grayscale(0)"] } : undefined}
            transition={loop}>
            <CardBack w={56} />
          </motion.div>
          {i === 0 && (
            <motion.div aria-hidden animate={{ opacity: [0, 0, 1, 1, 0], scale: [0.4, 0.4, 1, 1, 0.4] }} transition={loop}
              style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, color: "#e53935" }}>
              ✕
            </motion.div>
          )}
        </Box>
      ))}
    </Stack>
  );
}

const Appear = ({ i, children }: { i: number; children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.12 }}>
    {children}
  </motion.div>
);

// ---------- ۱) هدف ----------
export function GoalStep() {
  return (
    <>
      <Title icon="🎯">هدف بازی</Title>
      <Typography>کارت‌های حریف‌ها را از بین ببر و خودت زنده بمان.</Typography>
      <LoseCardLoop />
      <Stack spacing={0.75}>
        <Typography variant="body2">• هر بازیکن ۲ کارت پنهان دارد؛ فقط خودش آن‌ها را می‌بیند.</Typography>
        <Typography variant="body2">• کارتی که از دست می‌رود رو می‌شود و همه می‌بینند.</Typography>
        <Typography variant="body2">• کسی که هر دو کارتش رو شد، حذف می‌شود. <b>آخرین بازیکنِ دارای کارت برنده است.</b></Typography>
      </Stack>
    </>
  );
}

// ---------- ۲) بلوف و چالش ----------
const FLOW = [
  { n: 1, t: "ادعا کن", d: "هر کاری که کارتی لازم دارد را می‌توانی انجام دهی، حتی اگر آن کارت را نداری می‌توانی ادعای داشتن آن را بکنی و «بلوف» بزنی." },
  { n: 2, t: "چالش", d: "هر بازیکن می‌تواند بگوید «باور نمی‌کنم!»" },
  { n: 3, t: "کارت را نشان بده", d: "ادعاکننده همان کارتی که ادعا کرده را رو می‌کند." },
];
export function ClaimStep() {
  return (
    <>
      <Title icon="🎭">بلوف و چالش</Title>
      <Stack spacing={1}>
        {FLOW.map((s, i) => (
          <Appear key={s.n} i={i}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <Box sx={{ width: 30, height: 30, borderRadius: "50%", bgcolor: "primary.main", color: "primary.contrastText", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 }}>{toFa(s.n)}</Box>
              <Box><Typography fontWeight={700}>{s.t}</Typography><Typography variant="body2" color="text.secondary">{s.d}</Typography></Box>
            </Stack>
          </Appear>
        ))}
      </Stack>
      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Paper variant="outlined" sx={{ flex: 1, p: 1.25, borderRadius: 3, borderColor: "success.main" }}>
          <Typography fontWeight={800} color="success.main">✅ ادعای صحیح</Typography>
          <Typography variant="body2">چالش‌کننده یک کارت از دست می‌دهد و کارت تو با یک کارت تازه عوض می‌شود.</Typography>
        </Paper>
        <Paper variant="outlined" sx={{ flex: 1, p: 1.25, borderRadius: 3, borderColor: "error.main" }}>
          <Typography fontWeight={800} color="error.main">❌ ادعای دروغ</Typography>
          <Typography variant="body2">همان کارت رو شده می‌سوزد.</Typography>
        </Paper>
      </Stack>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1.5 }}>
        اگر کسی چالش نگیرد، ادعا پذیرفته می‌شود، حتی اگر بلوف باشد. بلاک کردن هم یک ادعاست و چالش‌پذیر است.
      </Typography>
    </>
  );
}

// ---------- ۳) کارهای بدون کارت ----------
const BASIC = [
  { t: "درآمد", v: "+۱", d: "بدون ادعا و بدون بلاک." },
  { t: "کمک خارجی", v: "+۲", d: "چالش‌پذیر نیست، ولی «بزرگ‌زاده» می‌تواند بلاکش کند." },
  { t: "کودتا", v: "−۷", d: "یک کارت از هدف حذف می‌شود. نه بلاک دارد نه چالش." },
];
export function BasicStep() {
  return (
    <>
      <Title icon="🪙">کارهای بدون کارت</Title>
      <Typography variant="body2" sx={{ mb: 1.5 }}>هر بازیکن با ۲ سکه شروع می‌کند و در نوبتش میتواند از قدرت کارت‌های ادعا شده‌اش استفاده کند یا بدون ادعای خاصی یکی از کارهای زیر را انجام دهد.</Typography>
      <Stack spacing={1}>
        {BASIC.map((b, i) => (
          <Appear key={b.t} i={i}>
            <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
              <Chip label={b.v} color={b.v.startsWith("−") ? "error" : "success"} sx={{ fontWeight: 800, minWidth: 54 }} />
              <Box><Typography fontWeight={700}>{b.t}</Typography><Typography variant="body2" color="text.secondary">{b.d}</Typography></Box>
            </Paper>
          </Appear>
        ))}
      </Stack>
      <Typography variant="caption" color="warning.main" display="block" sx={{ mt: 1.5 }}>
        با ۱۰ سکه یا بیشتر فقط کودتا مجاز است.
      </Typography>
    </>
  );
}

// ---------- ۴) مرور کارت‌ها ----------
export function OverviewStep() {
  const { src } = useAssets();
  return (
    <>
      <Title icon="🃏">۱۵ کارت</Title>
      <Stack direction="row" flexWrap="wrap" justifyContent="center" useFlexGap sx={{ gap: 1.5, mb: 1.5 }}>
        {ROLE_INFO.map((r, i) => (
          <Appear key={r.role} i={i}>
            <Box sx={{ position: "relative", textAlign: "center" }}>
              <Typography variant="caption"  sx={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", height: 20, fontWeight: 800 }}>{r.name}</Typography>
              <Box component="img" src={src(cardImagePath(r.role))} alt={r.name} draggable={false} sx={{ width: 52, height: 73, objectFit: "cover", borderRadius: 1 ,mt:2.5}} />
              <Chip size="small" color={r.count === 5 ? "warning" : "primary"} label={`×${toFa(r.count)}`}
                 sx={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", height: 20, fontWeight: 800 }}/>
            </Box>
          </Appear>
        ))}
      </Stack>
      <Typography textAlign="center" fontWeight={800}>۵ کارت × ۲ + ۵ بازرس = ۱۵ کارت</Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1.5, mb: 1 }}>کارت‌ها سه کار اصلی دارند:</Typography>
      <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap>
        {(Object.keys(CATS) as Cat[]).map((c) => (
          <Chip key={c} label={`${CATS[c].icon} ${CATS[c].title}`} sx={{ borderColor: CATS[c].color, fontWeight: 700 }} variant="outlined" />
        ))}
      </Stack>
    </>
  );
}

// ---------- ۵ تا ۷) دسته‌ها ----------
function RoleRow({ info, i }: { info: RoleInfo; i: number }) {
  const { src } = useAssets();
  return (
    <Appear i={i}>
      <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 3, display: "flex", gap: 1.5 }}>
        <Box sx={{ position: "relative", flexShrink: 0, pb: 1.5 }}>
          <Box component="img" src={src(cardImagePath(info.role))} alt={info.name} draggable={false} sx={{ width: 64, height: 95, objectFit: "cover", borderRadius: 1.5, display: "block" }} />
          <Chip size="small" color={info.count === 5 ? "warning" : "primary"} label={`×${toFa(info.count)}`}
            sx={{ position: "absolute", top: 82, left: "50%", transform: "translateX(-50%)", height: 20, fontWeight: 800 }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography fontWeight={800}>{info.name}</Typography>
          {info.does.map((d) => <Typography key={d} variant="body2">• {d}</Typography>)}
          {info.does.length === 0 && <Typography variant="body2" color="text.secondary">کار فعال ندارد؛ فقط دفاع می‌کند.</Typography>}
          {info.blocks && <Typography variant="body2" color="success.main">🛡️ {info.blocks}</Typography>}
        </Box>
      </Paper>
    </Appear>
  );
}

export const CategoryStep = ({ cat }: { cat: Cat }) => (
  <>
    <Title icon={CATS[cat].icon}>{CATS[cat].title}</Title>
    <Stack spacing={1.5}>
      {CATS[cat].roles.map((r, i) => <RoleRow key={r} i={i} info={ROLE_INFO.find((x) => x.role === r)!} />)}
    </Stack>
  </>
);

// ---------- ۸) آنارشیست ----------
const ANARCH = [
  "در نوبت خود با پرداخت ۵ سکه یک بازیکن را هدف می‌گیرید. این کارت آماده است پس چالش‌پذیر نیست.",
  "هدف یا قبول می‌کند و یک کارت از دست می‌دهد،",
  "یا با «شاهدخت» بلاک می‌کند (این ادعا چالش‌پذیر است).",
  "اگر بلاک بماند، بلاک‌کننده می‌تواند حمله را به یک نفر دیگر منتقل کند (نه مهاجم و نه کسانی که قبلاً هدف بوده‌اند) یا حمله را کاملاً خنثی کند.",
];
export function AnarchistStep() {
  const { src } = useAssets();
  return (
    <>
      <Title icon="💣">آنارشیست</Title>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
        <Box component="img" src={src(ANARCHIST_IMAGE)} alt="" draggable={false} sx={{ width: 64, height: 90, objectFit: "cover", borderRadius: 1.5 }} />
        <Typography variant="body2" color="text.secondary">
          یک کارت ویژه است که دست کسی نیست و هر بازیکن می‌تواند با پرداخت ۵ سکه از آن استفاده کند.
        </Typography>
      </Stack>
      <Stack spacing={0.75}>
        {ANARCH.map((t, i) => (
          <Appear key={i} i={i}><Typography variant="body2">{toFa(i + 1)}. {t}</Typography></Appear>
        ))}
      </Stack>
    </>
  );
}

// ---------- ۹) دو کارت در یک ضربه ----------
export function DoubleLossStep() {
  return (
    <>
      <Title icon="⚠️">دو کارت در یک ضربه</Title>
      <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ mb: 1.5 }}>
        {[0, 1].map((i) => (
          <motion.div key={i} animate={{ opacity: [1, 0.3, 1], rotate: [0, i ? 8 : -8, 0] }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.5 }} style={{ position: "relative" }}>
            <CardBack w={48} />
            <Box sx={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, color: "#e53935" }}>✕</Box>
          </motion.div>
        ))}
      </Stack>
      <Stack spacing={1}>
        <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 3 }}>
          <Typography fontWeight={800}>۱) چالش اشتباه روی قاتل</Typography>
          <Typography variant="body2">برای ادعای قاتل بلوف میگیری ولی او واقعاً کارت قاتل دارد. یک کارت برای چالش اشتباه و یک کارت هم برای  قتل از دست می‌دهی: ۲ کارت.</Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 3 }}>
          <Typography fontWeight={800}>۲) شاهدخت دروغین</Typography>
          <Typography variant="body2">حمله‌ی قاتل یا آنارشیست را با ادعای بلوف «شاهدخت» بلاک می‌کنی ولی چالش گرفته میشود. یک کارت برای بلوف لو رفته و یک کارت برای حمله موفق حذف می‌شود: ۲ کارت.</Typography>
        </Paper>
      </Stack>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1.5 }}>
        آنارشیست ادعای نقش ندارد؛ پس برایش فقط حالت ۲ پیش می‌آید. اگر فقط یک کارت داری، با اولین باخت حذف می‌شوی.
      </Typography>
    </>
  );
}