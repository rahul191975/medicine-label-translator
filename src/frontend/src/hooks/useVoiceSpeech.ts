import { useCallback, useEffect, useRef, useState } from "react";

export type VoiceState = "idle" | "playing" | "paused";

export function useVoiceSpeech() {
  const [state, setState] = useState<VoiceState>("idle");
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const chunksRef = useRef<string[]>([]);
  const currentIndexRef = useRef<number>(0);
  const langRef = useRef<string>("en");

  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    return () => {
      if (isSupported) window.speechSynthesis.cancel();
    };
  }, [isSupported]);

  const speakChunk = useCallback(
    (index: number) => {
      if (!isSupported) return;
      if (index >= chunksRef.current.length) {
        setState("idle");
        setActiveIndex(-1);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunksRef.current[index]);
      utterance.lang = langRef.current;
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onstart = () => {
        setActiveIndex(index);
        currentIndexRef.current = index;
      };
      utterance.onend = () => {
        speakChunk(index + 1);
      };
      utterance.onerror = () => {
        setState("idle");
        setActiveIndex(-1);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported],
  );

  const play = useCallback(
    (chunks: string[], langCode: string) => {
      if (!isSupported) return;
      window.speechSynthesis.cancel();
      chunksRef.current = chunks;
      langRef.current = langCode;
      currentIndexRef.current = 0;
      setState("playing");
      speakChunk(0);
    },
    [isSupported, speakChunk],
  );

  const pause = useCallback(() => {
    if (!isSupported) return;
    if (state === "playing") {
      window.speechSynthesis.pause();
      setState("paused");
    } else if (state === "paused") {
      window.speechSynthesis.resume();
      setState("playing");
    }
  }, [isSupported, state]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setState("idle");
    setActiveIndex(-1);
    currentIndexRef.current = 0;
  }, [isSupported]);

  return { state, activeIndex, isSupported, play, pause, stop };
}
