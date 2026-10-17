import React, { useEffect, useState } from "react";
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import CardPicker, { toggleIndex } from "./CardPicker";

const ROLE_LABELS_FA: Record<string, string> = {
  duke: "بزرگ‌زاده", captain: "فرمانده", ambassador: "سفیر",
  princess: "شاهدخت", assassin: "قاتل", contessa: "بازرس",
};

interface Props {
  open: boolean;
  pool?: string[];
  keepCount?: number;
  onConfirm: (keepIndexes: number[]) => void;
  animated?: boolean;
}

export default function ExchangeDialog({ open, pool, keepCount = 0, onConfirm, animated = true }: Props) {
  const [selected, setSelected] = useState<number[]>([]);

  // با join کلید می‌گیریم؛ با هر broadcast آرایه‌ی pool یه رفرنس جدید می‌شه و انتخاب بی‌دلیل پاک می‌شد
  const poolKey = pool?.join(",") ?? "";
  useEffect(() => setSelected([]), [poolKey,open]);

  const toggle = (i: number) => setSelected((prev) => toggleIndex(prev, i, keepCount));

  return (
    <Dialog open={open} disableEscapeKeyDown fullWidth maxWidth="xs">
      <DialogTitle>انتخاب کارت (سفیر)</DialogTitle>
      <DialogContent>
        <Typography variant="body2" textAlign="center">
          {keepCount} کارت رو نگه دارید ({selected.length}/{keepCount}). بقیه زیر دسته می‌رن.
        </Typography>
        {animated ? (
          <CardPicker roles={pool ?? []} selected={selected} onToggle={toggle} />
        ) : (
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent="center" sx={{ py: 2 }}>
            {pool?.map((role, i) => (
              <Chip
                key={i}
                label={ROLE_LABELS_FA[role] ?? role}
                color={selected.includes(i) ? "primary" : "default"}
                onClick={() => toggle(i)}
              />
            ))}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" disabled={selected.length !== keepCount} onClick={() => onConfirm(selected)}>
          تایید
        </Button>
      </DialogActions>
    </Dialog>
  );
}