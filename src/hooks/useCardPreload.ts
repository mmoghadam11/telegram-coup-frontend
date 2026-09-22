import { useCallback, useEffect, useRef } from "react";

const actionCard = ["duke", "captain", "ambassador", "princess", "assassin", "contessa", "aid", "income", "coup"];

export function useCardPreload() {
  const revealAudioRef = useRef<HTMLAudioElement | null>(null);
  const anarchistAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    actionCard.forEach((role) => {
      const img = new Image();
      img.src = `/assets/images/cards/minimal/${role}.png`;
    });

    const reveal = new Audio("/assets/sounds/reveal.mp3");
    reveal.preload = "auto";
    reveal.load();
    revealAudioRef.current = reveal;

    const anarchist = new Audio("/assets/sounds/clock-tick.mp3");
    anarchist.preload = "auto";
    anarchist.loop = true;
    anarchist.load();
    anarchistAudioRef.current = anarchist;

    return () => {
      reveal.pause();
      revealAudioRef.current = null;
      anarchist.pause();
      anarchistAudioRef.current = null;
      sourceNodeRef.current?.disconnect();
      gainNodeRef.current?.disconnect();
      audioCtxRef.current?.close();
      audioCtxRef.current = null;
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

  // یه گراف صوتی می‌سازه که صدای خام <audio> رو از یه GainNode رد می‌کنه تا تقویت بشه
  const ensureAudioGraph = useCallback(() => {
    const audio = anarchistAudioRef.current;
    if (!audio || audioCtxRef.current) return;

    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new Ctx();
    const source = ctx.createMediaElementSource(audio);
    const gain = ctx.createGain();
    gain.gain.value = 3; // ۳ برابر صدای خام — عدد رو اگه لازم بود تنظیم کنید (بین ۲ تا ۵ معمولاً منطقیه)

    source.connect(gain);
    gain.connect(ctx.destination);

    audioCtxRef.current = ctx;
    sourceNodeRef.current = source;
    gainNodeRef.current = gain;
  }, []);

  const startAnarchistLoop = useCallback(() => {
    const audio = anarchistAudioRef.current;
    if (!audio) return;

    ensureAudioGraph();
    // بعضی مرورگرها AudioContext رو تا یه تعامل کاربر suspended نگه می‌دارن
    audioCtxRef.current?.resume();

    if (audio.paused) {
      void audio.play().catch((error) => {
        console.debug("Anarchist loop sound blocked:", error);
      });
    }
  }, [ensureAudioGraph]);

  const stopAnarchistLoop = useCallback(() => {
    const audio = anarchistAudioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }, []);

  return {
    playRevealSound,
    startAnarchistLoop,
    stopAnarchistLoop,
  };
}