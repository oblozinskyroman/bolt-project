// src/hooks/useSpeechToText.ts
import { useEffect, useRef, useState } from 'react';

type Options = {
  lang?: string;
  onText?: (text: string) => void;
};

export function useSpeechToText({ lang = 'sk-SK', onText }: Options = {}) {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SR) {
      setIsSupported(false);
      return;
    }

    const recog: SpeechRecognition = new SR();
    recog.lang = lang;
    recog.interimResults = false;
    recog.continuous = false;

    recog.onresult = (event: SpeechRecognitionEvent) => {
      const text = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join(' ');
      if (onText) onText(text);
    };

    recog.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recog;
    setIsSupported(true);

    return () => {
      recog.abort();
    };
  }, [lang, onText]);

  const start = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {}
  };

  const stop = () => {
    recognitionRef.current?.stop();
  };

  return {
    isSupported,
    isListening,
    start,
    stop,
  };
}
