import React, { useState } from "react";
import {
  ArrowLeft,
  Globe,
  Mail,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Settings,
  Zap,
  Shield,
  Users,
} from "lucide-react";
import { saveWebProject } from "../lib/saveWebProject";

interface AddCompanyPageProps {
  onNavigateBack: () => void;
}

interface WebFormData {
  projectName: string;
  websiteUrl: string;
  contactName: string;
  contactEmail: string;
  businessType: string;
  aiTasks: string;
  notes: string;
}

function AddCompanyPage({ onNavigateBack }: AddCompanyPageProps) {
  const [formData, setFormData] = useState<WebFormData>({
    projectName: "",
    websiteUrl: "",
    contactName: "",
    contactEmail: "",
    businessType: "",
    aiTasks: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (field: keyof WebFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");

    try {
      // uloženie do Supabase (web_projects)
      await saveWebProject(formData);

      setStatus("success");
      // voliteľné: po úspechu vyčistiť formulár
      // setFormData({
      //   projectName: "",
      //   websiteUrl: "",
      //   contactName: "",
      //   contactEmail: "",
      //   businessType: "",
      //   aiTasks: "",
      //   notes: "",
      // });
      setTimeout(() => {
        setStatus("idle");
      }, 3000);
    } catch (err: any) {
      console.error("Chyba pri odoslaní formulára:", err);

      if (err?.message === "Not logged in") {
        alert("Na odoslanie formulára sa musíš najprv prihlásiť.");
      }

      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
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
            <Globe className="text-white" size={32} />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Pridať web do ServisAI
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Pošli nám základné informácie o webe a o tom, čo má AI asistent
            vybavovať. Následne sa ti ozveme s návrhom riešenia.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Základné údaje o webe
              </h2>

              {status === "success" && (
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                  <div className="flex items-center">
                    <CheckCircle className="text-green-600 mr-3" size={20} />
                    <div>
                      <p className="font-semibold text-green-800">
                        Formulár bol odoslaný.
                      </p>
                      <p className="text-sm text-green-700">
                        Ozveme sa ti čo najskôr s ďalším postupom.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200">
                  <div className="flex items-center">
                    <AlertCircle className="text-red-600 mr-3" size={20} />
                    <div>
                      <p className="font-semibold text-red-800">
                        Pri odoslaní nastala chyba.
                      </p>
                      <p className="text-sm text-red-700">
                        Skús to znovu alebo nám napíš na{" "}
                        <span className="font-semibold">info@zrovnaj.sk</span>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Názov projektu / webu */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Názov webu *
                  </label>
                  <input
                    type="text"
                    value={formData.projectName}
                    onChange={(e) =>
                      handleChange("projectName", e.target.value)
                    }
                    placeholder="Názov webu"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL webu *
                  </label>
                  <input
                    type="text"
                    value={formData.websiteUrl}
                    onChange={(e) =>
                      handleChange("websiteUrl", e.target.value)
                    }
                    placeholder="https://"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Kontakt */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kontaktná osoba *
                    </label>
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) =>
                        handleChange("contactName", e.target.value)
                      }
                      placeholder="Meno"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) =>
                        handleChange("contactEmail", e.target.value)
                      }
                      placeholder="email"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Typ biznisu */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Typ webu / biznisu
                  </label>
                  <input
                    type="text"
                    value={formData.businessType}
                    onChange={(e) =>
                      handleChange("businessType", e.target.value)
                    }
                    placeholder="E-shop, salón, reštaurácia…"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Čo má robiť AI */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Čo má AI asistent vybavovať? *
                  </label>
                  <textarea
                    value={formData.aiTasks}
                    onChange={(e) => handleChange("aiTasks", e.target.value)}
                    rows={5}
                    placeholder="Rezervácie, objednávky, otázky zákazníkov, interné otázky…"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Poznámky */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Poznámka
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    rows={4}
                    placeholder="Čokoľvek dôležité k projektu."
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 shadow-lg hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Odosielam
                    </>
                  ) : (
                    <>
                      <MessageSquare size={20} />
                      Odoslať údaje o webe
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  * Povinné polia
                </p>
              </form>
            </div>
          </div>

          {/* Right column – vysvetlenie / benefity */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Čo sa stane po odoslaní?
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Settings className="text-blue-500 mt-0.5" size={16} />
                  <span>
                    Pozrieme sa na web a pripravíme návrh, ako tam AI asistenta
                    nasadiť.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Users className="text-emerald-500 mt-0.5" size={16} />
                  <span>
                    Ak budeš chcieť, spravíme krátky call a prejdeme si flow
                    zákazníkov.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="text-purple-500 mt-0.5" size={16} />
                  <span>
                    Všetko ide cez bezpečné API – pracujeme len s dátami, ktoré
                    nám sprístupníš.
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Pre aké weby sa ServisAI hodí?
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• E-shopy s častými otázkami a objednávkami</li>
                <li>• Salóny, služby, rezervácie termínov</li>
                <li>• Servisné firmy, reklamácie, ticketing</li>
                <li>• Menšie projekty, kde nemá kto odpovedať na správy</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">
                Nechceš formulár?
              </h3>
              <p className="text-sm text-blue-100 mb-4">
                Môžeš nám rovno napísať krátky e-mail s odkazom na web a tým,
                čo chceš automatizovať.
              </p>
              <a
                href="mailto:info@zrovnaj.sk"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-colors"
              >
                <Mail size={16} />
                info@zrovnaj.sk
              </a>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 flex items-center gap-3">
              <Zap className="text-yellow-500" size={24} />
              <p className="text-sm text-gray-700">
                Cieľ: čo najskôr otestovať, či ti AI asistent šetrí čas a
                peniaze. Žiadne zbytočné okecávanie.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCompanyPage;
