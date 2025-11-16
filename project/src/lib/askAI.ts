// src/lib/askAI.ts

const BASE = import.meta.env.VITE_SUPABASE_URL;
const URL = `${BASE}/functions/v1/ai-assistant`;

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type AskMeta = {
  history?: ChatMessage[];
  temperature?: number;
  // prípadne ďalšie polia, ktoré budeš chcieť posielať
  [key: string]: any;
};

export async function askAI(prompt: string, meta: AskMeta = {}) {
  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // dôležité: meta rozpustíme na root úroveň,
    // aby sa do Edge Function dostali history, temperature atď.
    body: JSON.stringify({
      prompt,
      ...meta,
    }),
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // necháme data = null, nižšie to ošetríme
  }

  // kontrolujeme HTTP chybu aj ok:false z funkcie
  if (!res.ok || data?.ok === false) {
    const msg =
      data?.error || `AI request failed (${res.status})`;
    throw new Error(msg);
  }

  return {
    reply: data?.answer ?? "",
    meta: data?.meta ?? {},
  };
}
