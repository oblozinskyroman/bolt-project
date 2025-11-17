// src/lib/askAI.ts

const BASE = import.meta.env.VITE_SUPABASE_URL;
const URL = `${BASE}/functions/v1/ai-assistant`;

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
  site_slug?: string;     // ⭐ pridali sme sem
};

type RawResponse = {
  ok?: boolean;
  answer?: string;
  cards?: any[];
  intent?: any;
  meta?: any;
  error?: string;
};

export async function askAI(
  prompt: string,
  history: ChatTurn[] = [],
  temperature = 0.7,
  meta: AskMeta = {}
) {
  // ⭐ Keď meta neobsahuje site_slug → nastav vždy "servisai"
  const fixedMeta = {
    site_slug: "servisai",
    ...meta,
  };

  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: prompt,
      history,
      temperature,
      ...fixedMeta,
    }),
  });

  let data: RawResponse | null = null;
  try {
    data = (await res.json()) as RawResponse;
  } catch {}

  if (!res.ok || data?.ok === false) {
    const msg =
      data?.error ||
      `AI request failed (${res.status} ${res.statusText || ""})`.trim();
    throw new Error(msg);
  }

  return {
    reply: data?.answer ?? "",
    cards: data?.cards ?? [],
    intent: data?.intent,
    meta: data?.meta ?? {},
  };
}
