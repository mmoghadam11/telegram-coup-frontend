import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, Typography, Stack, Box } from "@mui/material";
import { motion } from "motion/react";
import RoleCardImage from "./proving/RoleCardImage";

function CardBack({ width = 70 }: { width?: number }) {
  return (
    <Box
      sx={{
        width,
        height: width * 1.4,
        borderRadius: 1.5,
        background: "#29374e",
        border: "2px solid #c99a4a",
        boxShadow: "0 4px 10px rgba(0,0,0,.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: width * 0.4,
      }}
    >
      👑
    </Box>
  );
}

type Stage = "shuffle" | "deal" | "show";

interface Props {
  open: boolean;
  endsAt?: number;
  playerName: string;
  isMe: boolean;
  newRole?: string; // فقط برای خود بازیکن پر می‌شه
}

export default function ReplacementDialog({ open, endsAt, playerName, isMe, newRole }: Props) {
  const [stage, setStage] = useState<Stage>("shuffle");

  useEffect(() => {
    if (!open) return;
    setStage("shuffle");
    const t1 = setTimeout(() => setStage("deal"), 1800);
    const t2 = setTimeout(() => setStage("show"), 2800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [open, endsAt]);

  if (!open) return null;

  return (
    <Dialog open disableEscapeKeyDown>
      <DialogContent>
        <Stack alignItems="center" spacing={2} sx={{ py: 2, minWidth: 240, minHeight: 260 }}>
          <Typography variant="subtitle1">
            {stage === "shuffle" && "دسته در حال بُر خوردنه..."}
            {stage === "deal" && `کارت جدید داره به ${playerName} داده می‌شه...`}
            {stage === "show" && (isMe ? "کارت جدید شما" : `یک کارت جدید به ${playerName} داده شد`)}
          </Typography>

          <Box sx={{ position: "relative", width: 130, height: 182 }}>
            {stage === "shuffle" &&
              [0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  style={{ position: "absolute", left: 30, top: 0 }}
                  animate={{ x: [0, (i % 2 ? 1 : -1) * 45, 0], rotate: [0, (i % 2 ? 1 : -1) * 8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.08 }}
                >
                  <CardBack />
                </motion.div>
              ))}

            {stage === "deal" && (
              <motion.div
                style={{ position: "absolute", left: 30, top: 0 }}
                initial={{ y: 0, scale: 1 }}
                animate={{ y: 70, scale: 1.15 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              >
                <CardBack />
              </motion.div>
            )}

            {stage === "show" && (
              <Box sx={{ position: "absolute", left: 0, top: 0 }}>
                {isMe && newRole ? (
                  <RoleCardImage role={newRole} size={130} reveal />
                ) : (
                  <Box sx={{ pl: "30px" }}>
                    <CardBack width={70} />
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}