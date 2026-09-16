import React from "react";
import { Dialog, DialogTitle, DialogContent, Typography, Stack } from "@mui/material";
import RoleCardImage from "./RoleCardImage";

interface Props {
  open: boolean;
  roles?: string[];
  revealed?: boolean[];
  onSelect: (roleIndex: number) => void;
}

export default function ProveCardDialog({ open, roles, revealed, onSelect }: Props) {
  return (
    <Dialog open={open} disableEscapeKeyDown>
      <DialogTitle>یکی از کارت‌هاتون رو برای اثبات انتخاب کنید</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          اگه این کارت با ادعاتون یکی باشه، همین کارت می‌مونه (با یه کارت جدید عوض می‌شه). اگه نباشه، همین کارت رو از دست می‌دید.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          {roles?.map((role, i) =>
            !revealed?.[i] ? (
              <RoleCardImage key={i} role={role} onClick={() => onSelect(i)} />
            ) : null
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}