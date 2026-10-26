import React from "react";
import { Stack } from "@mui/material";
import { motion } from "motion/react";
import RoleCardImage from "./proving/RoleCardImage";
import { SkinSelection } from "shared/cardSkins";

export function toggleIndex(prev: number[], i: number, max: number): number[] {
  if (prev.includes(i)) return prev.filter((x) => x !== i);
  if (max <= 1) return [i]; // انتخاب تکی: جایگزین قبلی می‌شه
  return prev.length < max ? [...prev, i] : prev;
}

interface Props {
  roles: string[];
  selected: number[];
  onToggle: (i: number) => void;
  hiddenIndexes?: number[];
  size?: number;
  skins?: SkinSelection;
}

export default function CardPicker({ roles, selected, onToggle, hiddenIndexes = [], size = 64 , skins}: Props) {
  return (
    <Stack direction="row" flexWrap="wrap" justifyContent="center" useFlexGap sx={{ gap: 2, py: 2 }}>
      {roles.map((role, i) => {
        if (hiddenIndexes.includes(i)) return null;
        const isSel = selected.includes(i);
        return (
          <motion.div
            key={i}
            animate={{ scale: isSel ? 1.2 : 1, y: isSel ? -6 : 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            style={{ filter: isSel ? "drop-shadow(0 0 10px rgba(255,193,7,.95))" : "none" }}
          >
            <RoleCardImage role={role} size={size} onClick={() => onToggle(i)} skins={skins}/>
          </motion.div>
        );
      })}
    </Stack>
  );
}