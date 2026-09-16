import React, { useEffect } from "react";
import { Dialog, DialogContent, Typography, Stack, Box } from "@mui/material";
import RoleCardImage from "./RoleCardImage";

interface Props {
  event: { playerId: string; playerName: string; role: string; success: boolean } | null;
  onClose: () => void;
}

export default function ProveResultDialog({ event, onClose }: Props) {
  useEffect(() => {
    if (!event) return;
    const timer = setTimeout(onClose, 2800);
    return () => clearTimeout(timer);
  }, [event]);

  if (!event) return null;

  return (
    <Dialog open={!!event} onClose={onClose}>
      <DialogContent>
        <Stack alignItems="center" spacing={2} sx={{ py: 2 }}>
          <RoleCardImage role={event.role} size={130} />
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