// src/pages/AdminLogsPage.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type AiLog = {
  id: string | number;
  created_at: string;
  site_slug: string;
  question: string | null;
  answer: string | null;
  history: any;
  meta: any;
};

interface AdminLogsPageProps {
  onNavigateBack: () => void;
}

function formatDateTime(value: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("sk-SK");
}

const AdminLogsPage: React.FC<AdminLogsPageProps> = ({ onNavigateBack }) => {
  const [logs, setLogs] = useState<AiLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [siteSlug, setSiteSlug] = useState("servisai");
  const [limit, setLimit] = useState(100);

  const loadLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("ai_logs")
        .select("*")
        .eq("site_slug", siteSlug)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("loadLogs error:", error);
        setError(error.message);
        setLogs([]);
        return;
      }

      setLogs(data || []);
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "Neznáma chyba pri načítaní logov");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    loadLogs();
  };

  const handleExportCsv = () => {
    if (!logs.length) return;

    const headers = [
      "id",
      "created_at",
      "site_slug",
      "question",
      "answer",
      "meta",
    ];

    const rows = logs.map((log) => {
      const safeQuestion = (log.question ?? "").replace(/\s+/g, " ").trim();
      const safeAnswer = (log.answer ?? "").replace(/\s+/g, " ").trim();
      const metaStr = log.meta ? JSON.stringify(log.meta) : "";

      // CSV escapovanie
      const esc = (val: string) =>
        `"${val.replace(/"/g, '""')}"`;

      return [
        esc(String(log.id)),
        esc(log.created_at),
        esc(log.site_slug),
        esc(safeQuestion),
        esc(safeAnswer),
        esc(metaStr),
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const now = new Date();
    const ts = now.toISOString().replace(/[:.]/g, "-");
    a.href = url;
    a.download = `ai_logs_${siteSlug}_${ts}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Admin – AI logy
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Interný prehľad dopytov z tabuľky <code>ai_logs</code> pre
              konkrétny <code>site_slug</code>.
            </p>
          </div>

          <button
            onClick={onNavigateBack}
            className="px-4 py-2 text-sm rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
          >
            ← Späť na web
          </button>
        </div>

        {/* Filter panel */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-600 mb-1">
              site_slug
            </label>
            <input
              type="text"
              value={siteSlug}
              onChange={(e) => setSiteSlug(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-600 mb-1">
              Počet záznamov
            </label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
            >
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </div>

          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Načítavam…" : "Obnoviť"}
            </button>

            <button
              onClick={handleExportCsv}
              disabled={!logs.length}
              className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm font-medium hover:bg-black disabled:opacity-40"
            >
              Exportovať CSV
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            Chyba pri načítaní logov: {error}
          </div>
        )}

        {/* Zoznam logov */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-800">
              Záznamy ({logs.length})
            </span>
          </div>

          {logs.length === 0 && !loading && !error && (
            <div className="p-6 text-sm text-slate-500">
              Žiadne logy pre tento <code>site_slug</code>.
            </div>
          )}

          {logs.length > 0 && (
            <div className="divide-y divide-slate-100">
              {logs.map((log) => (
                <div key={log.id} className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-slate-500">
                      {formatDateTime(log.created_at)} •{" "}
                      <span className="font-mono">{log.site_slug}</span>
                    </div>
                    <div className="text-[10px] px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                      id: {log.id}
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="text-xs font-semibold text-slate-600 mb-1">
                      Otázka:
                    </div>
                    <div className="text-sm text-slate-800 whitespace-pre-wrap">
                      {log.question || <span className="text-slate-400">–</span>}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-600 mb-1">
                      Odpoveď:
                    </div>
                    <div className="text-sm text-slate-800 whitespace-pre-wrap">
                      {log.answer || <span className="text-slate-400">–</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {loading && (
            <div className="p-4 text-sm text-slate-500">
              Načítavam logy…
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogsPage;
