import React, { useEffect, useState } from "react";
import CompanyListPage from "./pages/CompanyListPage";
import AddCompanyPage from "./pages/AddCompanyPage";
import CompanyDetailPage from "./pages/CompanyDetailPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import ReferencesPage from "./pages/ReferencesPage";
import NewsPage from "./pages/NewsPage";
import HelpCenterPage from "./pages/HelpCenterPage";
import ContactPage from "./pages/ContactPage";
import MyAccountPage from "./pages/MyAccountPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentCancelPage from "./pages/PaymentCancelPage";
import CookieConsentBanner from "./components/CookieConsentBanner";

import { supabase } from "./lib/supabase";
import { askAI, type ChatTurn } from "./lib/askAI";
import { createOrderAndRedirect } from "./lib/createOrderAndRedirect";

import {
  MessageCircle,
  Calendar,
  Shield,
  Zap,
  Puzzle,
  Palette,
  Menu,
  X,
  User,
  MapPin,
  CheckCircle,
  Star,
} from "lucide-react";

/** Lokálny storage kľúč pre preferovanú lokalitu */
const LS_PREF_LOC = "sa_pref_loc";

type UICard = {
  id?: string | number;
  title: string;
  subtitle?: string;
  description?: string;
  location?: string;
  verified?: boolean;
  rating?: number | null;
  tags?: string[];
  geo?: { lat: number; lng: number } | null;
  distanceKm?: number | null;
  actions?: {
    call?: string | null;
    email?: string | null;
    website?: string | null;
    ctaLabel?: string;
  };
};

/* ---------- malé pomocné komponenty ---------- */
function StarRating({ value = 0 }: { value?: number | null }) {
  const v = Math.max(0, Math.min(Number(value ?? 0), 5));
  const pct = (v / 5) * 100;
  return (
    <div
      className="relative inline-block leading-none"
      aria-label={`Hodnotenie ${v} z 5`}
    >
      <div className="text-gray-300 select-none">★★★★★</div>
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pct}%` }}
      >
        <div className="text-yellow-400 select-none">★★★★★</div>
      </div>
    </div>
  );
}

function NavCta({
  onClick,
  children,
  className = "",
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl border-2 ${className}`}
    >
      {children}
    </button>
  );
}

/* ---------- vzdialenosť (km) ---------- */
function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const s =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
  return R * c;
}

type SortBy = "relevance" | "rating" | "distance";

type PageId =
  | "home"
  | "companyList"
  | "addCompany"
  | "companyDetail"
  | "howItWorks"
  | "references"
  | "news"
  | "helpCenter"
  | "contact"
  | "myAccount"
  | "myOrders"
  | "paymentSuccess"
  | "paymentCancel";

const ALL_PAGES: PageId[] = [
  "home",
  "companyList",
  "addCompany",
  "companyDetail",
  "howItWorks",
  "references",
  "news",
  "helpCenter",
  "contact",
  "myAccount",
  "myOrders",
  "paymentSuccess",
  "paymentCancel",
];

