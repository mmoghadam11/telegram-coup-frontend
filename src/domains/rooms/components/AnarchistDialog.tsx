import React, { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Typography, Stack,
  Stepper, Step, StepLabel, Box, Button, Select, MenuItem,
} from "@mui/material";

interface Player {
  id: string;
  name: string;
}

interface AnarchistPendingState {
  originalAttackerId: string;
  currentTargetId: string;
  chain: string[];
  status: "awaiting_block_decision" | "awaiting_block_challenge" | "awaiting_pass_target";
  blockChallengeResponses: Record<string, "allow" | "challenge">;
}

interface Props {
  open: boolean;
  anarchist: AnarchistPendingState | null;
  players: Player[];
  myUserId: string;
  onAllow: () => void;
  onBlock: () => void;
  onBlockAllow: () => void;
  onBlockChallenge: () => void;
  onPass: (targetId: string) => void;
  onNeutralize: () => void;
}

function nameOf(players: Player[], id: string) {
  return players.find((p) => p.id === id)?.name || id;
}

export default function AnarchistDialog({
  open, anarchist, players, myUserId,
  onAllow, onBlock, onBlockAllow, onBlockChallenge, onPass, onNeutralize,
}: Props) {
  const [passTarget, setPassTarget] = useState("");

  if (!anarchist) return null;

  const chain = [anarchist.originalAttackerId, ...(anarchist.chain ?? [])];
  const isCurrentTarget = anarchist.currentTargetId === myUserId;
  const alreadyRespondedToBlock = !!anarchist?.blockChallengeResponses?.[myUserId];

  const eligibleForPass = players.filter(
    (p) => p.id !== anarchist.originalAttackerId && !anarchist.chain.includes(p.id)
  );

  return (
    <Dialog open={open} disableEscapeKeyDown maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "center" }}>حمله‌ی آنارشیست</DialogTitle>
      <DialogContent>
        <Stack alignItems="center" sx={{ mb: 2 }}>
          <Box
            component="img"
            src="/assets/images/cards/minimal/anarchist.jpeg"
            alt="آنارشیست"
            sx={{ width: 90, height: 126, objectFit: "cover", borderRadius: 1, border: "1px solid", borderColor: "divider" }}
          />
        </Stack>

        <Stepper orientation="vertical" activeStep={chain.length - 1} sx={{ mb: 2 }}>
          {chain.map((id, idx) => (
            <Step key={`${id}-${idx}`} completed={idx < chain.length - 1}>
              <StepLabel>
                {nameOf(players, id)}
                {idx === 0 && " (مهاجم اول)"}
                {idx === chain.length - 1 && idx !== 0 && " (هدف فعلی)"}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {anarchist.status === "awaiting_block_decision" && (
          <Typography variant="body2" textAlign="center" color={isCurrentTarget ? "text.primary" : "text.secondary"}>
            {isCurrentTarget
              ? "می‌خواید قبول کنید یا با شاهدخت بلاک کنید؟"
              : `در انتظار تصمیم ${nameOf(players, anarchist.currentTargetId)}...`}
          </Typography>
        )}

        {anarchist.status === "awaiting_block_challenge" && (
          <Typography variant="body2" textAlign="center" color={!isCurrentTarget && !alreadyRespondedToBlock ? "text.primary" : "text.secondary"}>
            {!isCurrentTarget && !alreadyRespondedToBlock
              ? `${nameOf(players, anarchist.currentTargetId)} با ادعای شاهدخت بلاک کرد. قبول می‌کنید یا چالش می‌زنید؟`
              : "در انتظار پاسخ بقیه به بلاک..."}
          </Typography>
        )}

        {anarchist.status === "awaiting_pass_target" && (
          isCurrentTarget ? (
            <Stack spacing={1} sx={{ mt: 1 }}>
              <Typography variant="body2">
                بلاک شما تایید شد. می‌تونید کارت رو pass بدید یا حمله رو کامل خنثی کنید.
              </Typography>
              {eligibleForPass.length > 0 && (
                <Select size="small" value={passTarget} onChange={(e) => setPassTarget(e.target.value)}>
                  {eligibleForPass.map((p) => (
                    <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                  ))}
                </Select>
              )}
              {eligibleForPass.length === 0 && (
                <Typography variant="caption" color="text.secondary">
                  کسی برای pass دادن باقی نمونده — فقط می‌تونید خنثی کنید.
                </Typography>
              )}
            </Stack>
          ) : (
            <Typography variant="body2" textAlign="center" color="text.secondary">
              در انتظار تصمیم {nameOf(players, anarchist.currentTargetId)}...
            </Typography>
          )
        )}
      </DialogContent>

      {anarchist.status === "awaiting_block_decision" && isCurrentTarget && (
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={onAllow}>قبول می‌کنم</Button>
          <Button variant="contained" onClick={onBlock}>بلاک می‌کنم (شاهدخت)</Button>
        </DialogActions>
      )}

      {anarchist.status === "awaiting_block_challenge" && !isCurrentTarget && !alreadyRespondedToBlock && (
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={onBlockAllow}>قبول</Button>
          <Button color="warning" onClick={onBlockChallenge}>چالش (بلوفه!)</Button>
        </DialogActions>
      )}

      {anarchist.status === "awaiting_pass_target" && isCurrentTarget && (
        <DialogActions sx={{ flexWrap: "wrap", justifyContent: "center", gap: 1 }}>
          <Button color="secondary" onClick={onNeutralize}>
            خنثی می‌کنم
          </Button>
          {eligibleForPass.length > 0 && (
            <Button variant="contained" disabled={!passTarget} onClick={() => onPass(passTarget)}>
              تایید pass
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}