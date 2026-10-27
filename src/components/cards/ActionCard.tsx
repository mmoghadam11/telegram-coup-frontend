import React from "react";
import { Box, Card, CardMedia, Typography } from "@mui/material";
import { cardImagePath, SkinSelection } from "shared/cardSkins";
import { useAssets } from "context/AssetPreloadContext";
import { ACTION_ROLE } from "shared/constants/actionCards";

export interface ActionCardData {
  action: string;
  image: string;
  title: string;
  description: string;
  disabled?: boolean;
}

interface Props extends ActionCardData {
  onClick: (action: string) => void;
  skins?: SkinSelection;
}

export default function ActionCard({ action, image, title, description, disabled, onClick , skins}: Props) {
   const { src } = useAssets();
  const role = ACTION_ROLE[action];
  // اگر اکشن نقش دارد، تصویر از اسکین کاربر؛ وگرنه همان تصویر ثابت
  const finalImage = src(role ? cardImagePath(role, skins) : image);
  return (
    <Card
      sx={{
        flex: "0 0 50%",
        borderRadius: "10px",
        position: "relative",
        width: "100%",
        cursor: disabled ? "default" : "pointer",
        // opacity: disabled ? 0.45 : 1,
        // transition: "transform 0.15s",
        // "&:hover": disabled ? {} : { transform: "scale(1.02)" },
      }}
      onClick={() => !disabled && onClick(action)}
    >
      <CardMedia
        component="img"
        height="100%"
        width="100%"
        image={finalImage}
        alt={title}
        sx={{ objectFit: "cover", width: "100%", height: "100%" }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 64,
          p: 1,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          color: "white",
          zIndex: 3,
        }}
      >
        <Typography variant="body1" fontWeight="bold" fontSize="0.65rem" gutterBottom>
          {title}
        </Typography>
        <Typography
          variant="caption"
          fontSize="0.6rem"
          sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {description}
        </Typography>
      </Box>
    </Card>
  );
}