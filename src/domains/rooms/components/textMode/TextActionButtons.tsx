import React from "react";
import { Button, Stack } from "@mui/material";

const COSTS: Record<string, number> = { coup: 7, assassinate: 3, anarchist_attack: 5 };

export default function TextActionButtons({ coins, labels, onSelect }: {
  coins: number; labels: Record<string, string>; onSelect: (action: string) => void;
}) {
  const mustCoup = coins >= 10; // همون قانونی که کاروسل هم رعایت می‌کنه
  const actions = Object.keys(labels).filter((a) =>
    mustCoup ? a === "coup" : coins >= (COSTS[a] ?? 0)
  );
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
      {actions.map((a) => (
        <Button key={a} size="small" variant="outlined" onClick={() => onSelect(a)}>{labels[a]}</Button>
      ))}
    </Stack>
  );
}