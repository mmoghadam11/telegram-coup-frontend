import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, ButtonBase, Typography } from "@mui/material";
import { motion } from "motion/react";
import { useAuth } from "hooks/useAuth";
import { useAssets } from "context/AssetPreloadContext";
import { cardImagePath, SkinSelection } from "shared/cardSkins";

const FAN_ROLES = ["assassin", "duke", "contessa"];
const CW = 34;
// const CW = 47;
const CH = 48;
// const CH = 70;

const cardVariants: any = {
  rest: (i: number) => ({ rotate: (i - 1) * 12, x: (i - 1) * 14, y: i === 1 ? 0 : 4 }),
  hover: (i: number) => ({ rotate: (i - 1) * 24, x: (i - 1) * 30, y: i === 1 ? -6 : 0 }),
};

export default function SkinsEntryCard() {
  const Auth = useAuth();
  const navigate = useNavigate();
  const { src, ensureAssets } = useAssets();

  // card_skins ممکنه توی تایپ userInfo تعریف نشده باشه؛ cast فقط برای همینه
  const raw = (Auth?.userInfo as any)?.card_skins as string | null | undefined;
  const skins: SkinSelection = useMemo(() => {
    try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
  }, [raw]);

  // اسکین انتخابی کاربر ممکنه جزو دانلودهای پایه نباشه
  useEffect(() => {
    ensureAssets(FAN_ROLES.map((r) => cardImagePath(r, skins)));
  }, [raw]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ButtonBase
      onClick={() => navigate("/skins")}
      sx={{ display: "block", width: "100%",height:"100%", borderRadius: 2.5, textAlign: "center" }}
    >
      {/* شناور شدن آروم کل کارت */}
      <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}>
        <motion.div initial="rest" animate="rest" whileHover="hover" whileTap="hover">
          <Box
            sx={{
              position: "relative", overflow: "hidden", borderRadius: 2.5, px: 0.5, pt: 1.5, pb: 1,
              background: "linear-gradient(145deg, #3a1d0c, #7a3f1d)",
              border: "1px solid rgba(245,196,81,.55)",
              boxShadow: "0 8px 22px rgba(0,0,0,.35)",
            }}
          >
            <Box sx={{ position: "relative", height: CH + 18 }}>
              {FAN_ROLES.map((role, i) => (
                <motion.img
                  key={role}
                  custom={i}
                  variants={cardVariants}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  src={src(cardImagePath(role, skins))}
                  alt=""
                  draggable={false}
                  style={{
                    position: "absolute", left: "50%", marginLeft: -CW / 2, top: 8, width: CW, height: CH,
                    objectFit: "cover", borderRadius: 4, boxShadow: "0 3px 8px rgba(0,0,0,.5)", zIndex: i === 1 ? 2 : 1,
                  }}
                />
              ))}
            </Box>
            <Typography sx={{ color: "#f5c451", fontWeight: 800, fontSize: "0.8rem" }}>اسکین‌ها</Typography>
            <Typography sx={{ color: "rgba(255,255,255,.7)", fontSize: "0.62rem" }}>ظاهر کارت‌هات رو بساز</Typography>

            {/* نور جاروب‌کننده */}
            <motion.div
              aria-hidden
              initial={{ x: "-130%" }}
              animate={{ x: "130%" }}
              transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
              style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,.28) 50%, transparent 60%)",
              }}
            />
          </Box>
        </motion.div>
      </motion.div>
    </ButtonBase>
  );
}