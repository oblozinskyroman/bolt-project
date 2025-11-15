import React, { useEffect, useState } from "react";
import { ArrowLeft, User, Mail, LogOut, Globe, PlusCircle } from "lucide-react";
import { supabase } from "../lib/supabase";

interface MyAccountPageProps {
  onNavigateBack: () => void;
  onNavigateToAddCompany: () => void;
}

type AuthStatus = "idle" | "sending" | "sent" | "error";

function MyAccountPage({
  onNavigateBack,
  onNavigateToAddCompany,
}: MyAccountPageProps) {
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [loginEmail, setLoginEmail] = useState("");
  const [authStatus, setAuthStatus] = useState<AuthStatus>("idle");
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user ?? null);
      } catch (e) {
        console.error("Chyba pri načítaní užívateľa:", e);
      } finally {
        setLoadingUser(false);
      }
    };
    loadUser();
  }, []);

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = loginEmail.trim();
    if (!email) return;

    setAuthStatus("sending");
    setAuthError(null);

    try {
      const {
        error,
      } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        console.error(error);
        setAuthStatus("error");
        setAuthError(error.message || "Nepodarilo sa poslať prihlasovací e-mail.");
        return;
      }

      setAuthStatus("sent");
    } catch (err: any) {
      console.error(err);
      setAuthStatus("error");
      setAuthError("Nepodarilo sa poslať prihlasovací e-mail.");
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      onNavigateBack(); // späť na home
    } catch (err) {
      console.error("Chyba pri odhlásení:", err);
      alert("Nepodarilo sa odhlásiť. Skúste to znova.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between">
            <div>
              <button
                onClick={onNavigateBack}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors duration-200 mb-6"
              >
                <ArrowLeft className="text-white" size={20} />
              </button>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 w-16 h-16 mb-4 flex items-center justify-center">
                <User className="text-white" size={32} />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                Môj účet
              </h1>
              <p className="text-lg md:text-xl text-blue-100 max-w-2xl">
                Spravuj svoj profil a weby, na ktorých bude ServisAI vybavovať
                zákazníkov.
              </p>
            </div>

            {user && (
              <div className="mt-2">
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium border border-white/40 transition-colors"
                >
                  <LogOut size={16} />
                  Odhlásiť sa
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loadingUser ? (
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Načítavam údaje účtu…</p>
          </div>
        ) : !user ? (
          /* --------- STAV: NEPRIHLÁSENÝ --------- */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Prihlásenie / registrácia
              </h2>
              <p className="text-gray-600 mb-6">
                Zadaj svoj e-mail. Pošleme ti prihlasovací link. Pri prvom
                prihlásení sa účet automaticky vytvorí.
              </p>

              <form onSubmit={handleSendMagicLink} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="tvoj@email.sk"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authStatus === "sending"}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {authStatus === "sending"
                    ? "Odosielam link…"
                    : "Poslať prihlasovací link"}
                </button>
              </form>

              {authStatus === "sent" && (
                <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-800">
                  Skontroluj e-mail a klikni na prihlasovací link. Potom sa sem
                  môžeš vrátiť.
                </div>
              )}

              {authStatus === "error" && authError && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800">
                  {authError}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Ako funguje účet ServisAI
                </h3>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                  <li>Prihlásenie prebieha cez bezpečný Supabase účet.</li>
                  <li>Ten istý e-mail slúži na login aj na správu webov.</li>
                  <li>
                    Neskôr pridáme sekcie pre objednávky a platby – až keď ich
                    budeš reálne potrebovať.
                  </li>
                </ul>
              </div>

              <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Potrebuješ ihneď doriešiť integráciu?
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Kľudne nám napíš cez kontaktný formulár alebo AI asistenta.
                  Pri prvých klientoch vieme časť nastavenia urobiť manuálne.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* --------- STAV: PRIHLÁSENÝ --------- */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* ľavý stĺpec */}
            <div className="space-y-6 lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  Zhrnutie účtu
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  Toto je jednoduchá verzia účtu – sústredíme sa na profil a
                  weby. Sekcie ako objednávky či platby pridáme neskôr, keď ich
                  budeš reálne potrebovať.
                </p>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                  <li>Prihlásenie cez Supabase účet</li>
                  <li>E-mail slúži ako hlavný identifikátor</li>
                  <li>Jedným klikom vytvoríš dopyt na integráciu ServisAI.</li>
                </ul>
              </div>

              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Pridať web so ServisAI
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Pošli nám základné info o webe a o tom, čo má AI asistent
                  vybavovať. Následne sa ti ozveme s návrhom riešenia.
                </p>
                <button
                  onClick={onNavigateToAddCompany}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <PlusCircle size={16} />
                  Pridať web
                </button>
              </div>
            </div>

            {/* pravý stĺpec – profil */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Profil používateľa
                </h2>

                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xl mr-4">
                    {user.email?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">E-mail</p>
                    <p className="text-base font-semibold text-gray-800">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Meno
                    </label>
                    <div className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-400 text-sm">
                      Zatiaľ nevyplnené
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Mesto
                    </label>
                    <div className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-400 text-sm">
                      Zatiaľ nevyplnené
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Telefón
                    </label>
                    <div className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-400 text-sm">
                      Zatiaľ nevyplnené
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Web / značka
                    </label>
                    <div className="px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-400 text-sm flex items-center gap-2">
                      <Globe size={14} className="text-gray-300" />
                      Zatiaľ nevyplnené
                    </div>
                  </div>
                </div>

                <p className="mt-6 text-xs text-gray-500">
                  Úprava detailov profilu (meno, mesto, telefón, web) bude
                  doplnená v ďalšej verzii. Teraz slúži táto stránka hlavne ako
                  vstupný bod pre tvoje weby a integráciu ServisAI.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAccountPage;
