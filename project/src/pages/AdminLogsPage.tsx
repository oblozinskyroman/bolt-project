import React, { useEffect, useState } from "react";
import { ArrowLeft, Download, Filter } from "lucide-react";
import { supabase } from "../lib/supabase";

interface AdminLogsPageProps {
  onNavigateBack: () => void;
}

type AiLogRow = {
  id: string;
  created_at: string;
  site_slug: string;
  question: string | null;
  answer: string | null;
  meta: any | null;
  lead_name: string | null;
  lead_email: string | null;
};

const AdminLogsPage: React.FC<AdminLogsPageProps> = ({ onNavigateBack }) => {
  const [siteSlug, setSiteSlug] = useState("servisai");
  const [limit, setLimit] = useState(100);
  const [onlyLeads, setOnlyLeads] = useState(false);
  const [logs, setLogs] = useState<AiLogRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // štatistiky
  const total = logs.length;
  const leadsCount = logs.filter(
    (row) => row.lead_email || row.lead_name
  ).length;
  const conversion =
    total > 0 ? Math.round((leadsCount / total) * 100) : 0;

  const filteredLogs = onlyLeads
    ? logs.filter((row) => row.lead_email || row.lead_name)
    : logs;

  const loadLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("ai_logs")
        .select(
          "id, created_at, site_slug, question, answer, meta, lead_name, lead_email"
        )
        .eq("site_slug", siteSlug)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      setLogs((data || []) as AiLogRow[]);
    } catch (e: any) {
      console.error(e);
      setError(e.message ?? "Nepodarilo sa načítať logy.");
    } finally {
      setIsLoading(false);
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
    if (!filteredLogs.length) return;

    const headers = [
      "created_at",
      "site_slug",
      "question",
      "answer",
      "lead_name",
      "lead_email",
      "meta_json",
    ];

    const rows = filteredLogs.map((row) => [
      row.created_at,
      row.site_slug,
      (row.question ?? "").replace(/\s+/g, " ").trim(),
      (row.answer ?? "").replace(/\s+/g, " ").trim(),
      row.lead_name ?? "",
      row.lead_email ?? "",
      JSON.stringify(row.meta ?? {}),
    ]);

    const csvLines = [
      headers.join(";"),
      ...rows.map((r) =>
        r
          .map((cell) => {
            const val = String(cell ?? "");
            // jednoduché escapovanie ; a "
            const needQuote = /[;"\n]/.test(val);
            const escaped = val.replace(/"/g, '""');
            return needQuote ? `"${escaped}"` : escaped;
          })
          .join(";")
      ),
    ];

    const csvContent = csvLines.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `ai_logs_${siteSlug}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={onNavigateBack}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Späť na web
          </button>
          <h1 className="text-lg md:text-xl font-semibold text-gray-800">
            Admin – AI logy
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              disabled={isLoading || filteredLogs.length === 0}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs md:text-sm rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-60"
            >
              <Download size={16} />
              Exportovať CSV
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Filter */}
        <section className="bg-white rounded-xl shadow-sm border p-4 flex flex-col md:flex-row gap-4 md:items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              site_slug
            </label>
            <input
              type="text"
              value={siteSlug}
              onChange={(e) => setSiteSlug(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Počet záznamov
            </label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={500}>500</option>
            </select>
          </div>

          <button
            onClick={handleRefresh}
            className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-black"
          >
            Obnoviť
          </button>

          <button
            type="button"
            onClick={() => setOnlyLeads((v) => !v)}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${
              onlyLeads
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-white border-gray-200 text-gray-700"
            }`}
          >
            <Filter size={14} />
            Len leady
          </button>
        </section>

        {/* Štatistiky */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <p className="text-xs font-medium text-gray-500 mb-1">
              Počet otázok (aktuálny filter)
            </p>
            <p className="text-2xl font-bold text-gray-900">{total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <p className="text-xs font-medium text-gray-500 mb-1">
              Zachytené leady
            </p>
            <p className="text-2xl font-bold text-emerald-700">{leadsCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <p className="text-xs font-medium text-gray-500 mb-1">
              Konverzná miera
            </p>
            <p className="text-2xl font-bold text-indigo-700">
              {conversion}%
            </p>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
            {error}
          </div>
        )}

        {/* Záznamy */}
        <section className="bg-white rounded-xl shadow-sm border">
          <div className="border-b px-4 py-3 text-sm font-medium text-gray-600 flex">
            <div className="w-32">Čas</div>
            <div className="flex-1">Otázka</div>
            <div className="flex-1">Odpoveď</div>
            <div className="w-64">Lead</div>
          </div>

          {isLoading && (
            <div className="px-4 py-6 text-sm text-gray-500">
              Načítavam záznamy...
            </div>
          )}

          {!isLoading && filteredLogs.length === 0 && (
            <div className="px-4 py-6 text-sm text-gray-500">
              Žiadne logy pre tento filter.
            </div>
          )}

          {!isLoading &&
            filteredLogs.map((row) => (
              <div
                key={row.id}
                className={`px-4 py-3 text-sm border-t flex hover:bg-gray-50 ${
                  row.lead_email || row.lead_name ? "bg-emerald-50/40" : ""
                }`}
              >
                <div className="w-32 text-xs text-gray-500 pr-2">
                  {new Date(row.created_at).toLocaleString("sk-SK")}
                </div>
                <div className="flex-1 pr-4">
                  <p className="text-gray-800 line-clamp-3">
                    {row.question}
                  </p>
                </div>
                <div className="flex-1 pr-4">
                  <p className="text-gray-600 line-clamp-3">
                    {row.answer}
                  </p>
                </div>
                <div className="w-64 text-xs text-gray-700">
                  {row.lead_email || row.lead_name ? (
                    <>
                      <p className="font-semibold text-emerald-700">
                        Lead zachytený
                      </p>
                      {row.lead_name && (
                        <p>Meno: {row.lead_name}</p>
                      )}
                      {row.lead_email && (
                        <p>Email: {row.lead_email}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-400">Nie je lead</p>
                  )}
                </div>
              </div>
            ))}
        </section>
      </main>
    </div>
  );
};

export default AdminLogsPage;
