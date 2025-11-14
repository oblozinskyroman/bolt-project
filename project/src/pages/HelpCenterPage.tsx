import React, { useState } from "react";
import {
  ArrowLeft,
  MessageCircle,
  Globe,
  Code2,
  Settings,
  Shield,
  Zap,
  CheckCircle,
  FileText,
  Copy,
} from "lucide-react";

interface HelpCenterPageProps {
  onNavigateBack: () => void;
}
function HelpCenterPage({ onNavigateBack }: HelpCenterPageProps) {
  const [activeTab, setActiveTab] = useState<"simple" | "dev">("simple");

  const simpleSteps = [
    {
      icon: MessageCircle,
      title: "1. Vytvoríte projekt v ServisAI",
      text: "Po prihlásení si založíte nový web/projekt. Vyplníte názov, URL a základné nastavenia asistenta (jazyk, typ otázok, časť dňa, kedy má byť aktívny).",
    },
    {
      icon: Globe,
      title: "2. Skopírujete krátky kód na váš web",
      text: "Vygenerujeme vám jednoduchý script, ktorý vložíte do hlavičky alebo cez váš CMS (WordPress, Webnode, Shoptet, vlastný kód...).",
    },
    {
      icon: Shield,
      title: "3. Asistent sa učí z vašich dát",
      text: "Pridáte cenník, FAQ, texty služieb alebo URL s popisom firmy. Asistent z nich číta odpovede a vybavuje zákazníkov priamo na vašom webe.",
    },
  ];

  const devBlocks = [
    {
      icon: Code2,
      title: "REST API / Edge Function",
      text: "Asistenta môžete volať priamo z vášho backendu. Odovzdáte históriu chatu + meta dáta (ID zákazníka, typ služby, lokalitu) a späť dostanete odpoveď aj štruktúrované dáta.",
    },
    {
      icon: Settings,
      title: "Vlastné UI komponenty",
      text: "Ak nechcete bublinu v rohu, môžete si urobiť vlastný chat, formulár alebo wizard. Stačí volať jedno API a ServisAI sa postará o logiku odpovedí.",
    },
    {
      icon: Shield,
      title: "Bezpečnosť a limity",
      text: "Každý projekt má vlastný API kľúč a kvóty. Môžete obmedziť zdroje, z ktorých asistent čerpá (napr. len konkrétne služby, konkrétnu lokalitu alebo jazyk).",
    },
  ];

  const checklist = [
    "Máte stránku, kam viete vložiť krátky script (alebo prístup k človeku, čo spravuje web).",
    "Viete, aké typy otázok má asistent riešiť (rezervácie, cenník, základné FAQ, tracking objednávok...).",
    "Máte aspoň základný textový podklad – cenník, popis služieb, podmienky, otváracie hodiny.",
    "Viete, kam majú padať dopyty – e-mail, CRM, jednoduchá notifikácia, alebo len interný prehľad.",
  ];

  const scriptExample = `<script
  src="https://cdn.servisai.sk/widget.js"
  data-project-id="VAS_PROJECT_ID"
  async
></script>`;

  const apiExample = `POST https://api.vasweb.sk/ai-assistant

Body:
{
  "message": "Potrebujem preložiť termín rezervácie na piatok",
  "history": [...],
  "meta": {
    "projectId": "VAS_PROJECT_ID",
    "userId": "123",
    "locale": "sk-SK"
  }
}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text).catch(() => undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-start mb-6">
            <button
              onClick={onNavigateBack}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
            >
              <ArrowLeft className="text-white" size={20} />
            </button>
          </div>

          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <Settings className="text-white" size={32} />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Integrácia ServisAI
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Pridajte AI asistenta na váš web za pár minút – bez programovania
            alebo s plnou kontrolou cez API.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-2 mb-10 flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setActiveTab("simple")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm md:text-base font-medium transition-all ${
              activeTab === "simple"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <MessageCircle size={18} />
            Bez programovania
          </button>
          <button
            onClick={() => setActiveTab("dev")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm md:text-base font-medium transition-all ${
              activeTab === "dev"
                ? "bg-gradient-to-r from-slate-700 to-gray-900 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Code2 size={18} />
            Pre vývojárov
          </button>
        </div>
      </div>

      {/* Content – Simple integration */}
      {activeTab === "simple" && (
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-16">
          {/* 3 kroky */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
              3 kroky k AI asistentovi na vašom webe
            </h2>
            <p className="text-lg text-gray-600 text-center mb-10 max-w-3xl mx-auto">
              Typický klient zvládne nasadenie do 30 minút. Technické veci
              pripravíme za vás, stačí vložiť krátky kód na web.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {simpleSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={i}
                    className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                        <Icon className="text-white" size={24} />
                      </div>
                      <span className="text-sm font-semibold text-blue-600">
                        Krok {i + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Script snippet */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="text-blue-600" size={20} />
                <h3 className="text-xl font-bold text-gray-800">
                  Vloženie na web (príklad)
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Tento kód je ukážka, ako bude vyzerať skript pre váš projekt.
                Skutočný kód nájdete po prihlásení v administrácii ServisAI.
              </p>
              <div className="relative">
                <pre className="text-xs md:text-sm bg-gray-900 text-green-100 rounded-xl p-4 overflow-x-auto">
{scriptExample}
                </pre>
                <button
                  onClick={() => copyToClipboard(scriptExample)}
                  className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-xs text-white"
                >
                  <Copy size={12} />
                  Kopírovať
                </button>
              </div>
              <ul className="mt-4 text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Kód vložte ideálne pred koniec tagu {'</head>'}.</li>
                <li>
                  Na WordPresse môžete použiť vlastný HTML blok alebo plugin na
                  vloženie scriptov.
                </li>
                <li>
                  Asistent sa zobrazí ako bublina v pravom dolnom rohu – klikom
                  sa otvorí chat okno.
                </li>
              </ul>
            </div>

            {/* Checklist */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="text-emerald-600" size={22} />
                <h3 className="text-xl font-bold text-gray-800">
                  Čo si pripraviť pred integráciou
                </h3>
              </div>
              <ul className="space-y-3">
                {checklist.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="mt-1">
                      <CheckCircle
                        size={16}
                        className="text-emerald-500 flex-shrink-0"
                      />
                    </span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-800 flex gap-2">
                <Shield size={16} className="mt-0.5" />
                <p>
                  Údaje, ktoré nahráte (FAQ, cenníky, interné texty), sú
                  použité len na trénovanie vášho asistenta. Nesdieľame ich s
                  inými projektmi.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content – Dev integration */}
      {activeTab === "dev" && (
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-16">
          {/* Blocks */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
              Integrácia pre vývojárov
            </h2>
            <p className="text-lg text-gray-600 text-center mb-10 max-w-3xl mx-auto">
              ServisAI môžete použiť ako čisté AI backend riešenie. Frontend
              aj UX si viete postaviť na mieru – my dodáme odpovede a logiku.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {devBlocks.map((block, i) => {
                const Icon = block.icon;
                return (
                  <div
                    key={i}
                    className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-slate-700 to-gray-900 flex items-center justify-center mb-4">
                      <Icon className="text-white" size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {block.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {block.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* API example */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Code2 className="text-slate-800" size={20} />
                <h3 className="text-xl font-bold text-gray-800">
                  Volanie asistenta cez API (príklad)
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Jednoduchý príklad requestu. V reále dostanete aj štruktúrované
                polia (napr. rozpoznaná služba, lokalita, budúci termín,
                typ zákazníka…).
              </p>
              <div className="relative">
                <pre className="text-xs md:text-sm bg-gray-900 text-green-100 rounded-xl p-4 overflow-x-auto">
{apiExample}
                </pre>
                <button
                  onClick={() => copyToClipboard(apiExample)}
                  className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-xs text-white"
                >
                  <Copy size={12} />
                  Kopírovať
                </button>
              </div>
              <ul className="mt-4 text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Autentifikácia prebieha cez projektový API kľúč.</li>
                <li>
                  V histórii môžete posielať predošlé správy chatu pre
                  kontextové odpovede.
                </li>
                <li>
                  Meta dáta slúžia na filtrovanie služieb, miest a interných
                  pravidiel.
                </li>
              </ul>
            </div>

            {/* Latency / reliability */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="text-amber-600" size={20} />
                <h3 className="text-xl font-bold text-gray-800">
                  Prevádzka a limity
                </h3>
              </div>
              <ul className="space-y-3 text-sm text-gray-700">
                <li>
                  <strong>Latencia:</strong> odpovede typicky do 1–4 sekúnd
                  podľa zložitosti dotazu.
                </li>
                <li>
                  <strong>Rate limiting:</strong> podľa zvoleného plánu
                  (počet požiadaviek / min, mesačné limity).
                </li>
                <li>
                  <strong>Sandbox:</strong> možnosť oddeliť testovací a
                  produkčný projekt, aby sa nemiešali dáta.
                </li>
                <li>
                  <strong>Logy:</strong> každá konverzácia sa dá spätne
                  analyzovať (čo sa pýtal zákazník, čo odpovedal asistent).
                </li>
              </ul>
              <div className="mt-6 p-4 rounded-xl bg-slate-900 text-slate-100 text-sm flex gap-2">
                <Shield size={16} className="mt-0.5 flex-shrink-0" />
                <p>
                  Pri vlastnej integrácii máte plnú kontrolu nad tým, aké dáta
                  sa k nám posielajú. Môžete anonymizovať osobné údaje alebo
                  posielať len interné ID.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Chcete vidieť integráciu naživo?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Dohodnite si krátke demo. Ukážeme vám, ako ServisAI vybavuje
            zákazníkov na reálnom webe – od prvej otázky až po zaplatenú
            objednávku.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={onNavigateBack}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              Späť na úvod
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HelpCenterPage;
