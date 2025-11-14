import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Edit3, 
  BarChart3, 
  CheckCircle, 
  Shield, 
  Clock, 
  Star, 
  CreditCard,
  Building2,
  MessageSquare,
  ArrowRight,
  Verified,
  Timer,
  DollarSign,
  Users,
  Menu,
  X,
  User
} from 'lucide-react';

interface HowItWorksPageProps {
  onNavigateBack: () => void;
  onNavigateToAddCompany: () => void;
}

function HowItWorksPage({ onNavigateBack, onNavigateToAddCompany }: HowItWorksPageProps) {
  // 4 kroky pre nasadenie AI asistenta
  const steps = [
    {
      number: 1,
      icon: Edit3,
      title: 'Vyplníte krátky onboarding',
      description:
        'Povieme si, čo robí váš web, akých zákazníkov obsluhujete a aký je ideálny výsledok – rezervácia, objednávka, dopyt alebo kontakt.',
      example: 'Príklad: „Kaderníctvo v centre, chcem aby si klienti vedeli sami rezervovať termín.“',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      number: 2,
      icon: Shield,
      title: 'Naučíme AI váš obsah',
      description:
        'Do systému pridáme vaše služby, ceny, často kladené otázky a interné pravidlá. Asistent nikdy nevymýšľa vlastné podmienky, drží sa vašich dát.',
      example: '',
      color: 'from-emerald-500 to-green-600',
    },
    {
      number: 3,
      icon: Building2,
      title: 'Vložíte asistenta na web',
      description:
        'Dostanete krátky kód, ktorý vloží váš správca webu (WordPress, Webnode, vlastný web…). Asistent sa zobrazí ako chat alebo bublina v rohu stránky.',
      example: '',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      number: 4,
      icon: BarChart3,
      title: 'Meriate výsledky a ladíte',
      description:
        'V prehľade vidíte počet rozhovorov, rezervácií a zodpovedaných otázok. Môžeme spolu doladiť odpovede, scenáre a konverziu.',
      example: '',
      color: 'from-orange-500 to-red-600',
    },
  ];

  const benefits = [
    {
      icon: Verified,
      title: 'Presné odpovede z vášho webu',
      description: 'Asistent čerpá z vašich textov, cenníka a interných pravidiel. Neháda a nevymýšľa.',
      color: 'text-blue-600',
    },
    {
      icon: Timer,
      title: 'Nonstop prevádzka',
      description: 'Odpovedá 24/7, aj keď nezdvíhate telefón alebo nemáte človeka na support.',
      color: 'text-green-600',
    },
    {
      icon: DollarSign,
      title: 'Viac objednávok bez call centra',
      description: 'Zákazníka privedie až k výsledku – rezervácia, objednávka, formulár alebo odkaz na platbu.',
      color: 'text-purple-600',
    },
    {
      icon: Users,
      title: 'Kontrola a spätná väzba',
      description: 'Vidíte reálne rozhovory, viete upraviť odpovede a sledovať, čo ľudia najčastejšie riešia.',
      color: 'text-orange-600',
    },
  ];

  const timelineSteps = [
    { label: 'Onboarding', emoji: '📝' },
    { label: 'Nastavenie AI', emoji: '🤖' },
    { label: 'Nasadenie na web', emoji: '🌐' },
    { label: 'Testovanie', emoji: '✅' },
    { label: 'Reálni zákazníci', emoji: '💬' },
  ];

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
            Ako funguje ServisAI
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Z pasívneho webu spravíme asistenta, ktorý odpovedá, vysvetľuje a vybavuje zákazníkov za vás.
          </p>
        </div>
      </div>

      {/* Steps Section */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={step.number}
                className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative"
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-8">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.number}
                  </div>
                </div>

                {/* Icon */}
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center mb-6 mx-auto`}
                >
                  <IconComponent className="text-white" size={28} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center mb-4 leading-relaxed">
                  {step.description}
                </p>

                {/* Example */}
                {step.example && (
                  <div className="bg-blue-50 rounded-lg p-3 mt-4">
                    <p className="text-sm text-blue-700 italic">{step.example}</p>
                  </div>
                )}

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2">
                    <ArrowRight className="text-gray-300" size={24} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Why It Works Better Section */}
      <div className="bg-white/50 backdrop-blur-md py-20">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Čo presne vám AI asistent prinesie
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Menej mailov a telefonátov, viac vybavených zákazníkov – bez toho, aby ste sedeli pri počítači.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="mb-4">
                      <IconComponent
                        className={`${benefit.color} mx-auto group-hover:scale-110 transition-transform duration-300`}
                        size={48}
                      />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Ako bude vyzerať prvý týždeň
          </h2>
          <p className="text-xl text-gray-600">
            Od prvého kontaktu po nasadenie asistenta na vašom webe v 5 krokoch.
          </p>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 transform -translate-y-1/2"></div>

            {/* Timeline Steps */}
            <div className="flex justify-between items-center relative">
              {timelineSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-white border-4 border-blue-500 rounded-full flex items-center justify-center text-2xl mb-4 shadow-lg">
                    {step.emoji}
                  </div>
                  <div className="bg-white/80 backdrop-blur-md rounded-lg px-4 py-2 shadow-md">
                    <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                      {step.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="md:hidden space-y-6">
          {timelineSteps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-xl mr-4 shadow-lg">
                {step.emoji}
              </div>
              <div className="bg-white/80 backdrop-blur-md rounded-lg px-4 py-3 shadow-md flex-1">
                <p className="font-semibold text-gray-800">
                  {index + 1}. {step.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Chcete AI asistenta aj na vašom webe?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Najprv si ho vyskúšajte, potom ho nasadíme na váš web a spolu zmeriame výsledok.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={onNavigateBack}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <MessageSquare size={20} />
              Vrátiť sa k živému demu
            </button>
            <button
              onClick={onNavigateToAddCompany}
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Building2 size={20} />
              Pridať môj web do ServisAI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowItWorksPage;
