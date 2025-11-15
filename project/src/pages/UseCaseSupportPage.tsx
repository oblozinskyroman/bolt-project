import React from "react";
import { ArrowLeft, MessageCircle } from "lucide-react";

interface UseCasePageProps {
  onNavigateBack: () => void;
}

const UseCaseSupportPage: React.FC<UseCasePageProps> = ({ onNavigateBack }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <button
        onClick={onNavigateBack}
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Naspäť na úvod
      </button>

      <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Zákaznícka podpora 24/7
            </h1>
            <p className="text-gray-600 text-sm">
              AI, ktorá odpovedá na najčastejšie otázky nonstop.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
          <p>
            ServisAI dokáže pokryť väčšinu bežných otázok – otváracie hodiny,
            ceny, postupy, podmienky, reklamácie a ďalšie FAQ, ktoré dnes
            riešite telefonicky alebo mailom.
          </p>

          <ul className="list-disc pl-5 space-y-2">
            <li>odpovede podľa vašich dokumentov a webu,</li>
            <li>konzistentná komunikácia v rovnakom tóne,</li>
            <li>odľahčenie ľudskej podpory od repetitívnych otázok,</li>
            <li>preposielanie zložitejších prípadov človeku.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UseCaseSupportPage;
