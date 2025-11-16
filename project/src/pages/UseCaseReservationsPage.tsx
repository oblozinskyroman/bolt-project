import React from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";

interface UseCasePageProps {
  onNavigateBack: () => void;
}

const UseCaseReservationsPage: React.FC<UseCasePageProps> = ({
  onNavigateBack,
}) => {
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

      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Rezervácie a objednávky
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                ServisAI preberie od zákazníka celý proces rezervácie – bez
                telefonovania, bez prepisovania údajov a bez chaosu v kalendári.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm text-blue-900 max-w-xs">
            <p className="font-semibold mb-1">Ideálne pre:</p>
            <p>
              salóny, servisy, poradne, konzultácie, tréningy, prenájmy
              priestorov a všetko, kde riešiš termíny a kapacity.
            </p>
          </div>
        </div>

        {/* What AI does */}
        <div className="grid gap-6 md:grid-cols-2 mb-10">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Čo všetko ServisAI vybaví za teba
            </h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                <span>
                  získa od zákazníka všetky dôležité údaje
                  (meno, kontakt, typ služby, preferovaný termín),
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                <span>
                  skontroluje dostupnosť podľa tvojich pravidiel
                  (otváracie hodiny, prestávky, kapacita, black-list termínov),
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                <span>
                  ponúkne náhradné časy, keď je termín plný alebo kolízie v
                  kalendári,
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                <span>
                  odošle zákazníkovi potvrdenie aj pripomienku (e-mail / SMS /
                  WhatsApp – podľa integrácie),
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                <span>
                  zapíše rezerváciu do tvojho systému – kalendár, CRM alebo
                  rezervačný nástroj.
                </span>
              </li>
            </ul>
          </div>

          {/* Scenario */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Ako vyzerá reálna konverzácia
            </h2>
            <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 text-sm text-gray-800 space-y-2">
              <p className="font-semibold text-gray-900">Scenár:</p>
              <p className="flex gap-2">
                <PhoneCall className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
                <span>
                  Zákazník príde na web a napíše: „Chcel by som termín na servis
                  auta budúci týždeň.“
                </span>
              </p>
              <p className="flex gap-2">
                <Clock className="w-4 h-4 mt-1 text-amber-500 flex-shrink-0" />
                <span>
                  AI sa dopýta značku, typ služby, preferovaný deň/čas a podľa
                  tvojich pravidiel rovno navrhne voľné sloty.
                </span>
              </p>
              <p className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 mt-1 text-emerald-500 flex-shrink-0" />
                <span>
                  Po potvrdení termínu odošle zhrnutie zákazníkovi aj tebe a
                  zapíše všetko do kalendára.
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Process steps */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Proces, ktorý nastavíme na mieru tvojej prevádzke
          </h2>
          <div className="grid gap-4 md:grid-cols-4 text-sm">
            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
              <p className="text-xs font-semibold text-gray-500 mb-1">
                KROK 1
              </p>
              <p className="font-semibold text-gray-900 mb-1">
                Zber vstupných údajov
              </p>
              <p className="text-gray-700">
                definujeme, čo AI potrebuje vedieť pred vytvorením rezervácie.
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
              <p className="text-xs font-semibold text-gray-500 mb-1">
                KROK 2
              </p>
              <p className="font-semibold text-gray-900 mb-1">
                Pravidlá dostupnosti
              </p>
              <p className="text-gray-700">
                otváracie hodiny, dĺžka služieb, kapacita tímu, špeciálne dni.
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
              <p className="text-xs font-semibold text-gray-500 mb-1">
                KROK 3
              </p>
              <p className="font-semibold text-gray-900 mb-1">
                Potvrdenia a pripomienky
              </p>
              <p className="text-gray-700">
                texty e-mailov/SMS, ktoré pôjdu zákazníkovi automaticky.
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
              <p className="text-xs font-semibold text-gray-500 mb-1">
                KROK 4
              </p>
              <p className="font-semibold text-gray-900 mb-1">
                Napojenie na systém
              </p>
              <p className="text-gray-700">
                spojenie s tvojím kalendárom, CRM alebo rezervačným softvérom.
              </p>
            </div>
          </div>
        </div>

        {/* Closing note */}
        <div className="rounded-2xl border border-blue-100 bg-blue-50/80 px-5 py-4 text-sm text-blue-900">
          <p>
            V ďalšom kroku spolu prejdeme tvoj reálny proces rezervácií,
            pripravíme dialóg pre AI a otestujeme ho na konkrétnych prípadoch.
            Cieľ je jediný: aby ServisAI riešil termíny za teba bez toho, aby
            zákazník cítil, že komunikuje so strojom.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UseCaseReservationsPage;
