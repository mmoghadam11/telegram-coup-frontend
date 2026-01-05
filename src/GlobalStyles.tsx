// src/theme/GlobalStyles.tsx
import { GlobalStyles as MuiGlobalStyles, useTheme } from "@mui/material";
import React from "react";

export default function GlobalStyles() {
  const theme = useTheme();

  return (
    <MuiGlobalStyles
      styles={(theme) => ({
        /* Webkit scrollbars (Chrome, Edge, Safari) */
        "*::-webkit-scrollbar": {
          width: "8px",
          height: "8px",
        },
        "*::-webkit-scrollbar-track": {
          backgroundColor:
            theme.palette.mode === "dark" ? "#1a1a1a" : "#f0f0f0",
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: theme.palette.mode === "dark" ? "#555" : "#bdbdbd",
          borderRadius: "4px",
        },
        "*::-webkit-scrollbar-thumb:hover": {
          backgroundColor: theme.palette.mode === "dark" ? "#777" : "#999",
        },

        /* Firefox (using scrollbar-color) */
        "*": {
          scrollbarColor:
            theme.palette.mode === "dark" ? "#555 #1a1a1a" : "#bdbdbd #f0f0f0",
          scrollbarWidth: "thin",
        },
      })}
    />
  );
}
