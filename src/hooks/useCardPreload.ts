import { useCallback, useEffect, useRef } from "react";

const ROLES = ["duke", "captain", "ambassador", "princess", "assassin", "contessa"];

export function useCardPreload() {
    const revealAudioRef = useRef<HTMLAudioElement | null>(null);
    useEffect(() => {
        ROLES.forEach((role) => {
            const img = new Image();
            img.src = `/assets/images/cards/minimal/${role}.png`;
        });

        // preload reveal sound
        const audio = new Audio("/assets/sounds/reveal.wav");
        audio.preload = "auto";
        audio.load();

        revealAudioRef.current = audio;

        return () => {
            audio.pause();
            revealAudioRef.current = null;
        };
    }, []);

    const playRevealSound = useCallback(() => {
    const audio = revealAudioRef.current;

    if (!audio) return;

    audio.currentTime = 0;

    void audio.play().catch((error) => {
      console.debug("Reveal sound blocked:", error);
    });
  }, []);

    return {
        playRevealSound,
    };
}