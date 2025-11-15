import React, { useEffect, useState } from "react";
import { ArrowLeft, User as UserIcon, LogOut, Globe, Plus } from "lucide-react";
import { supabase } from "../lib/supabase";

interface MyAccountPageProps {
  onNavigateBack: () => void;
  onNavigateToAddCompany: () => void;
}

interface AccountInfo {
  email: string | null;
}

function MyAccountPage({
  onNavigateBack,
  onNavigateToAddCompany,
}: MyAccountPageProps) {
  const [account, setAccount] = useState<AccountInfo>({ email: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setAccount({
          email: user?.email ?? null,
        });
      } catch (err) {
        console.error("Chyba pri načítaní používateľa:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // jednoduché riešenie – po odhlásení refresh
      window.location.reload();
    } catch (err) {
      console.error("Chyba pri odhlasovaní:", err);
      alert("Nepodarilo sa odhlásiť. Skúste to prosím znova.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-start mb-8">
            <button
              onClick={onNavigateBack}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors duration-200"
            >
              <ArrowLeft className="text-white" size={20} />
            </button>

            <div className="flex items-center gap-3">
              {account.email && (
                <span className="text-sm md:text-base text-blue-100">
                  Prihlásený ako{" "}
                  <span className="font-semibold text-white">
                    {account.email}
                  </span>
                </span>
              )}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-sm font-medium text-white border border-white/30 transition-colors"
              >
                <LogOut size={16} />
                Odhlásiť
              </button>
            </div>
          </div>

          <div className="text-left md:text-center">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 w-16 h-16 mx-0 md:mx-auto mb-4 flex items-center justify-center">
              <UserIcon className="text-white" size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Môj účet
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl md:mx-auto">
              Spravuj svoj profil a pridávaj weby, na ktorých bude ServisAI
              vybavovať zákazníkov.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ľavý stĺpec – zhrnutie účtu */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Zhrnutie účtu
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Toto je jednoduchá verzia účtu – sústredíme sa len na profil a
                weby. Sekcie ako objednávky či platby pridáme neskôr, keď ich
                budeš reálne potrebovať.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Prihlásenie cez Supabase účet</li>
                <li>• E-mail slúži ako hlavný identifikátor</li>
                <li>• Jedným klikom vytvoríš dopyt na integráciu ServisAI</li>
              </ul>
            </div>

            <div className="bg-blue-50/80 backdrop-blur-md rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Pridať web so ServisAI
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Pošli nám základné info o webe a čo má AI asistent vybavovať.
                Následne sa ti ozveme s návrhom riešenia.
              </p>
              <button
                onClick={onNavigateToAddCompany}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
              >
                <Plus size={16} />
                Pridať web
              </button>
            </div>
          </div>

          {/* Pravý stĺpec – profil */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Profil používateľa
              </h2>

              {loading ? (
                <p className="text-gray-500">Načítavam údaje...</p>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-semibold">
                      {account.email
                        ? account.email.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">E-mail</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {account.email ?? "—"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Meno
                      </label>
                      <input
                        type="text"
                        value=""
                        placeholder="Zatiaľ nevyplnené"
                        disabled
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Mesto
                      </label>
                      <input
                        type="text"
                        value=""
                        placeholder="Zatiaľ nevyplnené"
                        disabled
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Telefón
                      </label>
                      <input
                        type="text"
                        value=""
                        placeholder="Zatiaľ nevyplnené"
                        disabled
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Web / značka
                      </label>
                      <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        <Globe size={16} />
                        <span>Údaje o webových projektoch sa doplnia neskôr</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-4">
                    Úprava detailov profilu (meno, mesto, telefón) bude doplnená
                    v ďalšej verzii. Teraz slúži táto stránka hlavne ako vstupný
                    bod pre tvoje weby a integráciu ServisAI.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAccountPage;
