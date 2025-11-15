import React from "react";
import { ArrowLeft, Calendar } from "lucide-react";

interface UseCasePageProps {
  onNavigateBack: () => void;
}

const UseCaseReservationsPage: React.FC<UseCasePageProps> = ({
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

      <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Rezervácie a objednávky
            </h1>
            <p className="text-gray-600 text-sm">
              Ako môže ServisAI vybavovať termíny, rezervácie a dopyty bez
              telefonovania.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
          <p>
            AI asistent dokáže na vašom webe prebrať celý proces rezervácie:
            od úvodnej otázky zákazníka až po potvrdenie termínu a odoslanie
            podkladov e-mailom.
          </p>

          <ul className="list-disc pl-5 space-y-2">
            <li>zber nevyhnutných údajov (meno, kontakt, typ služby, termín),</li>
            <li>kontrola dostupnosti podľa vašich pravidiel,</li>
            <li>automatické potvrdenie rezervácie zákazníkovi,</li>
            <li>odoslanie detailov vám – e-mail, CRM alebo iný systém.</li>
          </ul>

          <p>
            V ďalšom kroku na mieru nastavíme konkrétne otázky a pravidlá tak,
            aby AI pracovala presne podľa vašich procesov.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UseCaseReservationsPage;
