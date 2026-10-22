// import React from "react";
// import { Box, Typography } from "@mui/material";
// import { motion } from "motion/react";
// import { useAssets } from "context/AssetPreloadContext";
// import { cardImagePath, SkinSelection } from "shared/cardSkins";

// const ROLE_LABELS_FA: Record<string, string> = {
//   duke: "بزرگ‌زاده",
//   captain: "فرمانده",
//   ambassador: "سفیر",
//   princess: "شاهدخت",
//   assassin: "قاتل",
//   contessa: "بازرس",
// };

// interface Props {
//   role: string;
//   size?: number;
//   faded?: boolean;
//   onClick?: () => void;
//   reveal?: boolean;
//   skins?: SkinSelection;
// }

// export default function RoleCardImage({
//   role,
//   size = 90,
//   faded,
//   onClick,
//   reveal = false,
//   skins
// }: Props) {
//   const { src } = useAssets();
//   return (
//     <Box
//       sx={{
//         textAlign: "center",
//         cursor: onClick ? "pointer" : "default",
//       }}
//       onClick={onClick}
//     >
//       <motion.img
//         // src={`/assets/images/cards/minimal/${role}.webp`}
//         src={src(cardImagePath(role, skins))}
//         alt={ROLE_LABELS_FA[role] || role}
//         loading="eager"
//         draggable={false}
//         initial={reveal
//           ? {
//             opacity: 0,
//             scale: 0.4,
//             rotateY: 90,
//             y: 30,
//           }
//           : {
//             opacity: 1,
//             scale: 1,
//             rotateY: 0,
//             y: 0,
//           }}

//         animate={{
//           opacity: 1,
//           scale: 1,
//           rotateY: 0,
//           y: 0,
//         }}

//         transition={{
//           duration: 2,
//           ease: [0.22, 1, 0.36, 1],
//         }}
//         whileHover={
//           onClick
//             ? {
//               scale: 1.05,
//             }
//             : undefined
//         }
//         style={{
//           width: size,
//           height: size * 1.4,
//           objectFit: "cover",
//           borderRadius: 4,
//           border: "1px solid",
//           display: "block",
//           userSelect: "none",
//         }}
//       />

//       <Typography variant="caption" display="block">
//         {ROLE_LABELS_FA[role] || role}
//       </Typography>
//     </Box>
//   );
// }
import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "motion/react";
import { useAssets } from "context/AssetPreloadContext";
import { CARD_BACK_PATH, cardImagePath, SkinSelection } from "shared/cardSkins";

const ROLE_LABELS_FA: Record<string, string> = {
  duke: "بزرگ‌زاده", captain: "فرمانده", ambassador: "سفیر",
  princess: "شاهدخت", assassin: "قاتل", contessa: "بازرس",
};

interface Props {
  role: string;
  size?: number;
  faded?: boolean;
  onClick?: () => void;
  reveal?: boolean;     // انیمیشن چرخش از پشت به رو
  skins?: SkinSelection;
}

const face: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  borderRadius: 6,
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  userSelect: "none",
};

export default function RoleCardImage({ role, size = 90, faded, onClick, reveal = false, skins }: Props) {
  const { src } = useAssets();
  const h = size * 1.4;
  const DUR = 1.4;

  return (
    <Box
      onClick={onClick}
      sx={{ textAlign: "center", cursor: onClick ? "pointer" : "default", opacity: faded ? 0.4 : 1 }}
    >
      {/* perspective روی والد: بدونش چرخش تخت و خشک دیده می‌شه */}
      <Box sx={{ perspective: 900, width: size, height: h, mx: "auto" }}>
        <motion.div
          style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d" }}
          // شروع: پشت کارت (۱۸۰ درجه) و کمی کوچیک و پایین‌تر؛ پایان: همه‌ی مقدارها صفر
          initial={reveal ? { rotateY: 180, rotateZ: -6, scale: 0.85, y: 24 } : false}
          animate={{
            rotateY: 0,
            rotateZ: reveal ? [-6, 4, -2, 0] : 0,
            scale: reveal ? [0.85, 1.12, 1] : 1,
            y: reveal ? [24, -14, 0] : 0,
          }}
          transition={{
            rotateY: { duration: DUR, ease: [0.22, 1, 0.36, 1] },
            rotateZ: { duration: DUR, ease: "easeInOut", times: [0, 0.45, 0.75, 1] },
            scale: { duration: DUR, ease: "easeOut", times: [0, 0.5, 1] },
            y: { duration: DUR, ease: "easeOut", times: [0, 0.4, 1] },
          }}
          whileHover={onClick ? { scale: 1.05 } : undefined}
        >
          {/* وجه رو */}
          <img
            src={src(cardImagePath(role, skins))}
            alt={ROLE_LABELS_FA[role] || role}
            draggable={false}
            style={{ ...face, boxShadow: "0 8px 20px rgba(0,0,0,.45)" }}
          />
          {/* وجه پشت؛ ۱۸۰ درجه برعکسه تا با چرخش به جلو بیاد */}
          {reveal && (
            <img
              src={src(CARD_BACK_PATH)}
              alt=""
              draggable={false}
              style={{ ...face, transform: "rotateY(180deg)" }}
            />
          )}
        </motion.div>
      </Box>
      <Typography variant="caption" display="block">
        {ROLE_LABELS_FA[role] || role}
      </Typography>
    </Box>
  );
}