import React, { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import CardPicker, { toggleIndex } from "./CardPicker";

const ROLE_LABELS_FA: Record<string, string> = {
  duke: "بزرگ‌زاده", captain: "فرمانده", ambassador: "سفیر",
  princess: "شاهدخت", assassin: "قاتل", contessa: "بازرس",
};

interface Props {
  open: boolean;
  roles?: string[];
  revealed?: boolean[];
  onSelect: (roleIndex: number) => void;
  animated?: boolean;
}

export default function ContessaDialog({ open, roles, revealed, onSelect, animated = true }: Props) {
  const [selected, setSelected] = useState<number[]>([]);
  useEffect(() => { if (!open) setSelected([]); }, [open]);

  const hidden = (revealed ?? []).map((r, i) => (r ? i : -1)).filter((i) => i >= 0);

  return (
    <Dialog open={open} disableEscapeKeyDown fullWidth maxWidth="xs">
      <DialogTitle>انتخاب کارت برای تعویض (بازرس)</DialogTitle>
      <DialogContent>
        {animated ? (
          <CardPicker
            roles={roles ?? []}
            hiddenIndexes={hidden}
            selected={selected}
            onToggle={(i) => setSelected((prev) => toggleIndex(prev, i, 1))}
          />
        ) : (
          <Stack direction="row" spacing={1} sx={{ py: 2 }}>
            {roles?.map((role, i) =>
              !revealed?.[i] ? (
                <Button key={i} variant="outlined" onClick={() => onSelect(i)}>
                  {ROLE_LABELS_FA[role] ?? role}
                </Button>
              ) : null
            )}
          </Stack>
        )}
      </DialogContent>
      {animated && (
        <DialogActions>
          <Button variant="contained" disabled={selected.length === 0} onClick={() => onSelect(selected[0])}>
            تایید
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}