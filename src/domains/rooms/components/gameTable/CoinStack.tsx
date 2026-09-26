import React from "react";
import { Badge, Box, Typography } from "@mui/material";

interface CoinStackProps {
  count: number;
}

export default function CoinStack({ count }: CoinStackProps) {
  if (count <= 0) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Badge
        badgeContent={count}
        color={count<9?"default":"secondary"}
        // max={99}
        // sx={{
        //   "& .MuiBadge-badge": {
        //     fontSize: 11,
        //     fontWeight: 700,
        //     height: 18,
        //     minWidth: 18,
        //     border: "1.5px solid",
        //     borderColor: "background.paper",
        //     color: "#3b2200",
        //   },
        // }}
      >
        <Box
          component="img"
          src="/assets/images/cards/coin.png"
          alt="coin"
          sx={{
            width: 28,
            height: 28,
            objectFit: "contain",
            filter: "drop-shadow(0 2px 2px rgba(0,0,0,.35))",
          }}
        />
      </Badge>
    </Box>
  );
}