import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Stack, CircularProgress } from "@mui/material";

interface Props {
  open: boolean;
  isCreator: boolean;
  alreadyResponded: boolean;
  waitingForNames: string[];
  onStay: () => void;
  onLeave: () => void;
}

export default function RestartVoteDialog({
  open, isCreator, alreadyResponded, waitingForNames, onStay, onLeave,
}: Props) {
  return (
    <Dialog open={open} disableEscapeKeyDown>
      <DialogTitle>شروع مجدد بازی</DialogTitle>
      <DialogContent>
        {isCreator || alreadyResponded ? (
          <Stack alignItems="center" spacing={2} sx={{ py: 2 }}>
            <CircularProgress size={28} />
            <Typography variant="body2">
              {waitingForNames.length > 0
                ? `در انتظار پاسخ: ${waitingForNames.join("، ")}`
                : "در حال آماده‌سازی بازی جدید..."}
            </Typography>
          </Stack>
        ) : (
          <Typography variant="body2">
            سازنده‌ی روم می‌خواد بازی رو دوباره شروع کنه. می‌خواید بمونید یا از روم خارج بشید؟
          </Typography>
        )}
      </DialogContent>
      {!isCreator && !alreadyResponded && (
        <DialogActions>
          <Button color="warning" onClick={onLeave}>خارج می‌شم</Button>
          <Button variant="contained" onClick={onStay}>می‌مونم</Button>
        </DialogActions>
      )}
    </Dialog>
  );
}