// src/hooks/useSpeechToText.ts
import { useEffect, useRef, useState } from "react";

type Options = {
  lang?: string;
  onText?: (text: string) => void;
};

export function useSpeechToText(options: Options = {}) {
  const { lang = "sk-SK", onText } = options;

  const [isSupported, setIsSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;

    if (!SR) {
      setIsSupported(false);
      return;
    }

    const recog: SpeechRecognition = new SR();
    recog.lang = lang;
    recog.interimResults = false;
    recog.continuous = true; // dôležité – neukončí sa po 1 vete

    recog.onresult = (event: SpeechRecognitionEvent) => {
      const text = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join(" ");
      if (onText) onText(text);
    };

    recog.onerror = (e) => {
      console.error("SpeechRecognition error:", e);
      setIsListening(false);
    };

    recog.onend = () => {
      // keď používateľ stopne mikrofón, necháme isListening = false
      setIsListening(false);
    };

    recognitionRef.current = recog;

    return () => {
      recog.abort();
      recognitionRef.current = null;
    };
  }, [lang, onText]);

  const toggleListening = () => {
    if (!isSupported) return;
    const recog = recognitionRef.current;
    if (!recog) return;

    try {
      if (isListening) {
        recog.stop();
        setIsListening(false);
      } else {
        recog.start();
        setIsListening(true);
      }
    } catch (e) {
      console.error("SpeechRecognition start/stop error:", e);
      setIsListening(false);
    }
  };

  return {
    isSupported,
    isListening,
    toggleListening,
  };
}
