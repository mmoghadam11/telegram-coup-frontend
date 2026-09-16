import React, { useState } from "react";
import { Box, Typography, Fade } from "@mui/material";

const ROLE_LABELS_FA: Record<string, string> = {
  duke: "بزرگ‌زاده", captain: "فرمانده", ambassador: "سفیر",
  princess: "شاهدخت", assassin: "قاتل", contessa: "بازرس",
};

interface Props {
  role: string;
  size?: number;
  faded?: boolean;
  onClick?: () => void;
  fadeIn?: boolean; // این خط اضافه شد
}

export default function RoleCardImage({ role, size = 90, faded, onClick, fadeIn }: Props) {
  const [loaded, setLoaded] = useState(!fadeIn); // اگه fadeIn نمی‌خوایم، همون اول visible باشه

  return (
    <Fade in={loaded} timeout={400}>
      <Box
        onClick={onClick}
        sx={{
          cursor: onClick ? "pointer" : "default",
          opacity: faded ? 0.4 : 1,
          textAlign: "center",
          transition: "transform 0.15s",
          "&:hover": onClick ? { transform: "scale(1.05)" } : {},
        }}
      >
        <Box
          component="img"
          src={`/assets/images/cards/minimal/${role}.png`}
          alt={ROLE_LABELS_FA[role] || role}
          loading="eager"
          decoding="async"
          onLoad={() => setLoaded(true)}
          sx={{ width: size, height: size * 1.4, objectFit: "cover", borderRadius: 1, border: "1px solid", borderColor: "divider" }}
        />
        <Typography variant="caption" display="block">
          {ROLE_LABELS_FA[role] || role}
        </Typography>
      </Box>
    </Fade>
  );
}