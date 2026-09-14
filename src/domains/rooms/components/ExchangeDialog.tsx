import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Stack, Chip, Button } from "@mui/material";

const ROLE_LABELS_FA: Record<string, string> = {
  duke: "بزرگ‌زاده", captain: "فرمانده", ambassador: "سفیر",
  princess: "شاهدخت", assassin: "قاتل", contessa: "بازرس",
};

interface Props {
  open: boolean;
  pool?: string[];
  keepCount?: number;
  onConfirm: (keepIndexes: number[]) => void;
}

export default function ExchangeDialog({ open, pool, keepCount, onConfirm }: Props) {
  const [selected, setSelected] = useState<number[]>([]);

  // هر بار که pool عوض بشه (یعنی یه دور جدید تعویض شروع شده)، انتخاب رو ریست کن
  useEffect(() => {
    setSelected([]);
  }, [pool]);

  const toggle = (i: number) => {
    setSelected((prev) =>
      prev.includes(i)
        ? prev.filter((x) => x !== i)
        : prev.length < (keepCount || 0)
        ? [...prev, i]
        : prev
    );
  };

  return (
    <Dialog open={open} disableEscapeKeyDown>
      <DialogTitle>انتخاب کارت (سفیر)</DialogTitle>
      <DialogContent>
        <Typography variant="body2" gutterBottom>
          {keepCount} تا از این کارت‌ها رو نگه دارید
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {pool?.map((role, i) => (
            <Chip
              key={i}
              label={ROLE_LABELS_FA[role] || role}
              color={selected.includes(i) ? "primary" : "default"}
              onClick={() => toggle(i)}
            />
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" disabled={selected.length !== keepCount} onClick={() => onConfirm(selected)}>
          تایید
        </Button>
      </DialogActions>
    </Dialog>
  );
}