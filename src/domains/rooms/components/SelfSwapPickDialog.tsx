import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Stack, Button } from "@mui/material";
import RoleCardImage from "./proving/RoleCardImage";

interface Props {
  open: boolean;
  roles?: string[];
  revealed?: boolean[];
  onSelect: (roleIndex: number) => void;
  onClose: () => void;
}

export default function SelfSwapPickDialog({ open, roles, revealed, onSelect, onClose }: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>کدوم کارتت رو «بازرس» معرفی می‌کنی؟</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          اگه کسی چالش بزنه، همین کارت نشون داده می‌شه. بعدش همین کارت با کارت رویی دسته عوض می‌شه.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          {roles?.map((role, i) =>
            !revealed?.[i] ? <RoleCardImage key={i} role={role} onClick={() => onSelect(i)} /> : null
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>انصراف</Button>
      </DialogActions>
    </Dialog>
  );
}