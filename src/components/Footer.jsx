import React from 'react';
import { Heart, ShieldCheck, Globe, Sparkles, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer = ({ onOpenCulture, setActivePage }) => {
  const { t, languages, setLanguage, currentLang } = useLanguage();

  return (
    <footer className="bg-[#1E432A] text-[#FAF7F0] pt-12 pb-8 border-t-4 border-[#C99E32]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Disclaimer Banner (Safety Requirement) */}
        <div className="bg-[#122819] border-2 border-[#C99E32]/60 rounded-3xl p-5 mb-10 flex flex-col md:flex-row items-center gap-4 text-center md:text-left shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <h4 className="font-serif font-bold text-amber-300 text-base md:text-lg mb-1">
              {t.hero?.nonMedicalNotice || "A Reminiscence & Cognitive Support Platform"}
            </h4>
            <p className="text-xs md:text-sm text-stone-300 leading-relaxed">
              <strong>Memory Roots</strong> is designed for emotional comfort, familiar reminiscence, and caregiver organization. It does not provide medical diagnosis, clinical prognosis, or direct pharmaceutical advice. If you have clinical concerns, please consult a qualified healthcare professional.
            </p>
          </div>
        </div>

        {/* 3 Column Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌿</span>
              <span className="font-serif text-2xl font-bold text-amber-200">
                {t.appTitle?.split('(')[0] || 'Memory Roots'}
              </span>
            </div>
            <p className="text-amber-100 font-serif italic text-base max-w-md">
              "{t.tagline || 'Remember Yesterday. Enjoy Today. Connect Tomorrow.'}"
            </p>
            <p className="text-stone-300 text-sm max-w-lg leading-relaxed">
              Dedicated to the loving elders of Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Tripura, and Sikkim.
            </p>
            {onOpenCulture && (
              <button
                onClick={onOpenCulture}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-200 hover:bg-amber-500/30 text-sm font-semibold transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{t.hero?.aboutCulture || "Explore 8 States Heritage"}</span>
              </button>
            )}
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h5 className="font-serif font-bold text-amber-300 text-base mb-3 border-b border-amber-500/30 pb-1">
              Quick Navigation
            </h5>
            <ul className="space-y-1.5 text-sm text-stone-200">
              <li>
                <button onClick={() => setActivePage('home')} className="hover:text-amber-300 transition-colors">
                  {t.nav?.home || 'Home'}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('games')} className="hover:text-amber-300 transition-colors">
                  {t.nav?.games || 'Memory Games'}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('dashboard')} className="hover:text-amber-300 transition-colors">
                  {t.nav?.profile || 'Patient Profile'}
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('help')} className="hover:text-amber-300 transition-colors">
                  {t.nav?.help || 'Caregiver Guide & Help'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Supported Languages */}
          <div className="space-y-2">
            <h5 className="font-serif font-bold text-amber-300 text-base mb-3 border-b border-amber-500/30 pb-1 flex items-center gap-1.5">
              <Globe className="w-4 h-4" />
              <span>Regional Languages</span>
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                    currentLang === l.code
                      ? 'bg-amber-400 text-stone-900 border-amber-400 font-bold'
                      : 'bg-stone-800/60 text-stone-200 border-stone-600 hover:border-amber-300'
                  }`}
                >
                  {l.native}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-amber-800/40 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-2">
          <p>© 2026 Memory Roots. Built with deep cultural respect for North-East India.</p>
          <div className="flex items-center gap-1 text-amber-200/80">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
            <span>for Caregivers & Elders</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
