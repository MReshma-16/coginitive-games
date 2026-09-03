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
  Image as ImageIcon
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
    { title: '🧺 Memory Basket', desc: 'Remember traditional objects in the woven basket.' },
    { title: '🏡 My Old Village', desc: 'Explore the traditional village scene & object placements.' },
    { title: '🥁 Rhythm Recall', desc: 'Listen and reproduce gentle bell and drum rhythms.' },
    { title: '🎨 Pattern Match', desc: 'Recognize traditional North-Eastern weaves and motifs.' },
    { title: '🎵 Folk Song Guess', desc: 'Identify short authentic folk melody clips.' },
    { title: '🛤️ Memory Path', desc: 'Recreate step-by-step memory walks through the village.' }
  ];

  return (
    <div className="bg-[#FAF7F0] min-h-screen">
      {/* Clean, Neat Hero */}
      <section className="pt-10 pb-16 md:pt-16 md:pb-20 border-b border-[#E5DFD5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          {/* Subtle Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-[#7C3218] font-bold text-xs">
            <span>🌿 Memory Roots</span>
            <span className="text-amber-400">•</span>
            <span>North-Eastern India Cognitive Platform</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1B3B2B] leading-tight tracking-tight">
            Remember Yesterday. Enjoy Today. Connect Tomorrow.
          </h1>

          <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
            A peaceful, culturally rooted space designed for our beloved elders to revisit traditional memories, folk rhythms, and familiar village life with gentle 3-round adaptive games.
          </p>

          {/* Voice Prompt */}
          <div className="flex justify-center pt-1">
            <VoiceButton
              textToRead="Welcome to Memory Roots. A peaceful cognitive support and reminiscence platform for our beloved elders."
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
              <span>Explore the 6 Games</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {isAuthenticated ? (
              <button
                onClick={() => setActivePage('dashboard')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-stone-900 font-bold text-base border border-amber-300 shadow-sm transition-all"
              >
                <Heart className="w-5 h-5 text-amber-700" />
                <span>Caretaker Dashboard</span>
              </button>
            ) : (
              <button
                onClick={handleDemoStart}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50 text-stone-800 font-bold text-base border-2 border-stone-300 shadow-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>1-Click Demo Caregiver</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Prominent, Clean Language Cards (Requirement 3) */}
      <section className="py-10 bg-white border-b border-[#E5DFD5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-serif font-bold text-[#1B3B2B]">
              🌿 Choose Your Language
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Instant translation across all activities, questions, and audio
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {languages.map((lang) => {
              const isSelected = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                    isSelected
                      ? 'bg-[#1B3B2B] text-white border-[#C99E32] shadow-md ring-2 ring-amber-300/40'
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

      {/* 6 Cognitive Activities Preview */}
      <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1B3B2B]">
            6 Tailored Cognitive Activities
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Featuring 🟢 Easy, 🟡 Medium, and 🔴 Hard tiers with gentle 3-round adaptive difficulty.
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
      </section>

      {/* Non-Diagnostic Safety Callout */}
      <section className="pb-12 max-w-3xl mx-auto px-4 text-center">
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center justify-center gap-2 text-xs text-emerald-950 font-medium">
          <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0" />
          <span>A peaceful reminiscence and cognitive support platform, not a medical diagnostic tool.</span>
        </div>
      </section>
    </div>
  );
};
