import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, Stack, Typography } from "@mui/material";
import { motion } from "motion/react";
import { useCountdown } from "hooks/useCountdown";
import { SkinSelection } from "shared/cardSkins";
import RoleCardImage from "./proving/RoleCardImage";

const DUEL_ROLES = ["duke", "captain", "ambassador", "princess", "assassin"]; // بدون بازرس

interface Props {
  open: boolean;
  opponentName: string;
  deadlineAt?: number | null;
  totalMs?: number | null;
  confirmedByMe: boolean;
  myPick?: string | null;
  skins?: SkinSelection;
  onConfirm: (role: string) => void;
}

export default function DuelDialog({ open, opponentName, deadlineAt, totalMs, confirmedByMe, myPick, skins, onConfirm }: Props) {
  const [sel, setSel] = useState<string | null>(null);
  const left = useCountdown(deadlineAt);
  useEffect(() => { if (!open) setSel(null); }, [open]);

  const chosen = confirmedByMe ? myPick ?? sel : sel;
  const pct = left != null && totalMs ? Math.min(100, (left * 1000 * 100) / totalMs) : 0;

  return (
    <Dialog open={open} disableEscapeKeyDown fullWidth maxWidth="xs">
      <DialogTitle sx={{ textAlign: "center" }}>⚔️ دوئل با {opponentName}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" textAlign="center">
          {confirmedByMe ? "منتظر انتخاب حریف..." : "کارت اولت را انتخاب کن. اگر نکنی، تصادفی انتخاب می‌شود."}
        </Typography>
        <LinearProgress variant="determinate" value={pct} sx={{ my: 1.5 }} />
        <Typography variant="caption" display="block" textAlign="center">{left ?? 0} ثانیه</Typography>
        <Stack direction="row" flexWrap="wrap" justifyContent="center" useFlexGap sx={{ gap: 2, py: 2 }}>
          {DUEL_ROLES.map((role) => {
            const on = chosen === role;
            return (
              <motion.div key={role}
                animate={{ scale: on ? 1.15 : 1, y: on ? -5 : 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                style={{ filter: on ? "drop-shadow(0 0 10px rgba(255,193,7,.95))" : "none", opacity: confirmedByMe && !on ? 0.4 : 1 }}>
                <RoleCardImage role={role} size={56} skins={skins} onClick={confirmedByMe ? undefined : () => setSel(role)} />
              </motion.div>
            );
          })}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" disabled={!sel || confirmedByMe} onClick={() => sel && onConfirm(sel)}>تأیید</Button>
      </DialogActions>
    </Dialog>
  );
}