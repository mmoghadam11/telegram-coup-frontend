import React from "react";
import {
  ListItemButton, ListItemButtonProps, Stack, Typography, Box, Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import { ACTION_CARD_DATA } from "shared/constants/actionCards";

interface Props extends Omit<ListItemButtonProps, "onClick"> {
  onClick?: () => void;
  aspectRatio?: string;
  shine?: boolean;
  shineDuration?: number;
  shineDelay?: number;
  /** زاویه نوار (degrees) */
  shineAngle?: number;
  /** ضخامت نوار نسبت به عرض container (0.05 = ۵٪) */
  shineThickness?: number;
  overlayOpacity?: number;
}

const COUP_DATA = ACTION_CARD_DATA.coup1;

export default function CoupCardItem({
  onClick,
  aspectRatio = "16/9",
  shine = true,
  shineDuration = 1.6,
  shineDelay = 2.4,
  shineAngle = 25,
  shineThickness = 0.14,
  overlayOpacity = 0.5,
  sx,
  ...rest
}: Props) {
  // نصف ضخامت shine (برای محاسبه‌ی شروع/پایان gradient)
  const half = (shineThickness * 100) / 2;
  const start = 50 - half;
  const end = 50 + half;

  return (
    <ListItemButton
      onClick={onClick}
      sx={{
        position: "relative",
        borderRadius: 2,
        overflow: "hidden",
        p: 0,
        aspectRatio,
        minHeight: 90,
        "&:hover .coup-bg": { transform: "scale(1.05)" },
        "&:hover .coup-overlay": { opacity: overlayOpacity - 0.15 },
        ...sx,
      }}
      {...rest}
    >
      {/* تصویر پس‌زمینه */}
      <Box
        className="coup-bg"
        component="img"
        src={COUP_DATA.image}
        alt={COUP_DATA.title}
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.4s ease",
        }}
      />

      {/* لایه‌ی تیره */}
      <Box
        className="coup-overlay"
        sx={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg,
            rgba(0,0,0,${overlayOpacity + 0.15}) 0%,
            rgba(0,0,0,${overlayOpacity}) 50%,
            rgba(0,0,0,${overlayOpacity - 0.15}) 100%)`,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
        }}
      />

      {/* shine - نوار براق اریب */}
      {shine && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <motion.div
            initial={{ x: "-100%", rotate: shineAngle }}
            animate={{ x: "100%", rotate: shineAngle }}
            transition={{
              duration: shineDuration,
              repeat: Infinity,
              repeatDelay: shineDelay,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              top: "-50%",
              left: 0,
              width: "100%",         // ✅ هم‌عرض container
              height: "200%",        // ✅ بلندتر از container برای پوشش اریب
              background: `linear-gradient(90deg,
                rgba(255,215,100,0) ${start}%,
                rgba(255,215,100,0.7) 50%,
                rgba(255,215,100,0) ${end}%)`,
              mixBlendMode: "screen",
              filter: "blur(0.5px)",
            }}
          />
        </Box>
      )}

      {/* محتوا */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          p: 1.5,
          color: "common.white",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            noWrap
            sx={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)", mb: 0.25 }}
          >
            {COUP_DATA.title}
          </Typography>
          <Typography
            variant="caption"
            noWrap
            sx={{
              display: "block",
              color: "rgba(255,255,255,0.85)",
              textShadow: "0 1px 4px rgba(0,0,0,0.8)",
            }}
          >
            {COUP_DATA.description}
          </Typography>
        </Box>

        <Chip
          size="small"
          label={`${COUP_DATA.cost} سکه`}
          sx={{
            flexShrink: 0,
            fontWeight: "bold",
            bgcolor: "rgba(255, 215, 100, 0.9)",
            color: "rgba(0,0,0,0.9)",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        />
      </Stack>
    </ListItemButton>
  );
}