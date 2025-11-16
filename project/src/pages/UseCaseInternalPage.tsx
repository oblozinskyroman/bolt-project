import React from "react";
import { ArrowLeft, Zap } from "lucide-react";

interface UseCasePageProps {
  onNavigateBack: () => void;
}

const UseCaseInternalPage: React.FC<UseCasePageProps> = ({
  onNavigateBack,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <button
        onClick={onNavigateBack}
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Naspäť na úvod
      </button>

      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-r from-slate-500 to-gray-700 flex items-center justify-center text-white shadow-md">
              <Zap className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Interné otázky a know-how
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                AI ako interný „knowledge base“, ktorý odpovedá namiesto
                manuálov, PDF a skúsených kolegov.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 text-xs md:text-sm text-slate-900 max-w-sm">
            <p className="font-semibold mb-1">Kde dáva najväčší zmysel:</p>
            <p>
              onboarding nováčikov, interné procesy, produktové informácie,
              support skripty, bezpečnostné a HR pravidlá.
            </p>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid gap-8 md:grid-cols-2 text-sm md:text-base text-gray-700 leading-relaxed">
          {/* Left column */}
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900 text-base md:text-lg">
              Čo všetko môže AI vedieť o tvojej firme
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>procesy krok-za-krokom (ako vybaviť reklamáciu, objednávku…)</li>
              <li>
                odpovede na často kladené otázky od zákazníkov – v jazyku, ktorý
                majú používať operátori,
              </li>
              <li>
                technické špecifikácie produktov, cenníky, výnimky, povolenia,
              </li>
              <li>
                interné smernice (GDPR, bezpečnosť, prístupové práva) pre HR a
                manažment.
              </li>
            </ul>

            <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
              <p className="text-xs font-semibold text-gray-900 mb-1">
                Typická otázka od nového kolegu:
              </p>
              <p className="text-xs text-gray-700">
                „Ako presne máme postupovať pri reklamácii, keď chýba faktúra a
                zákazník má len objednávku z e-shopu?“
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            <div>
              <h2 className="font-semibold text-gray-900 text-base md:text-lg mb-2">
                Ako AI uľahčí život tímu
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  namiesto hľadania v zdieľaných diskoch stačí položiť otázku v
                  prirodzenom jazyku,
                </li>
                <li>
                  odpovede sú konzistentné – každý dostane rovnaký proces, nie
                  „ako si to pamätá kolega“,
                </li>
                <li>
                  senior ľudia nemusia vysvetľovať to isté stále dokola, AI to
                  zvládne za nich,
                </li>
                <li>
                  vedomosti zostanú v systéme aj vtedy, keď ľudia odídu alebo
                  zmenia pozíciu.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-semibold text-gray-900 text-base md:text-lg mb-2">
                Implementácia v praxi
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  nahratie manuálov, interných dokumentov a procesných popisov,
                </li>
                <li>
                  odladenie spôsobu, akým má AI odpovedať (jazyk, tón, odkazy na
                  konkrétne dokumenty),
                </li>
                <li>
                  možnosť logovania otázok – vidíš, čo tím nevie a kde máš
                  medzery v dokumentácii.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 border-t border-gray-100 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs md:text-sm text-gray-500 max-w-xl">
            Interný asistent beží len vo vnútri firmy. Môžeš ho mať dostupný
            cez web, intranet alebo priamo v nástrojoch, ktoré už používate
            (napr. helpdesk, CRM, interný portál).
          </p>
          <div className="flex gap-3">
            <span className="inline-flex items-center rounded-full bg-slate-50 text-slate-700 text-xs md:text-sm px-3 py-1 border border-slate-200">
              Menej zaškolovania, viac konzistentných odpovedí
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseCaseInternalPage;
