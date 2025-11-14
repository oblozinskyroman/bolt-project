import React from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Shield,
  Clock,
  Zap,
  Globe2,
} from "lucide-react";

interface NewsPageProps {
  onNavigateBack: () => void;
}

type PlanId = "starter" | "pro" | "agency";

interface PricingPlan {
  id: PlanId;
  name: string;
  headline: string;
  price: string;
  priceNote?: string;
  description: string;
  tag?: string;
  popular?: boolean;
  features: string[];
}

const plans: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    headline: "Prvý AI asistent na web",
    price: "39 € / mesiac",
    priceNote: "pri ročnej platbe",
    description:
      "Ideálne pre jeden web alebo menší biznis, ktorý chce otestovať AI asistenta v praxi.",
    features: [
      "1 web / doména",
      "do 1 500 AI konverzácií mesačne",
      "jednoduché vloženie kódu na web",
      "nastavenie podľa textov z vášho webu",
      "základný report – počet otázok a dopytov",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    headline: "AI asistent ako hlavný kanál podpory",
    price: "89 € / mesiac",
    priceNote: "pri ročnej platbe",
    description:
      "Pre firmy, ktoré chcú, aby AI riešila väčšinu objednávok, otázok a dopytov za ľudí.",
    tag: "Najobľúbenejší",
    popular: true,
    features: [
      "až 3 weby / domény",
      "do 8 000 AI konverzácií mesačne",
      "pokročilé scenáre (rezervácie, objednávky, formuláre)",
      "napojenie na e-mail / CRM / ticketing",
      "prioritná podpora – úpravy nastavení za vás",
    ],
  },
  {
    id: "agency",
    name: "Agency / Custom",
    headline: "AI asistent pre väčšie projekty a agentúry",
    price: "na mieru",
    priceNote: "podľa počtu webov a objemu konverzácií",
    description:
      "Pre agentúry, siete pobočiek alebo projekty, kde ide o tisíce zákazníkov mesačne.",
    features: [
      "neobmedzený počet webov v rámci dohody",
      "vysoký objem AI konverzácií",
      "white-label možnosť pre agentúry",
      "vlastné integrácie (API, interné systémy)",
      "dedikovaný kontakt pre úpravy a konzultácie",
    ],
  },
];

const faqs = [
  {
    q: "Ako AI asistenta nasadíme na náš web?",
    a: "Po objednaní dostanete krátky kód (script), ktorý sa vloží na váš web – podobne ako Google Analytics alebo chat widget. Ak nechcete riešiť technické veci, kód vieme vložiť za vás.",
  },
  {
    q: "Z čoho sa AI učí?",
    a: "Primárne z textov na vašom webe (služby, cenník, často kladené otázky, podmienky, blog). Podľa potreby vieme doplniť vlastné interné podklady – PDF, dokumenty alebo manuály.",
  },
  {
    q: "Čo ak prekročíme limit konverzácií?",
    a: "Pri prekročení limitu vás budeme vopred informovať a navrhneme vyšší balík alebo individuálnu dohodu. Asistent sa nikdy „len tak“ nevypne bez upozornenia.",
  },
  {
    q: "Je možné začať len na skúšku?",
    a: "Áno. Bežne začíname 1–2 mesačným testom na Starter alebo Pro balíku. Ak uvidíte výsledky, prepneme to na dlhodobú spoluprácu.",
  },
];

function NewsPage({ onNavigateBack }: NewsPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16 md:py-20 shadow-lg">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <button
              onClick={onNavigateBack}
              className="p-2 rounded-lg hover:bg-white/15 transition-colors duration-200"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-sm mb-4">
              <Sparkles size={16} />
              <span>Cenník ServisAI</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Cenník AI asistenta pre váš web
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-4">
              Vyberte si balík podľa toho, koľko webov máte a koľko vecí má
              asistent vybavovať namiesto vás – od jednoduchých otázok až po
              rezervácie a objednávky.
            </p>
            <p className="text-sm md:text-base text-blue-100/90 flex items-center gap-2">
              <Shield size={16} />
              <span>
                Všetky balíky obsahujú bezpečné spracovanie dát a možnosť
                kedykoľvek meniť nastavenia asistenta.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Pricing plans */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col h-full rounded-2xl border shadow-sm bg-white/80 backdrop-blur-md p-6 md:p-7
              ${
                plan.popular
                  ? "border-blue-500 shadow-xl scale-[1.02]"
                  : "border-gray-200"
              }`}
            >
              {plan.tag && (
                <div className="absolute -top-3 left-6">
                  <span className="inline-flex items-center rounded-full bg-blue-600 text-white text-xs font-semibold px-3 py-1 shadow-md">
                    <Sparkles size={14} className="mr-1" /> {plan.tag}
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h2 className="text-sm font-semibold tracking-wide text-gray-500 uppercase">
                  {plan.name}
                </h2>
                <p className="text-xl font-bold text-gray-900 mt-1 mb-2">
                  {plan.headline}
                </p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-extrabold text-gray-900">
                    {plan.price}
                  </span>
                </div>
                {plan.priceNote && (
                  <p className="text-xs text-gray-500">{plan.priceNote}</p>
                )}
                <p className="mt-3 text-sm text-gray-600">{plan.description}</p>
              </div>

              <ul className="mt-4 space-y-2 text-sm text-gray-700 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 text-emerald-500 flex-shrink-0"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <button
                  onClick={onNavigateBack}
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all
                    ${
                      plan.popular
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg"
                        : "bg-gray-900 text-white hover:bg-black shadow-sm hover:shadow-md"
                    }`}
                >
                  Chcem nasadiť asistenta
                </button>
                <p className="mt-2 text-xs text-gray-500 text-center">
                  Po kliknutí sa vrátite na hlavnú stránku, kde môžete pokračovať
                  cez „Pridať web“.
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* What’s included */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
              <Clock size={20} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Nonstop odpovede pre zákazníkov
            </h3>
            <p className="text-sm text-gray-600">
              Asistent odpovedá 24/7 – bez prestávok, PN a bez toho, aby ste
              museli riešiť klasický support chat.
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
              <Zap size={20} className="text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Rezervácie, objednávky, formuláre
            </h3>
            <p className="text-sm text-gray-600">
              Nielen odpovede – AI vie vyzbierať údaje od zákazníka a pripraviť
              celý dopyt alebo rezerváciu tak, aby vám len „pristála“ do mailu
              alebo systému.
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
              <Globe2 size={20} className="text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Funguje na väčšine bežných platforiem
            </h3>
            <p className="text-sm text-gray-600">
              WordPress, Shoptet, Shopify, vlastný web… všade, kde viete vložiť
              kúsok kódu, vieme nasadiť aj ServisAI asistenta.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Často kladené otázky
          </h2>
          <div className="space-y-4">
            {faqs.map((item) => (
              <div
                key={item.q}
                className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-gray-200 shadow-sm"
              >
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {item.q}
                </h3>
                <p className="text-sm text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs text-gray-500 text-center">
            Ak máte špecifický typ webu alebo vyšší objem zákazníkov, je
            pravdepodobné, že sa zmestíte do jedného z balíkov – zvyšok doladíme
            individuálne.
          </p>
        </div>
      </div>
    </div>
  );
}

export default NewsPage;
