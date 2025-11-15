import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Mic, Loader2 } from "lucide-react";
import { askAI, type ChatTurn } from "../lib/askAI";

type Role = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: Role;
  content: string;
}

const FloatingChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Ahoj, som ServisAI bot. Spýtaj sa ma, ako by AI vedela pomôcť na tvojom webe.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  // scroll na spodok vždy, keď pribudne správa alebo sa otvorí widget
  useEffect(() => {
    if (!isOpen) return;
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isSending) return;

    // lokálna user správa
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");

    // história pre backend
    const nextHistory: ChatTurn[] = [
      ...history,
      { role: "user", content: text },
    ];
    setHistory(nextHistory);

    setIsSending(true);

    try {
      const { reply } = await askAI(text, nextHistory, 0.7, {
        page: 0,
        limit: 0,
        userLocation: "",
        coords: null,
        filters: [],
        source: "floating-widget",
      } as any);

      const answerText =
        reply?.toString().trim() ||
        "Ospravedlňujem sa, ale nedostal som žiadnu odpoveď od AI.";

      const botMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: answerText,
      };

      setMessages([...nextMessages, botMessage]);
      setHistory([
        ...nextHistory,
        { role: "assistant", content: answerText },
      ]);
    } catch (error) {
      console.error("Chyba vo FloatingChatWidget → askAI:", error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content:
          "Niečo zlyhalo pri volaní AI. Skús to prosím o chvíľu znova alebo cez hlavné demo.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  // fokús na input po otvorení
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <>
      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 z-[9999] w-[360px] max-w-[90vw]">
          <div className="rounded-2xl bg-white/90 backdrop-blur-xl shadow-2xl border border-blue-100 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-sky-500 to-blue-600 text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">ServisAI Chat</span>
                  <span className="text-[11px] opacity-80">
                    AI asistent pre tvoji web
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleToggle}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Zavrieť chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="px-3 py-3 space-y-2 max-h-[380px] overflow-y-auto bg-slate-50/60">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 text-sm rounded-2xl max-w-[80%] whitespace-pre-wrap shadow-sm ${
                      m.role === "user"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white text-slate-800 rounded-bl-sm border border-slate-100"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {isSending && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 text-sm rounded-2xl bg-white border border-slate-100 text-slate-500 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI premýšľa…</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-100 bg-white/90 px-3 py-2 flex items-center gap-2">
              <button
                type="button"
                className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                title="(Mikrofón doplníme neskôr)"
              >
                <Mic className="w-4 h-4" />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 border border-slate-200 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
                placeholder="Napíšte otázku…"
              />
              <button
                type="button"
                onClick={sendMessage}
                disabled={isSending || !input.trim()}
                className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
                aria-label="Odoslať správu"
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating bubble – POSUNUTÁ NAD reCAPTCHA */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isOpen ? "Zavrieť chat" : "Otvoriť chat"}
        className="fixed bottom-6 right-4 z-[9999] h-14 w-14 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-[0_16px_40px_rgba(15,23,42,0.45)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>
    </>
  );
};

export default FloatingChatWidget;