function getPageFromHash(): PageId {
  if (typeof window === "undefined") return "home";
  const raw = window.location.hash.replace("#", "").trim() as PageId;
  return ALL_PAGES.includes(raw) ? raw : "home";
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageId>(getPageFromHash);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );

  // AI
  const [message, setMessage] = useState("");
  const [lastQuery, setLastQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [cards, setCards] = useState<UICard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const [page, setPage] = useState(0);
  const [limit] = useState(9);
  const [hasMore, setHasMore] = useState(false);
  const [userLocation, setUserLocation] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [ack, setAck] = useState("");
  const [aiActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>("relevance");

  // Auth
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkAuth();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Hash routing – reaguje na back/forward a pri prvom načítaní
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = () => {
      setCurrentPage(getPageFromHash());
    };

    window.addEventListener("hashchange", handler);
    // istota, že pri prvom load-e sedí stránka s hashom
    handler();

    return () => {
      window.removeEventListener("hashchange", handler);
    };
  }, []);

  // jednotné presúvanie medzi stránkami + zapis hash do URL
  const goTo = (page: PageId) => {
    if (typeof window !== "undefined") {
      const hash = page === "home" ? "" : `#${page}`;
      if (window.location.hash !== hash) {
        window.location.hash = hash;
        // currentPage sa nastaví cez hashchange handler
        return;
      }
    }
    setCurrentPage(page);
  };

  // Načítaj preferovanú lokalitu z localStorage pri štarte
  useEffect(() => {
    const existing = (localStorage.getItem(LS_PREF_LOC) || "").trim();
    if (existing && !userLocation) setUserLocation(existing);
  }, []); // úmyselne bez závislostí userLocation pri prvom loade

  // Ukladaj preferovanú lokalitu
  useEffect(() => {
    const t = setTimeout(() => {
      const v = (userLocation || "").trim();
      localStorage.setItem(LS_PREF_LOC, v);
    }, 250);
    return () => clearTimeout(t);
  }, [userLocation]);

  // Use-cases pre AI asistenta
  const useCases = [
    {
      name: "Rezervácie a objednávky",
      icon: Calendar,
      color: "from-blue-500 to-indigo-600",
      description: "Prijímanie rezervácií, termínov a dopytov bez telefonovania.",
    },
    {
      name: "Zákaznícka podpora 24/7",
      icon: MessageCircle,
      color: "from-emerald-500 to-teal-600",
      description:
        "Odpovede na časté otázky, otváracie hodiny, ceny a podmienky.",
    },
    {
      name: "E-shop a produkty",
      icon: Puzzle,
      color: "from-violet-500 to-purple-600",
      description:
        "Pomoc s výberom produktu, dostupnosťou a stavom objednávky.",
    },
    {
      name: "Servis a reklamácie",
      icon: Shield,
      color: "from-amber-500 to-orange-600",
      description: "Zber údajov k poruche, otvorenie ticketu, základné rady.",
    },
    {
      name: "Formuláre a dopyty",
      icon: Palette,
      color: "from-pink-500 to-rose-600",
      description:
        "AI vyplní so zákazníkom všetko potrebné a odošle vám podklady.",
    },
    {
      name: "Interné otázky",
      icon: Zap,
      color: "from-slate-500 to-gray-600",
      description: "Návody, procesy a interné know-how dostupné na pár kliknutí.",
    },
  ];

  const menuItems = [
    { label: "Ako fungujeme", action: "howItWorks" },
    { label: "Funkcie", action: "references" },
    { label: "Cenník", action: "news" },
    { label: "Integrácia", action: "helpCenter" },
    { label: "Kontakt", action: "contact" },
  ];
  const mainMenuItems = [...menuItems];

  const relyOrEmpty = (s?: string) => (typeof s === "string" ? s : "");

  const makeAck = (intent?: any, fallbackLocation?: string) => {
    const s = (intent?.service ?? "").toString().trim();
    const loc = (intent?.location ?? fallbackLocation ?? "").toString().trim();
    const parts: string[] = [];
    if (s) parts.push(`službu ${s.toLowerCase()}`);
    if (loc) parts.push(`lokalita ${loc}`);
    return parts.length ? `Rozumiem — ${parts.join(", ")}.` : "";
  };

  const withDistances = (arr: UICard[]): UICard[] => {
    if (!coords) return arr.map((c) => ({ ...c, distanceKm: null }));
    return arr.map((c) => {
      if (c.geo && Number.isFinite(c.geo.lat) && Number.isFinite(c.geo.lng)) {
        const d = haversineKm(coords, c.geo);
        return { ...c, distanceKm: Math.round(d * 10) / 10 };
      }
      return { ...c, distanceKm: null };
    });
  };

  const sortCards = (arr: UICard[], by: SortBy): UICard[] => {
    if (by === "rating")
      return [...arr].sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
    if (by === "distance") {
      return [...arr].sort((a, b) => {
        const da = a.distanceKm ?? Number.POSITIVE_INFINITY;
        const db = b.distanceKm ?? Number.POSITIVE_INFINITY;
        return da - db;
      });
    }
    return arr;
  };

  /* ---------- AI ---------- */
  const handleAsk = async () => {
    const msg = message.trim();
    if (!msg) return;

    setIsLoading(true);
    try {
      const nextHistory: ChatTurn[] = [
        ...history,
        { role: "user", content: msg },
      ];
      const {
        reply,
        cards: incoming,
        intent,
        meta,
      } = await askAI(msg, nextHistory, 0.7, {
        page: 0,
        limit,
        userLocation,
        coords,
        filters: aiActiveFilters,
      });

      const enriched = withDistances(incoming || []);
      const sorted = sortCards(enriched, sortBy);

      setLastQuery(msg);
      setPage(0);
      setAiResponse(relyOrEmpty(reply));
      setCards(sorted);
      setHasMore(!!meta?.hasMore);
      setHistory([...nextHistory, { role: "assistant", content: reply }]);
      if (!userLocation && intent?.location) setUserLocation(intent.location);
      setAck(makeAck(intent, userLocation));
      setMessage("");
    } catch (error: any) {
      console.error("Chyba pri volaní AI asistenta:", error);
      setAiResponse(
        "Prepáčte, nastala chyba pri komunikácii s AI asistentom. Skúste to prosím znovu."
      );
      setCards([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    if (!lastQuery) return;
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const { cards: incoming, meta } = await askAI(lastQuery, history, 0.7, {
        page: nextPage,
        limit,
        userLocation,
        coords,
        filters: aiActiveFilters,
      });
      const enriched = withDistances(incoming || []);
      const merged = [...cards, ...enriched];
      setCards(sortCards(merged, sortBy));
      setPage(nextPage);
      setHasMore(!!meta?.hasMore);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!cards.length) return;
    const enriched = withDistances(cards);
    setCards(sortCards(enriched, sortBy));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords]);

  useEffect(() => {
    setCards((prev) => sortCards(prev, sortBy));
  }, [sortBy]);

  /* ---------- Navigácia ---------- */
  const navigateToCompanyList = (serviceName: string) => {
    setSelectedService(serviceName);
    goTo("companyList");
  };
  const navigateToHome = () => {
    setSelectedService("");
    goTo("home");
  };
  const navigateToAddCompany = () => goTo("addCompany");
  const navigateToHowItWorks = () => goTo("howItWorks");
  const navigateToReferences = () => goTo("references");
  const navigateToNews = () => goTo("news");
  const navigateToHelpCenter = () => goTo("helpCenter");
  const navigateToContact = () => goTo("contact");
  const navigateToMyAccount = () => goTo("myAccount");
  const navigateToMyOrders = () => goTo("myOrders");
  const navigateToPaymentSuccess = () => goTo("paymentSuccess");
  const navigateToPaymentCancel = () => goTo("paymentCancel");
  const navigateToCompanyDetail = (companyId: string) => {
    setSelectedCompanyId(companyId);
    goTo("companyDetail");
  };

  const handleMenuClick = (action: string | null) => {
    if (action === "howItWorks") navigateToHowItWorks();
    else if (action === "references") navigateToReferences();
    else if (action === "news") navigateToNews();
    else if (action === "helpCenter") navigateToHelpCenter();
    else if (action === "contact") navigateToContact();
    else if (action === "myAccount") navigateToMyAccount();
    else if (action === "myOrders") navigateToMyOrders();
  };

  const ORDER_AMOUNT_CENTS = 5000; // 50 €

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            {/* Logo vľavo */}
            <div className="flex-shrink-0">
              <button
                onClick={navigateToHome}
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                ServisAI
              </button>
            </div>

            {/* Menu uprostred */}
            <div className="hidden md:flex flex-1 items-center justify-center space-x-6">
              {mainMenuItems.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleMenuClick(item.action)}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors hover:bg-blue-50 rounded-lg"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Account + CTA vpravo */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={navigateToMyAccount}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg ${
                  isLoggedIn
                    ? "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200"
                    : "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200"
                }`}
              >
                <User size={16} />
                {isLoggedIn ? "Prihlásený" : "Odhlásený"}
              </button>

              <NavCta
                onClick={navigateToAddCompany}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 border-blue-400"
              >
                Pridať web
              </NavCta>
            </div>

            {/* Burger na mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t">
            <div className="px-2 pt-2 pb-3 space-y-2">
              {mainMenuItems.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    handleMenuClick(item.action);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {item.label}
                </button>
              ))}

              <button
                onClick={() => {
                  navigateToMyAccount();
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-3 text-base font-medium rounded-lg transition-all ${
                  isLoggedIn
                    ? "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200"
                    : "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200"
                }`}
              >
                <User size={20} />
                {isLoggedIn ? "Prihlásený" : "Odhlásený"}
              </button>

              <button
                onClick={() => {
                  navigateToAddCompany();
                  setMobileMenuOpen(false);
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-3 text-base font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 border-2 border-blue-400"
              >
                Pridať web
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Content */}
      <div className="flex-1">
        {currentPage === "home" && (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              {/* HERO */}
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
                  AI asistent pre váš web
                </h1>
                <p className="text-3xl md:text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    ktorý vybavuje zákazníkov za vás
                  </span>
                </p>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Automatizujte odpovede, objednávky a podporu. Asistent pozná
                  vaše služby, ceny aj dostupnosť a pracuje nonstop – priamo na
                  vašom webe.
                </p>
              </div>

              {/* AI chat – živé demo */}
              <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-20">
                <div className="flex items-center mb-3">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-xl mr-4">
                    <MessageCircle className="text-white" size={24} />
                  </div>
                <div>
                    <h3 className="text-2xl font-semibold text-gray-800">
                      AI Asistent – živé demo
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Spýtaj sa, čo všetko by mohol vybavovať na tvojom webe.
                      Napr.: „Ako by AI riešila rezervácie pre môj salón?“
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Napíšte svoju otázku... napr. 'Ako by AI riešila rezervácie pre môj salón?'"
                      className="flex-1 px-6 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-white/80 backdrop-blur-sm"
                      onKeyDown={(e) =>
                        e.key === "Enter" && !isLoading && handleAsk()
                      }
                    />
                    <button
                      onClick={handleAsk}
                      disabled={isLoading}
                      className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      {isLoading ? "Načítavam..." : "Odoslať"}
                    </button>
                  </div>

                  {ack && (
                    <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-sm flex items-start gap-2">
                      <CheckCircle size={18} className="mt-0.5 flex-shrink-0" />
                      <span>{ack}</span>
                    </div>
                  )}
                </div>

                {isLoading && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                      <p className="text-blue-700 font-medium">
                        AI asistent premýšľa...
                      </p>
                    </div>
                  </div>
                )}

                {aiResponse && !isLoading && cards.length === 0 && (
                  <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-sm">
                    <div className="flex items-start">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg mr-4 flex-shrink-0">
                        <MessageCircle className="text-white" size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-green-800 mb-2">
                          AI Asistent odpovedá:
                        </h4>
                        <p className="text-green-700 leading-relaxed whitespace-pre-wrap">
                          {aiResponse}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Výsledky ako ukážkové karty */}
                {cards.length > 0 && (
                  <>
                    <div className="flex flex-col space-y-6 mt-6">
                      {cards.map((c) => (
                        <div
                          key={String(c.id ?? c.title)}
                          className="flex flex-col h-full rounded-2xl shadow p-5 bg-white cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                          onClick={() =>
                            c.id && navigateToCompanyDetail(String(c.id))
                          }
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="text-lg font-semibold break-words">
                                {c.title}
                              </h3>
                              {c.subtitle && (
                                <p className="text-sm text-gray-500 truncate">
                                  {c.subtitle}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {coords && (
                                <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Demo: podľa lokality
                                </span>
                              )}
                              {c.verified && (
                                <span className="shrink-0 text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                                  Overená
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="mt-2 flex items-center gap-2 flex-wrap">
                            {typeof c.rating === "number" ? (
                              <>
                                <StarRating value={c.rating} />
                                <span className="text-xs text-gray-500">
                                  {c.rating.toFixed(1)}
                                </span>
                              </>
                            ) : (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                Ukážkový kontakt
                              </span>
                            )}

                            {c.location && (
                              <span className="inline-flex items-center gap-1 text-xs text-gray-500 ml-2">
                                <MapPin size={12} />
                                {c.location}
                                {typeof c.distanceKm === "number" && (
                                  <span className="text-gray-400">
                                    &nbsp;•&nbsp;{c.distanceKm} km
                                  </span>
                                )}
                              </span>
                            )}
                            {!c.location &&
                              typeof c.distanceKm === "number" && (
                                <span className="inline-flex items-center gap-1 text-xs text-gray-500 ml-2">
                                  <MapPin size={12} />
                                  {c.distanceKm} km
                                </span>
                              )}
                          </div>

                          {c.description && (
                            <p className="mt-3 text-sm text-gray-700 line-clamp-3">
                              {c.description}
                            </p>
                          )}

                          <div className="mt-3 min-h-8 flex flex-wrap gap-2">
                            {Array.isArray(c.tags) &&
                              c.tags.map((t: string) => (
                                <span
                                  key={t}
                                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                                >
                                  {t}
                                </span>
                              ))}
                          </div>

                          {/* CTA + ESCROW – demo logika */}
                          <div
                            className="mt-auto pt-4 flex flex-wrap gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {c.id && (
                              <button
                                onClick={async () => {
                                  if (!isLoggedIn) {
                                    alert(
                                      "Pre platbu sa prosím najprv prihláste."
                                    );
                                    return;
                                  }
                                  try {
                                    await createOrderAndRedirect(
                                      String(c.id),
                                      ORDER_AMOUNT_CENTS
                                    );
                                  } catch (err) {
                                    console.error(err);
                                    alert(
                                      "Nepodarilo sa vytvoriť escrow objednávku."
                                    );
                                  }
                                }}
                                className="px-3 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
                              >
                                Escrow 50 €
                              </button>
                            )}

                            {c.actions?.website ? (
                              <a
                                href={c.actions.website}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-2 rounded-xl bg-blue-600 text-white"
                              >
                                Kontaktovať
                              </a>
                            ) : c.actions?.call ? (
                              <a
                                href={`tel:${c.actions.call}`}
                                className="px-3 py-2 rounded-xl bg-blue-600 text-white"
                              >
                                Zavolať
                              </a>
                            ) : c.actions?.email ? (
                              <a
                                href={`mailto:${c.actions.email}`}
                                className="px-3 py-2 rounded-xl bg-blue-600 text-white"
                              >
                                Napísať e-mail
                              </a>
                            ) : null}

                            {c.actions?.call && (
                              <a
                                href={`tel:${c.actions.call}`}
                                className="px-3 py-2 rounded-xl bg-blue-100 text-blue-700"
                              >
                                Tel.
                              </a>
                            )}
                            {c.actions?.email && (
                              <a
                                href={`mailto:${c.actions.email}`}
                                className="px-3 py-2 rounded-xl bg-blue-100 text-blue-700"
                              >
                                Email
                              </a>
                            )}
                            {c.actions?.website && (
                              <a
                                href={c.actions.website}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-2 rounded-xl bg-gray-100"
                              >
                                Web
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {hasMore && (
                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={loadMore}
                          disabled={isLoading}
                          className="px-6 py-3 rounded-xl bg-gray-900 text-white hover:bg-black transition disabled:opacity-60"
                        >
                          {isLoading ? "Načítavam…" : "Zobraziť viac"}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Use cases sekcia */}
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                  Na čo môžete AI asistenta nasadiť
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Vyberte, čo má na vašom webe vybavovať – rezervácie, objednávky,
                  otázky zákazníkov alebo interné procesy. Zvyšok zvládne AI.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {useCases.map((useCase, index) => {
                  const IconComponent = useCase.icon;
                  return (
                    <div
                      key={index}
                      onClick={() => navigateToCompanyList(useCase.name)}
                      className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2 cursor-pointer group"
                    >
                      <div
                        className={`w-16 h-16 bg-gradient-to-r ${useCase.color} rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}
                      >
                        <IconComponent className="text-white" size={28} />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-800 text-center group-hover:text-blue-600 transition-colors mb-2">
                        {useCase.name}
                      </h4>
                      <p className="text-sm text-gray-600 text-center">
                        {useCase.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {currentPage === "companyList" && (
          <CompanyListPage
            selectedService={selectedService}
            onNavigateBack={navigateToHome}
            onNavigateToCompanyDetail={navigateToCompanyDetail}
          />
        )}
        {currentPage === "companyDetail" && selectedCompanyId && (
          <CompanyDetailPage
            companyId={selectedCompanyId}
            onNavigateBack={() => goTo("companyList")}
          />
        )}
        {currentPage === "addCompany" && (
          <AddCompanyPage onNavigateBack={navigateToHome} />
        )}
        {currentPage === "howItWorks" && (
          <HowItWorksPage
            onNavigateBack={navigateToHome}
            onNavigateToAddCompany={navigateToAddCompany}
          />
        )}
        {currentPage === "references" && (
          <ReferencesPage onNavigateBack={navigateToHome} />
        )}
        {currentPage === "news" && <NewsPage onNavigateBack={navigateToHome} />}
        {currentPage === "helpCenter" && (
          <HelpCenterPage onNavigateBack={navigateToHome} />
        )}
        {currentPage === "contact" && (
          <ContactPage onNavigateBack={navigateToHome} />
        )}
        {currentPage === "myAccount" && (
          <MyAccountPage
            onNavigateBack={navigateToHome}
            onNavigateToAddCompany={navigateToAddCompany}
          />
        )}
        {currentPage === "myOrders" && (
          <MyOrdersPage onNavigateBack={navigateToHome} />
        )}
        {currentPage === "paymentSuccess" && (
          <PaymentSuccessPage
            onNavigateBack={navigateToHome}
            onNavigateToMyOrders={navigateToMyOrders}
          />
        )}
        {currentPage === "paymentCancel" && (
          <PaymentCancelPage
            onNavigateBack={navigateToHome}
            onNavigateToMyOrders={navigateToMyOrders}
          />
        )}
      </div>

      <CookieConsentBanner />

      <footer className="bg-white/50 backdrop-blur-md mt-20">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              ServisAI
            </h2>
            <p className="text-gray-600 mb-6">
              Váš AI asistent pre web a zákaznícku podporu.
            </p>
            <div className="flex justify-center space-x-6 flex-wrap gap-3">
              {menuItems.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleMenuClick(item.action)}
                  className="text-gray-500 hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                © 2025 ServisAI. Všetky práva vyhradené.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
