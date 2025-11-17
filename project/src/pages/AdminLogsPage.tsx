// src/pages/AdminLogsPage.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { ArrowLeft, Loader2, Download, RefreshCw } from "lucide-react";

interface AdminLogsPageProps {
  onNavigateBack: () => void;
}

type AiLogRow = {
  id: string;
  created_at: string;
  site_slug: string;
  question: string;
  answer: string;
  meta: any | null;
  lead_name: string | null;
  lead_email: string | null;
  lead_phone: string | null;
  lead_notes: string | null;
};

const DEFAULT_SITE = "servisai";

const LIMIT_OPTIONS = [50, 100, 200];

const AdminLogsPage: React.FC<AdminLogsPageProps> = ({ onNavigateBack }) => {
  const [siteSlug, setSiteSlug] = useState<string>(DEFAULT_SITE);
  const [limit, setLimit] = useState<number>(100);
  const [rows, setRows] = useState<AiLogRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // štatistiky
  const totalCount = rows.length;
  const leadCount = rows.filter((r) => {
    const metaLead = (r.meta as any)?.lead;
    const isMetaLead = !!metaLead?.is_lead;
    const hasContact = !!(r.lead_email || r.lead_phone);
    return isMetaLead || hasContact;
  }).length;

  const contactIntentCount = rows.filter((r) => {
    const metaLead = (r.meta as any)?.lead;
    return metaLead?.intent === "contact";
  }).length;

  const leadRate = totalCount ? Math.round((leadCount / totalCount) * 100) : 0;

  const lastQuestionAt =
    rows[0]?.created_at &&
    new Date(rows[0].created_at).toLocaleString("sk-SK", {
      dateStyle: "short",
      timeStyle: "short",
    });

  const loadLogs = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("ai_logs")
        .select(
          `
          id,
          created_at,
          site_slug,
          question,
          answer,
          meta,
          lead_name,
          lead_email,
          lead_phone,
          lead_notes
        `
        )
        .eq("site_slug", siteSlug.trim() || DEFAULT_SITE)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("ai_logs select error:", error);
        setError("Nepodarilo sa načítať logy.");
        setRows([]);
        return;
      }

      setRows((data as AiLogRow[]) || []);
    } catch (err) {
      console.error("ai_logs load error:", err);
      setError("Nepodarilo sa načítať logy (výnimka).");
      setRows([]);
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
    if (!rows.length) return;

    const header = [
      "created_at",
      "site_slug",
      "question",
      "answer",
      "lead_name",
      "lead_email",
      "lead_phone",
      "lead_notes",
    ];

    const csvLines = [
      header.join(";"),
      ...rows.map((r) =>
        [
          new Date(r.created_at).toISOString(),
          r.site_slug ?? "",
          (r.question || "").replace(/[\r\n]+/g, " "),
          (r.answer || "").replace(/[\r\n]+/g, " "),
          r.lead_name ?? "",
          r.lead_email ?? "",
          r.lead_phone ?? "",
          r.lead_notes ?? "",
        ]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(";")
      ),
    ];

    const blob = new Blob([csvLines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeSlug = siteSlug.trim() || DEFAULT_SITE;
    a.href = url;
    a.download = `ai_logs_${safeSlug}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString("sk-SK", {
      dateStyle: "short",
      timeStyle: "short",
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={onNavigateBack}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm"
          >
            <ArrowLeft size={16} />
            Späť na web
          </button>
          <h1 className="text-xl font-semibold text-gray-800 ml-2">
            Admin – AI logy
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Filter + akcie */}
        <section className="bg-white rounded-2xl shadow-sm p-4 md:p-5 border border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Interný prehľad dopytov z tabuľky{" "}
            <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
              ai_logs
            </code>{" "}
            pre konkrétny <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">site_slug</code>.
          </h2>

          <div className="flex flex-col md:flex-row md:items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                site_slug
              </label>
              <input
                type="text"
                value={siteSlug}
                onChange={(e) => setSiteSlug(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Počet záznamov
              </label>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {LIMIT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Načítavam…
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    Obnoviť
                  </>
                )}
              </button>

              <button
                onClick={handleExportCsv}
                disabled={!rows.length}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                <Download size={16} />
                Exportovať CSV
              </button>
            </div>
          </div>
        </section>

        {/* ŠTATISTIKY */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Dopyty (v tomto náhľade)</p>
            <p className="text-2xl font-semibold text-gray-800">{totalCount}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Zachytené leady</p>
            <p className="text-2xl font-semibold text-emerald-700">
              {leadCount}
            </p>
            <p className="text-xs text-emerald-700 mt-1">
              Konverzný pomer: {leadRate} %
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">
              Otázky s intentom „kontakt“
            </p>
            <p className="text-2xl font-semibold text-blue-700">
              {contactIntentCount}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Posledná otázka</p>
            <p className="text-sm text-gray-800">
              {lastQuestionAt || "—"}
            </p>
          </div>
        </section>

        {/* TABUĽKA LOGOV */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">
              Záznamy ({rows.length})
            </p>
          </div>

          {error && (
            <div className="px-4 py-3 text-sm text-red-700 bg-red-50 border-b border-red-100">
              {error}
            </div>
          )}

          {!rows.length && !loading && !error && (
            <div className="px-4 py-6 text-sm text-gray-500">
              Žiadne logy pre tento <code>site_slug</code>.
            </div>
          )}

          {rows.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="px-3 py-2 text-left whitespace-nowrap">
                      Čas
                    </th>
                    <th className="px-3 py-2 text-left">Otázka</th>
                    <th className="px-3 py-2 text-left">Odpoveď</th>
                    <th className="px-3 py-2 text-left whitespace-nowrap">
                      Lead
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rows.map((row) => {
                    const metaLead = (row.meta as any)?.lead;
                    const isLead =
                      !!metaLead?.is_lead ||
                      !!row.lead_email ||
                      !!row.lead_phone;
                    const contactLine = [
                      row.lead_name,
                      row.lead_email,
                      row.lead_phone,
                    ]
                      .filter(Boolean)
                      .join(" · ");

                    return (
                      <tr key={row.id} className={isLead ? "bg-emerald-50/50" : ""}>
                        <td className="px-3 py-2 align-top whitespace-nowrap text-xs text-gray-500">
                          {formatDateTime(row.created_at)}
                        </td>
                        <td className="px-3 py-2 align-top text-gray-800 max-w-xs">
                          {row.question}
                        </td>
                        <td className="px-3 py-2 align-top text-gray-700 max-w-xl">
                          {row.answer}
                        </td>
                        <td className="px-3 py-2 align-top text-xs text-gray-700">
                          {isLead ? (
                            <div className="space-y-1">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                                LEAD
                              </span>
                              {contactLine && <div>{contactLine}</div>}
                              {row.lead_notes && (
                                <div className="text-gray-500">
                                  {row.lead_notes}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
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
