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
  Compass,
  Play
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

  const featureCards = [
    {
      icon: '🪨',
      title: t.games?.childhoodTitle || "Back to My Childhood Games",
      desc: "Traditional Five Stones (Guti), Marbles, Spinning Tops (Latum), Kite memory, and Mancala Seed games.",
      action: () => setActivePage('games')
    },
    {
      icon: '🏮',
      title: t.games?.culturalTitle || "North-East Heritage & Foods",
      desc: "Reminiscence activities with authentic Mekhela Sador, Pitha, Bihu tunes, Duitara strings, and Living Root Bridges.",
      action: () => setActivePage('games')
    },
    {
      icon: '👨‍👩‍👧',
      title: t.family?.title || "Family Memories & AI Stories",
      desc: "Upload personal family photographs of weddings, grandchildren, and ancestral homes with gentle AI-crafted memory prompts.",
      action: () => setActivePage(isAuthenticated ? 'family' : 'auth')
    },
    {
      icon: '⏰',
      title: t.reminders?.title || "Caregiver Routine & Reminders",
      desc: "Gentle schedule reminders for meals, hydration, appointments, and caretaker-managed daily routines.",
      action: () => setActivePage(isAuthenticated ? 'reminders' : 'auth')
    },
    {
      icon: '📊',
      title: t.progress?.title || "Progress & Memory Profile",
      desc: "Track cognitive engagement, favorite games, and comfort levels without medical labels.",
      action: () => setActivePage(isAuthenticated ? 'progress' : 'auth')
    },
    {
      icon: '🎤',
      title: "Voice Assistant & Elder Accessibility",
      desc: "Slower audio read-aloud, spoken answer recognition, large fonts, and high-contrast heritage styling.",
      action: () => setActivePage('settings')
    }
  ];

  return (
    <div className="bg-[#FAF7F0] min-h-screen">
      {/* Hero Section with Atmospheric North-East Visual Theme */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 border-b-2 border-amber-200">
        {/* Decorative Background Image Overlay */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1600&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F0]/80 via-[#FAF7F0]/95 to-[#FAF7F0]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Cultural Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border-2 border-[#C99E32] text-[#7C3218] font-bold text-sm shadow-sm">
              <span>🌿</span>
              <span>{t.subTitle || "AI-Based Cognitive Support & Reminiscence for North-East India"}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#1E432A] tracking-tight leading-tight">
              {t.hero?.title || "Rekindling Precious Memories of the North-East"}
            </h1>

            {/* Tagline / Subtitle */}
            <p className="font-serif italic text-xl md:text-2xl text-[#A84B29] font-medium">
              "{t.tagline || "Remember Yesterday. Enjoy Today. Connect Tomorrow."}"
            </p>

            <p className="text-base sm:text-lg md:text-xl text-stone-700 max-w-3xl mx-auto leading-relaxed">
              {t.hero?.desc || "A warm, peaceful, culturally rooted space designed for our beloved elders to revisit traditional games, folk melodies, handicrafts, and cherished childhood moments."}
            </p>

            {/* Voice Read Aloud for Elders */}
            <div className="flex justify-center pt-2">
              <VoiceButton
                textToRead={`${t.appTitle}. ${t.tagline}. ${t.hero?.desc}`}
                label={t.dashboard?.listenVoice || "Listen to Introduction"}
              />
            </div>

            {/* Call To Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              {isAuthenticated ? (
                <button
                  onClick={() => setActivePage('dashboard')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#1E432A] hover:bg-[#2C5E3B] text-white font-bold text-lg border-2 border-[#C99E32] shadow-xl hover:shadow-2xl transition-all active:scale-98"
                >
                  <Heart className="w-6 h-6 text-amber-300" />
                  <span>{t.hero?.caretakerPortal || "Caretaker Dashboard"}</span>
                  <ArrowRight className="w-6 h-6" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setActivePage('auth')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#1E432A] hover:bg-[#2C5E3B] text-white font-bold text-lg border-2 border-[#C99E32] shadow-xl hover:shadow-2xl transition-all active:scale-98"
                  >
                    <span>{t.hero?.getStarted || "Begin Gentle Journey"}</span>
                    <ArrowRight className="w-6 h-6" />
                  </button>

                  <button
                    onClick={handleDemoStart}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-amber-100 hover:bg-amber-200 text-[#7C3218] font-bold text-lg border-2 border-amber-300 shadow-md transition-all active:scale-98"
                  >
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    <span>{t.hero?.tryDemo || "1-Click Demo Caregiver"}</span>
                  </button>
                </>
              )}

              <button
                onClick={() => setActivePage('games')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-amber-50 text-stone-800 font-bold text-lg border-2 border-stone-300 shadow-sm transition-all"
              >
                <Gamepad2 className="w-5 h-5 text-[#1E432A]" />
                <span>{t.nav?.games || "Explore Games"}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Prominent Language Selection Section (Requirement 3) */}
      <section className="py-12 bg-amber-50/70 border-b-2 border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E432A] flex items-center justify-center gap-2">
              <span>🌿</span>
              <span>{t.hero?.chooseLanguage || "Choose Your Language"}</span>
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-1">
              Select your native tongue — the entire platform will operate comfortably in your language.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {languages.map((lang) => {
              const isSelected = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-1.5 shadow-sm active:scale-95 ${
                    isSelected
                      ? 'bg-[#1E432A] text-white border-[#C99E32] shadow-lg scale-102 ring-4 ring-amber-300/40'
                      : 'bg-white text-stone-800 border-amber-200 hover:border-[#C99E32] hover:bg-amber-100/50'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl">{lang.flag}</span>
                  <span className="font-serif font-bold text-base sm:text-lg">{lang.native}</span>
                  <span className={`text-xs ${isSelected ? 'text-amber-200' : 'text-stone-500'}`}>
                    {lang.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E432A] mb-3">
            “A digital journey back to the memories of childhood.”
          </h2>
          <p className="text-stone-600 text-base sm:text-lg">
            Old memories + traditional games + North-East culture + AI personalization + caregiver assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feat, idx) => (
            <div
              key={idx}
              onClick={feat.action}
              className="bg-white/90 border-2 border-amber-200/90 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-[#C99E32] transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="font-serif font-bold text-xl text-[#1E432A] mb-2 group-hover:text-[#A84B29] transition-colors">
                  {feat.title}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-4">
                  {feat.desc}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm font-bold text-[#1E432A] group-hover:text-[#A84B29]">
                <span>Explore Activity</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cultural Heritage Banner & 8 States Tribute */}
      <section className="py-14 bg-gradient-to-r from-[#1E432A] via-[#2C5E3B] to-[#1E432A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-block px-4 py-1 rounded-full bg-amber-400/20 border border-amber-300 text-amber-200 text-xs uppercase tracking-widest font-bold">
            Honoring North-East India
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-amber-200">
            Assam • Arunachal Pradesh • Manipur • Meghalaya • Mizoram • Nagaland • Tripura • Sikkim
          </h2>
          <p className="text-stone-200 max-w-2xl mx-auto text-base leading-relaxed">
            Every game, instrument, and visual memory is respectfully inspired by the authentic traditions, weaving arts, and village landscapes of all eight states.
          </p>
          <div>
            <button
              onClick={onOpenCulture}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-400 text-stone-900 font-bold hover:bg-amber-300 transition-all shadow-lg text-base"
            >
              <Compass className="w-5 h-5" />
              <span>{t.hero?.aboutCulture || "Explore the 8 States Traditions"}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
