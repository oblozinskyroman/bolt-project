// src/hooks/useSpeechToText.ts
import { useEffect, useRef, useState } from "react";

type Options = {
  lang?: string;
  onText?: (text: string) => void;
};

type SpeechHook = {
  isSupported: boolean;
  isListening: boolean;
  toggleListening: () => void;
};

export function useSpeechToText(
  { lang = "sk-SK", onText }: Options = {}
): SpeechHook {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shouldListenRef = useRef(false);

  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SR) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const recog: SpeechRecognition = new SR();
    recog.lang = lang;
    recog.interimResults = false; // stačia finálne výsledky
    recog.continuous = true;      // nech beží dlhšie, nie len 1 vetu

    recog.onresult = (event: SpeechRecognitionEvent) => {
      const text = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join(" ");
      if (onText) onText(text);
    };

    recog.onstart = () => {
      setIsListening(true);
    };

    recog.onend = () => {
      // Chrome rád ukončí session po krátkej pauze
      setIsListening(false);
      if (shouldListenRef.current) {
        try {
          recog.start(); // reštartujeme, pokiaľ je toggle stále zapnutý
        } catch {
          shouldListenRef.current = false;
        }
      }
    };

    recog.onerror = () => {
      shouldListenRef.current = false;
      setIsListening(false);
    };

    recognitionRef.current = recog;

    return () => {
      shouldListenRef.current = false;
      try {
        recog.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    };
  }, [lang, onText]);

  const toggleListening = () => {
    if (!isSupported || !recognitionRef.current) return;
    const recog = recognitionRef.current;

    if (isListening || shouldListenRef.current) {
      // vypnúť
      shouldListenRef.current = false;
      try {
        recog.stop();
      } catch {
        // ignore
      }
    } else {
      // zapnúť
      shouldListenRef.current = true;
      try {
        recog.start();
      } catch {
        shouldListenRef.current = false;
      }
    }
  };

  return { isSupported, isListening, toggleListening };
}
