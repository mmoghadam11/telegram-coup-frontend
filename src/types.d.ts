import { PaletteOptions } from "@mui/material";

export type ThemeMode = "light" | "dark";

export type CustomPalette = {
  [mode in ThemeMode]: PaletteOptions;
}
