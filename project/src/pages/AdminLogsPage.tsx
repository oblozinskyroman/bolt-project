// src/pages/AdminLogsPage.tsx
import React, { useEffect, useState } from "react";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
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
  history: any | null;
};

const DEFAULT_SITE_SLUG = "servisai";

const AdminLogsPage: React.FC<AdminLogsPageProps> = ({ onNavigateBack }) => {
  const [siteSlug, setSiteSlug] = useState(DEFAULT_SITE_SLUG);
  const [limit, setLimit] = useState(100);
  const [rows, setRows] = useState<AiLogRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadLogs = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase
        .from<AiLogRow>("ai_logs")           // ← dôležité: čítame priamo ai_logs
        .select("*")
        .eq("site_slug", siteSlug)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("ai_logs fetch error", error);
        setErrorMsg(error.message ?? "Nepodarilo sa načítať logy.");
        setRows([]);
      } else {
        setRows(data ?? []);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Nepodarilo sa načítať logy.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExportCsv = () => {
    if (!rows.length) return;

    const header = ["created_at", "site_slug", "question", "answer"];

    const lines = [
      header.join(";"),
      ...rows.map((r) =>
        [
          r.created_at ?? "",
          r.site_slug ?? "",
          (r.question ?? "").replace(/\s+/g, " ").replace(/;/g, ","),
          (r.answer ?? "").replace(/\s+/g, " ").replace(/;/g, ","),
        ].join(";")
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadLogs();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onNavigateBack}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Späť na web
          </button>
          <h1 className="text-lg font-semibold text-gray-800">
            Admin – AI logy
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <p className="text-sm text-gray-500 mb-4">
          Interný prehľad dopytov z tabuľky <code>ai_logs</code> pre konkrétny{" "}
          <code>site_slug</code>.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap gap-3 items-end mb-6"
        >
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 mb-1">
              site_slug
            </label>
            <input
              type="text"
              value={siteSlug}
              onChange={(e) => setSiteSlug(e.target.value)}
              className="px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-500 mb-1">
              Počet záznamov
            </label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value) || 50)}
              className="px-3 py-2 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[50, 100, 200, 500].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 disabled:opacity-60"
          >
            <RefreshCw size={16} />
            {loading ? "Načítavam…" : "Obnoviť"}
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={!rows.length}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 text-gray-800 text-sm font-medium border border-gray-300 hover:bg-gray-200 disabled:opacity-40"
          >
            <Download size={16} />
            Exportovať CSV
          </button>
        </form>

        {errorMsg && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {errorMsg}
          </div>
        )}

        <section className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center justify-between">
            <div className="text-sm font-medium text-gray-700">
              Záznamy ({rows.length})
            </div>
          </div>

          {rows.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-500">
              Žiadne logy pre tento <code>site_slug</code>.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">
                      čas
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">
                      otázka
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">
                      odpoveď
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b last:border-b-0 hover:bg-gray-50 align-top"
                    >
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                        {new Date(row.created_at).toLocaleString("sk-SK")}
                      </td>
                      <td className="px-3 py-2 text-gray-800 max-w-xs">
                        {row.question}
                      </td>
                      <td className="px-3 py-2 text-gray-700 max-w-xl whitespace-pre-wrap">
                        {row.answer}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminLogsPage;