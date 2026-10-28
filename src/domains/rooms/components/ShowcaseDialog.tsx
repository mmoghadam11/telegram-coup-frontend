import React from "react";
import { Dialog, DialogContent, Typography, Stack } from "@mui/material";

import { useTableMode } from "context/TableModeContext";
import { SkinSelection } from "shared/cardSkins";
import RoleCardImage from "./proving/RoleCardImage";
import CardFate, { CardFateKind } from "./animation/CardFate";

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
  skins?: SkinSelection;
}

export default function ShowcaseDialog({ showcase, playerName, skins }: Props) {
  const { isAnimated } = useTableMode();
  if (!showcase || showcase.kind === "replacement" || !showcase.role) return null;

  const isProof = showcase.kind === "proof";
  const fate: CardFateKind = isProof
    ? showcase.success ? "truth" : "bluff"
    : showcase.eliminated ? "eliminated" : "sacrificed";

  return (
    <Dialog open disableEscapeKeyDown PaperProps={{ sx: { overflow: "visible" } }}>
      <DialogContent sx={{ overflow: "visible" }}>
        <Stack alignItems="center" spacing={2} sx={{ py: 2, minWidth: 220 }}>
          <Typography variant="subtitle1">
            {playerName} {isProof ? "کارت اثبات رو نشون داد" : "یک کارت فدا کرد"}
          </Typography>

          {isAnimated ? (
            // key: با هر نمایش جدید، انیمیشن‌ها از اول شروع بشن
            <CardFate key={`${showcase.kind}-${showcase.endsAt}`} role={showcase.role} size={130} skins={skins} fate={fate} />
          ) : (
            <RoleCardImage role={showcase.role} size={110} skins={skins} />
          )}

          <Typography
            variant="body2"
            color={isProof ? (showcase.success ? "success.main" : "error.main") : showcase.eliminated ? "error.main" : "text.secondary"}
          >
            {isProof
              ? showcase.success ? "ادعا درست بود ✅" : "ادعا دروغ بود ❌ این کارت می‌سوزه"
              : showcase.eliminated ? "حذف شد ☠️" : "یک کارت رو از دست داد 🔥"}
          </Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}