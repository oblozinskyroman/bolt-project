import React, { useEffect, useRef, useState } from "react";
import AddCompanyPage from "./pages/AddCompanyPage";
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

import UseCaseReservationsPage from "./pages/UseCaseReservationsPage";
import UseCaseSupportPage from "./pages/UseCaseSupportPage";
import UseCaseEshopPage from "./pages/UseCaseEshopPage";
import UseCaseServicePage from "./pages/UseCaseServicePage";
import UseCaseFormsPage from "./pages/UseCaseFormsPage";
import UseCaseInternalPage from "./pages/UseCaseInternalPage";

import { supabase } from "./lib/supabase";
import { askAI, type ChatTurn } from "./lib/askAI";

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
  Mic,
  MicOff,
} from "lucide-react";

import { useSpeechToText } from "./hooks/useSpeechToText";
import FloatingChatWidget from "./components/FloatingChatWidget";

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
  | "howItWorks"
  | "references"
  | "news"
  | "helpCenter"
  | "contact"
  | "addCompany"
  | "myAccount"
  | "myOrders"
  | "paymentSuccess"
  | "paymentCancel"
  | "useCaseReservations"
  | "useCaseSupport"
  | "useCaseEshop"
  | "useCaseService"
  | "useCaseForms"
  | "useCaseInternal";

const ALL_PAGES: PageId[] = [
  "home",
  "howItWorks",
  "references",
  "news",
  "helpCenter",
  "contact",
  "addCompany",
  "myAccount",
  "myOrders",
  "paymentSuccess",
  "paymentCancel",
  "useCaseReservations",
  "useCaseSupport",
  "useCaseEshop",
  "useCaseService",
  "useCaseForms",
  "useCaseInternal",
];

