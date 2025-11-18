// src/pages/AdminLogsPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  ArrowLeft,
  Download,
  Filter,
  Users,
  Activity,
} from "lucide-react";

interface AdminLogsPageProps {
  onNavigateBack: () => void;
}

type AiLog = {
  id: string;
  created_at: string;
  site_slug: string;
  question: string;
  answer: string;
  meta: any | null;
  lead_name: string | null;
  lead_email: string | null;
};

function isLead(log: AiLog): boolean {
  if (log.lead_email || log.lead_name) return true;
  const intent = (log.meta as any)?.intent;
  if (intent && typeof intent === "object" && intent.is_lead) return true;
  return false;
}

const AdminLogsPage: React.FC<AdminLogsPageProps> = ({ onNavigateBack }) => {
  const [siteSlug, setSiteSlug] = useState("servisai");
  const [limit, setLimit] = useState(100);
  const [onlyLeads, setOnlyLeads] = useState(false);

  const [logs, setLogs] = useState<AiLog[]>([]);
  const [loading, setLoading] = useState(false);

  // ---------- LOAD DATA ----------
  const loadLogs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("ai_logs")
        .select("*")
        .eq("site_slug", siteSlug)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (onlyLeads) {
        // filter podľa lead email / mena
        query = query.or("lead_email.not.is.null,lead_name.not.is.null");
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error loading ai_logs:", error);
        return;
      }
      setLogs((data as AiLog[]) ?? []);
    } catch (err) {
      console.error("Unexpected error loading ai_logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteSlug, limit, onlyLeads]);

  // ---------- STATS ----------
  const totalQuestions = logs.length;
  const leadCount = logs.filter((l) => isLead(l)).length;
  const conversionRate =
    totalQuestions > 0 ? Math.round((leadCount / totalQuestions) * 100) : 0;

  // ---------- CHART DATA (posledných 7 dní) ----------
  const chartData = useMemo(() => {
    if (!logs.length) return [];

    // posledných 7 dní vrátane dnes
    const map = new Map<
      string,
      { date: Date; total: number; leads: number }
    >();

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      map.set(key, { date: d, total: 0, leads: 0 });
    }

    logs.forEach((log) => {
      const key = log.created_at.slice(0, 10);
      const rec = map.get(key);
      if (!rec) return;
      rec.total += 1;
      if (isLead(log)) rec.leads += 1;
    });

    const arr = Array.from(map.values()).sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    const maxTotal = Math.max(...arr.map((x) => x.total), 1);

    return arr.map((d) => ({
      label: `${d.date.getDate().toString().padStart(2, "0")}.${(
        d.date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}.`,
      total: d.total,
      leads: d.leads,
      barHeight: (d.total / maxTotal) * 80 + (d.total > 0 ? 10 : 0), // px
    }));
  }, [logs]);

  // ---------- EXPORT CSV ----------
  const handleExportCsv = () => {
    if (!logs.length) return;

    const header = [
      "created_at",
      "site_slug",
      "question",
      "answer",
      "lead_name",
      "lead_email",
    ];

    const escapeCsv = (value: any) => {
      if (value === null || value === undefined) return "";
      const s = String(value).replace(/"/g, '""');
      return `"${s}"`;
    };

    const lines = [
      header.join(";"),
      ...logs.map((log) =>
        [
          log.created_at,
          log.site_slug,
          log.question,
          log.answer,
          log.lead_name ?? "",
          log.lead_email ?? "",
        ]
          .map(escapeCsv)
          .join(";")
      ),
    ];

    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `ai_logs_${siteSlug}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ---------- RENDER ----------
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={onNavigateBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border border-slate-200 hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Späť na web
          </button>
          <h1 className="text-lg md:text-xl font-semibold text-slate-900">
            Admin – AI logy
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* FILTERS */}
        <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col md:flex-row gap-4 md:items-end md:justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                site_slug
              </label>
              <input
                className="w-full sm:w-40 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={siteSlug}
                onChange={(e) => setSiteSlug(e.target.value.trim())}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Počet záznamov
              </label>
              <select
                className="w-full sm:w-32 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value) || 100)}
              >
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={250}>250</option>
                <option value={500}>500</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <button
              type="button"
              onClick={loadLogs}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-slate-900 text-white hover:bg-black disabled:opacity-60"
            >
              {loading ? "Obnovujem…" : "Obnoviť"}
            </button>

            <button
              type="button"
              onClick={() => setOnlyLeads((v) => !v)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm border ${
                onlyLeads
                  ? "bg-green-50 border-green-300 text-green-700"
                  : "bg-white border-slate-200 text-slate-700"
              }`}
            >
              <Filter size={16} />
              Len leady
            </button>

            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm border border-slate-200 bg-white hover:bg-slate-50"
            >
              <Download size={16} />
              Exportovať CSV
            </button>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <p className="text-xs font-medium text-slate-500 mb-1">
              Počet otázok (aktuálny filter)
            </p>
            <p className="text-2xl font-semibold text-slate-900">{totalQuestions}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-slate-500">
                Zachytené leady
              </p>
              <Users size={16} className="text-emerald-500" />
            </div>
            <p className="text-2xl font-semibold text-emerald-700">{leadCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-slate-500">
                Konverzná miera
              </p>
              <Activity size={16} className="text-blue-500" />
            </div>
            <p className="text-2xl font-semibold text-blue-700">
              {conversionRate}%
            </p>
          </div>
        </div>

        {/* CHART – POSLEDNÝCH 7 DNÍ */}
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Aktivita za posledných 7 dní
            </h2>
            <p className="text-xs text-slate-500">
              Počet otázok / leadov podľa dňa
            </p>
          </div>

          {chartData.length === 0 ? (
            <p className="text-sm text-slate-500">
              Zatiaľ nemáš žiadne záznamy pre tento filter.
            </p>
          ) : (
            <div className="mt-2 flex items-end gap-3 h-36">
              {chartData.map((d) => (
                <div
                  key={d.label}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div className="w-full h-24 bg-slate-50 rounded-lg flex items-end justify-center overflow-hidden">
                    <div
                      className="w-3 rounded-full bg-blue-500"
                      style={{ height: `${d.barHeight}px` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-500">{d.label}</div>
                  <div className="text-[11px] text-slate-500">
                    {d.total} otázok / {d.leads} leadov
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr className="text-left text-xs font-semibold text-slate-500">
                <th className="px-4 py-2 w-40">Čas</th>
                <th className="px-4 py-2 w-1/3">Otázka</th>
                <th className="px-4 py-2 w-1/2">Odpoveď</th>
                <th className="px-4 py-2 w-32">Lead</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const lead = isLead(log);
                const created = new Date(log.created_at);
                const timeStr = created.toLocaleString("sk-SK", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <tr
                    key={log.id}
                    className={`border-b last:border-0 ${
                      lead ? "bg-emerald-50/40" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-3 align-top text-xs text-slate-500">
                      {timeStr}
                    </td>
                    <td className="px-4 py-3 align-top text-slate-800">
                      {log.question}
                    </td>
                    <td className="px-4 py-3 align-top text-slate-700 whitespace-pre-wrap">
                      {log.answer}
                    </td>
                    <td className="px-4 py-3 align-top text-xs">
                      {lead ? (
                        <div className="inline-flex flex-col gap-0.5 text-emerald-700">
                          <span className="font-semibold">Lead zachytený</span>
                          {log.lead_name && (
                            <span>Meno: {log.lead_name}</span>
                          )}
                          {log.lead_email && (
                            <span>Email: {log.lead_email}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-500">Nie je lead</span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {!logs.length && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-sm text-slate-500"
                  >
                    Žiadne záznamy pre tento filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminLogsPage;
