// src/lib/askAI.ts

const BASE = import.meta.env.VITE_SUPABASE_URL;
const URL = `${BASE}/functions/v1/ai-assistant`;

export async function askAI(prompt: string, meta: any = {}) {
  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, meta }),
  });

  let data: any = null;
  try { data = await res.json(); } catch {}

  if (!res.ok) {
    const msg = data?.error || `AI request failed (${res.status})`;
    throw new Error(msg);
  }

  return {
    reply: data.answer ?? "",
    meta: data.meta ?? {},
  };
}
