//(فایل جدید، جایگزین ProveResultDialog و RevealResultDialog)
import React from "react";
import { Dialog, DialogContent, Typography, Stack, Box } from "@mui/material";
import RoleCardImage from "./proving/RoleCardImage";


interface ShowcaseState {
  kind: "proof" | "reveal" | "replacement";
  role: string | null;
  success: boolean | null;
  eliminated: boolean | null;
  endsAt: number;
}

interface Props {
  showcase: ShowcaseState | null;
  playerName: string;
}

// بدون onClose، پس بازیکن‌ها نمی‌تونن ببندنش؛ فقط با تموم شدن showcase سمت سرور بسته می‌شه
export default function ShowcaseDialog({ showcase, playerName }: Props) {
  if (!showcase || showcase.kind === "replacement" || !showcase.role) return null;

  const isProof = showcase.kind === "proof";

  return (
    <Dialog open disableEscapeKeyDown>
      <DialogContent>
        <Stack alignItems="center" spacing={2} sx={{ py: 2, minWidth: 220 }}>
          <Typography variant="subtitle1">
            {playerName} {isProof ? "کارت اثبات رو نشون داد" : "یک کارت فدا کرد"}
          </Typography>
          <RoleCardImage key={`${showcase.kind}-${showcase.endsAt}`} role={showcase.role} size={130} reveal />
          <Box textAlign="center">
            {isProof ? (
              <Typography variant="body2" color={showcase.success ? "success.main" : "error.main"}>
                {showcase.success ? "ادعا درست بود ✅" : "ادعا دروغ بود ❌ این کارت می‌سوزه"}
              </Typography>
            ) : (
              <Typography variant="body2" color={showcase.eliminated ? "error.main" : "text.secondary"}>
                {showcase.eliminated ? "حذف شد ☠️" : "یک کارت رو از دست داد 🔥"}
              </Typography>
            )}
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}