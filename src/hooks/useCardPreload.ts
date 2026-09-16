import { useEffect } from "react";

const ROLES = ["duke", "captain", "ambassador", "princess", "assassin", "contessa"];

export function useCardPreload() {
  useEffect(() => {
    ROLES.forEach((role) => {
      const img = new Image();
      img.src = `/assets/images/cards/minimal/${role}.png`;
    });
  }, []);
}