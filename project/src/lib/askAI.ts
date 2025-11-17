// src/lib/askAI.ts

const BASE = import.meta.env.VITE_SUPABASE_URL;
const URL = `${BASE}/functions/v1/ai-assistant`;

// Jeden krok v chate (user / assistant / system)
export type ChatTurn = {
  role: "user" | "assistant" | "system";
  content: string;
};

// Info o leadovi – používaj v meta.lead
export type LeadInfo = {
  name?: string;
  email?: string;
  phone?: string;
  note?: string;
  consent?: boolean; // napr. súhlas so spätným kontaktom
};

// Meta údaje, ktoré posielame do Edge funkcie a logujeme do ai_logs.meta
export type AskMeta = {
  page?: number;
  limit?: number;
  userLocation?: string;          // napr. "Bratislava"
  coords?: { lat: number; lng: number } | null;
  filters?: string[];             // tvoje quick filtre, tagy atď.
  sessionId?: string;             // ID aktuálnej relácie / návštevy
  tags?: string[];                // voľné tagy, napr. ["pricing", "lead"]
  lead?: LeadInfo;                // tu pošleš email/telefon, keď ho v UI zistíš
  [key: string]: any;             // fallback, keby si chcel pridať niečo navyše
};

type RawResponse = {
  ok?: boolean;
  answer?: string;
  cards?: any[];
  intent?: any;
  meta?: any;
  error?: string;
};

// Hlavná funkcia, ktorú volá frontend
export async function askAI(
  prompt: string,
  history: ChatTurn[] = [],
  temperature = 0.7,
  meta: AskMeta = {},
  siteSlug = "servisai" // môžeš prebiť pri viacerých weboch
) {
  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // to, čo očakáva Edge funkcia
      message: prompt,
      history,
      temperature,
      meta,
      site_slug: siteSlug,
    }),
  });

  let data: RawResponse | null = null;
  try {
    data = (await res.json()) as RawResponse;
  } catch {
    // necháme data = null, nižšie to ošetríme
  }

  // ak HTTP zlyhá alebo nám funkcia vráti ok:false -> vyhodíme chybu
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
