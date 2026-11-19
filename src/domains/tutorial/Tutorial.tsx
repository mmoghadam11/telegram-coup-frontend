import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { AnimatePresence, motion } from "motion/react";
import DemoTable from "./DemoTable";
import { AnarchistStep, BasicStep, CategoryStep, ClaimStep, DoubleLossStep, GoalStep, OverviewStep } from "./TutorialSteps";
import { toFa } from "./tutorialData";

const STEPS = [
  { key: "goal", el: <GoalStep /> },
  { key: "claim", el: <ClaimStep /> },
  { key: "basic", el: <BasicStep /> },
  { key: "overview", el: <OverviewStep /> },
  { key: "money", el: <CategoryStep cat="money" /> },
  { key: "swap", el: <CategoryStep cat="swap" /> },
  { key: "kill", el: <CategoryStep cat="kill" /> },
  { key: "anarchist", el: <AnarchistStep /> },
  { key: "double", el: <DoubleLossStep /> },
  { key: "demo", el: <DemoTable /> },
];

export default function Tutorial() {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const last = i === STEPS.length - 1;

  useEffect(() => { window.scrollTo({ top: 0 }); }, [i]);

  const finish = () => {
    try { localStorage.setItem("COUP_TUTORIAL_DONE", "1"); } catch { /* storage ممکنه بلاک باشه */ }
    navigate("/");
  };

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="caption" color="text.secondary">مرحله {toFa(i + 1)} از {toFa(STEPS.length)} · حدود ۳ دقیقه</Typography>
        <Button size="small" onClick={finish}>رد کردن</Button>
      </Stack>

      {/* نوار مراحل؛ لمس‌پذیر */}
      <Stack direction="row" spacing={0.5} sx={{ mb: 1 }}>
        {STEPS.map((s, k) => (
          <Box key={s.key} role="button" aria-label={`مرحله ${toFa(k + 1)}`} onClick={() => setI(k)} sx={{ flex: 1, py: 1, cursor: "pointer" }}>
            <Box sx={{ height: 6, borderRadius: 3, bgcolor: k <= i ? "primary.main" : "action.disabledBackground", transition: "background-color .3s" }} />
          </Box>
        ))}
      </Stack>

      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
          <Paper sx={{ p: 2, borderRadius: 4, minHeight: 300 }}>{STEPS[i].el}</Paper>
        </motion.div>
      </AnimatePresence>

      <Paper elevation={6} sx={{ position: "sticky", bottom: 8, mt: 2, p: 1.25, display: "flex", gap: 1, zIndex: 2, borderRadius: 3 }}>
        <Button variant="outlined" disabled={i === 0} onClick={() => setI(i - 1)} sx={{ flex: 1 }}>قبلی</Button>
        <Button variant="contained" onClick={() => (last ? finish() : setI(i + 1))} sx={{ flex: 2 }}>
          {last ? "فهمیدم، بریم بازی!" : "بعدی"}
        </Button>
      </Paper>
    </Container>
  );
}