function getPageFromHash(): PageId {
  if (typeof window === "undefined") return "home";
  const raw = window.location.hash.replace("#", "").trim() as PageId;
  return ALL_PAGES.includes(raw) ? raw : "home";
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageId>(getPageFromHash);

  const inputRef = useRef<HTMLInputElement | null>(null);

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

  const { isSupported: sttSupported, isListening, toggleListening } =
    useSpeechToText({
      lang: "sk-SK",
      onText: (text: string) => {
        const t = text.trim();
        if (!t) return;
        setMessage((prev) => (prev ? `${prev} ${t}` : t));
      },
    });

  const handleMicClick = () => {
    if (!sttSupported) return;

    if (!isListening && inputRef.current) {
      inputRef.current.focus();
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }

    toggleListening();
  };

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
      const loggedIn = !!session?.user;
      setIsLoggedIn(loggedIn);

      if (!loggedIn) {
        if (typeof window !== "undefined") {
          window.location.hash = "";
        }
        setCurrentPage("home");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = () => {
      setCurrentPage(getPageFromHash());
    };

    window.addEventListener("hashchange", handler);
    handler();

    return () => {
      window.removeEventListener("hashchange", handler);
    };
  }, []);

  const goTo = (page: PageId) => {
    if (typeof window !== "undefined") {
      const hash = page === "home" ? "" : `#${page}`;
      if (window.location.hash !== hash) {
        window.location.hash = hash;
        return;
      }
    }
    setCurrentPage(page);
  };

  useEffect(() => {
    const existing = (localStorage.getItem(LS_PREF_LOC) || "").trim();
    if (existing && !userLocation) setUserLocation(existing);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const t = setTimeout(() => {
      const v = (userLocation || "").trim();
      localStorage.setItem(LS_PREF_LOC, v);
    }, 250);
    return () => clearTimeout(t);
  }, [userLocation]);

  const useCases = [
    {
      name: "Rezervácie a objednávky",
      icon: Calendar,
      color: "from-blue-500 to-indigo-600",
      description: "Prijímanie rezervácií, termínov a dopytov bez telefonovania.",
      targetPage: "useCaseReservations" as PageId,
    },
    {
      name: "Zákaznícka podpora 24/7",
      icon: MessageCircle,
      color: "from-emerald-500 to-teal-600",
      description:
        "Odpovede na časté otázky, otváracie hodiny, ceny a podmienky.",
      targetPage: "useCaseSupport" as PageId,
    },
    {
      name: "E-shop a produkty",
      icon: Puzzle,
      color: "from-violet-500 to-purple-600",
      description:
        "Pomoc s výberom produktu, dostupnosťou a stavom objednávky.",
      targetPage: "useCaseEshop" as PageId,
    },
    {
      name: "Servis a reklamácie",
      icon: Shield,
      color: "from-amber-500 to-orange-600",
      description: "Zber údajov k poruche, otvorenie ticketu, základné rady.",
      targetPage: "useCaseService" as PageId,
    },
    {
      name: "Formuláre a dopyty",
      icon: Palette,
      color: "from-pink-500 to-rose-600",
      description:
        "AI vyplní so zákazníkom všetko potrebné a odošle vám podklady.",
      targetPage: "useCaseForms" as PageId,
    },
    {
      name: "Interné otázky",
      icon: Zap,
      color: "from-slate-500 to-gray-600",
      description:
        "Návody, procesy a interné know-how dostupné na pár kliknutí.",
      targetPage: "useCaseInternal" as PageId,
    },
  ];

  const menuItems = [
    { label: "Ako fungujeme", action: "howItWorks" },
    { label: "Referencie", action: "references" },
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

  const navigateToHome = () => goTo("home");
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

  const handleMenuClick = (action: string | null) => {
    if (action === "howItWorks") navigateToHowItWorks();
    else if (action === "references") navigateToReferences();
    else if (action === "news") navigateToNews();
    else if (action === "helpCenter") navigateToHelpCenter();
    else if (action === "contact") navigateToContact();
    else if (action === "myAccount") navigateToMyAccount();
    else if (action === "myOrders") navigateToMyOrders();
  };

  const ORDER_AMOUNT_CENTS = 5000; // nepotrebné, ale ak ho ešte používaš inde, nechaj

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex-shrink-0">
              <button
                onClick={navigateToHome}
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                ServisAI
              </button>
            </div>

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

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={navigateToMyAccount}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all transform hover:scale-105 shadow-md hover:shadow-lg ${
                  isLoggedIn
                    ? "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200"
                    : "bg-white text-blue-700 border border-blue-200 hover:bg-blue-50"
                }`}
              >
                <User size={16} />
                {isLoggedIn ? "Môj účet" : "Prihlásiť sa"}
              </button>

              <NavCta
                onClick={navigateToAddCompany}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 border-blue-400"
              >
                Pridať web
              </NavCta>
            </div>

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
                    : "bg-white text-blue-700 border border-blue-200 hover:bg-blue-50"
                }`}
              >
                <User size={20} />
                {isLoggedIn ? "Môj účet" : "Prihlásiť sa"}
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

      <div className="flex-1">
        {currentPage === "home" && (
          <>
            {/* ... (tu si nechaj tvoj existujúci HERO + demo chat + karty AI výsledkov, nemenil som) ... */}

            {/* Use cases sekcia */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              {/* ... hero nad use-cases sekciou ... */}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {useCases.map((useCase, index) => {
                  const IconComponent = useCase.icon;
                  return (
                    <div
                      key={index}
                      onClick={() => goTo(useCase.targetPage)}
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

        {currentPage === "useCaseReservations" && (
          <UseCaseReservationsPage onNavigateBack={navigateToHome} />
        )}
        {currentPage === "useCaseSupport" && (
          <UseCaseSupportPage onNavigateBack={navigateToHome} />
        )}
        {currentPage === "useCaseEshop" && (
          <UseCaseEshopPage onNavigateBack={navigateToHome} />
        )}
        {currentPage === "useCaseService" && (
          <UseCaseServicePage onNavigateBack={navigateToHome} />
        )}
        {currentPage === "useCaseForms" && (
          <UseCaseFormsPage onNavigateBack={navigateToHome} />
        )}
        {currentPage === "useCaseInternal" && (
          <UseCaseInternalPage onNavigateBack={navigateToHome} />
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

      {/* nový plávajúci chatbot */}
      <FloatingChatWidget />
    </div>
  );
}

export default App;
