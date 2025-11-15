import { useCallback, useEffect, useRef, useState } from "react";

type Options = {
  lang?: string;
  onText?: (text: string) => void;
};

type UseSpeechToTextResult = {
  isSupported: boolean;
  isListening: boolean;
  toggleListening: () => void;
};

export function useSpeechToText({
  lang = "sk-SK",
  onText,
}: Options): UseSpeechToTextResult {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // držíme si jednu inštanciu recognition
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const onTextRef = useRef<typeof onText>();

  // vždy aktualizujeme callback, ale nerozbíjame recognition
  useEffect(() => {
    onTextRef.current = onText;
  }, [onText]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const AnyWindow = window as any;
    const SpeechRecognition =
      AnyWindow.SpeechRecognition || AnyWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition: SpeechRecognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.continuous = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const last = event.results[event.results.length - 1];
      if (!last) return;
      const text = last[0].transcript;
      if (onTextRef.current) {
        onTextRef.current(text);
      }
    };

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e);
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setIsSupported(true);

    return () => {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    };
  }, [lang]);

  const toggleListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    try {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    } catch (e) {
      console.error("Speech recognition start/stop failed:", e);
    }
  }, [isListening]);

  return { isSupported, isListening, toggleListening };
}
