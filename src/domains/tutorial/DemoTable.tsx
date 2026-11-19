import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Chip, Grid, IconButton, Paper, Stack, Typography, useTheme } from "@mui/material";
import { Pause, PlayArrow, Replay, SkipNext, SkipPrevious } from "@mui/icons-material";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import GameTable from "domains/rooms/components/gameTable/GameTable";
import ActionButton from "domains/rooms/components/ActionButton";
import ActionCarousel from "components/cards/ActionCarousel";
import { ACTION_CARD_DATA } from "shared/constants/actionCards";
import { useAssets } from "context/AssetPreloadContext";
import { cardImagePath } from "shared/cardSkins";
import { DEMO, DEMO_PLAYERS, DemoStep, DemoUi, ROLE_INFO, toFa } from "./tutorialData";

const nameOf = (role: string) => ROLE_INFO.find((r) => r.role === role)?.name ?? role;
const noop = () => { };
const BAR_H = 148;        // ارتفاع ثابت ابزار؛ چیدمان بین مرحله‌ها نمی‌پرد
const LINE_MS = 2200;     // مدت دیده شدن هر حرف
const HIDE = ["income", "foreign_aid", "coup", "coup1"]; // مثل Room.tsx

// مدت هر مرحله: بلندترین از متن، آخرین حرف و لحظه‌ی انتخاب
const stepMs = (s: DemoStep) => {
    const lastLine = Math.max(0, ...(s.lines ?? []).map((l) => l.at + LINE_MS + 600));
    return Math.min(10000, Math.max(4500, s.note.length * 55, lastLine, (s.pickAt ?? 0) + 2200));
};

// حلقه و ضربه‌ی انگشت روی ابزاری که «انتخاب» شده
function Ring({ on, children }: { on: boolean; children: React.ReactNode }) {
    return (
        <Box sx={{ position: "relative", height: "100%" }}>
            {children}
            <motion.div aria-hidden initial={false}
                animate={{ opacity: on ? 1 : 0, boxShadow: on ? "0 0 0 3px #ffc107, 0 0 16px 3px rgba(255,193,7,.7)" : "0 0 0 0 rgba(0,0,0,0)" }}
                style={{ position: "absolute", inset: -2, borderRadius: 10, pointerEvents: "none" }} />
            {on && (
                <motion.div aria-hidden initial={{ scale: 0, opacity: 0.9 }} animate={{ scale: 2.2, opacity: 0 }} transition={{ duration: 0.8 }}
                    style={{ position: "absolute", left: "50%", top: "50%", width: 30, height: 30, marginLeft: -15, marginTop: -15, borderRadius: "50%", background: "rgba(255,193,7,.8)", pointerEvents: "none" }} />
            )}
        </Box>
    );
}

function ActBar({ ui, picked }: { ui: Extract<DemoUi, { kind: "act" }>; picked: boolean }) {
    const isBtn = ui.action === "income" || ui.action === "foreign_aid";
    // همان فیلتر Room.tsx؛ کارت انتخاب‌شده اول می‌آید تا در کاروسل دیده شود
    const actions = useMemo(
        () => Object.keys(ACTION_CARD_DATA)
            .filter((a) => !HIDE.includes(a) && ACTION_CARD_DATA[a].cost <= ui.coins)
            .map((a) => ({ action: a, ...ACTION_CARD_DATA[a] }))
            .sort((x, y) => Number(y.action === ui.action) - Number(x.action === ui.action)),
        [ui.action, ui.coins]
    );
    return (
        <Box aria-hidden sx={{ pointerEvents: "none", height: "100%", position: "relative" }}>
            <Grid container spacing={1} sx={{ height: "100%" }}>
                <Grid item xs={7} sx={{ height: "100%", overflow: "hidden" }}>
                    <Ring on={picked && !isBtn}><ActionCarousel key={ui.action} actions={actions} onSelect={noop} /></Ring>
                </Grid>
                <Grid item xs={5}>
                    <Ring on={picked && isBtn}>
                        <Stack spacing={1} sx={{ height: "100%" }}>
                            <ActionButton action="income" onClick={noop} />
                            <ActionButton action="foreign_aid" onClick={noop} />
                        </Stack>
                    </Ring>
                </Grid>
            </Grid>
            {picked && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ position: "absolute", bottom: 2, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
                    <Chip size="small" color="warning" label={`✋ انتخاب شد: ${ui.label}`} sx={{ fontWeight: 800 }} />
                </motion.div>
            )}
        </Box>
    );
}

function RespondBar({ ui, picked }: { ui: Extract<DemoUi, { kind: "respond" }>; picked: boolean }) {
    return (
        <Stack aria-hidden spacing={1.25} alignItems="center" justifyContent="center" sx={{ height: "100%", pointerEvents: "none" }}>
            <Typography variant="body2" fontWeight={700} textAlign="center">{ui.question}</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" useFlexGap>
                {ui.options.map((o) => {
                    const chosen = picked && o.id === ui.pick;
                    return (
                        <motion.div key={o.id} animate={{ scale: chosen ? 1.1 : 1, opacity: picked && !chosen ? 0.4 : 1 }}>
                            <Button size="small" color={o.color} variant="contained"
                                sx={{ boxShadow: chosen ? "0 0 0 3px #ffc107, 0 0 14px rgba(255,193,7,.7)" : undefined }}>{o.label}</Button>
                        </motion.div>
                    );
                })}
            </Stack>
        </Stack>
    );
}

