import React, { useMemo } from 'react';
import {
  User,
  Heart,
  Calendar,
  MapPin,
  Sparkles,
  Edit3,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Utensils,
  Music,
  Smile,
  Gamepad2,
  Trophy,
  Activity,
  CheckCircle2,
  Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePatient } from '../context/PatientContext';
import { useLanguage } from '../context/LanguageContext';
import { adaptiveEngine } from '../services/adaptiveEngine';

export const DashboardPage = ({ setActivePage, setSelectedGame }) => {
  const { t, currentLangObj } = useLanguage();
  const { caretaker } = useAuth();
  const { patient, gameResults } = usePatient();

  // Aggregate all game history from patient database and adaptive storage
  const allSessions = useMemo(() => {
    const list = Array.isArray(gameResults) ? [...gameResults] : [];
    const gameIds = ['alaska-word-search', 'odd-one-out', 'letter-c-word', 'crosswords', 'jigsaw-puzzle'];

    gameIds.forEach(id => {
      const gData = adaptiveEngine.getGameData(id);
      if (Array.isArray(gData.history)) {
        gData.history.forEach(h => {
          if (!list.some(item => item.timestamp === h.timestamp || item.completedAt === h.timestamp)) {
            list.push({
              gameId: id,
              gameName: id === 'alaska-word-search' ? (t.games?.wordSearchTitle || 'Alaska Word Search') :
                        id === 'odd-one-out' ? (t.games?.oddOneOutTitle || 'Find Odd One Out') :
                        id === 'letter-c-word' ? (t.games?.letterCTitle || 'Letter Word Game') :
                        id === 'crosswords' ? (t.games?.crosswordsTitle || 'Crosswords') : (t.games?.jigsawTitle || 'Jigsaw Puzzle'),
              score: h.percentageScore,
              accuracy: h.percentageScore,
              difficulty: h.difficulty || 'EASY',
              completedAt: h.timestamp
            });
          }
        });
      }
    });

    return list;
  }, [gameResults, t]);

  const gamesPlayed = allSessions.length;
  const gamesCompleted = allSessions.filter(s => (s.score ?? 0) >= 50).length;
  const bestScore = allSessions.length > 0 ? Math.max(...allSessions.map(s => s.score ?? s.accuracy ?? 0)) : 100;

  // Compute Favorite Game
  const favoriteGame = useMemo(() => {
    if (allSessions.length === 0) return t.games?.wordSearchTitle || 'Alaska Word Search';
    const countMap = {};
    allSessions.forEach(s => {
      const name = s.gameName || 'Cognitive Game';
      countMap[name] = (countMap[name] || 0) + 1;
    });

    let top = t.games?.wordSearchTitle || 'Alaska Word Search';
    let max = -1;
    Object.entries(countMap).forEach(([name, c]) => {
      if (c > max) {
        max = c;
        top = name;
      }
    });
    return top;
  }, [allSessions, t]);

  const recentSessions = allSessions.slice(0, 5);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-[#FAF7F0]">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Simple Page Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <span>🌿 {t.nav?.dashboard || "Caretaker Dashboard"}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1B3B2B]">
            {t.dashboard?.overviewTitle || "Profiles & Cognitive Care Overview"}
          </h1>

          <p className="text-stone-600 text-sm max-w-xl mx-auto">
            {t.dashboard?.overviewSubtitle || "Manage your caretaker credentials, your family elder's background, and cognitive game progress."}
          </p>
        </div>

        {/* 2 Profile Cards: Caretaker Profile & Patient Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. CARETAKER PROFILE CARD */}
          <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3.5 pb-3.5 border-b border-stone-100">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-300 text-[#1B3B2B] flex items-center justify-center text-2xl font-serif font-bold shadow-xs">
                  {caretaker?.fullName?.charAt(0) || 'C'}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {t.dashboard?.activeCaretaker || "Active Caretaker"}
                  </span>
                  <h2 className="font-serif font-bold text-xl text-[#1B3B2B] mt-0.5">
                    {caretaker?.fullName || 'Dr. Ananya Sharma'}
                  </h2>
                  <span className="text-xs text-stone-500">
                    {t.dashboard?.registeredCaregiver || "Registered Family Caregiver"}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
                  <div className="flex items-center gap-2 text-stone-600">
                    <Mail className="w-3.5 h-3.5 text-[#1B3B2B]" />
                    <span className="font-medium">{t.dashboard?.email || "Email:"}</span>
                  </div>
                  <strong className="text-stone-900 font-semibold">{caretaker?.email || 'care@cognicare.in'}</strong>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
                  <div className="flex items-center gap-2 text-stone-600">
                    <Phone className="w-3.5 h-3.5 text-[#1B3B2B]" />
                    <span className="font-medium">{t.dashboard?.phone || "Phone:"}</span>
                  </div>
                  <strong className="text-stone-900 font-semibold">{caretaker?.phone || '+91 98765 43210'}</strong>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
                  <div className="flex items-center gap-2 text-stone-600">
                    <Heart className="w-3.5 h-3.5 text-[#1B3B2B]" />
                    <span className="font-medium">{t.dashboard?.relationship || "Relationship:"}</span>
                  </div>
                  <strong className="text-stone-900 font-semibold">{patient?.relationship || 'Family'}</strong>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200/80">
                  <div className="flex items-center gap-2 text-stone-600">
                    <span>🌐</span>
                    <span className="font-medium">{t.dashboard?.language || "Language:"}</span>
                  </div>
                  <strong className="text-stone-900 font-semibold">{currentLangObj?.native || currentLangObj?.name || 'English'} ({currentLangObj?.flag})</strong>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100">
              <button
                onClick={() => setActivePage('patient-setup')}
                className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs border border-stone-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-stone-700" />
                <span>{t.dashboard?.updateSettings || "Update Caretaker Settings"}</span>
              </button>
            </div>
          </div>

          {/* 2. PATIENT PROFILE CARD */}
          <div className="bg-white border-2 border-amber-300/80 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-all space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3.5 pb-3.5 border-b border-amber-100">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 border-2 border-emerald-300 text-[#1B3B2B] flex items-center justify-center text-2xl shadow-xs">
                  👴
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {t.dashboard?.elderlyPatient || "Elderly Patient"}
                  </span>
                  <h2 className="font-serif font-bold text-xl text-[#1B3B2B] mt-0.5">
                    {patient?.name || 'Biren Sharma'}
                  </h2>
                  <span className="text-xs text-stone-500 font-medium">
                    {patient?.age || 74} {t.dashboard?.yearsOld || "years old"} • {patient?.gender || 'Elder'} • {patient?.state || 'Assam'}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80">
                  <div className="flex items-center gap-2 text-stone-700">
                    <MapPin className="w-3.5 h-3.5 text-[#A84B29]" />
                    <span className="font-medium">{t.dashboard?.homeRegion || "Home Region:"}</span>
                  </div>
                  <strong className="text-stone-900 font-semibold">{patient?.state || 'Assam'}</strong>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-stone-700 text-xs font-medium">
                    <Utensils className="w-3 h-3 text-amber-700" />
                    <span>{t.dashboard?.favoriteFoods || "Favorite Foods:"}</span>
                  </div>
                  <p className="text-xs font-semibold text-stone-900 truncate">
                    {Array.isArray(patient?.favoriteFoods)
                      ? patient.favoriteFoods.slice(0, 3).join(', ')
                      : 'Assamese Pitha, Masor Tenga, Hot Dudh Cha'}
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-stone-700 text-xs font-medium">
                    <Music className="w-3 h-3 text-emerald-700" />
                    <span>{t.dashboard?.favoriteSongs || "Favorite Folk Songs:"}</span>
                  </div>
                  <p className="text-xs font-semibold text-stone-900 truncate">
                    {Array.isArray(patient?.favoriteSongs)
                      ? patient.favoriteSongs.slice(0, 3).join(', ')
                      : 'Bihu Pepa melodies, Bhupen Hazarika classics'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-amber-100 flex gap-2">
              <button
                onClick={() => setActivePage('patient-setup')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#1B3B2B] hover:bg-[#2C5E3B] text-white font-bold text-xs border border-[#C99E32] shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.dashboard?.editProfile || "Edit Profile"}</span>
              </button>

              <button
                onClick={() => setActivePage('questionnaire')}
                className="py-2.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-stone-900 font-bold text-xs border border-amber-300 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Smile className="w-3.5 h-3.5 text-amber-800" />
                <span>{t.dashboard?.dailyCheckin || "Daily Check-in"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. COGNITIVE GAMES SUMMARY SECTION */}
        <div className="bg-white border-2 border-[#E5DFD5] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#1B3B2B] flex items-center justify-center text-xl shadow-xs">
                🧠
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl text-[#1B3B2B]">
                  {t.dashboard?.cognitiveOverview || "Cognitive Games Overview"}
                </h3>
                <p className="text-xs text-stone-500">
                  {t.dashboard?.cognitiveOverviewSub || "Track games played, completions, and recent session accuracy."}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActivePage('games')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1B3B2B] hover:bg-[#2C5E3B] text-white font-bold text-xs border border-[#C99E32] shadow-xs transition-all cursor-pointer self-start sm:self-auto"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.dashboard?.exploreAllGames || "Explore All 5 Games"}</span>
            </button>
          </div>

          {/* 4 Stat Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-1">
              <span className="text-[11px] uppercase font-bold text-stone-500 block">
                {t.dashboard?.gamesPlayed || "Games Played"}
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-[#1B3B2B]">{gamesPlayed}</div>
              <p className="text-[10px] text-stone-400">{t.dashboard?.totalSessions || "Total sessions recorded"}</p>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-1">
              <span className="text-[11px] uppercase font-bold text-emerald-800 block">
                {t.dashboard?.gamesCompleted || "Games Completed"}
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-emerald-900">{gamesCompleted}</div>
              <p className="text-[10px] text-emerald-600">{t.dashboard?.achieved50 || "Achieved ≥ 50% accuracy"}</p>
            </div>

            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-1">
              <span className="text-[11px] uppercase font-bold text-amber-800 block">
                {t.dashboard?.bestScore || "Best Score"}
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-amber-900">{bestScore}%</div>
              <p className="text-[10px] text-amber-700">{t.dashboard?.topPerformance || "Top performance"}</p>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-1">
              <span className="text-[11px] uppercase font-bold text-stone-500 block">
                {t.dashboard?.favoriteGame || "Favorite Game"}
              </span>
              <div className="text-base sm:text-lg font-bold text-[#1B3B2B] truncate">{favoriteGame}</div>
              <p className="text-[10px] text-stone-400">{t.dashboard?.mostPlayed || "Most frequently played"}</p>
            </div>
          </div>

          {/* Recent Completed Activities Table */}
          <div className="space-y-3 pt-2">
            <h4 className="font-serif font-bold text-sm text-[#1B3B2B] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#A84B29]" />
              <span>{t.dashboard?.recentActivityHistory || "Recent Completed Activity History"}</span>
            </h4>

            {recentSessions.length > 0 ? (
              <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">{t.dashboard?.gameColumn || "Game & Area"}</th>
                      <th className="p-3">{t.dashboard?.dateColumn || "Date & Time"}</th>
                      <th className="p-3">{t.dashboard?.diffColumn || "Difficulty"}</th>
                      <th className="p-3">{t.dashboard?.scoreColumn || "Score"}</th>
                      <th className="p-3">{t.dashboard?.statusColumn || "Status"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {recentSessions.map((session, index) => {
                      const isCompleted = (session.score ?? 0) >= 50;
                      const dateFormatted = session.completedAt
                        ? new Date(session.completedAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })
                        : 'Today';

                      return (
                        <tr key={index} className="hover:bg-amber-50/40 transition-colors">
                          <td className="p-3 font-semibold text-stone-900 flex items-center gap-2">
                            <span className="text-base">
                              {session.gameId === 'alaska-word-search' ? '🌲' :
                               session.gameId === 'odd-one-out' ? '🔍' :
                               session.gameId === 'letter-c-word' ? '🔤' :
                               session.gameId === 'crosswords' ? '📰' : '🧩'}
                            </span>
                            <span>{session.gameName}</span>
                          </td>
                          <td className="p-3 text-stone-600">{dateFormatted}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              session.difficulty === 'HARD' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                              session.difficulty === 'MEDIUM' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                              'bg-emerald-100 text-emerald-800 border-emerald-200'
                            }`}>
                              {session.difficulty}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-stone-900">{session.score ?? session.accuracy}%</td>
                          <td className="p-3">
                            {isCompleted ? (
                              <span className="inline-flex items-center gap-1 text-emerald-800 font-bold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>{t.dashboard?.statusCompleted || "Completed"}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-amber-800 font-bold text-[11px] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                <span>{t.dashboard?.statusPracticed || "Practiced"}</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-center space-y-2">
                <p className="text-xs text-stone-500 font-medium">
                  {t.dashboard?.noGamesYet || "No games played yet. Click below to begin your first memory exercise!"}
                </p>
                <button
                  onClick={() => setActivePage('games')}
                  className="px-4 py-2 rounded-xl bg-[#1B3B2B] text-white font-bold text-xs border border-[#C99E32] shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t.dashboard?.startFirstGame || "Start First Game Now"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
