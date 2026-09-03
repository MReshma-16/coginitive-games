import React, { useState, useEffect } from 'react';
import {
  User,
  HeartHandshake,
  Play,
  Sparkles,
  Gamepad2,
  Clock,
  BarChart3,
  Calendar,
  Volume2,
  ArrowRight,
  Music,
  Image as ImageIcon,
  CheckCircle2,
  Bell,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePatient } from '../context/PatientContext';
import { useLanguage } from '../context/LanguageContext';
import { VoiceButton } from '../components/VoiceButton';
import { aiService } from '../services/aiService';

export const DashboardPage = ({ setActivePage, setSelectedGame }) => {
  const { t, currentLang, currentLangObj } = useLanguage();
  const { caretaker } = useAuth();
  const { patient, gameResults, reminders } = usePatient();

  const [aiStory, setAiStory] = useState('');
  const [loadingStory, setLoadingStory] = useState(false);

  useEffect(() => {
    loadDailyStory();
  }, [patient?.name, patient?.state]);

  const loadDailyStory = async () => {
    setLoadingStory(true);
    try {
      const story = await aiService.generateDailyStory(patient);
      setAiStory(story);
    } catch (e) {
      setAiStory("On a golden morning in Assam, the gentle aroma of morning tea and fresh Pitha brought back peaceful memories of family laughter on the open wooden verandah.");
    } finally {
      setLoadingStory(false);
    }
  };

  const handleLaunchGame = (gameId) => {
    if (setSelectedGame) setSelectedGame(gameId);
    setActivePage('games');
  };

  const completedTodayCount = gameResults?.filter(gr => {
    const today = new Date().toDateString();
    return new Date(gr.completedAt).toDateString() === today;
  }).length || 2;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-[#FAF7F0]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome & Patient Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-[#1E432A] via-[#2C5E3B] to-[#1E432A] rounded-3xl p-6 sm:p-8 text-white shadow-xl border-2 border-[#C99E32]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-bold uppercase tracking-wider">
              <span>🌿 Caregiver Management Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-amber-100">
              {t.dashboard?.welcome || "Welcome back"}, {caretaker?.fullName || 'Dr. Ananya'}
            </h1>
            <p className="text-stone-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Personalized cognitive exercises and reminiscence activities for <strong>{patient?.name || 'Biren Sharma'}</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActivePage('patient-setup')}
              className="px-4 py-2.5 rounded-2xl bg-amber-200/90 hover:bg-amber-300 text-stone-900 font-bold text-sm transition-all shadow active:scale-95 flex items-center gap-1.5"
            >
              <User className="w-4 h-4 text-stone-900" />
              <span>{t.nav?.profile || "Edit Profile"}</span>
            </button>
            <button
              onClick={() => setActivePage('questionnaire')}
              className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm transition-all border border-white/30 active:scale-95"
            >
              <span>Daily Check-in</span>
            </button>
          </div>
        </div>

        {/* 2-Column Main Layout: Left: Patient Card & Today's Plan; Right: AI Story & Quick Launchers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (1 Col) */}
          <div className="space-y-6">
            {/* Patient Card (Requirement 8) */}
            <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                <h3 className="font-serif font-bold text-lg text-[#1E432A] flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-700" />
                  <span>{t.dashboard?.patientOverview || "Elderly Patient Card"}</span>
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                  {t.dashboard?.statusActive || "Active"}
                </span>
              </div>

              <div className="space-y-2.5 text-sm text-stone-700">
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500 font-medium">Name:</span>
                  <strong className="text-stone-900">{patient?.name || 'Biren Sharma (Koka)'}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500 font-medium">Age & Gender:</span>
                  <span className="font-semibold text-stone-800">{patient?.age || 74} yrs, {patient?.gender || 'Male'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500 font-medium">Home Region:</span>
                  <span className="font-semibold text-stone-800">{patient?.state || 'Assam'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500 font-medium">Preferred Language:</span>
                  <span className="font-bold text-[#1E432A] flex items-center gap-1">
                    <span>{currentLangObj.flag}</span>
                    <span>{currentLangObj.native}</span>
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500 font-medium">Today's Completed:</span>
                  <span className="font-bold text-emerald-700">{completedTodayCount} Activities</span>
                </div>
              </div>

              <button
                onClick={() => setActivePage('memory-profile')}
                className="w-full py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-[#7C3218] font-bold text-xs uppercase tracking-wider border border-amber-200 transition-all text-center block"
              >
                View Memory Activity Profile →
              </button>
            </div>

            {/* Today's Plan (Requirement 8) */}
            <div className="bg-amber-100/90 border-2 border-[#C99E32] rounded-3xl p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg text-[#7C3218] flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-700" />
                  <span>{t.dashboard?.todayPlan || "Today's Recommended Plan"}</span>
                </h3>
              </div>

              <div className="space-y-2.5">
                <div
                  onClick={() => handleLaunchGame('five-stones')}
                  className="bg-white/90 rounded-2xl p-3.5 border border-amber-200 hover:border-amber-400 cursor-pointer transition-all flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🪨</span>
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 group-hover:text-[#1E432A]">
                        {t.dashboard?.plan1 || "Five Stones Memory – 10 mins"}
                      </h4>
                      <p className="text-xs text-stone-500">Sequence & River stones recall</p>
                    </div>
                  </div>
                  <Play className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
                </div>

                <div
                  onClick={() => handleLaunchGame('music-memory')}
                  className="bg-white/90 rounded-2xl p-3.5 border border-amber-200 hover:border-amber-400 cursor-pointer transition-all flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎵</span>
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 group-hover:text-[#1E432A]">
                        {t.dashboard?.plan2 || "Song Recall – 5 mins"}
                      </h4>
                      <p className="text-xs text-stone-500">Folk instruments (Pepa, Duitara)</p>
                    </div>
                  </div>
                  <Play className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
                </div>

                <div
                  onClick={() => handleLaunchGame('memory-village')}
                  className="bg-white/90 rounded-2xl p-3.5 border border-amber-200 hover:border-amber-400 cursor-pointer transition-all flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏠</span>
                    <div>
                      <h4 className="font-bold text-sm text-stone-900 group-hover:text-[#1E432A]">
                        {t.dashboard?.plan3 || "Daily Routine Recall – 5 mins"}
                      </h4>
                      <p className="text-xs text-stone-500">Memory Village item placement</p>
                    </div>
                  </div>
                  <Play className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              <button
                onClick={() => handleLaunchGame('five-stones')}
                className="w-full py-3.5 rounded-2xl bg-[#1E432A] hover:bg-[#2C5E3B] text-white font-bold text-base border-2 border-[#C99E32] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 text-amber-300" />
                <span>{t.dashboard?.startPlanBtn || "Start Today's Session"}</span>
              </button>
            </div>
          </div>

          {/* Right Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Reminiscence Story of the Day */}
            <div className="bg-gradient-to-br from-amber-50 via-white to-amber-50/60 border-2 border-[#C99E32] rounded-3xl p-6 sm:p-7 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between pb-3 border-b border-amber-200">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📜</span>
                  <h3 className="font-serif font-bold text-xl text-[#1E432A]">
                    {t.dashboard?.aiStoryHeader || "AI Reminiscence Story of the Day"}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loadDailyStory}
                    className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-amber-100"
                    title="Generate another story"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingStory ? 'animate-spin' : ''}`} />
                  </button>
                  <VoiceButton textToRead={aiStory} />
                </div>
              </div>

              <div className="py-4">
                <p className="font-serif italic text-base sm:text-lg text-stone-800 leading-relaxed">
                  "{aiStory || "Loading your personalized North-East reminiscence story..."}"
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-stone-500">
                <span>Personalized using {patient?.name}'s favorite foods and memories</span>
                <span className="font-semibold text-amber-800">Warm Reminiscence</span>
              </div>
            </div>

            {/* Quick Activity Launchers */}
            <div className="space-y-3">
              <h3 className="font-serif font-bold text-xl text-[#1E432A]">
                {t.dashboard?.quickLaunch || "Activity Launchers"}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Launcher 1: Childhood Games */}
                <div
                  onClick={() => setActivePage('games')}
                  className="bg-white border-2 border-amber-200 rounded-3xl p-5 shadow-sm hover:shadow-lg hover:border-[#C99E32] cursor-pointer transition-all flex items-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-105 transition-transform">
                    🪨
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-lg text-[#1E432A] group-hover:text-[#A84B29]">
                      {t.games?.childhoodTitle || "Back to Childhood"}
                    </h4>
                    <p className="text-xs text-stone-600 line-clamp-2">
                      Five Stones, Marbles, Spinning Top, Kites & Village games.
                    </p>
                  </div>
                </div>

                {/* Launcher 2: Cultural Memories */}
                <div
                  onClick={() => setActivePage('games')}
                  className="bg-white border-2 border-amber-200 rounded-3xl p-5 shadow-sm hover:shadow-lg hover:border-[#C99E32] cursor-pointer transition-all flex items-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-105 transition-transform">
                    🏮
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-lg text-[#1E432A] group-hover:text-[#A84B29]">
                      {t.games?.culturalTitle || "North-East Heritage"}
                    </h4>
                    <p className="text-xs text-stone-600 line-clamp-2">
                      Pitha foods, Mekhela Sador textiles, Majuli & Folk music.
                    </p>
                  </div>
                </div>

                {/* Launcher 3: Family Memories */}
                <div
                  onClick={() => setActivePage('family')}
                  className="bg-white border-2 border-amber-200 rounded-3xl p-5 shadow-sm hover:shadow-lg hover:border-[#C99E32] cursor-pointer transition-all flex items-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-105 transition-transform">
                    👨‍👩‍👧
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-lg text-[#1E432A] group-hover:text-[#A84B29]">
                      {t.family?.title?.split(' ')[1] || "Family Memories"}
                    </h4>
                    <p className="text-xs text-stone-600 line-clamp-2">
                      Personal family photos & AI gentle memory questions.
                    </p>
                  </div>
                </div>

                {/* Launcher 4: Reminders */}
                <div
                  onClick={() => setActivePage('reminders')}
                  className="bg-white border-2 border-amber-200 rounded-3xl p-5 shadow-sm hover:shadow-lg hover:border-[#C99E32] cursor-pointer transition-all flex items-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-105 transition-transform">
                    ⏰
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-lg text-[#1E432A] group-hover:text-[#A84B29]">
                      {t.reminders?.title?.split(' ')[0] || "Caregiver Reminders"}
                    </h4>
                    <p className="text-xs text-stone-600 line-clamp-2">
                      Meals, water, caretaker-entered medication & routine calls.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Completed Activities Table */}
            <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                <h3 className="font-serif font-bold text-lg text-[#1E432A] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>{t.dashboard?.recentActivity || "Recent Completed Activities"}</span>
                </h3>
                <button
                  onClick={() => setActivePage('progress')}
                  className="text-xs font-bold text-[#A84B29] hover:underline"
                >
                  View Full Analytics →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase text-stone-500 border-b border-stone-200">
                      <th className="pb-2 font-semibold">Activity</th>
                      <th className="pb-2 font-semibold">Category</th>
                      <th className="pb-2 font-semibold">Accuracy</th>
                      <th className="pb-2 font-semibold">Response</th>
                      <th className="pb-2 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {(gameResults?.length > 0 ? gameResults.slice(0, 4) : [
                      { gameName: 'Five Stones (Guti)', category: 'Childhood', accuracy: 95, responseTimeMs: 2400 },
                      { gameName: 'Traditional Food Memory', category: 'Cultural', accuracy: 100, responseTimeMs: 1900 },
                      { gameName: 'Folk Music Memory', category: 'Cultural', accuracy: 90, responseTimeMs: 2800 },
                      { gameName: 'Memory Village', category: 'Childhood', accuracy: 88, responseTimeMs: 3100 }
                    ]).map((res, i) => (
                      <tr key={i} className="hover:bg-amber-50/50">
                        <td className="py-2.5 font-semibold text-stone-900">{res.gameName}</td>
                        <td className="py-2.5 text-xs text-stone-600">{res.category}</td>
                        <td className="py-2.5 font-bold text-emerald-700">{res.accuracy}%</td>
                        <td className="py-2.5 text-xs text-stone-500">{(res.responseTimeMs / 1000).toFixed(1)}s</td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
