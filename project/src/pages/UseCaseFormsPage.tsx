import React from "react";
import { ArrowLeft, FileText } from "lucide-react";

interface UseCasePageProps {
  onNavigateBack: () => void;
}

const UseCaseFormsPage: React.FC<UseCasePageProps> = ({ onNavigateBack }) => {
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
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md">
              <FileText className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Formuláre a dopyty
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Statické formuláre nahradí konverzácia, ktorá dotiahne klienta až
                k odoslaniu kompletného dopytu.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-pink-50 border border-pink-100 px-4 py-3 text-xs md:text-sm text-pink-900 max-w-sm">
            <p className="font-semibold mb-1">Na čo sa hodí:</p>
            <p>
              dopytové formuláre, cenové ponuky, servisné požiadavky, B2B lead
              gen, komplexné objednávky.
            </p>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid gap-8 md:grid-cols-2 text-sm md:text-base text-gray-700 leading-relaxed">
          {/* Left column */}
          <div className="space-y-4">
            <h2 className="font-semibold text-gray-900 text-base md:text-lg">
              Ako konverzačný formulár funguje
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                AI privíta návštevníka a stručne sa spýta, čo potrebuje
                vybaviť – dopyt, ponuku, servis, rezerváciu.
              </li>
              <li>
                Podľa typu požiadavky si vyžiada postupne všetky potrebné údaje
                (kontakt, parametre, termíny, rozpočet…).
              </li>
              <li>
                Dáta priebežne rekapituluje a overuje, aby sa predišlo
                chybám a neúplným formulárom.
              </li>
              <li>
                Na konci zhrnie celý dopyt v prehľadnej podobe a po potvrdení ho
                odošle – na e-mail, CRM alebo do interného systému.
              </li>
            </ul>

            <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 px-4 py-3">
              <p className="text-xs font-semibold text-gray-900 mb-1">
                Príklad otázky asistenta:
              </p>
              <p className="text-xs text-gray-700">
                „Aby sme vám vedeli pripraviť presnú cenovú ponuku, upresnite
                prosím rozsah prác a lokalitu realizácie.“
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            <div>
              <h2 className="font-semibold text-gray-900 text-base md:text-lg mb-2">
                Čo všetko vie AI pri formulároch vybaviť
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>predkvalifikácia leadov (rozpočet, urgencia, typ služby),</li>
                <li>automatické doplnenie chýbajúcich údajov,</li>
                <li>
                  validácia e-mailu, telefónu alebo IČO, aby kontakty neboli
                  nepoužiteľné,
                </li>
                <li>
                  generovanie štruktúrovaného výstupu – JSON, tabuľka, text,
                  ktorý viete ľahko napojiť na interný systém.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-semibold text-gray-900 text-base md:text-lg mb-2">
                Výsledok pre teba
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  žiadne poloprázdne formuláre, kde chýba telefón alebo kľúčové
                  informácie,
                </li>
                <li>
                  menej e-mailovej ping-pong komunikácie – všetko je zozbierané
                  hneď na prvýkrát,
                </li>
                <li>
                  dopyty sú zoradené a pripravené tak, aby sa s nimi dalo
                  rovno pracovať (ponuka, kalkulácia, konzultácia).
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 border-t border-gray-100 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs md:text-sm text-gray-500 max-w-xl">
            Formuláre môžeš nechať bežať popri existujúcich. AI jednoducho
            pridáš na podstránku s dopytovým formulárom a necháš ju zbierať
            kompletnejšie podklady.
          </p>
          <div className="flex gap-3">
            <span className="inline-flex items-center rounded-full bg-pink-50 text-pink-700 text-xs md:text-sm px-3 py-1 border border-pink-100">
              Ideálne pre dopytové formuláre a B2B
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UseCaseFormsPage;
