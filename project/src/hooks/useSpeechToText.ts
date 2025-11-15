// src/hooks/useSpeechToText.ts
import { useEffect, useRef, useState } from 'react';

type Options = {
  lang?: string;
  onText?: (text: string) => void;
};

type SpeechRecognitionLike = any;

export function useSpeechToText(
  { lang = 'sk-SK', onText }: Options = {}
) {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SR) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const recog: SpeechRecognitionLike = new SR();
    recog.lang = lang;
    recog.interimResults = false;
    recog.continuous = false;

    recog.onresult = (event: SpeechRecognitionEvent) => {
      const text = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join(' ')
        .trim();

      if (text && onText) onText(text);
      setIsListening(false);
    };

    recog.onerror = () => {
      setIsListening(false);
    };

    recog.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recog;

    return () => {
      try {
        recog.onresult = null as any;
        recog.onerror = null as any;
        recog.onend = null as any;
        recog.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    };
  }, [lang, onText]);

  const start = () => {
    if (!isSupported || !recognitionRef.current) return;
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      // napr. "start" called while already running – ignorujeme
    }
  };

  const stop = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch {
      // ignore
    }
    setIsListening(false);
  };

  return {
    isSupported,
    isListening,
    start,
    stop,
  };
}
