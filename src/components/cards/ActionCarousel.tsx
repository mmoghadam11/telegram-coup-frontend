import React from "react";
import { Box } from "@mui/material";
import useEmblaCarousel from "embla-carousel-react";
import ActionCard, { ActionCardData } from "./ActionCard";
import { SkinSelection } from "shared/cardSkins";

interface Props {
  actions: ActionCardData[];
  onSelect: (action: string) => void;
  skins?: SkinSelection;
}

export default function ActionCarousel({ actions,skins, onSelect }: Props) {
  const [emblaRef] = useEmblaCarousel({ loop: true, direction: "rtl" });

  if (actions.length === 0) return null;

  return (
    <Box ref={emblaRef} overflow="hidden">
      <Box display="flex">
        {actions.map((item,cardIndex) => (
          <ActionCard key={item.action} {...item} skins={skins} onClick={onSelect} />
        ))}
      </Box>
    </Box>
  );
}