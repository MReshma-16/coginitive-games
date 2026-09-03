import React from 'react';
import {
  HelpCircle,
  Heart,
  Phone,
  ShieldCheck,
  BookOpen,
  MessageCircle,
  Lightbulb,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { VoiceButton } from '../components/VoiceButton';

export const HelpSupportPage = ({ onOpenCulture }) => {
  const { t } = useLanguage();

  const tips = [
    {
      title: "Use Familiar Regional Phrasing",
      desc: "Speaking in their mother tongue and referring to childhood places (e.g. Majuli, Shillong, village courtyards) brings immediate emotional security."
    },
    {
      title: "Keep Sessions Short and Relaxed",
      desc: "5 to 10 minutes of gentle play once or twice a day is ideal. Never rush or introduce timers that might cause anxiety."
    },
    {
      title: "Celebrate Every Effort Warmly",
      desc: "Focus on the joy of participation rather than scores. Encouraging words like 'Wonderful!' and 'Good memory!' create positive associations."
    },
    {
      title: "Blend Music and Visuals",
      desc: "Folk tunes (Bihu Pepa, Duitara, Flute) and traditional textiles activate multi-sensory memory pathways."
    }
  ];

  const helplines = [
    {
      name: "National Dementia Helpline (ARDSI)",
      contact: "1800-11-2003 / 0484-2802035",
      desc: "Alzheimer's and Related Disorders Society of India support."
    },
    {
      name: "Tele-MANAS National Mental Health",
      contact: "14416 / 1800-891-4416",
      desc: "24x7 Free multi-lingual mental health counseling."
    },
    {
      name: "KIRAN Mental Health Helpline",
      contact: "1800-599-0019",
      desc: "Government of India 24x7 psychological support."
    },
    {
      name: "Regional Geriatric Care Support (NE)",
      contact: "Contact Local District Civil Hospital / PHC",
      desc: "Consult registered medical practitioners for clinical memory assessments."
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-[#FAF7F0]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-stone-800 text-xs font-bold uppercase tracking-wider">
            <span>🌿 Caregiver Resource Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E432A]">
            {t.nav?.help || "Help, Support & Caregiver Guide"}
          </h1>
          <p className="text-stone-600 max-w-2xl mx-auto text-base">
            Gentle communication techniques, reminiscence guidance, and emergency support resources.
          </p>
        </div>

        {/* Safety Disclaimer Banner */}
        <div className="bg-emerald-50/90 border-2 border-emerald-300 rounded-3xl p-5 flex items-start gap-3 shadow-sm">
          <ShieldCheck className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
            <strong>Platform Purpose:</strong> CogniCare is a cognitive comfort and reminiscence application, not a medical diagnosis or medical treatment platform. For clinical memory assessments, please contact a qualified healthcare physician or neurologist.
          </div>
        </div>

        {/* Dementia Reminiscence Communication Tips */}
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-amber-100">
            <Lightbulb className="w-5 h-5 text-amber-700" />
            <h2 className="font-serif font-bold text-xl text-[#1E432A]">
              Caregiver Reminiscence Tips
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tips.map((tip, i) => (
              <div key={i} className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-1.5">
                <h3 className="font-serif font-bold text-base text-[#1E432A] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1E432A] text-amber-300 text-xs flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  <span>{tip.title}</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {tip.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Support Helplines */}
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-8 shadow-md space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-amber-100">
            <Phone className="w-5 h-5 text-amber-700" />
            <h2 className="font-serif font-bold text-xl text-[#1E432A]">
              National & Regional Healthcare Helplines
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {helplines.map((line, idx) => (
              <div key={idx} className="border border-stone-200 rounded-2xl p-4 hover:border-amber-400 transition-all bg-stone-50/50">
                <h3 className="font-bold text-sm text-stone-900 mb-1">{line.name}</h3>
                <div className="text-base font-bold text-[#1E432A] mb-1 font-mono">{line.contact}</div>
                <p className="text-xs text-stone-500">{line.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Culture Explorer Link */}
        {onOpenCulture && (
          <div className="bg-gradient-to-r from-[#1E432A] to-[#2C5E3B] rounded-3xl p-6 text-white text-center shadow-lg space-y-3">
            <h3 className="font-serif font-bold text-xl text-amber-200">
              Explore North-East India Heritage
            </h3>
            <p className="text-stone-300 text-sm max-w-xl mx-auto">
              Learn about the traditional foods, dances, handloom weaves, and folk history of all 8 North-Eastern states.
            </p>
            <button
              onClick={onOpenCulture}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-amber-400 text-stone-900 font-bold hover:bg-amber-300 transition-all text-sm"
            >
              <Compass className="w-4 h-4" />
              <span>Open 8 States Heritage Explorer</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
