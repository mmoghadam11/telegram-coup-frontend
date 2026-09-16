// import React, { useState } from "react";
// import { Box, Typography, Fade } from "@mui/material";

// const ROLE_LABELS_FA: Record<string, string> = {
//   duke: "بزرگ‌زاده", captain: "فرمانده", ambassador: "سفیر",
//   princess: "شاهدخت", assassin: "قاتل", contessa: "بازرس",
// };

// interface Props {
//   role: string;
//   size?: number;
//   faded?: boolean;
//   onClick?: () => void;
//   fadeIn?: boolean; // این خط اضافه شد
// }

// export default function RoleCardImage({ role, size = 90, faded, onClick, fadeIn }: Props) {
//   const [loaded, setLoaded] = useState(!fadeIn); // اگه fadeIn نمی‌خوایم، همون اول visible باشه

//   return (
//     <Fade in={loaded} timeout={400}>
//       <Box
//         onClick={onClick}
//         sx={{
//           cursor: onClick ? "pointer" : "default",
//           opacity: faded ? 0.4 : 1,
//           textAlign: "center",
//           transition: "transform 0.15s",
//           "&:hover": onClick ? { transform: "scale(1.05)" } : {},
//         }}
//       >
//         <Box
//           component="img"
//           src={`/assets/images/cards/minimal/${role}.png`}
//           alt={ROLE_LABELS_FA[role] || role}
//           loading="eager"
//           decoding="async"
//           onLoad={() => setLoaded(true)}
//           sx={{ width: size, height: size * 1.4, objectFit: "cover", borderRadius: 1, border: "1px solid", borderColor: "divider" }}
//         />
//         <Typography variant="caption" display="block">
//           {ROLE_LABELS_FA[role] || role}
//         </Typography>
//       </Box>
//     </Fade>
//   );
// }
import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "motion/react";

const ROLE_LABELS_FA: Record<string, string> = {
  duke: "بزرگ‌زاده",
  captain: "فرمانده",
  ambassador: "سفیر",
  princess: "شاهدخت",
  assassin: "قاتل",
  contessa: "بازرس",
};

interface Props {
  role: string;
  size?: number;
  faded?: boolean;
  onClick?: () => void;
  reveal?: boolean;
}

export default function RoleCardImage({
  role,
  size = 90,
  faded,
  onClick,
  reveal = false,
}: Props) {
  return (
    <Box
      sx={{
        textAlign: "center",
        cursor: onClick ? "pointer" : "default",
      }}
      onClick={onClick}
    >
      <motion.img
        src={`/assets/images/cards/minimal/${role}.png`}
        alt={ROLE_LABELS_FA[role] || role}
        loading="eager"
        draggable={false}
        initial={reveal
          ? {
            opacity: 0,
            scale: 0.4,
            rotateY: 90,
            y: 30,
          }
          : {
            opacity: 1,
            scale: 1,
            rotateY: 0,
            y: 0,
          }}

        animate={{
          opacity: 1,
          scale: 1,
          rotateY: 0,
          y: 0,
        }}

        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        whileHover={
          onClick
            ? {
              scale: 1.05,
            }
            : undefined
        }
        style={{
          width: size,
          height: size * 1.4,
          objectFit: "cover",
          borderRadius: 4,
          border: "1px solid",
          display: "block",
          userSelect: "none",
        }}
      />

      <Typography variant="caption" display="block">
        {ROLE_LABELS_FA[role] || role}
      </Typography>
    </Box>
  );
}