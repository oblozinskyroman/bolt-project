import React from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Shield,
  Sparkles,
  Zap,
  MessageCircle,
  Clock,
  HelpCircle,
} from "lucide-react";

interface NewsPageProps {
  onNavigateBack: () => void;
}

type PlanId = "starter" | "pro" | "custom";

const PLANS: {
  id: PlanId;
  name: string;
  price: string;
  note?: string;
  description: string;
  bestFor: string;
  highlights: string[];
  features: string[];
  cta: string;
  popular?: boolean;
}[] = [
  {
    id: "starter",
    name: "Starter",
    price: "49 € / mes.",
    description: "Jednoduchý AI asistent pre jeden web.",
    bestFor: "malé podniky, salóny, lokálne služby",
    highlights: ["1 web", "Základné FAQ + rezervácie", "Email notifikácie"],
    features: [
      "AI chatbot vložený na váš web",
      "Tréning na vašom texte (FAQ, cenník, služby)",
      "Jednoduchý formulár na zadanie požiadavky",
      "Základné štatistiky – počet dopytov",
      "Emailové upozornenia na nové dopyty",
    ],
    cta: "Začať so Starter",
  },
  {
    id: "pro",
    name: "Growth",
    price: "99 € / mes.",
    note: "Najobľúbenejší",
    description: "AI asistent, ktorý skutočne nahradí prvú líniu podpory.",
    bestFor: "rastúce e-shopy, salóny, agentúry",
    highlights: [
      "Do 3 webov / projektov",
      "Pokročilé tréningové datasety",
      "Prioritná podpora",
    ],
    features: [
      "Všetko zo Starter",
      "Pokročilé scenáre (rezervácie, objednávky, statusy)",
      "Export dopytov do e-mailu alebo CRM",
      "Jednoduché A/B testovanie textov",
      "Prioritná podpora do 24 hodín",
    ],
    cta: "Rozbehnúť Growth plán",
    popular: true,
  },
  {
    id: "custom",
    name: "Custom / White-label",
    price: "Individuálna cenotvorba",
    description: "Integrácie na mieru, viac webov, vlastná značka.",
    bestFor: "väčšie firmy, siete pobočiek, agentúry",
    highlights: ["Viac webov", "API integrácie", "SLA support"],
    features: [
      "Nastavenie AI asistenta na mieru",
      "Integrácie (CRM, rezervačné systémy, interné API)",
      "Možnosť white-label riešenia",
      "Vyhradený konzultant",
      "Dohodnuté KPI a SLA",
    ],
    cta: "Dohodnúť stretnutie",
  },
];

const FAQ = [
  {
    q: "Je v cene aj nastavenie asistenta?",
    a: "Áno. Pri štarte vám pomôžeme pripraviť podklady (FAQ, služby, cenník) a nahrať ich do systému tak, aby AI odpovedala zrozumiteľne a bezpečne.",
  },
  {
    q: "Čo ak nemám technického človeka na webe?",
    a: "Stačí, ak nám pošlete prístup k webu alebo kontakt na vášho tvorcu webu. Implementácia je väčšinou len vloženie jedného skriptu.",
  },
  {
    q: "Koľko dopytov zvládne AI asistent?",
    a: "Neobmedzene. Asistent odpovedá 24/7 bez príplatku za počet konverzácií.",
  },
  {
    q: "Môžem plán kedykoľvek zrušiť?",
    a: "Áno, pri mesačnom účtovaní môžete plán kedykoľvek zrušiť bez viazanosti.",
  },
];

function NewsPage({ onNavigateBack }: NewsPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100">
      {/* HERO */}
      <div className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-start mb-6">
            <button
              onClick={onNavigateBack}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
            >
              <ArrowLeft className="text-white" size={20} />
            </button>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">
            Cenník ServisAI
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto text-center leading-relaxed">
            Vyberte si plán podľa toho, koľko práce chcete preniesť z ľudí na
            AI asistenta.
          </p>
          <div className="mt-6 flex justify-center gap-3 text-sm text-blue-100">
            <div className="flex items-center gap-2">
              <Shield size={16} />
              <span>Bez viazanosti</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={16} />
              <span>Neobmedzené konverzácie</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} />
              <span>Nastavenie pri štarte v cene</span>
            </div>
          </div>
        </div>
      </div>

      {/* PLÁNY */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* items-stretch = všetky karty rovnako vysoké */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border flex flex-col h-full ${
                plan.popular
                  ? "border-blue-500 shadow-xl scale-[1.02]"
                  : "border-gray-100"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  Najobľúbenejší
                </div>
              )}

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h2>
              <p className="text-3xl font-extrabold text-gray-900 mb-2">
                {plan.price}
              </p>
              {plan.note && (
                <p className="text-sm text-blue-600 font-semibold mb-2">
                  {plan.note}
                </p>
              )}
              <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
              <p className="text-gray-500 text-xs mb-4">
                Najlepšie pre:{" "}
                <span className="font-medium">{plan.bestFor}</span>
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {plan.highlights.map((h) => (
                  <span
                    key={h}
                    className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700"
                  >
                    <CheckCircle2 size={12} />
                    {h}
                  </span>
                ))}
              </div>

              {/* obsah necháme „flex-grow“, aby tlačidlo skončilo dole */}
              <ul className="mt-4 space-y-2 text-sm text-gray-700 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 text-emerald-500" size={16} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full mt-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  plan.popular
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                    : "bg-gray-900 text-white hover:bg-black"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Info pod tabuľkou */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="flex items-start gap-3 bg-white/70 rounded-xl p-4 shadow-sm">
            <Clock className="mt-1 text-blue-600" size={18} />
            <div>
              <p className="font-semibold text-gray-800">
                Nasadenie typicky do 7 dní
              </p>
              <p className="text-gray-600">
                Podľa zložitosti webu a množstva podkladov.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white/70 rounded-xl p-4 shadow-sm">
            <MessageCircle className="mt-1 text-emerald-600" size={18} />
            <div>
              <p className="font-semibold text-gray-800">
                Pomoc s obsahom v cene
              </p>
              <p className="text-gray-600">
                Pomôžeme vám preformulovať texty tak, aby im AI rozumela.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white/70 rounded-xl p-4 shadow-sm">
            <Shield className="mt-1 text-indigo-600" size={18} />
            <div>
              <p className="font-semibold text-gray-800">
                Bezpečné spracovanie dát
              </p>
              <p className="text-gray-600">
                AI odpovedá len z podkladov, ktoré jej dáte, a loguje každý
                dopyt.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white/50 backdrop-blur-md py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Často kladené otázky
            </h2>
            <p className="text-gray-600">
              Ak máte inú otázku, napíšte nám – doplníme ju aj sem.
            </p>
          </div>
          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className="bg-white/80 rounded-xl p-5 shadow-sm border border-gray-100"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="mt-1 text-blue-500" size={18} />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">
                      {item.q}
                    </p>
                    <p className="text-gray-600 text-sm">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsPage;
