import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack } from "@mui/material";

const ROLE_LABELS_FA: Record<string, string> = {
  duke: "بزرگ‌زاده", captain: "فرمانده", ambassador: "سفیر",
  princess: "شاهدخت", assassin: "قاتل", contessa: "بازرس",
};

interface Props {
  open: boolean;
  options: string[]; // مثلاً ["captain","ambassador"] برای دزدی
  onClose: () => void;
  onSelect: (role: string) => void;
}

export default function BlockClaimDialog({ open, options, onClose, onSelect }: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>با کدوم نقش بلاک می‌کنید؟</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={1}>
          {options.map((role) => (
            <Button key={role} variant="outlined" onClick={() => onSelect(role)}>
              {ROLE_LABELS_FA[role]}
            </Button>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>انصراف</Button>
      </DialogActions>
    </Dialog>
  );
}