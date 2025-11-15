// src/hooks/useSpeechToText.ts
import { useEffect, useRef, useState } from "react";

type Options = {
  lang?: string;
  onText?: (text: string) => void;
};

export function useSpeechToText({ lang = "sk-SK", onText }: Options = {}) {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any | null>(null);
  const callbackRef = useRef<((text: string) => void) | undefined>(onText);

  // aktualizuj callback bez re-inicializácie celej služby
  useEffect(() => {
    callbackRef.current = onText;
  }, [onText]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SR) {
      console.warn("SpeechRecognition API nie je podporovaná v tomto prehliadači.");
      setIsSupported(false);
      return;
    }

    const recog = new SR();
    recog.lang = lang;
    recog.interimResults = false;
    recog.continuous = false;

    recog.onresult = (event: any) => {
      const text = Array.from(event.results)
        .map((r: any) => r[0]?.transcript ?? "")
        .join(" ")
        .trim();

      console.log("[STT] onresult:", text);
      if (text && callbackRef.current) {
        callbackRef.current(text);
      }
    };

    recog.onend = () => {
      console.log("[STT] onend");
      setIsListening(false);
    };

    recog.onerror = (ev: any) => {
      console.error("[STT] error:", ev);
      setIsListening(false);
    };

    recognitionRef.current = recog;
    setIsSupported(true);
    console.log("[STT] SpeechRecognition inicializovaná");

    return () => {
      try {
        recog.stop();
        recog.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
      console.log("[STT] cleanup");
    };
  }, [lang]);

  const toggleListening = () => {
    const recog = recognitionRef.current;
    if (!recog || !isSupported) {
      console.warn("[STT] toggleListening – nie je podporované alebo neinicializované");
      return;
    }

    if (isListening) {
      try {
        recog.stop();
      } catch (e) {
        console.error("[STT] stop error:", e);
      }
      setIsListening(false);
    } else {
      try {
        recog.start();
        console.log("[STT] start – čaká sa na povolenie mikrofónu");
        setIsListening(true);
      } catch (e) {
        console.error("[STT] start error:", e);
        setIsListening(false);
      }
    }
  };

  return {
    isSupported,
    isListening,
    toggleListening,
  };
}
