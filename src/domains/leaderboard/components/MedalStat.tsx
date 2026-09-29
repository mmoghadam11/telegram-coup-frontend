import React from "react";
import { Stack, Box, Typography } from "@mui/material";

interface Props {
  icon: string; // ایموجی یا مسیر عکس
  label: string;
  value: number;
  color: string;
}

export default function MedalStat({ icon, label, value, color }: Props) {
  return (
    <Stack alignItems="center" spacing={0.3} sx={{ minWidth: 70 }}>
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          background: `radial-gradient(circle, ${color}33 0%, ${color}11 100%)`,
          border: "2px solid",
          borderColor: color,
        }}
      >
        {icon}
      </Box>
      <Typography variant="subtitle2" fontWeight="bold">
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Stack>
  );
}