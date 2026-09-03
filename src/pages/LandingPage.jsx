import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Gamepad2,
  Clock,
  BarChart3,
  Heart,
  Volume2,
  Image as ImageIcon,
  MapPin
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { VoiceButton } from '../components/VoiceButton';

export const LandingPage = ({ setActivePage, onOpenCulture }) => {
  const { currentLang, setLanguage, languages, t } = useLanguage();
  const { isAuthenticated, demoLogin } = useAuth();

  const handleDemoStart = async () => {
    await demoLogin();
    setActivePage('dashboard');
  };

  const simpleGamePills = [
    { title: '🧺 ' + (t.games?.memoryBasket || 'Memory Basket'), desc: t.games?.memoryBasketDesc || 'Remember traditional objects in the bamboo basket before it closes.' },
    { title: '🏡 ' + (t.games?.myOldVillage || 'My Old Village'), desc: t.games?.myOldVillageDesc || 'Explore the traditional village scene & object placements.' },
    { title: '🥁 ' + (t.games?.rhythmRecall || 'Rhythm Recall'), desc: t.games?.rhythmRecallDesc || 'Listen and reproduce gentle bell and drum rhythms.' },
    { title: '🎨 ' + (t.games?.patternMatch || 'Traditional Pattern Match'), desc: t.games?.patternMatchDesc || 'Recognize traditional North-Eastern weaves and motifs.' },
    { title: '🛤️ ' + (t.games?.memoryPath || 'Memory Path'), desc: t.games?.memoryPathDesc || 'Recreate step-by-step memory walks through the village.' }
  ];

  // 8 North-Eastern States Heritage Data (Requirement 2)
  const northEastStates = [
    {
      name: "Assam",
      nativeName: "অসম",
      theme: "Golden Muga Silk & Bihu Melodies",
      desc: "Home to the mighty Brahmaputra river, lush tea plantations, and joyful Bihu folk harvest celebrations.",
      icon: "🦏",
      color: "from-amber-500/20 to-yellow-600/20",
      border: "border-amber-300"
    },
    {
      name: "Arunachal Pradesh",
      nativeName: "অৰুণাচল প্ৰদেশ",
      theme: "Land of the Dawn-Lit Mountains",
      desc: "Pristine snow peaks, ancient Tawang monastery, and exquisite traditional tribal cane and bamboo handicrafts.",
      icon: "🏔️",
      color: "from-emerald-500/20 to-teal-600/20",
      border: "border-emerald-300"
    },
    {
      name: "Manipur",
      nativeName: "মণিপুর",
      theme: "The Jewel of Serene Lakes & Dance",
      desc: "Famous for the floating phumdis of Loktak Lake, classical Raas Leela dance, and sacred Pena folk string music.",
      icon: "🪷",
      color: "from-purple-500/20 to-indigo-600/20",
      border: "border-purple-300"
    },
    {
      name: "Meghalaya",
      nativeName: "মেঘালয়",
      theme: "The Abode of Clouds & Living Bridges",
      desc: "Misty pine hills, indigenous living root bridges, cascading waterfalls, and melodic Khasi Duitara folk tunes.",
      icon: "🌧️",
      color: "from-sky-500/20 to-blue-600/20",
      border: "border-sky-300"
    },
    {
      name: "Mizoram",
      nativeName: "মিজোৰাম",
      theme: "Rolling Hills & Bamboo Rhythm",
      desc: "Land of gentle rolling hills, vibrant Cheraw bamboo dance, and colorful handwoven traditional Puan textiles.",
      icon: "🎋",
      color: "from-rose-500/20 to-amber-600/20",
      border: "border-rose-300"
    },
    {
      name: "Nagaland",
      nativeName: "নাগালেণ্ড",
      theme: "Heritage of Festivals & Artistry",
      desc: "Celebrated for the grand Hornbill festival, rich warrior shawl motifs, ancient village traditions, and hill songs.",
      icon: "🪶",
      color: "from-red-500/20 to-orange-600/20",
      border: "border-red-300"
    },
    {
      name: "Tripura",
      nativeName: "ত্রিপুরা",
      theme: "Royal Palaces & Ancient Carvings",
      desc: "Water palace of Neermahal, ancient rock carvings of Unakoti, and vibrant handloom Rignai weaving traditions.",
      icon: "🏰",
      color: "from-teal-500/20 to-cyan-600/20",
      border: "border-teal-300"
    },
    {
      name: "Sikkim",
      nativeName: "सिक्किम",
      theme: "Sacred Peaks & Peaceful Monasteries",
      desc: "Guarded by the majestic Mount Kanchenjunga, serene prayer flags, organic alpine valleys, and sacred heritage.",
      icon: "☸️",
      color: "from-blue-500/20 to-violet-600/20",
      border: "border-blue-300"
    }
  ];

  return (
    <div className="bg-[#FAF7F0] min-h-screen">
      {/* Clean, Neat Hero with CogniCare Branding */}
      <section className="pt-10 pb-14 md:pt-14 md:pb-16 border-b border-[#E5DFD5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          {/* Logo Showcase */}
          <div className="flex justify-center mb-2">
            <img
              src="/logo.png"
              alt="CogniCare Logo"
              className="h-20 sm:h-24 md:h-28 object-contain drop-shadow-sm hover:scale-102 transition-transform duration-300"
            />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1B3B2B] leading-tight tracking-tight">
            {t.hero?.title || "when memories meet care"}
          </h1>

          <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            {t.hero?.desc || "A warm, peaceful, culturally rooted space designed for our beloved elders in North-Eastern India to revisit traditional games, familiar village life, and cherished moments with gentle adaptive memory activities."}
          </p>

          {/* Voice Prompt */}
          <div className="flex justify-center pt-1">
            <VoiceButton
              textToRead="Welcome to CogniCare, when memories meet care. A peaceful cognitive support and reminiscence platform for our beloved elders in North-Eastern India."
              label="Listen to Introduction"
            />
          </div>

          {/* Clean Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActivePage('games')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#1B3B2B] hover:bg-[#2C5E3B] text-white font-bold text-base border-2 border-[#C99E32] shadow-sm transition-all active:scale-98"
            >
              <Gamepad2 className="w-5 h-5 text-amber-300" />
              <span>Explore Cognitive Games</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => setActivePage('dashboard')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-stone-900 font-bold text-base border border-amber-300 shadow-sm transition-all"
              >
                <Heart className="w-5 h-5 text-amber-700" />
                <span>{t.hero?.caretakerPortal || "Caretaker Dashboard"}</span>
              </button>
            ) : (
              <button
                onClick={handleDemoStart}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50 text-stone-800 font-bold text-base border-2 border-stone-300 shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{t.hero?.tryDemo || "1-Click Demo Caregiver"}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Prominent Language Selection (Requirement 3) */}
      <section className="py-8 bg-white border-b border-[#E5DFD5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-5">
            <h2 className="text-xl font-serif font-bold text-[#1B3B2B]">
              🌿 {t.hero?.chooseLanguage || "Choose Your Language"}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Instant translation applies to all pages, games, reminders, and audio
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {languages.map((lang) => {
              const isSelected = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                    isSelected
                      ? 'bg-[#1B3B2B] text-white border-[#C99E32] shadow-md ring-2 ring-amber-300/40 scale-102'
                      : 'bg-stone-50 hover:bg-amber-50/70 text-stone-800 border-stone-200'
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="font-serif font-bold text-sm">{lang.native}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-amber-200' : 'text-stone-400'}`}>
                    {lang.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8 North-Eastern States Heritage Section (Requirement 2) */}
      <section className="py-14 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-[#7C3218] font-bold text-xs">
            <MapPin className="w-3.5 h-3.5" />
            <span>North-Eastern Region Heritage</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1B3B2B]">
            {t.hero?.exploreHeritage || "Explore North-East Heritage"}
          </h2>

          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto">
            {t.hero?.exploreHeritageSubtitle || "Honoring the 8 states of North-Eastern India with authentic culture, textiles, landscapes, and childhood traditions."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {northEastStates.map((st, idx) => (
            <div
              key={idx}
              className={`bg-white border-2 ${st.border} rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200 group-hover:scale-110 transition-transform">
                    {st.icon}
                  </span>
                  <span className="text-xs font-serif font-bold text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
                    {st.nativeName}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1B3B2B] group-hover:text-[#A84B29] transition-colors">
                    {st.name}
                  </h3>
                  <span className="text-xs font-semibold text-[#8C6D3B] block mt-0.5">
                    {st.theme}
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5 Cognitive Activities Preview */}
      <section className="py-12 bg-white/60 border-t border-[#E5DFD5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1B3B2B]">
              5 Tailored Cognitive Activities
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Featuring 🟢 Easy, 🟡 Medium, and 🔴 Hard tiers with immediate score-based adaptive difficulty.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {simpleGamePills.map((g, idx) => (
              <div
                key={idx}
                onClick={() => setActivePage('games')}
                className="bg-white border-2 border-[#E5DFD5] hover:border-[#C99E32] rounded-3xl p-5 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-1.5"
              >
                <h3 className="font-serif font-bold text-base text-[#1B3B2B]">
                  {g.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {g.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Non-Diagnostic Safety Callout */}
      <section className="py-10 max-w-3xl mx-auto px-4 text-center">
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center justify-center gap-2 text-xs text-emerald-950 font-medium">
          <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0" />
          <span>{t.hero?.nonMedicalNotice || "🌿 A peaceful reminiscence and cognitive support platform, not a medical diagnostic tool."}</span>
        </div>
      </section>
    </div>
  );
};
