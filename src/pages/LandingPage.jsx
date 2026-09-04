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
import logoImg from '../assets/logo.png';
import heroLake from '../assets/hero-lake.jpg';
import heroBg from '../assets/hero-bg.png';
import sacredTemple from '../assets/sacred-temple.png';
import mountainValley from '../assets/mountain-valley.png';
import loktakLake from '../assets/loktak-lake.png';

export const LandingPage = ({ setActivePage, onOpenCulture }) => {
  const { currentLang, setLanguage, languages, t } = useLanguage();
  const { isAuthenticated, demoLogin } = useAuth();

  const handleDemoStart = async () => {
    await demoLogin();
    setActivePage('dashboard');
  };

  const simpleGamePills = [
    { title: '🌲 ' + (t.games?.wordSearchTitle || 'Alaska Word Search'), desc: t.games?.wordSearchDesc || 'Find hidden words in a letter grid to improve concentration and word recognition.' },
    { title: '🔍 ' + (t.games?.oddOneOutTitle || 'Find Odd One Out'), desc: t.games?.oddOneOutDesc || 'Observe a group of similar objects and identify the one item that is different.' },
    { title: '🔤 ' + (t.games?.letterCTitle || 'Letter C Word Game'), desc: t.games?.letterCDesc || 'Find or create words beginning with the letter C to exercise vocabulary and word recall.' },
    { title: '📰 ' + (t.games?.crosswordsTitle || 'Crosswords'), desc: t.games?.crosswordsDesc || 'Use clues to complete a crossword puzzle and exercise vocabulary and reasoning.' },
    { title: '🧩 ' + (t.games?.jigsawTitle || 'Jigsaw Puzzle'), desc: t.games?.jigsawDesc || 'Arrange puzzle pieces correctly to complete a picture and exercise visual-spatial thinking.' }
  ];

  // 8 North-Eastern States Heritage Data
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
      {/* Scenic Sunrise Lake & Park Bench Hero (Matching Image 2 exactly) */}
      <section className="relative w-full overflow-hidden bg-[#FAF7F0] border-b border-[#E5DFD5]">
        <div className="relative w-full max-w-[1400px] mx-auto">
          {/* Pristine High-Resolution Hero Graphic */}
          <img
            src={heroLake}
            alt="CogniCare - when memories meet care"
            className="w-full h-auto block select-none"
          />

          {/* Interactive Voice Button Overlay aligned with 'Listen to Introduction' in image */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-[5.5%] sm:pb-[6%] md:pb-[6.5%]">
            <button
              onClick={() => {
                const text = "Welcome to CogniCare, when memories meet care. A warm, peaceful, culturally rooted space designed for our beloved elders to revisit joyful memories, exercise visual attention, and stimulate word recall with gentle cognitive games.";
                if ('speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  const utterance = new SpeechSynthesisUtterance(text);
                  utterance.rate = 0.9;
                  window.speechSynthesis.speak(utterance);
                }
              }}
              title="Listen to Introduction"
              className="px-5 py-2 sm:px-7 sm:py-2.5 rounded-full bg-[#1B3B2B] hover:bg-[#132E20] text-white font-medium text-xs sm:text-sm shadow-lg border border-[#C99E32]/50 inline-flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-amber-300" />
              <span>Listen to Introduction</span>
            </button>
          </div>
        </div>
      </section>

      {/* Quick Action Navigation Bar */}
      <section className="py-6 bg-white border-b border-[#E5DFD5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActivePage('games')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#1B3B2B] hover:bg-[#2C5E3B] text-white font-bold text-sm border-2 border-[#C99E32] shadow-sm hover:shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4 text-amber-300" />
              <span>Explore 5 Cognitive Games</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => setActivePage('dashboard')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-stone-900 font-bold text-sm border-2 border-amber-300 shadow-sm transition-all cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-amber-700" />
                  <span>Caretaker Dashboard</span>
                </button>

                <button
                  onClick={() => setActivePage('progress')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-sm border-2 border-emerald-300 shadow-sm transition-all cursor-pointer"
                >
                  <BarChart3 className="w-4 h-4 text-emerald-700" />
                  <span>View Progress Dashboard</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleDemoStart}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-amber-50 text-stone-900 font-bold text-sm border-2 border-stone-300 shadow-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>1-Click Demo Caregiver</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Prominent Language Selection */}
      <section className="py-8 bg-[#FAF7F0] border-b border-[#E5DFD5]">
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
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-[#1B3B2B] text-white border-[#C99E32] shadow-md ring-2 ring-amber-300/40 scale-102'
                      : 'bg-white hover:bg-amber-50/70 text-stone-800 border-stone-200'
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="font-sans font-bold text-sm">{lang.native}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-amber-200' : 'text-stone-400'}`}>
                    {lang.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Real Cultural Photography & Visual Memories */}
      <section className="py-12 bg-white/70 border-b border-[#E5DFD5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-[#7C3218] font-bold text-xs">
              <ImageIcon className="w-3.5 h-3.5 text-amber-700" />
              <span>Authentic Cultural Photography</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1B3B2B]">
              Cherished Heritage Sights & Mountain Landscapes
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto">
              Real high-definition photographs celebrating sacred architecture, serene lakes, and pine valleys — playable directly in the Jigsaw Puzzle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Loktak Lake Manipur */}
            <div className="bg-white rounded-3xl overflow-hidden border-2 border-amber-200/80 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={loktakLake}
                    alt="Loktak Lake & Floating Phumdis"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#051C26]/90 backdrop-blur-xs text-amber-200 text-[11px] px-3 py-1 rounded-full font-bold border border-amber-300/40">
                    🌊 Loktak Lake
                  </div>
                </div>
                <div className="p-4 space-y-1.5">
                  <h3 className="font-serif font-bold text-base text-[#1B3B2B] group-hover:text-[#A84B29] transition-colors">
                    Loktak Lake, Manipur
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    Iconic circular floating islands (phumdis) on crystal blue waters surrounded by gentle rolling green hills.
                  </p>
                </div>
              </div>
              <div className="p-4 pt-0">
                <button
                  onClick={() => setActivePage('games')}
                  className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#1B3B2B] font-bold text-xs border border-amber-300 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Gamepad2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>Play as Puzzle</span>
                  <ArrowRight className="w-3 h-3 text-amber-700" />
                </button>
              </div>
            </div>

            {/* Card 2: Ancient Sun Temple */}
            <div className="bg-white rounded-3xl overflow-hidden border-2 border-amber-200/80 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={heroBg}
                    alt="Ancient Sun Temple Architecture"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#1B3B2B]/90 backdrop-blur-xs text-amber-200 text-[11px] px-3 py-1 rounded-full font-bold border border-amber-300/40">
                    🏛️ Sacred Heritage
                  </div>
                </div>
                <div className="p-4 space-y-1.5">
                  <h3 className="font-serif font-bold text-base text-[#1B3B2B] group-hover:text-[#A84B29] transition-colors">
                    Grand Sun Temple
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    Carved ancient chariot wheels and majestic stone architecture inspiring cultural pride and peaceful reminiscence.
                  </p>
                </div>
              </div>
              <div className="p-4 pt-0">
                <button
                  onClick={() => setActivePage('games')}
                  className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#1B3B2B] font-bold text-xs border border-amber-300 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Gamepad2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>Play as Puzzle</span>
                  <ArrowRight className="w-3 h-3 text-amber-700" />
                </button>
              </div>
            </div>

            {/* Card 3: Sacred Twilight Temple */}
            <div className="bg-white rounded-3xl overflow-hidden border-2 border-amber-200/80 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={sacredTemple}
                    alt="Sacred Twilight Stone Temple"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#1B3B2B]/90 backdrop-blur-xs text-amber-200 text-[11px] px-3 py-1 rounded-full font-bold border border-amber-300/40">
                    🛕 Twilight Sanctum
                  </div>
                </div>
                <div className="p-4 space-y-1.5">
                  <h3 className="font-serif font-bold text-base text-[#1B3B2B] group-hover:text-[#A84B29] transition-colors">
                    Sacred Red Temple
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    Atmospheric sacred red stone temple glowing gently under the twilight evening sky, bringing soothing nostalgia.
                  </p>
                </div>
              </div>
              <div className="p-4 pt-0">
                <button
                  onClick={() => setActivePage('games')}
                  className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#1B3B2B] font-bold text-xs border border-amber-300 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Gamepad2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>Play as Puzzle</span>
                  <ArrowRight className="w-3 h-3 text-amber-700" />
                </button>
              </div>
            </div>

            {/* Card 4: Mountain Valley & Pine Hills */}
            <div className="bg-white rounded-3xl overflow-hidden border-2 border-amber-200/80 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between">
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={mountainValley}
                    alt="Himalayan Valley & Pine Hills"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#1B3B2B]/90 backdrop-blur-xs text-amber-200 text-[11px] px-3 py-1 rounded-full font-bold border border-amber-300/40">
                    🌲 Misty Valleys
                  </div>
                </div>
                <div className="p-4 space-y-1.5">
                  <h3 className="font-serif font-bold text-base text-[#1B3B2B] group-hover:text-[#A84B29] transition-colors">
                    Himalayan Pine Valley
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    Rolling emerald mountain ridges, misty pine canopies, and serene hill settlement bathed in pure morning light.
                  </p>
                </div>
              </div>
              <div className="p-4 pt-0">
                <button
                  onClick={() => setActivePage('games')}
                  className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#1B3B2B] font-bold text-xs border border-amber-300 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Gamepad2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>Play as Puzzle</span>
                  <ArrowRight className="w-3 h-3 text-amber-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8 North-Eastern States Heritage Section */}
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
