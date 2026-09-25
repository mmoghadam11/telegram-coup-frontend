import { Box, ListItemButton, Typography } from "@mui/material";
import { ACTION_CARD_DATA } from "shared/constants/actionCards";

interface ActionButtonProps {
  action: string;
  onClick: (action: string) => void;
  sx?: any;
}

export default function ActionButton({
  action,
  onClick,
  sx,
}: ActionButtonProps) {
  const data = ACTION_CARD_DATA[action];

  return (
    <ListItemButton
      onClick={() => onClick(action)}
      sx={{
        minWidth: { xs: 150, sm: 180 },
        minHeight: 55,
        px: 1,
        py: 0.5,
        borderRadius: 2,
        background: "rgba(0,0,0,.35)",
        border: "1px solid rgba(255,255,255,.12)",
        display: "flex",
        gap: 1,
        overflow: "hidden",

        "&:hover": {
          background: "rgba(255,255,255,.08)",
        },

        ...sx,
      }}
    >
      <Box
        component="img"
        src={data.image}
        alt={data.title}
        sx={{
        //   width: 34,
          height:"100%",
          aspectRatio:"3/4",
        //   height: 46,
          objectFit: "cover",
          borderRadius: 0.7,
          flexShrink: 0,
        }}
      />

      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: { xs: 11, sm: 13 },
            fontWeight: 700,
            color: "white",
            lineHeight: 1.2,
          }}
        >
          {data.title}
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: 8, sm: 9 },
            color: "rgba(255,255,255,.65)",
            lineHeight: 1.2,
            mt: 0.3,
          }}
        >
          {data.description}
        </Typography>
      </Box>
    </ListItemButton>
  );
}