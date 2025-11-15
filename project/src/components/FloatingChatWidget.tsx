import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Mic,
  Loader2,
} from "lucide-react";

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

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // auto-scroll na spodok pri novej správe
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsSending(true);

    // ZATIAĽ LEN FAKE ODPOVEĎ – neskôr to vymeníme za askAI()
    setTimeout(() => {
      const fakeReply: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content:
          "Toto je zatiaľ demo odpoveď. V ďalšom kroku to napojíme na tvoju funkciu askAI().",
      };
      setMessages((prev) => [...prev, fakeReply]);
      setIsSending(false);
    }, 900);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMicClick = () => {
    // Tu neskôr pripojíme useSpeechToText()
    console.log("Mic clicked – sem pôjde hlasové zadávanie");
  };

  return (
    <>
      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50">
          <div className="w-[360px] h-[520px] rounded-3xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_18px_60px_rgba(15,23,42,0.35)] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/50 bg-gradient-to-r from-sky-500/90 to-blue-600/90 text-white">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-2xl bg-white/15 flex items-center justify-center">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">ServisAI Chat</span>
                  <span className="text-[11px] text-white/80">
                    AI asistent pre tvoj web
                  </span>
                </div>
              </div>
              <button
                onClick={handleToggle}
                className="p-1.5 rounded-full hover:bg-white/20 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 px-3 py-3 space-y-2 overflow-y-auto bg-gradient-to-b from-sky-50/70 via-white to-slate-50">
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm
                        ${
                          isUser
                            ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-br-sm"
                            : "bg-white/90 border border-slate-100 text-slate-900 rounded-bl-sm"
                        }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-100 bg-white/90 px-3 py-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleMicClick}
                  className="shrink-0 h-9 w-9 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition"
                >
                  <Mic className="h-4 w-4" />
                </button>

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Napíšte otázku..."
                  className="flex-1 h-9 rounded-2xl border border-slate-200 bg-slate-50/70 px-3 text-sm outline-none focus:ring-2 focus:ring-sky-400/70 focus:border-transparent"
                />

                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isSending || !input.trim()}
                  className="shrink-0 h-9 px-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Posielam</span>
                    </>
                  ) : (
                    <>
                      <span>Odoslať</span>
                      <Send className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating bubble */}
      <button
        type="button"
        onClick={handleToggle}
        className="fixed bottom-30 right-4 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-[0_16px_40px_rgba(15,23,42,0.45)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        aria-label={isOpen ? "Zavrieť chat" : "Otvoriť chat"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
};

export default FloatingChatWidget;
