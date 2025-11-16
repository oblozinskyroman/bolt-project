import React from "react";
import {
  ArrowLeft,
  Package,
  ShoppingCart,
  CheckCircle2,
  Truck,
  CreditCard,
  BarChart3,
} from "lucide-react";

interface UseCasePageProps {
  onNavigateBack: () => void;
}

const UseCaseEshopPage: React.FC<UseCasePageProps> = ({ onNavigateBack }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Back button */}
      <button
        onClick={onNavigateBack}
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Naspäť na úvod
      </button>

      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 lg:p-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                E-shop a produkty
              </h1>
              <p className="text-gray-600 text-sm md:text-base mt-1">
                AI asistent pomáha zákazníkom s výberom produktu, dostupnosťou a
                stavom objednávky – bez preťaženia vašej podpory.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 text-xs font-medium border border-violet-100">
            <ShoppingCart className="w-4 h-4" />
            Použitie: katalóg, košík, objednávky, status zásielky
          </div>
        </div>

        {/* Two-column content */}
        <div className="grid gap-8 lg:grid-cols-2 mb-10">
          {/* Left column – čo vie AI vybaviť */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Čo zvládne AI v e-shope
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Asistent odpovedá na otázky, ktoré bežne končia na e-maili alebo
              chate zákazníckej podpory. Všetko robí podľa pravidiel, ktoré mu
              nastavíte.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                Pomoc s výberom produktu podľa parametrov, rozpočtu alebo
                použitia.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                Vysvetlí rozdiely medzi modelmi, balíčkami či verziami produktu.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                Overí dostupnosť – sklad, odberné miesta, odhad dodania.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                Zodpovie otázky k platbe, doprave, vráteniu tovaru a reklamácii.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                Pomôže dohľadať existujúcu objednávku a vysvetlí ďalší postup.
              </li>
            </ul>
          </div>

          {/* Right column – príklady použitia */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Konkrétne scenáre z praxe
            </h2>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4 flex gap-3">
                <CreditCard className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">
                    Nejasnosti pri platbe
                  </p>
                  <p className="text-gray-600">
                    Zákazník nevie, či bola platba úspešná, alebo čo znamená
                    chyba na bráne. Asistent vysvetlí stav, odporučí ďalšie
                    kroky a zníži počet zbytočných ticketov.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4 flex gap-3">
                <Truck className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">
                    Kde je moja zásielka?
                  </p>
                  <p className="text-gray-600">
                    Po zadaní čísla objednávky alebo e-mailu poskytne aktuálny
                    stav, odhad doručenia a informácie od dopravcu.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4 flex gap-3">
                <BarChart3 className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">
                    Výber správneho variantu
                  </p>
                  <p className="text-gray-600">
                    Zákazník opíše, čo potrebuje (napr. „monitor na prácu a
                    občasné hranie“). AI zúži ponuku na pár vhodných modelov
                    podľa parametrov a dostupnosti.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process section */}
        <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-6 mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Ako to beží na pozadí
          </h2>
          <p className="text-sm text-gray-700 mb-4">
            Po nasadení asistenta sa nemení váš e-shop ani pokladňa. AI len
            pracuje nad údajmi, ktoré už máte – popisy produktov, sklad, stav
            objednávok a interné pravidlá.
          </p>
          <ol className="grid gap-4 md:grid-cols-4 text-sm text-gray-700">
            <li className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-violet-700">
                1. Napojenie
              </span>
              <span>
                Import produktov, základných parametrov a pravidiel dopravy /
                platieb.
              </span>
            </li>
            <li className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-violet-700">
                2. Školenie asistenta
              </span>
              <span>
                Nastavenie typických otázok, odporúčaní a odpovedí podľa vašej
                značky.
              </span>
            </li>
            <li className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-violet-700">
                3. Nasadenie
              </span>
              <span>
                Widget na webe, ktorý zvládne chat, FAQ a zber údajov od
                zákazníka.
              </span>
            </li>
            <li className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-violet-700">
                4. Meranie
              </span>
              <span>
                Sledujete počet vybavených otázok, ušetrený čas a spätnú väzbu
                zákazníkov.
              </span>
            </li>
          </ol>
        </div>

        {/* Who is it for */}
        <div className="grid gap-4 md:grid-cols-3 text-sm">
          <div className="rounded-xl border border-gray-100 bg-white/70 p-4">
            <p className="font-semibold text-gray-900 mb-1">
              Menšie a stredné e-shopy
            </p>
            <p className="text-gray-600">
              Keď podporu rieši pár ľudí a každé zníženie počtu dopytov je
              cítiť na čase.
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white/70 p-4">
            <p className="font-semibold text-gray-900 mb-1">
              Značky s drahšími produktmi
            </p>
            <p className="text-gray-600">
              Kde zákazníci potrebujú poradiť, porovnať a pochopiť rozdiely
              pred nákupom.
            </p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-white/70 p-4">
            <p className="font-semibold text-gray-900 mb-1">
              E-shopy s vlastným skladom
            </p>
            <p className="text-gray-600">
              Asistent vie pracovať s dostupnosťou, dopravou a internými
              procesmi expedície.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseCaseEshopPage;
