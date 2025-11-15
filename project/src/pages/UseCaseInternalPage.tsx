import React from "react";
import { ArrowLeft, Zap } from "lucide-react";

interface UseCasePageProps {
  onNavigateBack: () => void;
}

const UseCaseInternalPage: React.FC<UseCasePageProps> = ({ onNavigateBack }) => {
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-slate-500 to-gray-700 flex items-center justify-center text-white">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Interné otázky</h1>
            <p className="text-gray-600 text-sm">
              AI ako interný „knowledge base“ pre tvoj tím.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
          <p>
            Sem patrí interný manuál, procesy, návody, školenia – všetko, čo
            ľudia dnes hľadajú v PDFkach alebo sa pýtajú kolegov.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UseCaseInternalPage;
