import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Eye,
  Brain,
  CheckCircle2,
  Calendar,
  Heart,
  ShieldCheck,
  Gamepad2,
  Play
} from 'lucide-react';
import { usePatient } from '../context/PatientContext';
import { useLanguage } from '../context/LanguageContext';
import { VoiceButton } from '../components/VoiceButton';

export const MemoryProfilePage = ({ setActivePage }) => {
  const { t, currentLang } = useLanguage();
  const { patient, questionnaire } = usePatient();

  const profile = questionnaire?.profile || {
    visualMemory: 85,
    shortTermRecall: 72,
    recognition: 90,
    attention: 80,
    sequenceMemory: 75,
    dailyRoutineRecall: 88,
    emotionalWellbeing: 92
  };

  const domains = [
    {
      name: t.profile?.visualMemory || 'Visual Memory',
      score: profile.visualMemory,
      icon: Eye,
      color: 'bg-emerald-500',
      tag: 'Pictures & Places',
      game: 'Familiar Places & Village Scene'
    },
    {
      name: t.profile?.shortTermRecall || 'Short-Term Recall',
      score: profile.shortTermRecall,
      icon: Brain,
      color: 'bg-amber-500',
      tag: 'Recent Items',
      game: 'Traditional Food Memory'
    },
    {
      name: t.profile?.recognition || 'Familiar Recognition',
      score: profile.recognition,
      icon: CheckCircle2,
      color: 'bg-teal-500',
      tag: 'People & Textiles',
      game: 'Textiles & Family Memories'
    },
    {
      name: t.profile?.attention || 'Gentle Attention',
      score: profile.attention,
      icon: Sparkles,
      color: 'bg-indigo-500',
      tag: 'Colors & Shapes',
      game: 'Marbles & Spinning Top'
    },
    {
      name: t.profile?.sequenceMemory || 'Sequence Memory',
      score: profile.sequenceMemory,
      icon: Play,
      color: 'bg-rose-500',
      tag: 'Order & Steps',
      game: 'Five Stones (Guti)'
    },
    {
      name: t.profile?.dailyRoutine || 'Daily Routine Recall',
      score: profile.dailyRoutineRecall,
      icon: Calendar,
      color: 'bg-purple-500',
      tag: 'Familiar Habits',
      game: 'Daily Routine Recall'
    },
    {
      name: t.profile?.emotionalWellbeing || 'Emotional Well-being',
      score: profile.emotionalWellbeing,
      icon: Heart,
      color: 'bg-rose-400',
      tag: 'Comfort & Peace',
      game: 'Folk Music & Storytelling'
    }
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-[#FAF7F0]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-sm font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile Created for {patient?.name || 'Elderly Member'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1E432A]">
            {t.profile?.title || "Memory Activity Profile"}
          </h1>

          <p className="text-stone-700 max-w-2xl mx-auto text-base sm:text-lg">
            {t.profile?.subtitle || "Supportive insights used to tailor comfortable game difficulty and reminiscence themes."}
          </p>

          <div className="flex justify-center pt-1">
            <VoiceButton
              textToRead={`${t.profile?.title}. Your personalized memory activity profile is ready to guide our games.`}
              label="Listen to Summary"
            />
          </div>
        </div>

        {/* Medical Non-Diagnostic Safety Callout */}
        <div className="bg-emerald-50/90 border-2 border-emerald-300 rounded-3xl p-4 sm:p-5 flex items-start gap-3 shadow-sm">
          <ShieldCheck className="w-6 h-6 text-emerald-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
            <strong>Activity Personalization Note:</strong> These indicators are visual gauges used solely to adapt cognitive games to the elder’s comfort zone. They do not constitute a clinical score or medical diagnosis.
          </div>
        </div>

        {/* Visual Indicators Grid (Requirement 7) */}
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <h2 className="font-serif font-bold text-xl text-[#1E432A]">
              Cognitive Engagement Areas
            </h2>
            <span className="text-xs uppercase font-bold text-stone-500 tracking-wider">Comfort Level</span>
          </div>

          <div className="space-y-4">
            {domains.map((dom) => {
              const Icon = dom.icon;
              return (
                <div key={dom.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-stone-900 text-base">{dom.name}</span>
                        <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                          {dom.tag}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-stone-800">{dom.score}%</span>
                  </div>

                  {/* Accessible Visual Gauge Bar */}
                  <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                    <div
                      className={`h-full ${dom.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${dom.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Personalized Game Recommendation Banner */}
        <div className="bg-amber-100/90 border-2 border-[#C99E32] rounded-3xl p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="font-serif font-bold text-xl text-[#7C3218] flex items-center justify-center md:justify-start gap-2">
              <Gamepad2 className="w-6 h-6 text-amber-700" />
              <span>Recommended Starting Activity</span>
            </h3>
            <p className="text-stone-700 text-sm">
              Based on {patient?.name || 'the patient'}'s profile: <strong>Five Stones (Guti)</strong> and <strong>Traditional Food Memory</strong> are ready.
            </p>
          </div>

          <button
            onClick={() => setActivePage('games')}
            className="px-6 py-3.5 rounded-2xl bg-[#1E432A] hover:bg-[#2C5E3B] text-white font-bold text-base border-2 border-[#C99E32] shadow transition-all active:scale-98 flex items-center gap-2 whitespace-nowrap"
          >
            <span>{t.profile?.exploreGames || "Play Recommended Games"}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Proceed to Dashboard Button */}
        <div className="text-center pt-2">
          <button
            onClick={() => setActivePage('dashboard')}
            className="inline-flex items-center gap-2 text-[#1E432A] hover:text-[#A84B29] font-bold text-lg underline decoration-amber-400 decoration-2"
          >
            <span>{t.profile?.proceedToDashboard || "Proceed to Caretaker Dashboard"}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
