// src/lib/askAI.ts

const BASE = import.meta.env.VITE_SUPABASE_URL;
const URL = `${BASE}/functions/v1/ai-assistant`;

// čo si ukladáme do histórie chatu
export type ChatTurn = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type AskMeta = {
  page?: number;
  limit?: number;
  userLocation?: string;
  coords?: { lat: number; lng: number } | null;
  filters?: string[];
  // necháme si priestor na ďalšie veci
  [key: string]: any;
};

export type AskResult = {
  reply: string;
  cards: any[];
  intent?: any;
  meta: Record<string, any>;
};

export async function askAI(
  prompt: string,
  history: ChatTurn[] = [],
  temperature = 0.7,
  meta: AskMeta = {}
): Promise<AskResult> {
  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      history,
      temperature,
      meta,
    }),
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // nič – chybu ošetríme nižšie
  }

  // chytáme HTTP chybu aj ok:false z funkcie
  if (!res.ok || data?.ok === false) {
    const msg =
      data?.error || data?.message || `AI request failed (${res.status})`;
    throw new Error(msg);
  }

  return {
    reply: data?.answer ?? "",
    cards: Array.isArray(data?.cards) ? data.cards : [],
    intent: data?.intent ?? undefined,
    meta: data?.meta ?? {},
  };
}
