import React from "react";
import { Dialog, DialogTitle, DialogContent, Typography, Stack, Button, CircularProgress } from "@mui/material";
import { motion } from "motion/react";

const ROLE_LABELS_FA: Record<string, string> = {
  duke: "بزرگ‌زاده", captain: "فرمانده", ambassador: "سفیر",
  princess: "شاهدخت", assassin: "قاتل", contessa: "بازرس",
};

const REASON_LABELS_FA: Record<string, string> = {
  coup: "کودتا کرد علیه",
  assassinated: "ترور کرد",
  anarchist: "با آنارشیست حمله کرد به",
  lost_challenge: "چالش رو باخت:",
};

interface Props {
  playerId: string;
  reason: string;
  actorId: string | null;
  myUserId: string;
  playerName: string;
  actorName?: string;
  roles?: string[];
  revealed?: boolean[];
  onSelect: (roleIndex: number) => void;
}

export default function EliminationAnnouncement({
  playerId, reason, actorId, myUserId, playerName, actorName, roles, revealed, onSelect,
}: Props) {
  const isMe = playerId === myUserId;
  const reasonLabel = REASON_LABELS_FA[reason] || "باعث حذف شد:";

  return (
    <Dialog open disableEscapeKeyDown maxWidth="xs" fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>
        {actorName ? `${actorName} ${reasonLabel}` : reasonLabel} {playerName}
      </DialogTitle>
      <DialogContent>
        <Stack alignItems="center" spacing={2} sx={{ py: 2 }}>
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Typography variant="h2">💀</Typography>
          </motion.div>

          {isMe ? (
            <>
              <Typography variant="body2" textAlign="center">یکی از کارت‌هاتون رو انتخاب کنید که فدا بشه</Typography>
              <Stack direction="row" spacing={1}>
                {roles?.map((role, i) =>
                  !revealed?.[i] ? (
                    <Button key={i} variant="outlined" onClick={() => onSelect(i)}>
                      {ROLE_LABELS_FA[role]}
                    </Button>
                  ) : null
                )}
              </Stack>
            </>
          ) : (
            <Stack alignItems="center" spacing={1}>
              <CircularProgress size={24} />
              <Typography variant="body2" color="text.secondary">
                در انتظار انتخاب کارت توسط {playerName}...
              </Typography>
            </Stack>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}