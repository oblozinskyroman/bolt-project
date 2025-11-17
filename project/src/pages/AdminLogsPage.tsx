import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, Download, Loader2, Filter } from "lucide-react";

interface AdminLogsPageProps {
  onNavigateBack: () => void;
}

// typ z DB (prispôsobené tvojej tabuľke)
interface AiLogRow {
  id: string;
  created_at: string;
  site_slug: string;
  question: string | null;
  answer: string | null;
  history: any | null;
  meta: any | null;
  lead_name: string | null;
  lead_email: string | null;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AdminLogsPage: React.FC<AdminLogsPageProps> = ({ onNavigateBack }) => {
  const [siteSlug, setSiteSlug] = useState<string>("servisai");
  const [limit, setLimit] = useState<number>(100);
  const [logs, setLogs] = useState<AiLogRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showOnlyLeads, setShowOnlyLeads] = useState<boolean>(false);

  // načítanie logov
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
          history,
          meta,
          lead_name,
          lead_email
        `
        )
        .eq("site_slug", siteSlug)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Supabase error:", error);
        setError(error.message);
        setLogs([]);
        return;
      }

      setLogs((data as AiLogRow[]) ?? []);
    } catch (err: any) {
      console.error("Load logs failed:", err);
      setError("Chyba pri načítaní logov.");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // helper: či je daný log lead
  const isLead = (row: AiLogRow): boolean => {
    const meta = row.meta || {};
    const intent = meta.intent || {};
    if (intent.is_lead === true) return true;
    if (row.lead_email || row.lead_name) return true;
    return false;
  };

  const filteredLogs = showOnlyLeads ? logs.filter(isLead) : logs;

  // štatistiky
  const total = logs.length;
  const leadsCount = logs.filter(isLead).length;
  const conversion =
    total > 0 ? Math.round((leadsCount / total) * 100) : 0;

  // export CSV – použijeme už vyfiltrované logy (čo vidíš na obrazovke)
  const handleExportCsv = () => {
    const rows = filteredLogs.map((row) => {
      const meta = row.meta || {};
      const intent = meta.intent || {};
      const lead = meta.lead || {};
      return {
        id: row.id,
        created_at: row.created_at,
        site_slug: row.site_slug,
        question: row.question ?? "",
        answer: row.answer ?? "",
        lead_name: row.lead_name ?? lead.name ?? "",
        lead_email: row.lead_email ?? lead.email ?? "",
        intent_is_lead: intent.is_lead === true ? "1" : "0",
        intent_contact: intent.contact === true ? "1" : "0",
      };
    });

    const header = Object.keys(rows[0] || {});
    const csvLines = [
      header.join(";"),
      ...rows.map((r) =>
        header
          .map((key) =>
            String((r as any)[key] ?? "").replace(/"/g, '""')
          )
          .map((v) => `"${v}"`)
          .join(";")
      ),
    ];

    const blob = new Blob([csvLines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai_logs_${siteSlug}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateBack}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white shadow hover:shadow-md text-gray-700 text-sm"
            >
              <ArrowLeft size={16} />
              Späť na web
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              Admin – AI logy
            </h1>
          </div>

          <button
            onClick={handleExportCsv}
            disabled={filteredLogs.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 disabled:opacity-50"
          >
            <Download size={16} />
            Exportovať CSV
          </button>
        </div>

        {/* Filter panel */}
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap items-end gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">
              site_slug
            </label>
            <input
              type="text"
              value={siteSlug}
              onChange={(e) => setSiteSlug(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm w-40"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-600 mb-1">
              Počet záznamov
            </label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </div>

          <button
            onClick={loadLogs}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium shadow hover:bg-black"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Načítavam...
              </>
            ) : (
              "Obnoviť"
            )}
          </button>

          <button
            onClick={() => setShowOnlyLeads((v) => !v)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border shadow-sm ${
              showOnlyLeads
                ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                : "bg-white border-gray-200 text-gray-700"
            }`}
          >
            <Filter size={16} />
            {showOnlyLeads ? "Zobraziť všetko" : "Len leady"}
          </button>
        </div>

        {/* Štatistiky */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-xs text-gray-500 mb-1">
              Počet otázok (aktuálny filter)
            </p>
            <p className="text-2xl font-bold text-gray-900">{total}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-xs text-gray-500 mb-1">
              Zachytené leady
            </p>
            <p className="text-2xl font-bold text-emerald-700">
              {leadsCount}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-xs text-gray-500 mb-1">
              Konverzná miera
            </p>
            <p className="text-2xl font-bold text-indigo-700">
              {conversion}%
            </p>
          </div>
        </div>

        {/* Zoznam logov */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="border-b px-4 py-3 text-sm font-medium text-gray-600 flex">
            <div className="w-48">Čas</div>
            <div className="flex-1">Otázka</div>
            <div className="flex-1">Odpoveď</div>
            <div className="w-64">Lead</div>
          </div>

          {loading && (
            <div className="px-4 py-6 text-sm text-gray-500 flex items-center gap-2">
              <Loader2 className="animate-spin" size={16} />
              Načítavam logy...
            </div>
          )}

          {!loading && filteredLogs.length === 0 && (
            <div className="px-4 py-6 text-sm text-gray-500">
              Žiadne logy pre tento <code>site_slug</code>.
            </div>
          )}

          {!loading &&
            filteredLogs.map((row) => {
              const meta = row.meta || {};
              const lead = meta.lead || {};
              const isLeadRow = isLead(row);

              return (
                <div
                  key={row.id}
                  className={`border-t px-4 py-3 text-sm flex ${
                    isLeadRow ? "bg-emerald-50/40" : "bg-white"
                  }`}
                >
                  <div className="w-48 text-xs text-gray-500 whitespace-nowrap pr-2">
                    {new Date(row.created_at).toLocaleString("sk-SK")}
                  </div>
                  <div className="flex-1 pr-4 text-gray-800 whitespace-pre-wrap">
                    {row.question}
                  </div>
                  <div className="flex-1 pr-4 text-gray-600 whitespace-pre-wrap">
                    {row.answer}
                  </div>
                  <div className="w-64 text-xs text-gray-700">
                    {isLeadRow ? (
                      <>
                        <div>
                          <span className="font-semibold">Meno: </span>
                          {row.lead_name || lead.name || "—"}
                        </div>
                        <div>
                          <span className="font-semibold">Email: </span>
                          {row.lead_email || lead.email || "—"}
                        </div>
                      </>
                    ) : (
                      <span className="text-gray-400">Nie je lead</span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default AdminLogsPage;
