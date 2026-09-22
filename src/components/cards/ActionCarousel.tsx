import React from "react";
import { Box } from "@mui/material";
import useEmblaCarousel from "embla-carousel-react";
import ActionCard, { ActionCardData } from "./ActionCard";

interface Props {
  actions: ActionCardData[];
  onSelect: (action: string) => void;
}

export default function ActionCarousel({ actions, onSelect }: Props) {
  const [emblaRef] = useEmblaCarousel({ loop: true, direction: "rtl" });

  if (actions.length === 0) return null;

  return (
    <Box ref={emblaRef} overflow="hidden">
      <Box display="flex">
        {actions.map((item) => (
          <ActionCard key={item.action} {...item} onClick={onSelect} />
        ))}
      </Box>
    </Box>
  );
}