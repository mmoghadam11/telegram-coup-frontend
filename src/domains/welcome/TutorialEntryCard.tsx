import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, ButtonBase, Typography } from "@mui/material";
import { motion } from "motion/react";
import MenuBookIcon from "@mui/icons-material/MenuBook";

interface Props {
  tutorialDone: boolean;
  reduce: boolean;
}

export default function TutorialEntryCard({ tutorialDone, reduce }: Props) {
  const navigate = useNavigate();

  return (
    <ButtonBase
      onClick={() => navigate("/tutorial")}
      sx={{ display: "block", width: "100%", height: "100%", borderRadius: 2.5, textAlign: "center" }}
    >
      {/* ✅ شناور شدن آرام کل کارت (مشابه اسکین) */}
      <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}>
        <motion.div>
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 2.5,
              px: 0.5,
              pt: 1.5,
              pb: 1,
              // رنگ پس‌زمینه مشابه اسکین (اگر بخواهی می‌توانی رنگ را متفاوت کنی)
              background: "linear-gradient(145deg, #3a1d0c, #7a3f1d)",
              border: "1px solid rgba(245,196,81,.55)",
              boxShadow: "0 8px 22px rgba(0,0,0,.35)",
            }}
          >
            {/* محتوای کارت: آیکون + متن */}
            <Box sx={{ position: "relative", height: 66, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* ✅ اگر آموزش نرفته بود، آیکون با انیمیشن ضربان (Pulse) بزرگ و کوچک می‌شود */}
              <motion.div
                animate={!tutorialDone || reduce ? undefined : { scale: [1, 1.15, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <MenuBookIcon sx={{ fontSize: 40, color: "#f5c451" }} />
              </motion.div>
            </Box>
            
            <Typography sx={{ color: "#f5c451", fontWeight: 800, fontSize: "0.8rem" }}>
              آموزش بازی
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,.7)", fontSize: "0.62rem" }}>
              {tutorialDone ? "مرور آموزش" : "۳ دقیقه یاد بگیر"}
            </Typography>

            {/* ✅ نور جاروب‌کننده */}
            <motion.div
              aria-hidden
              initial={{ x: "-130%" }}
              animate={{ x: "130%" }}
              transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,.28) 50%, transparent 60%)",
              }}
            />
          </Box>
        </motion.div>
      </motion.div>
    </ButtonBase>
  );
}