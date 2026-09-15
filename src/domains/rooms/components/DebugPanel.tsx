import React from "react";
import { Paper, Typography } from "@mui/material";

interface Props {
  debugMode: boolean;
  data: any;
}

export default function DebugPanel({ debugMode, data }: Props) {
  if (!debugMode) return null;

  return (
    <Paper sx={{ p: 1, mb: 2, bgcolor: "warning.light", maxHeight: 300, overflowY: "auto" }}>
      <Typography
        variant="caption"
        component="pre"
        sx={{ direction: "ltr", textAlign: "left", whiteSpace: "pre-wrap", fontFamily: "monospace" }}
      >
        {JSON.stringify(data, null, 2)}
      </Typography>
    </Paper>
  );
}