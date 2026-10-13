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
  newRole?: string;
  /** true = دسته بر خورده، false = فقط جابجایی کارت (ایزومتریک) */
  shuffle?: boolean;
}

export default function ReplacementDialog({
  open,
  endsAt,
  playerName,
  isMe,
  newRole,
  shuffle = true,
}: Props) {
  const [stage, setStage] = useState<Stage>("shuffle");

  useEffect(() => {
    if (!open) return;
    setStage("shuffle");
    // حالت shuffle: انیمیشن طولانی‌تره (بر خوردن + پخش)
    // حالت ایزومتریک: زمان‌بندی کوتاه‌تره چون یه توالی سریعه
    const t1 = setTimeout(() => setStage("deal"), shuffle ? 1800 : 2200);
    const t2 = setTimeout(() => setStage("show"), shuffle ? 2800 : 3400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [open, endsAt, shuffle]);

  if (!open) return null;

  return (
    <Dialog open disableEscapeKeyDown>
      <DialogContent>
        <Stack alignItems="center" spacing={2} sx={{ py: 2, minWidth: 280, minHeight: 280 }}>
          <Typography variant="subtitle1" textAlign="center">
            {stage === "shuffle" &&
              (shuffle
                ? "دسته در حال بُر خوردنه..."
                : `کارت ${playerName} با کارت رویی تعویض می‌شه...`)}
            {stage === "deal" &&
              (shuffle
                ? `کارت جدید داره به ${playerName} داده می‌شه...`
                : `کارت رویی داره به ${playerName} داده می‌شه...`)}
            {stage === "show" &&
              (isMe ? "کارت جدید شما" : `کارت ${playerName} عوض شد`)}
          </Typography>

          <Box sx={{ position: "relative", width: 200, height: 200 }}>
            {/* ✅ حالت بر خوردن — همون انیمیشن قبلی */}
            {shuffle && stage === "shuffle" &&
              [0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 65,
                    top: 10,
                  }}
                  animate={{
                    x: [0, (i % 2 ? 1 : -1) * 45, 0],
                    rotate: [0, (i % 2 ? 1 : -1) * 8, 0],
                  }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.08 }}
                >
                  <CardBack />
                </motion.div>
              ))}

            {/* ✅ حالت ایزومتریک — فقط وقتی shuffle=false */}
            {!shuffle && stage === "shuffle" && <IsometricSwap />}

            {/* حالت shuffle → مرحله‌ی پخش کارت جدید */}
            {shuffle && stage === "deal" && (
              <motion.div
                style={{ position: "absolute", left: 65, top: 10 }}
                initial={{ y: 0, scale: 1 }}
                animate={{ y: 70, scale: 1.15 }}
                transition={{ duration: 0.9, ease: "easeInOut" }}
              >
                <CardBack />
              </motion.div>
            )}

            {/* حالت ایزومتریک → کارت جدید با محو-ظاهر میاد */}
            {!shuffle && stage === "deal" && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isMe && newRole ? (
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <RoleCardImage role={newRole} size={130} reveal />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <CardBack width={70} />
                  </motion.div>
                )}
              </Box>
            )}

            {/* مرحله‌ی نهایی — کارت نشون داده می‌شه */}
            {stage === "show" && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isMe && newRole ? (
                  <RoleCardImage role={newRole} size={130} reveal />
                ) : (
                  <CardBack width={70} />
                )}
              </Box>
            )}
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

/**
 * ✅ انیمیشن ایزومتریک: کارت ادعایی میاد و می‌ره زیر دسته،
 *    بعد کارت رویی از دسته درمیاد.
 */
function IsometricSwap() {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: "900px",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: 130,
          height: 180,
          transformStyle: "preserve-3d",
          transform: "rotateX(50deg) rotateZ(-38deg)",
        }}
      >
        {/* کارت ادعایی — از راست میاد و می‌ره زیر دسته */}
        <motion.div
          initial={{ x: 140, y: -30, z: 40, rotateZ: -15, opacity: 0 }}
          animate={{
            x: [140, 25, 25],
            y: [-30, -10, 8],
            z: [40, 40, -40],       // در آخر زیر دسته
            rotateZ: [-15, 0, 0],
            opacity: [0, 1, 1],
          }}
          transition={{
            duration: 1.8,
            times: [0, 0.65, 1],
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 80,
            height: 112,
            borderRadius: 8,
            background: "#4a5a76",
            border: "2px solid #c99a4a",
            boxShadow: "0 8px 14px rgba(0,0,0,.5)",
          }}
        />

        {/* دسته — چند کارت روی هم */}
        {[3, 2, 1, 0].map((i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              left: 25,
              top: 35 - i * 3,
              width: 80,
              height: 112,
              borderRadius: 1.5,
              background: "#29374e",
              border: "2px solid #c99a4a",
              boxShadow: "0 4px 10px rgba(0,0,0,.35)",
              zIndex: 10 - i,
            }}
          />
        ))}

        {/* کارت جدید — از روی دسته درمیاد و به چپ می‌ره */}
        <motion.div
          initial={{ x: 25, y: 26, z: 15, opacity: 0, scale: 0.9 }}
          animate={{
            x: [25, 25, 25, -110],
            y: [26, 26, -35, -40],
            z: [15, 15, 30, 45],
            opacity: [0, 1, 1, 1],
            scale: [0.9, 1.05, 1.15, 1.2],
            rotateZ: [0, 0, -8, -14],
          }}
          transition={{
            duration: 2,
            delay: 1.5,
            times: [0, 0.15, 0.65, 1],
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 80,
            height: 112,
            borderRadius: 8,
            background: "#29374e",
            border: "2px solid #c99a4a",
            boxShadow: "0 10px 20px rgba(0,0,0,.5)",
            zIndex: 30,
          }}
        />
      </Box>
    </Box>
  );
}