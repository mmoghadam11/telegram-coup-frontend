import React from "react";
import { Dialog, DialogTitle, DialogContent, Typography, Stack } from "@mui/material";
import RoleCardImage from "./RoleCardImage";
import { SkinSelection } from "shared/cardSkins";

interface Props {
  open: boolean;
  roles?: string[];
  revealed?: boolean[];
  onSelect: (roleIndex: number) => void;
  forcedIndex?: number
  skins?: SkinSelection;
}

export default function ProveCardDialog({ open, roles, revealed, forcedIndex, onSelect ,skins}: Props) {
  const isForced = forcedIndex !== undefined;

  return (
    <Dialog open={open} disableEscapeKeyDown>
      <DialogTitle>
        {isForced ? "کارت ادعاشده رو نشون بدید" : "یکی از کارت‌هاتون رو برای اثبات انتخاب کنید"}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {isForced
            ? "همون کارتی که ادعا کردید نشون داده می‌شه."
            : "اگه این کارت با ادعاتون یکی باشه، همین کارت می‌مونه (با یه کارت جدید عوض می‌شه). اگه نباشه، همین کارت رو از دست می‌دید."}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          {roles?.map((role, i) => {
            if (revealed?.[i]) return null;
            if (isForced && i !== forcedIndex) return null;
            return <RoleCardImage key={i} role={role} onClick={() => onSelect(i)} skins={skins}/>;
          })}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}