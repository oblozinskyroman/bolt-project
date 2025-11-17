// src/lib/askAI.ts

const BASE = import.meta.env.VITE_SUPABASE_URL;

// Môže pomôcť pri debugovaní, ak zabudneš env premennú
if (!BASE) {
  console.warn(
    "[askAI] VITE_SUPABASE_URL nie je nastavené – volanie AI asistenta zlyhá."
  );
}

const URL = `${BASE}/functions/v1/ai-assistant`;

export type ChatTurn = {
  role: "user" | "assistant" | "system";
  content: string;
};

// Informácie o leadovi, ktoré vieš poslať k logu (voliteľné)
export type LeadMeta = {
  name?: string;
  email?: string;
  phone?: string;
  note?: string; // napr. „záujem o plán Growth“
};

// Všetko, čo posielame do meta – je to voliteľné, takže ti nič nerozbije
export type AskMeta = {
  // existujúce veci, ktoré už používame
  page?: number;
  limit?: number;
  userLocation?: string;
  coords?: { lat: number; lng: number } | null;
  filters?: string[];

  // nové polia pre budúci reporting a lead capture
  siteSlug?: string;      // napr. "servisai", "klient1", ...
  sourcePath?: string;    // napr. location.pathname
  lead?: LeadMeta;        // kontakt, ak ho od užívateľa získaš
};

type RawResponse = {
  ok?: boolean;
  answer?: string;
  cards?: any[];
  intent?: any;
  meta?: any;
  error?: string;
};

/**
 * Hlavná funkcia na volanie AI asistenta.
 *
 * - `prompt`     → aktuálna otázka používateľa
 * - `history`    → predošlé repliky (user/assistant), aby mal model kontext
 * - `temperature`→ tvorivosť odpovede (0–1)
 * - `meta`       → doplnkové dáta (siteSlug, lead, geo, filtre...)
 */
export async function askAI(
  prompt: string,
  history: ChatTurn[] = [],
  temperature = 0.7,
  meta: AskMeta = {}
) {
  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // Dôležité: posielame prompt + history + temperature + meta
    body: JSON.stringify({
      message: prompt,
      history,
      temperature,
      meta,
    }),
  });

  let data: RawResponse | null = null;

  try {
    data = (await res.json()) as RawResponse;
  } catch {
    // Ak odpoveď nie je validné JSON, necháme data = null
  }

  // HTTP chyba alebo funkcia explicitne vrátila ok:false
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
