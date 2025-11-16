import React from "react";
import { ArrowLeft, MessageCircle, CheckCircle2, Headphones } from "lucide-react";

interface UseCasePageProps {
  onNavigateBack: () => void;
}

const UseCaseSupportPage: React.FC<UseCasePageProps> = ({ onNavigateBack }) => {
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

      {/* Hero */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg">
              <MessageCircle className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Zákaznícka podpora 24/7
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                AI, ktorá pozná tvoje služby, dokumenty a podmienky. Odpovedá nonstop,
                okamžite a vždy rovnako presne.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 max-w-xs">
            <p className="text-xs text-emerald-700 font-semibold mb-1">
              Ideálne pre:
            </p>
            <p className="text-sm text-emerald-900">
              E-shopy, salóny, služby, servisy, poradne, reštaurácie – všade tam,
              kde sa opakujú tie isté otázky.
            </p>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Čo AI robí */}
          <section className="bg-white/80 rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Čo všetko ServisAI pokryje
            </h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Otváracie hodiny a dostupnosť.</li>
              <li>• Cenníky, podmienky, postupy, termíny.</li>
              <li>• Informácie o produktoch a službách.</li>
              <li>• Základné reklamácie a spracovanie problémov.</li>
              <li>• Navigácia zákazníka na správne miesto alebo formulár.</li>
              <li>• Filtrovanie otázok, ktoré treba posunúť človeku.</li>
              <li>• Pravidelný tón komunikácie – žiadne chaos, žiadne výkyvy.</li>
            </ul>
          </section>

          {/* Scenár konverzácie */}
          <section className="bg-white/80 rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Ako vyzerá reálna podpora v praxi
            </h2>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs uppercase text-gray-500 mb-1">Zákazník</p>
                <div className="rounded-xl bg-gray-100 px-4 py-2 inline-block">
                  Máte dnes otvorené? A robíte aj cez víkend?
                </div>
              </div>

              <div>
                <p className="text-xs uppercase text-emerald-500 mb-1">
                  ServisAI asistent
                </p>
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-400/30 px-4 py-2 inline-block">
                  Áno, dnes sme otvorení do 18:00.  
                  Cez víkend je prevádzka otvorená len v sobotu do 12:00.
                </div>
              </div>

              <div>
                <p className="text-xs uppercase text-gray-500 mb-1">Zákazník</p>
                <div className="rounded-xl bg-gray-100 px-4 py-2 inline-block">
                  A koľko stojí diagnostika problému?
                </div>
              </div>

              <div>
                <p className="text-xs uppercase text-emerald-500 mb-1">
                  ServisAI asistent
                </p>
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-400/30 px-4 py-2 inline-block">
                  Základná diagnostika stojí 15 €.  
                  Ak necháte produkt u nás na opravu, diagnostika je zadarmo.
                </div>
              </div>
            </div>
          </section>

          {/* Prečo to funguje */}
          <section className="bg-slate-900 text-slate-50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-3">Prečo je to efektívne</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Zákazníci nechcú čakať na odpoveď v e-maile ani telefonovať.
              Chcú rýchlu, jasnú odpoveď, bez omáčok.  
              ServisAI odpovedá do 1 sekundy, vždy presne podľa vašich
              podkladov a nikdy nezabudne informáciu alebo pravidlo.
            </p>
          </section>
        </div>

        {/* Right column – benefity a implementácia */}
        <div className="space-y-6">
          <section className="bg-white/80 rounded-2xl shadow-md p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Najčastejšie otázky, ktoré AI zvládne
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Otváracie hodiny</li>
              <li>• Cenník a podmienky</li>
              <li>• Rezervácie, termíny, kapacita</li>
              <li>• Reklamácie a servis</li>
              <li>• Stav objednávky (e-shop)</li>
              <li>• Lokačné informácie / navigácia</li>
            </ul>
          </section>

          <section className="bg-white/80 rounded-2xl shadow-md p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Čo potrebujeme od vás
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Dokumenty (PDF, Word, interné poznámky).</li>
              <li>• Webové texty a cenníky.</li>
              <li>• Zoznam FAQ, ak existujú.</li>
              <li>• Špeciálne pravidlá a obmedzenia.</li>
            </ul>
          </section>

          <section className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-base font-semibold mb-2">
              Chceš pripraviť AI podporu pre svoj web?
            </h3>
            <p className="text-sm text-emerald-50 mb-4">
              Na základe tvojich textov vytvoríme hotového asistenta, ktorý
              odpovedá presne podľa tvojej značky.
            </p>
            <button
              onClick={onNavigateBack}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white text-emerald-700 text-sm font-semibold hover:bg-emerald-50 transition-colors"
            >
              <Headphones className="w-4 h-4" />
              Dohodnúť konzultáciu
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UseCaseSupportPage;