function ProveBar({ ui, mine, picked }: { ui: Extract<DemoUi, { kind: "prove" }>; mine: string[]; picked: boolean }) {
    const { src } = useAssets();
    // کارت قاتل بعد از اثبات عوض می‌شود؛ پس برای نمایش، کارت انتخابی را همیشه در دست نشان می‌دهیم
    const cards = mine.includes(ui.pick) ? mine : [ui.pick, ...mine.filter((m) => m !== ui.pick)].slice(0, 2);
    return (
        <Stack aria-hidden spacing={1} alignItems="center" justifyContent="center" sx={{ height: "100%", pointerEvents: "none" }}>
            <Typography variant="body2" fontWeight={700} textAlign="center">{ui.question}</Typography>
            <Stack direction="row" spacing={1.5}>
                {cards.map((r) => {
                    const chosen = picked && r === ui.pick;
                    return (
                        <motion.div key={r} animate={{ scale: chosen ? 1.12 : 1, opacity: picked && !chosen ? 0.4 : 1, y: chosen ? -4 : 0 }}>
                            <Box component="img" src={src(cardImagePath(r))} alt="" draggable={false}
                                sx={{ width: 50, height: 70, objectFit: "cover", borderRadius: 1, boxShadow: chosen ? "0 0 0 3px #ffc107, 0 0 14px rgba(255,193,7,.7)" : "0 2px 6px rgba(0,0,0,.4)" }} />
                        </motion.div>
                    );
                })}
            </Stack>
        </Stack>
    );
}

