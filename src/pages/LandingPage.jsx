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
import assamImg from '../assets/states/assam.png';
import arunachalImg from '../assets/states/arunachal.png';
import manipurImg from '../assets/states/manipur.png';
import meghalayaImg from '../assets/states/meghalaya.png';
import mizoramImg from '../assets/states/mizoram.png';
import nagalandImg from '../assets/states/nagaland.png';
import tripuraImg from '../assets/states/tripura.png';
import sikkimImg from '../assets/states/sikkim.png';

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

  // 8 North-Eastern States Heritage Data with Real Photos & Dynamic Language Support
  const stateConfigs = [
    {
      key: "assam",
      nativeName: "অসম",
      icon: "🦏",
      image: assamImg,
      color: "from-amber-500/20 to-yellow-600/20",
      border: "border-amber-300"
    },
    {
      key: "arunachal",
      nativeName: "অৰুণাচল প্ৰদেশ",
      icon: "🏔️",
      image: arunachalImg,
      color: "from-emerald-500/20 to-teal-600/20",
      border: "border-emerald-300"
    },
    {
      key: "manipur",
      nativeName: "মণিপুর",
      icon: "🌸",
      image: manipurImg,
      color: "from-purple-500/20 to-indigo-600/20",
      border: "border-purple-300"
    },
    {
      key: "meghalaya",
      nativeName: "মেঘালয়",
      icon: "🌧️",
      image: meghalayaImg,
      color: "from-sky-500/20 to-blue-600/20",
      border: "border-sky-300"
    },
    {
      key: "mizoram",
      nativeName: "মিজোৰাম",
      icon: "🎋",
      image: mizoramImg,
      color: "from-rose-500/20 to-amber-600/20",
      border: "border-rose-300"
    },
    {
      key: "nagaland",
      nativeName: "নাগালেণ্ড",
      icon: "🥁",
      image: nagalandImg,
      color: "from-red-500/20 to-orange-600/20",
      border: "border-red-300"
    },
    {
      key: "tripura",
      nativeName: "ত্রিপুরা",
      icon: "🏰",
      image: tripuraImg,
      color: "from-teal-500/20 to-cyan-600/20",
      border: "border-teal-300"
    },
    {
      key: "sikkim",
      nativeName: "सिक्किम",
      icon: "☸️",
      image: sikkimImg,
      color: "from-blue-500/20 to-violet-600/20",
      border: "border-blue-300"
    }
  ];

  const northEastStates = stateConfigs.map(st => {
    const data = t.states?.[st.key] || {};
    return {
      ...st,
      name: data.name || st.key,
      theme: data.theme || "",
      desc: data.desc || ""
    };
  });

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

          {/* Interactive Voice Button Hotspot - Invisible interactive hotspot directly over the graphic to eliminate any double layer, matching reference image 2 exactly */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-[84.4%] -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
              <button
                onClick={() => {
                  if ('speechSynthesis' in window) {
                    const speechText = t.hero?.spokenIntro || t.hero?.desc || "Welcome to CogniCare, when memories meet care. A warm, peaceful, culturally rooted space designed for our beloved elders to revisit joyful memories, exercise visual attention, and stimulate word recall with gentle cognitive games.";
                    window.speechSynthesis.cancel();
                    const utterance = new SpeechSynthesisUtterance(speechText);
                    utterance.rate = 0.9;
                    const langMap = { as: 'as-IN', bn: 'bn-IN', brx: 'hi-IN', mni: 'mni-IN', ne: 'ne-NP', en: 'en-US' };
                    if (langMap[currentLang]) utterance.lang = langMap[currentLang];
                    window.speechSynthesis.speak(utterance);
                  }
                }}
                title={t.hero?.listenIntro || "Listen to Introduction"}
                aria-label={t.hero?.listenIntro || "Listen to Introduction"}
                className="w-[185px] h-[38px] sm:w-[210px] sm:h-[42px] rounded-full cursor-pointer bg-transparent hover:bg-amber-400/15 active:bg-amber-500/25 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
            </div>
          </div>

            {/* Dynamic Localized Hero Overlay for non-English languages */}
            {currentLang !== 'en' && (
              <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6 bg-black/25">
                <div className="bg-[#FAF7F0]/95 backdrop-blur-md border-2 border-[#C99E32] rounded-3xl p-5 sm:p-8 max-w-2xl text-center shadow-2xl space-y-3 transform translate-y-[-2%] animate-fadeIn">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1B3B2B] text-amber-200 text-xs font-bold uppercase tracking-wider">
                    <span>🌿 {t.hero?.tagline || t.tagline || "when memories meet care"}</span>
                  </div>
                  <h1 className="font-serif font-bold text-2xl sm:text-4xl text-[#1B3B2B] leading-tight">
                    {t.hero?.title || "when memories meet care"}
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base text-stone-700 leading-relaxed font-medium max-w-xl mx-auto">
                    {t.hero?.desc}
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        const speechText = t.hero?.spokenIntro || t.hero?.desc;
                        if ('speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                          const utterance = new SpeechSynthesisUtterance(speechText);
                          utterance.rate = 0.9;
                          const langMap = { as: 'as-IN', bn: 'bn-IN', brx: 'hi-IN', mni: 'mni-IN', ne: 'ne-NP', en: 'en-US' };
                          if (langMap[currentLang]) utterance.lang = langMap[currentLang];
                          window.speechSynthesis.speak(utterance);
                        }
                      }}
                      className="btn-voice px-7 py-3 shadow-lg"
                    >
                      <Volume2 className="w-4 h-4 text-amber-300 icon-pulse-wave" />
                      <span>{t.hero?.listenIntro || "Listen to Introduction"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

      {/* Quick Action Navigation Bar */}
      <section className="py-6 bg-white border-b border-[#E5DFD5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setActivePage('games')}
              className="btn-primary btn-ring-pulse px-7 py-3.5 rounded-2xl text-sm font-bold inline-flex items-center gap-2.5"
            >
              <Gamepad2 className="w-4 h-4 text-amber-300" />
              <span>{t.hero?.exploreGames || "Explore 5 Cognitive Games"}</span>
              <ArrowRight className="w-4 h-4 text-amber-300 icon-slide-right" />
            </button>

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => setActivePage('dashboard')}
                  className="btn-secondary px-6 py-3.5 rounded-2xl text-sm font-bold inline-flex items-center gap-2"
                >
                  <Heart className="w-4 h-4 text-amber-800" />
                  <span>{t.hero?.caretakerDashboard || "Caretaker Dashboard"}</span>
                </button>

                <button
                  onClick={() => setActivePage('progress')}
                  className="btn-emerald px-6 py-3.5 rounded-2xl text-sm font-bold inline-flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4 text-emerald-200" />
                  <span>{t.hero?.progressDashboard || "View Progress Dashboard"}</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleDemoStart}
                className="btn-gold px-6 py-3.5 rounded-2xl text-sm font-bold inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-900 icon-spin-hover" />
                <span>{t.hero?.demoCaregiver || "1-Click Demo Caregiver"}</span>
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
              {t.hero?.chooseLanguageSub || "Instant translation applies to all pages, games, reminders, and audio"}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {languages.map((lang) => {
              const isSelected = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`btn-pill p-3.5 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-1.5 cursor-pointer shadow-xs hover:shadow-md hover:-translate-y-0.5 ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#1B3B2B] via-[#224A35] to-[#132E20] text-white border-[#C99E32] shadow-lg ring-3 ring-amber-300/60 scale-102'
                      : 'bg-white hover:bg-amber-50/80 text-stone-800 border-stone-200 hover:border-amber-300'
                  }`}
                >
                  <span className="text-xl transition-transform duration-200 group-hover:scale-110">{lang.flag}</span>
                  <span className="font-sans font-bold text-sm">{lang.native}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-amber-300 font-bold' : 'text-stone-400'}`}>
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
              <span>{t.gallery?.badge || "Authentic Cultural Photography"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1B3B2B]">
              {t.gallery?.title || "Cherished Heritage Sights & Mountain Landscapes"}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl mx-auto">
              {t.gallery?.subtitle || "Real high-definition photographs celebrating sacred architecture, serene lakes, and pine valleys — playable directly in the Jigsaw Puzzle."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                badge: t.gallery?.loktakBadge || "🌊 Loktak Lake",
                title: t.gallery?.loktakTitle || "Loktak Lake, Manipur",
                desc: t.gallery?.loktakDesc || "Iconic circular floating islands (phumdis) on crystal blue waters surrounded by gentle rolling green hills.",
                image: loktakLake,
                bg: "bg-[#051C26]/90"
              },
              {
                badge: t.gallery?.sunTempleBadge || "🏛️ Sacred Heritage",
                title: t.gallery?.sunTempleTitle || "Grand Sun Temple",
                desc: t.gallery?.sunTempleDesc || "Carved ancient chariot wheels and majestic stone architecture inspiring cultural pride and peaceful reminiscence.",
                image: heroBg,
                bg: "bg-[#1B3B2B]/90"
              },
              {
                badge: t.gallery?.redTempleBadge || "🛕 Twilight Sanctum",
                title: t.gallery?.redTempleTitle || "Sacred Red Temple",
                desc: t.gallery?.redTempleDesc || "Atmospheric sacred red stone temple glowing gently under the twilight evening sky, bringing soothing nostalgia.",
                image: sacredTemple,
                bg: "bg-[#1B3B2B]/90"
              },
              {
                badge: t.gallery?.valleyBadge || "🌲 Misty Valleys",
                title: t.gallery?.valleyTitle || "Himalayan Pine Valley",
                desc: t.gallery?.valleyDesc || "Rolling emerald mountain ridges, misty pine canopies, and serene hill settlement bathed in pure morning light.",
                image: mountainValley,
                bg: "bg-[#1B3B2B]/90"
              }
            ].map((card, idx) => (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden border-2 border-amber-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1">
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className={`absolute top-3 left-3 ${card.bg} backdrop-blur-xs text-amber-200 text-[11px] px-3 py-1 rounded-full font-bold border border-amber-300/40`}>
                      {card.badge}
                    </div>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <h3 className="font-serif font-bold text-base text-[#1B3B2B] group-hover:text-[#A84B29] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                      {card.desc}
                    </p>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <button
                    onClick={() => setActivePage('games')}
                    className="btn-secondary w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Gamepad2 className="w-3.5 h-3.5 text-amber-800" />
                    <span>{t.gallery?.playPuzzle || "Play as Puzzle"}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-800 icon-slide-right" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8 North-Eastern States Heritage Section */}
      <section className="py-14 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-[#7C3218] font-bold text-xs">
            <MapPin className="w-3.5 h-3.5" />
            <span>{t.hero?.heritageBadge || "North-Eastern Region Heritage"}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1B3B2B]">
            {t.hero?.exploreHeritage || "Explore North-East Heritage"}
          </h2>

          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto">
            {t.hero?.exploreHeritageSubtitle || "Honoring the 8 states of North-Eastern India with authentic culture, textiles, landscapes, and childhood traditions."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {northEastStates.map((st, idx) => (
            <div
              key={idx}
              className={`bg-white border-2 ${st.border} rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5`}
            >
              {/* Photo Banner with Badges */}
              <div className="relative h-44 w-full overflow-hidden bg-stone-100">
                <img
                  src={st.image}
                  alt={st.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                {/* Cultural Icon Badge */}
                <div className="absolute top-3 left-3">
                  <span className="text-xl p-1.5 rounded-xl bg-white/90 backdrop-blur-sm border border-white/60 shadow-sm inline-flex items-center justify-center">
                    {st.icon}
                  </span>
                </div>

                {/* Native Script Badge */}
                <div className="absolute top-3 right-3">
                  <span className="text-xs font-serif font-bold text-amber-100 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-300/40 shadow-xs">
                    {st.nativeName}
                  </span>
                </div>

                {/* State Name overlay at bottom of photo */}
                <div className="absolute bottom-2.5 left-3.5 right-3.5">
                  <h3 className="font-serif font-bold text-lg text-white drop-shadow-md leading-tight">
                    {st.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#8C6D3B] block">
                    {st.theme}
                  </span>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
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
              {t.hero?.activitiesTitle || "5 Tailored Cognitive Activities"}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              {t.hero?.activitiesSub || "Featuring 🟢 Easy, 🟡 Medium, and 🔴 Hard tiers with immediate score-based adaptive difficulty."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {simpleGamePills.map((g, idx) => (
              <div
                key={idx}
                onClick={() => setActivePage('games')}
                className="bg-white border-2 border-[#E5DFD5] hover:border-[#C99E32] rounded-3xl p-5 shadow-xs hover:shadow-lg hover:-translate-y-1 active:translate-y-0 active:scale-98 cursor-pointer transition-all duration-200 space-y-2 group flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <h3 className="font-serif font-bold text-base text-[#1B3B2B] group-hover:text-[#A84B29] transition-colors">
                    {g.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {g.desc}
                  </p>
                </div>
                <div className="pt-2 flex items-center gap-1 text-xs font-bold text-amber-800 group-hover:text-[#1B3B2B] transition-colors">
                  <span>Play Activity</span>
                  <ArrowRight className="w-3.5 h-3.5 icon-slide-right text-[#C99E32]" />
                </div>
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
