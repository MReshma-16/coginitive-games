import React from 'react';
import { Heart, ShieldCheck, Globe, Sparkles, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import logoImg from '../assets/logo.png';

export const Footer = ({ onOpenCulture, setActivePage }) => {
  const { t, languages, setLanguage, currentLang } = useLanguage();

  return (
    <footer className="bg-[#1B3B2B] text-[#FAF7F0] pt-10 pb-8 border-t-4 border-[#C99E32]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Disclaimer Banner */}
        <div className="bg-[#122819] border-2 border-[#C99E32]/60 rounded-3xl p-5 mb-8 flex flex-col md:flex-row items-center gap-4 text-center md:text-left shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h4 className="font-serif font-bold text-amber-300 text-base mb-1">
              {t.hero?.nonMedicalNotice || "A Reminiscence & Cognitive Support Platform"}
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              <strong>CogniCare</strong> is designed for emotional comfort, familiar reminiscence, and caregiver routine organization. It does not provide medical diagnosis, clinical prognosis, or direct pharmaceutical advice. If you have clinical concerns, please consult a qualified healthcare professional.
            </p>
          </div>
        </div>

        {/* Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="bg-white/95 backdrop-blur-sm px-3.5 py-2 rounded-2xl border border-amber-300 shadow-md inline-flex items-center">
                <img
                  src={logoImg}
                  alt="CogniCare Logo"
                  className="h-9 sm:h-10 object-contain"
                />
              </div>
            </div>
            <p className="text-amber-200 font-serif italic text-sm max-w-md">
              "{t.tagline || 'when memories meet care'}"
            </p>
            <p className="text-stone-300 text-xs max-w-lg leading-relaxed">
              Dedicated to the loving elders of Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Tripura, and Sikkim.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h5 className="font-serif font-bold text-amber-300 text-sm mb-2 border-b border-amber-500/30 pb-1">
              Quick Navigation
            </h5>
            <ul className="space-y-1.5 text-xs text-stone-200">
              <li>
                <button onClick={() => setActivePage('home')} className="hover:text-amber-300 transition-colors">
                  {t.nav?.home || 'Home'}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('games')} className="hover:text-amber-300 transition-colors">
                  {t.nav?.games || 'Cognitive Games'}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('dashboard')} className="hover:text-amber-300 transition-colors">
                  {t.nav?.dashboard || 'Caretaker Dashboard'}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('settings')} className="hover:text-amber-300 transition-colors">
                  {t.nav?.settings || 'Settings & Accessibility'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Supported Languages */}
          <div className="space-y-2">
            <h5 className="font-serif font-bold text-amber-300 text-sm mb-2 border-b border-amber-500/30 pb-1">
              Languages
            </h5>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`text-left px-2 py-1 rounded transition-colors ${
                    currentLang === l.code
                      ? 'bg-amber-400 text-stone-900 font-bold'
                      : 'text-stone-300 hover:text-white'
                  }`}
                >
                  {l.native}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-amber-400/20 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-2">
          <span>© 2026 CogniCare • when memories meet care</span>
          <span className="flex items-center gap-1 text-amber-200 font-serif">
            Made with <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> for the Elders of North-East India
          </span>
        </div>
      </div>
    </footer>
  );
};
