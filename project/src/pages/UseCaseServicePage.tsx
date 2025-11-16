import React from "react";
import { ArrowLeft, Shield } from "lucide-react";

interface UseCasePageProps {
  onNavigateBack: () => void;
}

const UseCaseServicePage: React.FC<UseCasePageProps> = ({ onNavigateBack }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Back */}
      <button
        onClick={onNavigateBack}
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Naspäť na úvod
      </button>

      {/* Hero blok */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Servis a reklamácie
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                AI asistent, ktorý zákazníka prevedie celou reklamáciou alebo
                servisným dopytom – bez chaosu v mailoch a telefonátoch.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
              <p className="text-xs text-amber-700 font-semibold uppercase tracking-wide">
                Hlavný prínos
              </p>
              <p className="text-sm text-amber-900 font-medium">
                Menej zbytočných telefonátov
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
              <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wide">
                Čas tímu
              </p>
              <p className="text-sm text-emerald-900 font-medium">
                Tím rieši len pripravené ticketi
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Ľavý stĺpec – čo AI robí */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white/80 rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Čo konkrétne za vás vybaví
            </h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>
                • Zistí <strong>čo sa pokazilo</strong>, kedy a za akých okolností.
              </li>
              <li>
                • Vyžiada si <strong>číslo faktúry / objednávky</strong> a kontaktné údaje.
              </li>
              <li>
                • Poprosí o <strong>fotky, video alebo screenshot</strong> problému.
              </li>
              <li>
                • Overí <strong>záručné podmienky</strong> podľa vašich pravidiel.
              </li>
              <li>
                • Vytvorí <strong>ticket v systéme</strong> alebo pošle všetko na váš e-mail.
              </li>
            </ul>
          </section>

          <section className="bg-white/80 rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Ako vyzerá proces pre zákazníka
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
              <li>Na stránke servisu klikne na „Reklamácia / servis“.</li>
              <li>
                Asistent sa spýta, čo sa stalo, a zrozumiteľne vedie rozhovor –
                žiadne komplikované formuláre.
              </li>
              <li>
                AI si vyžiada všetky podklady (číslo dokladu, kontakty, fotky).
              </li>
              <li>
                Po skončení konverzácie vytvorí súhrn a odošle ho vám ako
                hotový ticket.
              </li>
              <li>
                Zákazník dostane prehľad, čo ste od neho dostali a čo bude ďalej.
              </li>
            </ol>
          </section>

          <section className="bg-slate-900 text-slate-50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-3">
              Ukážka konverzácie (zjednodušená)
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs uppercase text-slate-400 mb-1">Zákazník</p>
                <div className="rounded-xl bg-slate-800/80 px-4 py-2 inline-block">
                  Potrebujem reklamovať notebook, nejde zapnúť.
                </div>
              </div>
              <div>
                <p className="text-xs uppercase text-amber-300 mb-1">
                  ServisAI asistent
                </p>
                <div className="rounded-xl bg-amber-500/20 border border-amber-500/40 px-4 py-2 inline-block">
                  Rozumiem, pozrieme sa na to. Prosím, napíšte číslo faktúry
                  alebo objednávky a približný dátum nákupu.
                </div>
              </div>
              <div>
                <p className="text-xs uppercase text-slate-400 mb-1">Zákazník</p>
                <div className="rounded-xl bg-slate-800/80 px-4 py-2 inline-block">
                  Faktúra č. 2024-154, kupované v apríli 2024.
                </div>
              </div>
              <div>
                <p className="text-xs uppercase text-amber-300 mb-1">
                  ServisAI asistent
                </p>
                <div className="rounded-xl bg-amber-500/20 border border-amber-500/40 px-4 py-2 inline-block">
                  Ďakujem. Ešte prosím opíšte problém – čo presne zariadenie
                  robí alebo nerobí, a ak viete, priložte fotku alebo krátke
                  video. Na základe toho vytvorím reklamačný ticket pre náš
                  servisný tím.
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Pravý stĺpec – benefity + nastavenie */}
        <div className="space-y-6">
          <section className="bg-white/80 rounded-2xl shadow-md p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Pre koho je tento use case ideálny
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• E-shopy s elektronikou, náradím, technikou.</li>
              <li>• Servisné firmy (IT, domácnosti, priemysel).</li>
              <li>• Výrobcovia so záručným a pozáručným servisom.</li>
            </ul>
          </section>

          <section className="bg-white/80 rounded-2xl shadow-md p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Čo od vás potrebujeme pri implementácii
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Popis typických porúch / problémov.</li>
              <li>• Záručné pravidlá v jednoduchom jazyku.</li>
              <li>• Kam sa majú ukladať ticketi (e-mail / CRM / iný systém).</li>
            </ul>
          </section>

          <section className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-base font-semibold mb-2">
              Chceš vidieť, ako by to vyzeralo u teba?
            </h3>
            <p className="text-sm text-amber-50 mb-4">
              Pošleš nám súčasný proces reklamácií a pripravíme návrh konverzácie
              a ticketu priamo pre tvoj biznis.
            </p>
            <button
              onClick={onNavigateBack}
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white text-amber-700 text-sm font-semibold hover:bg-amber-50 transition-colors"
            >
              Dohodnúť si úvodný call
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UseCaseServicePage;
