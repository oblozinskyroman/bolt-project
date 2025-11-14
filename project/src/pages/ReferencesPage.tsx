import React, { useState } from "react";
import {
  ArrowLeft,
  Star,
  Shield,
  Calendar,
  MapPin,
  CheckCircle,
  Users,
  FileCheck,
  MessageSquare,
} from "lucide-react";

interface ReferencesPageProps {
  onNavigateBack: () => void;
}

interface Review {
  id: number;
  name: string;
  company: string;
  location: string;
  rating: number;
  text: string;
  useCase: string;
  date: string;
  type: "verified" | "sample";
}

function ReferencesPage({ onNavigateBack }: ReferencesPageProps) {
  const [activeTab, setActiveTab] = useState<"all" | "verified" | "sample">(
    "all"
  );

  const reviews: Review[] = [
    {
      id: 1,
      name: "Marek K.",
      company: "Barber & Style",
      location: "Bratislava",
      rating: 5,
      text: "Predtým sme nestíhali reagovať na správy z webu a Facebooku. Po nasadení AI asistenta ide 80 % rezervácií cez chat a telefón nám takmer nevolá nikto.",
      useCase: "Rezervácie termínov",
      date: "2024-12-15",
      type: "verified",
    },
    {
      id: 2,
      name: "Jana S.",
      company: "Studio Vita",
      location: "Košice",
      rating: 5,
      text: "Asistent odpovedá na ceny, dostupnosť a základné otázky nonstop. Večer vidím v prehľade, koľko rezervácií urobil a čo ľudí najviac zaujímalo.",
      useCase: "Wellness & beauty",
      date: "2024-12-10",
      type: "verified",
    },
    {
      id: 3,
      name: "Peter M.",
      company: "TechPoint Servis",
      location: "Žilina",
      rating: 4,
      text: "Na support nám chodilo množstvo opakujúcich sa otázok. AI asistent vyrieši väčšinu z nich sám a na operátorov zostávajú už len zložitejšie prípady.",
      useCase: "Zákaznícka podpora",
      date: "2024-12-08",
      type: "verified",
    },
    {
      id: 4,
      name: "Lucia T.",
      company: "Bloom Flowers",
      location: "Nitra",
      rating: 5,
      text: "Ľudia si cez chat vyberú kyticu, doplnia text na kartičku a objednávku dokončia na webe. Asistent vie pracovať s naším cenníkom aj dopravou.",
      useCase: "E-shop s kvetmi",
      date: "2024-12-05",
      type: "verified",
    },
    {
      id: 5,
      name: "Tomáš H.",
      company: "FitPoint Gym",
      location: "Trnava",
      rating: 4,
      text: "Najviac oceňujem, že asistent vysvetľuje členstvá a rozdiel medzi balíkmi. Máme menej zbytočných návštev len kvôli otázkam a viac reálnych registrácií.",
      useCase: "Fitness & členstvá",
      date: "2024-12-01",
      type: "verified",
    },
  ];

  const filteredReviews = reviews.filter((review) => {
    if (activeTab === "all") return true;
    return review.type === activeTab;
  });

  const verifiedCount = reviews.filter((r) => r.type === "verified").length;

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={
          index < rating
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }
      />
    ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100">
      {/* Hero Section */}
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Skúsenosti klientov
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Ako sa z pasívneho webu stal AI asistent, ktorý vybavuje zákazníkov
            za nich.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-2 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === "all"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Users size={18} />
              Všetky ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab("verified")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === "verified"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Shield size={18} />
              Overené projekty ({verifiedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-12 shadow-lg">
              <CheckCircle className="text-gray-400 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Zatiaľ nemáme zobrazené žiadne referencie
              </h3>
              <p className="text-gray-500">
                Buďte medzi prvými, ktorí si nechajú nasadiť AI asistenta na
                svoj web.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold text-lg">
                        {review.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {review.name}
                      </h4>
                      <div className="text-sm text-gray-500">
                        {review.company}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin size={12} className="mr-1" />
                        {review.location}
                      </div>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                    <Shield size={12} className="mr-1" />
                    Overený klient
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex mr-2">{renderStars(review.rating)}</div>
                  <span className="font-semibold text-gray-700">
                    {review.rating}/5
                  </span>
                </div>

                {/* Text */}
                <p className="text-gray-600 mb-4 leading-relaxed">
                  "{review.text}"
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {review.useCase}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {new Date(review.date).toLocaleDateString("sk-SK")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Chcete vidieť, ako by AI fungovala na vašom webe?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Najskôr si asistenta vyskúšajte v živom deme, potom ho prispôsobíme
            presne podľa vašich stránok a cieľov.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={onNavigateBack}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <MessageSquare size={20} />
              Vrátiť sa k živému demu
            </button>
          </div>
        </div>
      </div>

      {/* Methodology Section */}
      <div className="bg-white/50 backdrop-blur-md py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Ako pracujeme s referenciami a dátami
            </h2>
            <p className="text-lg text-gray-600">
              Dôležité je nielen to, čo AI odpovedá, ale aj to, čo sa z toho
              naučí váš biznis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileCheck className="text-white" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Dáta z reálnych rozhovorov
              </h3>
              <p className="text-gray-600 text-sm">
                V prehľade vidíte najčastejšie otázky, dokončené konverzácie a
                miesta, kde zákazníkovi ešte treba pomôcť.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="text-white" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Bezpečná práca s obsahom
              </h3>
              <p className="text-gray-600 text-sm">
                Asistent používa vaše texty, cenníky a interné dokumenty. Prístup
                k nim máte pod kontrolou vy.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-white" size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Meranie výsledkov
              </h3>
              <p className="text-gray-600 text-sm">
                Sledujeme, koľko rozhovorov skončilo rezerváciou alebo
                objednávkou, a podľa toho asistenta ďalej ladíme.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReferencesPage;
