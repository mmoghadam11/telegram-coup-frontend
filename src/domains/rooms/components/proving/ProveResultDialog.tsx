import React, { useEffect, useRef } from "react";
import { Dialog, DialogContent, Typography, Stack, Box } from "@mui/material";
import RoleCardImage from "./RoleCardImage";

interface Props {
  open:boolean;
  event: { playerId: string; playerName: string; role: string; success: boolean } | null;
  onClose: () => void;
}

export default function ProveResultDialog({ event, onClose, open }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!event) return;

    // پخش صدا همون لحظه‌ای که دیالوگ باز می‌شه
    audioRef.current?.play().catch(() => {
      // بعضی مرورگرها بدون تعامل قبلی کاربر با صفحه، پخش خودکار صدا رو بلاک می‌کنن — بی‌خطره نادیده بگیریمش
    });

    // const timer = setTimeout(onClose, 2800);
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [event]);

  if (!event) return null;

  return (
    <Dialog open={!!event&&open}
      onClose={(_, reason) => {
        // ✅ فقط کلیک روی backdrop و ESC رو بلاک کن
        if (reason === "backdropClick" || reason === "escapeKeyDown") return;
        onClose();
      }}
      disableEscapeKeyDown
    >
      <audio ref={audioRef} src="/assets/sounds/reveal.mp3" preload="auto" />
      <DialogContent>
        <Stack alignItems="center" spacing={2} sx={{ py: 2 }}>
          <RoleCardImage role={event.role} size={130} reveal />
          <Box textAlign="center">
            <Typography variant="subtitle1">{event.playerName}</Typography>
            <Typography variant="body2" color={event.success ? "success.main" : "error.main"}>
              {event.success ? "ادعا درست بود ✅" : "ادعا دروغ بود ❌"}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}