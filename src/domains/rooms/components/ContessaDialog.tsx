import React from "react";
import { Dialog, DialogTitle, DialogContent, Stack, Button } from "@mui/material";

const ROLE_LABELS_FA: Record<string, string> = {
  duke: "بزرگ‌زاده", captain: "فرمانده", ambassador: "سفیر",
  princess: "شاهدخت", assassin: "قاتل", contessa: "بازرس",
};

interface Props {
  open: boolean;
  roles?: string[];
  revealed?: boolean[];
  onSelect: (roleIndex: number) => void;
}

export default function ContessaDialog({ open, roles, revealed, onSelect }: Props) {
  return (
    <Dialog open={open} disableEscapeKeyDown>
      <DialogTitle>انتخاب کارت برای تعویض (بازرس)</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={1}>
          {roles?.map((role, i) =>
            !revealed?.[i] ? (
              <Button key={i} variant="outlined" onClick={() => onSelect(i)}>
                {ROLE_LABELS_FA[role]}
              </Button>
            ) : null
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}