export default function DemoTable() {
    const { src } = useAssets();
    const rtl = useTheme().direction === "rtl";
    const reduce = useReducedMotion();
    const [idx, setIdx] = useState(0);
    const [playing, setPlaying] = useState(!reduce);
    const [picked, setPicked] = useState(false);
    const [lineIdx, setLineIdx] = useState(-1);
    const last = DEMO.length - 1;
    const step = DEMO[idx];

    // پخش خودکار
    useEffect(() => {
        if (!playing) return;
        if (idx >= last) { setPlaying(false); return; }
        const t = setTimeout(() => setIdx((i) => i + 1), stepMs(step));
        return () => clearTimeout(t);
    }, [playing, idx, last, step]);

    // خط زمانی داخل هر مرحله: انتخاب خودکار و حرف‌ها (مستقل از پخش/توقف)
    useEffect(() => {
        setPicked(false);
        setLineIdx(-1);
        const timers: ReturnType<typeof setTimeout>[] = [];
        if (step.ui) timers.push(setTimeout(() => setPicked(true), step.pickAt ?? 1500));
        (step.lines ?? []).forEach((l, k) => {
            timers.push(setTimeout(() => setLineIdx(k), l.at));
            timers.push(setTimeout(() => setLineIdx((cur) => (cur === k ? -1 : cur)), l.at + LINE_MS));
        });
        return () => timers.forEach(clearTimeout);
    }, [idx]); // eslint-disable-line react-hooks/exhaustive-deps

    const players = DEMO_PLAYERS.map((p, k) => ({
        id: p.id, name: p.name, connected: true,
        coins: step.coins[k], roleCount: step.hidden[k],
        revealedRoles: step.revealed[k], isAlive: step.hidden[k] > 0,
    }));

    const manual = (n: number) => { setPlaying(false); setIdx(Math.min(last, Math.max(0, n))); };
    const toggle = () => { if (!playing && idx >= last) setIdx(0); setPlaying((p) => !p); };
    const flip = { transform: rtl ? "scaleX(-1)" : "none" };
    const line = lineIdx >= 0 ? step.lines?.[lineIdx] : undefined;
    const speaker = line ? DEMO_PLAYERS.find((p) => p.id === line.who) : undefined;
    const showPop = !!step.pop && (!step.ui || picked);
    const pct = ((idx + 1) / DEMO.length) * 100;

    return (
        <Box>
            {/* ردیف بالا: وضعیت تماشا و کارت‌های شما */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.75 }}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                    <Typography variant="caption" color="text.secondary">کارت‌های شما:</Typography>
                    {step.mine.length === 0 && <Typography variant="caption">—</Typography>}
                    {step.mine.map((r, k) => (
                        <motion.img key={`${r}-${k}`} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
                            src={src(cardImagePath(r))} alt={nameOf(r)} draggable={false}
                            style={{ width: 26, height: 36, objectFit: "cover", borderRadius: 4 }} />
                    ))}
                </Stack>
                <Chip size="small" color="info" label="👀 نمایشی؛ فقط تماشا" />
            </Stack>

            {/* توضیح بالای میز */}
            <Paper variant="outlined" sx={{ p: 1.25, borderRadius: 3, minHeight: 74, mb: 0.75 }}>
                <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Typography variant="body2">{step.note}</Typography>
                </motion.div>
            </Paper>

            {/* میز؛ عرض محدود تا روی صفحه‌ی بزرگ اسکرول نشود */}
            <Box sx={{ position: "relative", maxWidth: { xs: "100%", sm: 380 }, mx: "auto" }}>
                <GameTable players={players} myUserId="a" currentTurnPlayerId={step.turn} />

                {/* حرف بازیکن‌ها روی میز: محو و ظاهر می‌شود و جایی نمی‌گیرد */}
                <Box sx={{ position: "absolute", left: 0, right: 0, top: "22%", display: "flex", justifyContent: "center", zIndex: 41, pointerEvents: "none" }}>
                    <AnimatePresence mode="wait">
                        {line && speaker && (
                            <motion.div key={`${idx}-${lineIdx}`} initial={{ opacity: 0, y: reduce ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} style={{ maxWidth: "88%" }}>
                                <Paper elevation={6} sx={{ px: 1.25, py: 0.5, borderRadius: 3, display: "flex", alignItems: "center", gap: 0.75, boxShadow: `1px 1px 7px ${speaker.color}` }}>
                                    <Typography variant="body2"><b style={{ color: speaker.color }}>{speaker.name}:</b> {line.text}</Typography>
                                </Paper>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Box>

                {/* کارتِ نشان‌داده‌شده، وقتی کاربر انتخاب را انجام داد */}
                <Box sx={{ position: "absolute", left: "50%", top: "46%", transform: "translate(-50%, -50%)", zIndex: 40, pointerEvents: "none" }}>
                    <AnimatePresence>
                        {showPop && step.pop && (
                            <motion.div key={idx} initial={{ opacity: 0, scale: 0.6, rotateY: 90 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} style={{ textAlign: "center" }}>
                                <Box component="img" src={src(cardImagePath(step.pop.role))} alt="" draggable={false}
                                    sx={{ width: 64, height: 90, objectFit: "cover", borderRadius: 1.5, boxShadow: "0 8px 24px rgba(0,0,0,.6)" }} />
                                <Chip size="small" color={step.pop.ok ? "success" : "error"} sx={{ display: "block", mt: 0.5, fontWeight: 800 }}
                                    label={step.pop.ok ? `✓ ${nameOf(step.pop.role)}` : `✗ ${nameOf(step.pop.role)} (ادعا: ${nameOf(step.pop.claimed!)})`} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Box>

                {step.winner && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}
                        style={{ position: "absolute", left: "50%", top: "38%", marginLeft: -28, fontSize: 52, zIndex: 40 }}>🏆</motion.div>
                )}
            </Box>

            {/* ابزار بیرون میز، با ارتفاع ثابت */}
            <Paper variant="outlined" sx={{ mt: 0.75, p: 1, borderRadius: 3, height: BAR_H, overflow: "hidden" }}>
                {step.ui?.kind === "act" && <ActBar ui={step.ui} picked={picked} />}
                {step.ui?.kind === "respond" && <RespondBar ui={step.ui} picked={picked} />}
                {step.ui?.kind === "prove" && <ProveBar ui={step.ui} mine={step.mine} picked={picked} />}
                {!step.ui && (
                    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
                        <Typography variant="body2" color="text.secondary" textAlign="center">
                            {step.winner || step.hidden[0] === 0 ? "ابزارها وقتی کارت دارید فعال‌اند" : "شما فقط تماشا می‌کنید؛ منتظر نوبت بعدی..."}
                        </Typography>
                    </Stack>
                )}
            </Paper>

            {/* نوار پیشرفت؛ جهت را صریح تنظیم می‌کنیم تا در RTL از راست پر شود */}
            <Box dir={rtl ? "rtl" : "ltr"} sx={{ display: "flex", height: 5, borderRadius: 3, bgcolor: "action.disabledBackground", overflow: "hidden", mt: 1 }}>
                <Box sx={{ width: `${pct}%`, bgcolor: "primary.main", transition: "width .4s" }} />
            </Box>
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                <IconButton size="small" aria-label="از اول" onClick={() => { setIdx(0); setPlaying(!reduce); }}><Replay fontSize="small" /></IconButton>
                <IconButton size="small" aria-label="قبلی" disabled={idx === 0} onClick={() => manual(idx - 1)}><SkipPrevious sx={flip} /></IconButton>
                <IconButton aria-label={playing ? "توقف" : "پخش"} color="primary" onClick={toggle} sx={{ bgcolor: "action.hover" }}>
                    {playing ? <Pause /> : <PlayArrow />}
                </IconButton>
                <IconButton size="small" aria-label="بعدی" disabled={idx === last} onClick={() => manual(idx + 1)}><SkipNext sx={flip} /></IconButton>
                <Typography variant="caption" color="text.secondary">{toFa(idx + 1)}/{toFa(DEMO.length)}</Typography>
            </Stack>
        </Box>
    );
}