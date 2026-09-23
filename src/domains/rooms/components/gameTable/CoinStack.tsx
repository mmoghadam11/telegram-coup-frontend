import React from "react";
import { Box, Typography } from "@mui/material";

interface CoinStackProps {
  count: number;
}

export default function CoinStack({ count }: CoinStackProps) {
  if (count <= 0) return null;

  return (
    <Box
      sx={{
        direction:"row",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.2,
      }}
    >
      <Box
        component="img"
        src="/assets/images/cards/coin.png"
        alt="coin"
        sx={{
          width: 22,
          height: 22,
          objectFit: "contain",
          filter: "drop-shadow(0 2px 2px rgba(0,0,0,.35))",
        }}
      />

      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 700,
          color: "text.primary",
          lineHeight: 1,
        }}
      >
        {count}
      </Typography>
    </Box>
  );
}