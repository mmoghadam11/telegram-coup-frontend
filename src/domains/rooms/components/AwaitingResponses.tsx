import React from "react";
import { Box, Stack, Avatar, Typography, CircularProgress } from "@mui/material";
import { motion } from "motion/react";
import CheckIcon from "@mui/icons-material/Check";

interface PlayerInfo {
  id: string;
  name: string;
  photoUrl?: string | null;
}

interface Props {
  players: PlayerInfo[];       // کسایی که باید جواب بدن (نه همه‌ی بازیکنای روم)
  respondedIds: string[];      // کی‌ها تا الان جواب دادن
}

export default function AwaitingResponses({ players, respondedIds }: Props) {
  const total = players.length;
  const respondedCount = players.filter((p) => respondedIds.includes(p.id)).length;
  const progress = total > 0 ? (respondedCount / total) * 100 : 0;

  return (
    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 1 }}>
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress variant="determinate" value={100} size={32} thickness={4} sx={{ color: "action.disabledBackground", position: "absolute" }} />
        <CircularProgress variant="determinate" value={progress} size={32} thickness={4} sx={{ color: "success.main" }} />
        <Box
          sx={{
            top: 0, left: 0, bottom: 0, right: 0, position: "absolute",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <Typography variant="caption" fontSize={9}>
            {respondedCount}/{total}
          </Typography>
        </Box>
      </Box>

      <Stack direction="row" spacing={-0.7}>
        {players.map((p) => {
          const hasResponded = respondedIds.includes(p.id);
          return (
            <Box key={p.id} sx={{ position: "relative" }}>
              <motion.div
                animate={hasResponded ? { scale: 1 } : { scale: [1, 1.08, 1], opacity: [1, 0.6, 1] }}
                transition={hasResponded ? { duration: 0.25 } : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Avatar
                  src={p.photoUrl || undefined}
                  sx={{
                    width: 26, height: 26, fontSize: 12,
                    border: "2px solid", borderColor: hasResponded ? "success.main" : "background.paper",
                    opacity: hasResponded ? 1 : 0.85,
                  }}
                >
                  {p.name?.[0]}
                </Avatar>
              </motion.div>
              {hasResponded && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  style={{ position: "absolute", bottom: -2, right: -2 }}
                >
                  <Box
                    sx={{
                      width: 13, height: 13, borderRadius: "50%", bgcolor: "success.main",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: "1.5px solid", borderColor: "background.paper",
                    }}
                  >
                    <CheckIcon sx={{ fontSize: 9, color: "#fff" }} />
                  </Box>
                </motion.div>
              )}
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
}